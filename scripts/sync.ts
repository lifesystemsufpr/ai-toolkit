#!/usr/bin/env tsx
/**
 * sync.ts — gera adaptadores específicos de IDE a partir da fonte neutra.
 *
 * Fonte da verdade: source/rules/*.md e source/skills/*.md (markdown com frontmatter).
 * Saída: build/<repo>/ com os arquivos no formato de cada IDE.
 *
 * Formatos gerados:
 *   Cursor      -> build/<repo>/.cursor/rules/<id>.mdc
 *   Claude Code -> build/<repo>/CLAUDE.md  +  .claude/skills/<id>/SKILL.md
 *   Copilot     -> build/<repo>/.github/copilot-instructions.md
 *                  + .github/instructions/<id>.instructions.md
 *                  + .github/prompts/<id>.prompt.md  (skills)
 *
 * Uso:
 *   tsx scripts/sync.ts            # gera para todos os repos
 *   tsx scripts/sync.ts auth-service
 *
 * NOTA: os formatos de regra/skill de cada IDE evoluem. Toda a lógica específica
 * de formato está isolada nas funções emitCursor/emitClaude/emitCopilot abaixo —
 * se um formato mudar, ajuste só ali e rode de novo para reemitir os 7 repos.
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS, type ProjectProfile } from "../config/projects.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "source");
const OUT = join(ROOT, "build");

// ---------- frontmatter parser (mínimo, sem dependência) ----------
interface Doc {
  meta: {
    id: string;
    title: string;
    description?: string;
    appliesTo: string[];
    globs?: string[];
    always?: boolean;
  };
  body: string;
}

function parseDoc(raw: string, file: string): Doc {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Frontmatter ausente em ${file}`);
  const [, fm, body] = m;
  const meta: any = { appliesTo: [], always: false };
  let key: string | null = null;
  for (const line of fm.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    const item = line.match(/^\s*-\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const val = kv[2].trim();
      if (val === "" ) { meta[key] = []; }
      else if (val.startsWith("[")) {
        meta[key] = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      } else if (val === "true" || val === "false") {
        meta[key] = val === "true";
      } else {
        meta[key] = val.replace(/^["']|["']$/g, "");
      }
    } else if (item && key) {
      if (!Array.isArray(meta[key])) meta[key] = [];
      meta[key].push(item[1].trim().replace(/^["']|["']$/g, ""));
    }
  }
  return { meta, body: body.trim() };
}

function loadDir(dir: string): Doc[] {
  const full = join(SRC, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => parseDoc(readFileSync(join(full, f), "utf8"), `${dir}/${f}`));
}

function appliesToRepo(doc: Doc, repo: ProjectProfile): boolean {
  if (doc.meta.appliesTo.includes("all")) return true;
  return doc.meta.appliesTo.some((p) => repo.profiles.includes(p));
}

function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.endsWith("\n") ? content : content + "\n");
}

// ---------- Cursor: .cursor/rules/<id>.mdc ----------
function emitCursor(repoDir: string, rules: Doc[], skills: Doc[]) {
  for (const r of rules) {
    const fm = [
      "---",
      `description: ${r.meta.title}`,
      r.meta.globs?.length ? `globs: ${r.meta.globs.join(",")}` : "globs:",
      `alwaysApply: ${r.meta.always ? "true" : "false"}`,
      "---",
      "",
    ].join("\n");
    write(join(repoDir, ".cursor", "rules", `${r.meta.id}.mdc`), fm + r.body);
  }
  // Skills viram regras agent-requestable (alwaysApply false, descrição rica)
  for (const s of skills) {
    const fm = [
      "---",
      `description: ${s.meta.description ?? s.meta.title}`,
      "globs:",
      "alwaysApply: false",
      "---",
      "",
    ].join("\n");
    write(join(repoDir, ".cursor", "rules", `skill-${s.meta.id}.mdc`), fm + s.body);
  }
}

// ---------- Claude Code: CLAUDE.md + .claude/skills/<id>/SKILL.md ----------
function emitClaude(repoDir: string, repo: string, rules: Doc[], skills: Doc[]) {
  const always = rules.filter((r) => r.meta.always);
  const scoped = rules.filter((r) => !r.meta.always);

  const parts: string[] = [
    `# ${repo} — Diretrizes do projeto`,
    "",
    "Gerado automaticamente a partir do ai-toolkit. Não edite à mão; ajuste a fonte neutra e rode o sync.",
    "",
    "## Regras sempre aplicáveis",
    "",
    ...always.map((r) => r.body),
  ];

  if (scoped.length) {
    parts.push("", "## Regras por contexto de arquivo", "");
    for (const r of scoped) {
      const globs = r.meta.globs?.join(", ") ?? "—";
      parts.push(`### ${r.meta.title}  (aplica a: ${globs})`, "", r.body, "");
    }
  }

  write(join(repoDir, "CLAUDE.md"), parts.join("\n"));

  for (const s of skills) {
    const fm = ["---", `name: ${s.meta.id}`, `description: ${s.meta.description ?? s.meta.title}`, "---", ""].join("\n");
    write(join(repoDir, ".claude", "skills", s.meta.id, "SKILL.md"), fm + s.body);
  }
}

// ---------- Copilot: copilot-instructions.md + instructions + prompts ----------
function emitCopilot(repoDir: string, repo: string, rules: Doc[], skills: Doc[]) {
  const always = rules.filter((r) => r.meta.always);
  const scoped = rules.filter((r) => !r.meta.always);

  const main = [
    `# ${repo}`,
    "",
    "Instruções para o GitHub Copilot. Geradas a partir do ai-toolkit; não edite à mão.",
    "",
    ...always.map((r) => r.body),
  ].join("\n");
  write(join(repoDir, ".github", "copilot-instructions.md"), main);

  // Regras com glob viram instruction files com applyTo
  for (const r of scoped) {
    const fm = [
      "---",
      `applyTo: "${(r.meta.globs ?? ["**"]).join(",")}"`,
      "---",
      "",
    ].join("\n");
    write(join(repoDir, ".github", "instructions", `${r.meta.id}.instructions.md`), fm + r.body);
  }

  // Skills viram prompt files
  for (const s of skills) {
    const fm = ["---", `mode: agent`, `description: ${s.meta.description ?? s.meta.title}`, "---", ""].join("\n");
    write(join(repoDir, ".github", "prompts", `${s.meta.id}.prompt.md`), fm + s.body);
  }
}

// ---------- main ----------
function main() {
  const filter = process.argv[2];
  const targets = filter ? PROJECTS.filter((p) => p.repo === filter) : PROJECTS;
  if (!targets.length) {
    console.error(`Nenhum repo bate com: ${filter}`);
    console.error(`Disponíveis: ${PROJECTS.map((p) => p.repo).join(", ")}`);
    process.exit(1);
  }

  const allRules = loadDir("rules");
  const allSkills = loadDir("skills");
  console.log(`Fonte: ${allRules.length} regras, ${allSkills.length} skills\n`);

  if (!filter && existsSync(OUT)) rmSync(OUT, { recursive: true });

  for (const repo of targets) {
    const rules = allRules.filter((r) => appliesToRepo(r, repo));
    const skills = allSkills.filter((s) => appliesToRepo(s, repo));
    const repoDir = join(OUT, repo.repo);

    if (repo.ides.includes("cursor")) emitCursor(repoDir, rules, skills);
    if (repo.ides.includes("claude-code")) emitClaude(repoDir, repo.repo, rules, skills);
    if (repo.ides.includes("copilot")) emitCopilot(repoDir, repo.repo, rules, skills);

    console.log(
      `✓ ${repo.repo.padEnd(20)} ${rules.length} regras · ${skills.length} skills · ${repo.ides.join(", ")}`
    );
  }

  console.log(`\nGerado em build/. Próximo: distribuir com distribute.ts (abre PR por repo).`);
}

main();

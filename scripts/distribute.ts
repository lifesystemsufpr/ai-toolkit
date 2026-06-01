#!/usr/bin/env tsx
/**
 * distribute.ts — distribui os adaptadores gerados em build/<repo>/ para os
 * repositórios reais da org, abrindo 1 PR por repo.
 *
 * Rode `tsx scripts/sync.ts` antes para gerar build/.
 *
 * Uso:
 *   GITHUB_TOKEN=ghp_xxx tsx scripts/distribute.ts
 *   GITHUB_TOKEN=ghp_xxx tsx scripts/distribute.ts auth-service
 *   DRY_RUN=1 tsx scripts/distribute.ts
 */

import { Octokit } from "@octokit/rest";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS, ORG } from "../config/projects.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = join(ROOT, "build");

const TOKEN = process.env.GITHUB_TOKEN;
const DRY_RUN = process.env.DRY_RUN === "1";
const BRANCH = process.env.TOOLKIT_BRANCH ?? "chore/ai-toolkit-sync";

if (!TOKEN && !DRY_RUN) {
  console.error("GITHUB_TOKEN não definido. Use DRY_RUN=1 para testar.");
  process.exit(1);
}

const octokit = new Octokit({ auth: TOKEN });

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

async function getRemote(repo: string, path: string, ref: string) {
  try {
    const { data } = await octokit.repos.getContent({ owner: ORG, repo, path, ref });
    if (Array.isArray(data) || data.type !== "file") return null;
    return { sha: data.sha, content: Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf8") };
  } catch (e: any) {
    if (e.status === 404) return null;
    throw e;
  }
}

async function ensureBranch(repo: string, base: string, branch: string) {
  try {
    await octokit.repos.getBranch({ owner: ORG, repo, branch });
    return;
  } catch (e: any) {
    if (e.status !== 404) throw e;
  }
  const { data: baseRef } = await octokit.git.getRef({ owner: ORG, repo, ref: `heads/${base}` });
  if (DRY_RUN) { console.log(`  [dry-run] criaria branch ${branch}`); return; }
  await octokit.git.createRef({ owner: ORG, repo, ref: `refs/heads/${branch}`, sha: baseRef.object.sha });
}

async function getDefaultBranch(repo: string): Promise<string> {
  const { data } = await octokit.repos.get({ owner: ORG, repo });
  return data.default_branch;
}

async function distribute(repoName: string) {
  const repoDir = join(OUT, repoName);
  if (!existsSync(repoDir)) {
    console.log(`\n${repoName}: sem build/, pulei (rode sync primeiro)`);
    return { repo: repoName, ok: false, error: "sem build" };
  }
  console.log(`\n📦 ${repoName}`);

  const base = DRY_RUN ? "main" : await getDefaultBranch(repoName);
  await ensureBranch(repoName, base, BRANCH);

  const files = walk(repoDir);
  let changed = 0;
  for (const abs of files) {
    const path = relative(repoDir, abs).split("\\").join("/");
    const content = readFileSync(abs, "utf8");
    const existing = await getRemote(repoName, path, BRANCH);
    if (existing && existing.content === content) { continue; }
    if (DRY_RUN) { console.log(`  [dry-run] ${existing ? "update" : "create"} ${path}`); changed++; continue; }
    await octokit.repos.createOrUpdateFileContents({
      owner: ORG, repo: repoName, path, branch: BRANCH,
      message: `chore(ai-toolkit): sync ${path}`,
      content: Buffer.from(content).toString("base64"),
      sha: existing?.sha,
    });
    console.log(`  ✓ ${path}`);
    changed++;
  }

  if (changed === 0) { console.log("  · nada mudou"); return { repo: repoName, ok: true }; }

  // PR
  const { data: open } = await octokit.pulls.list({ owner: ORG, repo: repoName, head: `${ORG}:${BRANCH}`, state: "open" });
  if (open.length) { console.log(`  · PR já aberto: ${open[0].html_url}`); return { repo: repoName, ok: true }; }
  if (DRY_RUN) { console.log(`  [dry-run] abriria PR ${BRANCH} → ${base}`); return { repo: repoName, ok: true }; }
  const { data: pr } = await octokit.pulls.create({
    owner: ORG, repo: repoName, head: BRANCH, base,
    title: "chore: sincronizar regras e skills de IA (ai-toolkit)",
    body: [
      "## O que esse PR faz",
      "",
      "Sincroniza as regras e skills de IA deste repositório a partir do `ai-toolkit` central, nos formatos de cada IDE em uso:",
      "",
      "- Cursor: `.cursor/rules/*.mdc`",
      "- Claude Code: `CLAUDE.md` + `.claude/skills/`",
      "- GitHub Copilot: `.github/copilot-instructions.md` + `.github/instructions/` + `.github/prompts/`",
      "",
      "Arquivos gerados automaticamente. Para alterar, edite a fonte neutra no `ai-toolkit` e rode o sync — não edite estes arquivos à mão.",
      "",
      "---",
      "_Gerado por `distribute.ts` do [ai-toolkit](https://github.com/lifesystemsufpr/ai-toolkit)._",
    ].join("\n"),
  });
  console.log(`  ✓ PR: ${pr.html_url}`);
  return { repo: repoName, ok: true };
}

async function main() {
  const filter = process.argv[2];
  const targets = filter ? PROJECTS.filter((p) => p.repo === filter) : PROJECTS;
  if (!targets.length) { console.error(`Nenhum repo bate com: ${filter}`); process.exit(1); }

  console.log(`Distribuindo ai-toolkit para ${targets.length} repo(s)`);
  if (DRY_RUN) console.log("🔬 DRY_RUN ativo\n");

  const results = [];
  for (const t of targets) {
    try { results.push(await distribute(t.repo)); }
    catch (e: any) { console.error(`  ❌ ${t.repo}: ${e.message}`); results.push({ repo: t.repo, ok: false, error: e.message }); }
  }

  console.log("\n=== Resumo ===");
  for (const r of results) console.log(`  ${r.ok ? "✓" : "✗"} ${r.repo}${r.error ? ` — ${r.error}` : ""}`);
  process.exit(results.some((r) => !r.ok) ? 1 : 0);
}

main();

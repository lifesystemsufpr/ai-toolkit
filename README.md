# ai-toolkit

Fonte neutra de regras e skills de IA para a org `lifesystemsufpr`, com adaptadores gerados automaticamente para **Cursor**, **Claude Code** e **GitHub Copilot**.

## Ideia central

Você escreve a regra **uma vez**, em markdown neutro em `source/`. O `sync.ts` gera os arquivos no formato específico de cada IDE, para cada repositório. Quando uma regra muda, muda num lugar só e propaga para os 3 ambientes e os 7 repos.

```
source/  (fonte da verdade, markdown)  ──sync.ts──▶  build/<repo>/  ──distribute.ts──▶  PR em cada repo
```

## Estrutura

```
source/
  rules/        Regras de código (markdown com frontmatter)
  skills/       Skills/procedimentos invocáveis por agente
config/
  projects.ts   Mapeia cada repo aos perfis de regra e às IDEs
scripts/
  sync.ts       Gera build/<repo>/ nos formatos de cada IDE
  distribute.ts Abre 1 PR por repo com os arquivos gerados
build/          Saída gerada (não versionar; está no .gitignore)
```

## Formatos gerados por IDE

| IDE | Arquivos |
|---|---|
| Cursor | `.cursor/rules/<id>.mdc` (com `globs` e `alwaysApply`) |
| Claude Code | `CLAUDE.md` (regras always inline + escopadas em seções) e `.claude/skills/<id>/SKILL.md` |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/<id>.instructions.md` (com `applyTo`), `.github/prompts/<id>.prompt.md` |

> Os formatos de regra/skill de cada IDE evoluem. Toda a lógica de formato está isolada nas funções `emitCursor` / `emitClaude` / `emitCopilot` em `scripts/sync.ts`. Se um formato mudar, ajuste só ali e rode o sync de novo.

## Anatomia de uma regra

```markdown
---
id: backend-node
title: Backend Node.js
appliesTo: [backend]          # all | ts | backend | frontend | mobile | kotlin
globs: ["src/**/*.ts"]        # alvos de arquivo (Cursor globs / Copilot applyTo)
always: false                 # true = sempre aplicada, independente de arquivo
---

# conteúdo da regra em markdown...
```

Uma regra entra num repo se `appliesTo` inclui `all` **ou** intersecta os `profiles` daquele repo em `config/projects.ts`.

## Uso

```bash
pnpm install

# Gerar os adaptadores para todos os repos
pnpm sync

# Gerar só para um repo
pnpm sync auth-service

# Distribuir (abre 1 PR por repo). Precisa de PAT com escopo repo.
DRY_RUN=1 pnpm distribute            # simula
GITHUB_TOKEN=ghp_xxx pnpm distribute # para valer
```

## Como adicionar uma regra ou skill

1. Crie um arquivo em `source/rules/` ou `source/skills/` com o frontmatter.
2. Rode `pnpm sync` e confira o resultado em `build/`.
3. Rode `pnpm distribute` para abrir os PRs.

## Como adicionar uma IDE (ex.: Windsurf)

1. Escreva uma função `emitWindsurf(...)` em `scripts/sync.ts` no formato da IDE.
2. Adicione `"windsurf"` ao tipo de `ides` em `config/projects.ts` e chame a função no loop.
3. Rode o sync. A fonte neutra não muda.

## Integração com os agentes de código

As skills em `source/skills/` são consumidas tanto pelo **Claude Agent SDK** quanto pelo **Cursor SDK** (ambos suportam skills e MCP). O mesmo conteúdo que orienta o desenvolvedor na IDE orienta o agente headless no pipeline de CI — uma fonte, vários consumidores.

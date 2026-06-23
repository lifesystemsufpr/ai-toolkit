# processo-IA — ai-toolkit (fundação)

> Repositório de **fundação**: as regras e skills daqui **são** o processo-IA. O "como fazer" é
> **como evoluir e distribuir** essas regras. **Não contém código.** Task: [86e1tmk1q](https://app.clickup.com/t/86e1tmk1q).

## 1. Contexto do repo

- **Stack:** TypeScript / pnpm. Fonte neutra (markdown) → adaptadores por IDE (Cursor / Claude Code / Copilot).
- **Teste hoje:** **Vitest** (`scripts/sync.test.ts` cobre `parseDoc`/`appliesToRepo`/`emit*`).
- **CI:** `ci.yml` roda `lint` + `typecheck` + `test` + `sync` (valida que as regras geram para os 7 repos).

## 2. As peças do processo que vivem aqui

**Regras** (`source/rules/`):
- [`60-testing.md`](../source/rules/60-testing.md) — AAA, comportamento, **geração adversarial**, escolha de framework.
- [`75-code-review.md`](../source/rules/75-code-review.md) — o que a IA revisa (correção, contrato, segurança/auth, acessibilidade, testes).
- [`80-healthcare-domain.md`](../source/rules/80-healthcare-domain.md) — guard-rail clínico/LGPD (sobrepõe as demais).
- Mais: `00-base`, `10-typescript`, `20-backend-node`, `30-frontend-react`, `40-mobile-rn`, `50-kotlin`, `70-commits-pr`.

**Skills** (`source/skills/`):
- [`generate-tests.md`](../source/skills/generate-tests.md) — gera testes (happy/erros/fronteira/adversarial).
- [`review-pr.md`](../source/skills/review-pr.md) — checklist de review de PR.
- [`nav-check.md`](../source/skills/nav-check.md) — varredura de navegação no front (Playwright/Chrome DevTools) → relatório QA. É a **fonte da Camada 2** das [validações automáticas](https://github.com/lifesystemsufpr/devops-hub/blob/main/docs/processo-ia/validacoes-automaticas.md); evolução futura possível: uma skill de **autoria de specs e2e**.
- [`pre-pr-gate.md`](../source/skills/pre-pr-gate.md) — lint+typecheck+test:cov local antes do PR.
- [`review-clinical-change.md`](../source/skills/review-clinical-change.md) — revisão humana obrigatória (clínico/auth/schema).
- `write-github-workflow.md` — autoria de workflows no padrão reutilizável.

## 3. Como evoluir (o "como fazer" aqui)

1. **Editar a fonte** em `source/rules/` ou `source/skills/` (markdown único, IDE-independente).
2. **Sincronizar:** `pnpm sync` regenera `build/<repo>/` nos formatos das 3 IDEs
   (`.cursor/rules/*.mdc`, `CLAUDE.md` + `.claude/skills/`, `.github/copilot-instructions.md`).
   Deve reportar as regras/skills/repos esperados.
3. **Se um formato de IDE mudou:** corrigir só a função `emit*` correspondente em `scripts/sync.ts` e re-sincronizar.
4. **Distribuir:** `pnpm distribute:dry` para revisar e depois `pnpm distribute` (abre 1 PR/repo; só toca o que mudou).
5. **Nunca commitar `build/`** (é gerado, gitignored) — regenerar sempre com `pnpm sync`.

## 4. Code review

- PRs aqui passam por [`review-pr`](../source/skills/review-pr.md). Mudança em `80-healthcare-domain`
  ou na lógica de `emit*` (que afeta todos os repos) → revisão humana cuidadosa.

## 5. Guard-rails

- A regra clínica (`80-healthcare-domain`) é a mais importante e sobrepõe as outras em conflito.
- Manter a fonte **neutra**: nada específico de uma IDE na regra; o específico vive só no `emit*`.

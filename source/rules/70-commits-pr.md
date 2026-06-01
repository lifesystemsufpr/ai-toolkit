---
id: commits-pr
title: Commits e Pull Requests
appliesTo: [all]
always: true
---

# Commits e Pull Requests

## Commits

- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, `ci:`, com escopo opcional (`feat(auth): ...`).
- Mensagem no imperativo, descrevendo o que a mudança faz, não o que você fez.
- Commits pequenos e coesos; um commit por unidade lógica de mudança.

## Pull Requests

- PRs pequenos, idealmente abaixo de 400 linhas alteradas; PR grande é difícil de revisar bem.
- Preencha o template: contexto, o que muda, como testar, risco e rollback.
- Todo PR passa por lint, typecheck e testes verdes antes de revisão.
- Vincule a task do ClickUp correspondente.

## Sinalização de risco

- Marque com label de área quando a mudança tocar autenticação (`area:auth`), dados clínicos (`area:clinical`) ou schema (`area:migration`).
- Mudança em área de risco exige revisão humana obrigatória, mesmo que o restante do fluxo seja automatizado.

## Para PRs gerados por IA

- O corpo do PR deve listar as suposições feitas a partir da spec.
- O PR deve declarar que testes foram gerados e o que eles cobrem.
- Se a mudança encostar em lógica clínica, o agente não faz merge: para e pede revisão.

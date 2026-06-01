---
id: write-github-workflow
title: Escrever workflow do GitHub Actions
description: Use ao criar ou alterar workflows do GitHub Actions. Segue o padrão de consumir os workflows reutilizáveis do devops-hub em vez de duplicar lógica de CI.
appliesTo: [all]
---

# Skill: Escrever workflow do GitHub Actions

Ao criar ou alterar um workflow de CI/CD nestes repositórios:

1. Não duplique lógica de CI. Cada repo deve apenas chamar o workflow reutilizável apropriado do `devops-hub` via `workflow_call`. O `ci.yml` do repo tem cerca de dez linhas.
2. Escolha o workflow reutilizável certo pelo tipo do repo: backend, frontend, mobile ou Kotlin.
3. Passe os inputs corretos: versão de Node, gerenciador de pacotes, threshold de cobertura. Não invente nomes de input; confira os definidos no workflow reutilizável.
4. Use `secrets: inherit` em vez de repassar segredos um a um.
5. Configure `concurrency` para cancelar runs antigos do mesmo PR e cache agressivo para não estourar minutos.
6. Para mudança na lógica compartilhada (lint, build, teste), altere no `devops-hub`, não no repo consumidor; assim propaga para os sete repos.

Boas práticas gerais de Actions:

- Fixe versões de actions de terceiros por tag ou SHA, nunca `@master`.
- Não exponha segredo em log; nunca ecoe variável sensível.
- Permissões mínimas no token (`permissions:` explícito), princípio do menor privilégio.
- Jobs idempotentes e sem dependência de estado de execução anterior.

---
id: pre-pr-gate
title: Gate de teste local antes do PR
description: Use antes de abrir qualquer PR. Roda lint, typecheck e testes com cobertura no repo, com o contexto das regras do projeto, e avisa sobre impacto em repos que se interligam. Só abre o PR se tudo passar.
appliesTo: [all]
---

# Skill: Gate de teste local antes do PR

Antes de subir um PR, garanta localmente — não confie só no CI:

1. Rode, na raiz do repo (ou no working-directory do pacote), na ordem:
   - `lint` (corrige o corrigível, zero erro),
   - `typecheck` (zero erro),
   - `test:cov` (testes verdes e cobertura ≥ threshold do repo em `repos.config.ts`).
   Se algum script não existir no repo, registre isso como lacuna (não pule silenciosamente).
2. Aplique as regras do projeto como contexto da revisão própria: 60-testing (AAA, adversarial),
   a regra de stack (backend/frontend/mobile/kotlin) e 75-code-review.
3. **Impacto cross-repo**: se a mudança altera contrato consumido por outro repo (ex.: auth-service
   é consumido por ivcf-front e tecnoaging-front), liste os repos afetados no corpo do PR e o que
   verificar neles.
4. Se tocar área clínica/auth/schema → pare e peça revisão humana (não faça merge autônomo).
5. Só então crie a branch, faça o commit (Conventional Commits) e abra o PR preenchendo o template
   (contexto, o que muda, como testar, risco, repos afetados).

A regra é simples: **PR só sobe verde**. O gate local é o primeiro filtro; o CI confirma.

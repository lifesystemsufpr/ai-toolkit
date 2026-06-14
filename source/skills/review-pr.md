---
id: review-pr
title: Revisar PR
description: Use ao revisar um pull request ou diff. Produz um parecer priorizado (correção, contrato cross-repo, segurança, testes, acessibilidade) com veredito e achados por arquivo:linha.
appliesTo: [all]
---

# Skill: Revisar PR

Ao revisar um PR/diff:

1. Leia a descrição do PR e a task vinculada: o que ele PROMETE fazer. Revise contra isso.
2. Percorra o diff procurando, em ordem de prioridade:
   - **Correção**: borda, null/undefined, await/erro engolido, regressão.
   - **Contrato cross-repo**: assinatura/retorno/rota/DTO que outro repo consome mudou? (auth-service ↔ fronts.)
   - **Segurança/auth**: entrada validada, autorização por papel, sem vazar segredo/PII em log/URL/erro.
   - **Testes**: veio teste junto? cobre erro e borda? (regra 60-testing.)
   - **Acessibilidade** (front): foco, rótulo/role, alvo de toque (público idoso).
3. Se tocar área clínica/auth/schema → use `review-clinical-change` e marque revisão humana obrigatória.
4. Produza o parecer:
   - Veredito numa linha: aprovar / aprovar com ressalvas / bloquear.
   - Achados: `arquivo:linha` · severidade (bloqueio/atenção/nit) · porquê curto.
   - Não liste nit demais; foque no que muda a decisão.

Objetivo: dar ao revisor humano um mapa do que olhar primeiro, não aprovar rápido.

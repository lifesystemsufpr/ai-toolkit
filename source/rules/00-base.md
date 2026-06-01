---
id: base
title: Padrões base de engenharia
appliesTo: [all]
always: true
---

# Padrões base de engenharia — lifesystemsufpr

Estas regras valem para todo código da organização, em qualquer linguagem ou projeto.

## Princípios

- Clareza acima de esperteza. Código é lido muito mais do que escrito; prefira o óbvio ao engenhoso.
- Funções pequenas e com responsabilidade única. Se uma função precisa de comentário explicando "o que" ela faz, provavelmente deve ser duas funções.
- Nomes descritivos e em inglês. Variáveis, funções e tipos em inglês; mensagens de domínio voltadas ao usuário final em português.
- Falhe cedo e de forma explícita. Valide entradas no limite do sistema e lance erros claros em vez de propagar estado inválido.
- Sem números mágicos nem strings soltas. Extraia para constantes nomeadas.

## Estrutura

- Organize por feature/domínio, não por tipo técnico. Prefira `users/` contendo controller, service e tipos a pastas separadas `controllers/`, `services/`.
- Evite arquivos com mais de 400 linhas; é sinal de responsabilidade demais.
- Exporte o mínimo necessário. Mantenha implementação interna privada ao módulo.

## O que nunca fazer

- Nunca commitar segredos, tokens, chaves ou credenciais. Use variáveis de ambiente e `.env` fora do versionamento.
- Nunca deixar `console.log` de depuração em código de produção.
- Nunca suprimir erros silenciosamente com `catch` vazio.
- Nunca desabilitar regras de lint sem comentário justificando.

## Ao gerar código com IA

- Antes de implementar, confirme que entendeu a spec; se houver ambiguidade, liste as suposições no PR.
- Gere o teste junto com a implementação, não depois.
- Se a mudança tocar autenticação, dados clínicos ou esquema de banco, sinalize explicitamente no PR e peça revisão humana (ver regra de domínio de saúde).

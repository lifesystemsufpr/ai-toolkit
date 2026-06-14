---
id: code-review
title: Code review por IA
appliesTo: [all]
always: false
---

# Code review por IA

A IA revisa para **aumentar o sinal do revisor humano**, não para substituí-lo. O parecer é
sugestão; merge continua sendo decisão de pessoa.

## O que a IA procura (nesta ordem)

1. **Correção**: o código faz o que o PR/spec diz? Casos de borda, off-by-one, null/undefined,
   await esquecido, erro engolido.
2. **Contrato**: mudou assinatura, retorno, formato de erro ou rota que outro repo consome?
   (auth-service alimenta os fronts; mudança de contrato é risco cross-repo.)
3. **Segurança/auth**: validação de entrada, autorização por papel, vazamento de segredo/PII em
   log, URL ou mensagem de erro.
4. **Testes**: o PR traz teste junto da mudança? Cobre erro e borda, não só o caminho feliz?
5. **Acessibilidade** (frontend): foco visível, rótulo/role acessível, alvo de toque — o produto
   é para idosos.
6. **Simplicidade**: duplicação, função longa demais, abstração prematura.

## Limites (guard-rail)

- Se o diff tocar **cálculo/classificação do IVCF-20, autenticação/autorização ou schema de saúde**,
  a IA marca **revisão humana obrigatória** e não recomenda merge autônomo (ver skill
  `review-clinical-change`).
- A IA **não** sugere afrouxar proteção de dado de saúde; sinaliza como bloqueio.

## Forma do parecer

- Comece com um veredito de uma linha: aprovar / aprovar com ressalvas / bloquear.
- Cada achado: arquivo:linha, severidade (bloqueio/atenção/nit), e o porquê — curto.
- Não inunde de nits; priorize o que muda a decisão.

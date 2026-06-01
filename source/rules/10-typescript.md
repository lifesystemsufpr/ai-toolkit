---
id: typescript
title: Padrões TypeScript
appliesTo: [ts]
globs: ["**/*.ts", "**/*.tsx"]
always: false
---

# Padrões TypeScript

## Tipagem

- `strict: true` no tsconfig é obrigatório. Nunca relaxe `strictNullChecks` ou `noImplicitAny`.
- Proibido `any`. Use `unknown` e refine com type guards quando o tipo for incerto.
- Prefira `type` para uniões e composição; `interface` para contratos públicos extensíveis.
- Modele estados impossíveis como impossíveis: use uniões discriminadas em vez de flags booleanas soltas.
- Evite asserções `as`; quando inevitável, comente o porquê.

## Estilo

- `const` por padrão; `let` só quando reatribuição é real. Nunca `var`.
- Funções assíncronas sempre com `async/await`, não `.then()` encadeado.
- Trate promises rejeitadas: nenhuma promise sem `await` ou tratamento explícito.
- Use optional chaining (`?.`) e nullish coalescing (`??`) em vez de checagens manuais verbosas.

## Imports

- Imports absolutos via path alias (`@/...`) em vez de `../../../`.
- Agrupe imports: bibliotecas externas, depois internos, depois relativos.
- Sem imports não utilizados (o lint deve barrar).

---
id: frontend-react
title: Frontend React / Next.js
appliesTo: [frontend]
globs: ["**/*.tsx", "app/**/*.ts", "components/**/*.tsx"]
always: false
---

# Frontend React / Next.js

## Componentes

- Componentes funcionais com Hooks. Sem class components novos.
- Um componente, uma responsabilidade. Extraia lógica reutilizável para custom hooks (`useX`).
- Props tipadas explicitamente; sem `any` em props. Forneça defaults onde fizer sentido.
- Componentes de apresentação (visual) separados de containers (estado/dados).

## Estado e dados

- Estado local com `useState`/`useReducer`; estado de servidor com a lib de data fetching do projeto (React Query/SWR), não `useEffect` manual para fetch.
- Nunca derive estado que pode ser calculado em render; evite duplicar fonte da verdade.
- Memoize (`useMemo`/`useCallback`) só quando há ganho mensurável, não por reflexo.

## Acessibilidade e UX (crítico em produto para idosos)

- Todo elemento interativo é acessível por teclado e tem rótulo (`aria-label` quando o texto visível não basta).
- Contraste e tamanho de fonte adequados ao público idoso; não dependa só de cor para transmitir informação.
- Estados de loading, erro e vazio sempre tratados explicitamente na UI.
- Formulários clínicos: validação clara, mensagens em português, sem perda de dados ao errar.

## Next.js

- Respeite a fronteira server/client component; marque `'use client'` só quando necessário.
- Não exponha segredo em código de client component nem em variáveis `NEXT_PUBLIC_` sensíveis.

---
id: kotlin
title: Kotlin / Android
appliesTo: [kotlin]
globs: ["**/*.kt"]
always: false
---

# Kotlin / Android

## Estilo

- Siga as convenções oficiais Kotlin; ktlint e detekt barram desvios.
- Prefira `val` a `var`; imutabilidade por padrão.
- Use null-safety da linguagem; evite `!!`. Trate nulos com `?.`, `?:` e `let`.
- Data classes para modelos; sealed classes/interfaces para estados e resultados.

## Arquitetura

- Separação clara de camadas (UI, domínio, dados); UI não acessa dados direto.
- Coroutines para assíncrono, com escopo adequado; trate cancelamento.
- Flow para streams de dados; colete no escopo de lifecycle correto.
- Injeção de dependência (Hilt/Koin) para testabilidade.

## Compose (se aplicável)

- Composables pequenos e sem estado quando possível; eleve o estado (state hoisting).
- Evite recomposição desnecessária; chaves estáveis em listas.

## Público idoso

- Acessibilidade: descrições de conteúdo, alvos de toque grandes, suporte a fonte ampliada do sistema.

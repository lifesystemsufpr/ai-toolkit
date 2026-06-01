---
id: mobile-rn
title: Mobile React Native / Expo
appliesTo: [mobile]
globs: ["**/*.tsx", "src/**/*.ts"]
always: false
---

# Mobile React Native / Expo

## Estrutura

- Componentes funcionais com Hooks; navegação centralizada e tipada.
- Lógica de negócio fora dos componentes de tela; telas orquestram, não implementam regra.
- Reuso de tipos e contratos com o backend a partir de uma fonte compartilhada quando possível.

## Plataforma

- Trate diferenças iOS/Android explicitamente; não assuma comportamento idêntico.
- Cuide de safe areas, teclado e estados de permissão (câmera, notificação) de forma robusta.
- Imagens e listas longas otimizadas (lazy, virtualização); evite re-render desnecessário.

## Público idoso

- Alvos de toque grandes, tipografia legível, contraste alto.
- Fluxos curtos e tolerantes a erro; confirmação antes de ações destrutivas.

## Offline e dados

- Trate perda de conectividade sem travar a UI; sinalize estado offline.
- Nunca armazene dado de saúde sensível sem criptografia no dispositivo.

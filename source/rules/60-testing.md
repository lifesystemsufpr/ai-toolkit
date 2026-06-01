---
id: testing
title: Convenções de teste
appliesTo: [all]
globs: ["**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/*Test.kt"]
always: false
---

# Convenções de teste

## Princípios

- Teste comportamento observável, não implementação interna. Refatorar não deve quebrar testes que testam a coisa certa.
- Cada teste verifica uma coisa e tem nome que descreve o cenário e o resultado esperado.
- Arrange-Act-Assert: prepare, execute, verifique, nessa ordem e visualmente separados.
- Testes independentes e determinísticos; nenhum teste depende da ordem ou do estado deixado por outro.

## Cobertura

- Gere o teste junto com a feature, no mesmo PR.
- Priorize caminhos críticos: autenticação, cálculo do índice clínico, validações de formulário, fluxos de pagamento.
- Cubra o caminho feliz e os principais casos de erro/borda, não só o feliz.

## Geração adversarial por IA

- Ao gerar testes com IA, parte deles deve tentar quebrar o código: entradas inválidas, limites, nulos, concorrência.
- Não confie em teste gerado pela mesma passada que gerou o código sem revisão; vale uma segunda passada com a intenção de falhar.

## Ferramentas por stack

- Backend e frontend TS: Vitest (ou Jest) com cobertura; mocks via injeção de dependência.
- Frontend: React Testing Library, consultando por papel/rótulo acessível, não por detalhe de DOM.
- Mobile RN: Jest + Testing Library React Native.
- Kotlin: JUnit5 + MockK; Turbine para Flow.

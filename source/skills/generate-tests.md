---
id: generate-tests
title: Gerar testes
description: Use ao criar ou ampliar a suíte de testes de um arquivo ou módulo. Gera testes que cobrem caminho feliz, erros e bordas, com parte adversarial tentando quebrar o código.
appliesTo: [all]
---

# Skill: Gerar testes

Quando solicitado a gerar testes para um módulo, função ou componente:

1. Identifique o contrato observável: o que entra, o que sai, quais efeitos colaterais. Teste isso, não a implementação interna.
2. Estruture cada teste em Arrange-Act-Assert, com nome descrevendo cenário e resultado esperado.
3. Cubra, nesta ordem de prioridade:
   - Caminho feliz principal.
   - Erros esperados e validações (entrada inválida, ausência de permissão).
   - Bordas: vazio, nulo, limites numéricos, coleções grandes, concorrência quando aplicável.
4. Gere uma parte adversarial: escreva ao menos alguns testes com a intenção explícita de quebrar o código. Pense como alguém tentando furar a validação.
5. Use a ferramenta da stack: Vitest/Jest + Testing Library para TS, JUnit5 + MockK para Kotlin. Mocke efeitos colaterais via injeção de dependência.
6. Para código clínico (cálculo do IVCF-20, classificação), teste os valores de fronteira das faixas com rigor extra e não altere a lógica para "passar" o teste.

Não confie cegamente em testes gerados na mesma passada que gerou o código; eles tendem a herdar a mesma interpretação. Quando possível, gere os testes a partir da spec, não do código.

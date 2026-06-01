---
id: review-clinical-change
title: Revisar mudança clínica
description: Use ao revisar ou avaliar um diff que pode tocar lógica clínica, cálculo do IVCF-20, autenticação ou esquema de dados de saúde. Produz um parecer de risco e bloqueia merge autônomo.
appliesTo: [all]
---

# Skill: Revisar mudança clínica

Ao revisar um diff que possa afetar área de risco:

1. Classifique o blast radius. A mudança toca: cálculo/classificação do IVCF-20; autenticação ou autorização; esquema ou migração de dados de saúde; armazenamento ou transporte de dado pessoal sensível?
2. Se tocar qualquer um desses, marque como **revisão humana obrigatória** e não recomende merge autônomo.
3. Verifique especificamente:
   - A lógica de cálculo do índice, pesos, faixas e interpretação não foi alterada sem justificativa e aprovação documentada.
   - Nenhum dado pessoal ou de saúde é logado, exposto em URL ou retornado em erro ao cliente.
   - Migrations são reversíveis.
   - Não há dado real de paciente em testes, fixtures ou seeds.
4. Produza um parecer curto: o que muda, qual o risco, o que precisa de aprovação de quem entende o instrumento, e o que reverter se quebrar.
5. Se a mudança parecer tentar flexibilizar uma proteção de dado de saúde, sinalize como bloqueio, não como sugestão.

O objetivo não é aprovar rápido, é evitar que uma mudança sutil altere resultado clínico ou exponha dado sensível sem que ninguém perceba.

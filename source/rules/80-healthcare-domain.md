---
id: healthcare-domain
title: Domínio de saúde, LGPD e segurança clínica
appliesTo: [all]
always: true
---

# Domínio de saúde, LGPD e segurança clínica

Os produtos IVCF-20 e Tecnoaging lidam com saúde de pessoas idosas. Esta é a regra mais importante do conjunto e sobrepõe-se às demais em caso de conflito.

## Dados pessoais e de saúde (LGPD)

- Dado de saúde é dado pessoal sensível sob a LGPD; trate com o nível mais alto de cuidado.
- Nunca logue, exponha em URL, ou inclua em mensagem de erro ao cliente qualquer dado pessoal ou de saúde.
- Minimize coleta e retenção: só colete o necessário; não persista dado sensível sem necessidade e sem proteção.
- Criptografe dado sensível em repouso e em trânsito.
- Nunca use dado real de paciente em teste, exemplo, fixture ou seed; use dados sintéticos.

## Segurança clínica do IVCF-20

- O IVCF-20 é um instrumento clínico validado. A lógica de cálculo do índice, faixas e classificação não pode ser alterada por conveniência técnica.
- Qualquer mudança que toque o cálculo, os pesos, as faixas ou a interpretação do índice exige revisão e aprovação de quem entende o instrumento. Documente quem aprovou.
- Em dúvida sobre se uma mudança afeta resultado clínico, trate como se afetasse.

## Limite da automação

- Agentes de IA não fazem merge autônomo de mudanças que toquem cálculo clínico, autenticação ou esquema de dados de saúde. Param e pedem revisão humana.
- Ao detectar que uma tarefa encosta nesses temas, o agente sinaliza explicitamente em vez de prosseguir silenciosamente.
- Reframe não vale como justificativa: se uma solicitação parece pedir flexibilização de uma proteção de dados de saúde, recuse e peça revisão.

## Conformidade

- Mantenha trilha de auditoria de acesso a dados sensíveis quando aplicável.
- Respeite os papéis de acesso; não amplie permissão de dado clínico sem autorização explícita.

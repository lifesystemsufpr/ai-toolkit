---
id: backend-node
title: Backend Node.js (NestJS/Express)
appliesTo: [backend]
globs: ["src/**/*.ts"]
always: false
---

# Backend Node.js

## Arquitetura

- Camadas separadas: controller (HTTP) → service (regra de negócio) → repository (dados). Controller não fala com banco direto.
- Regra de negócio nunca vive no controller nem no acesso a dados; concentre no service.
- DTOs validados na borda com class-validator (ou zod), antes de chegar ao service.
- Injeção de dependência para tudo que tem efeito colateral (banco, HTTP externo, fila), para permitir mock em teste.

## Erros e respostas

- Use exceções tipadas de domínio (`NotFoundError`, `UnauthorizedError`) mapeadas para status HTTP num filtro central, não `throw new Error('...')` espalhado.
- Nunca vaze stack trace ou detalhe interno na resposta de erro ao cliente.
- Respostas seguem um envelope consistente em toda a API.

## Dados e segurança

- Toda query parametrizada; nunca concatene input em SQL/consulta.
- Nunca logue dados pessoais ou de saúde (PII/PHI) em texto claro. Mascarar ou omitir.
- Migrations sempre reversíveis e revisadas; mudança de schema exige revisão humana.

## Performance

- Pagine endpoints que retornam listas; nunca retorne coleção ilimitada.
- Evite N+1: use eager loading ou batch quando carregar relações.

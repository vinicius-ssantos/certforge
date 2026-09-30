# ADR 0002: Usar PostgreSQL como fonte da verdade

> Tradução de [`docs/adr/0002-postgresql-source-of-truth.md`](../../docs/adr/0002-postgresql-source-of-truth.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-07-30

## Contexto

O produto exige integridade transacional entre publicação, sessões, tentativas, evidências de auditoria e projeções de progresso reconstruíveis. Esses relacionamentos são fortemente estruturados e se beneficiam de constraints e transações duráveis.

## Decisão

Usar o PostgreSQL como sistema de persistência autoritativo. Gerenciar a evolução do schema com Flyway e validar o comportamento contra um PostgreSQL real por meio de testes de integração.

## Consequências

- Constraints relacionais e transações garantem a integridade crítica.
- As projeções de progresso continuam reconstruíveis a partir de evidências duráveis de tentativas.
- A propriedade dos módulos deve ser preservada mesmo com um único banco de dados.
- Redis, mecanismos de busca e stores analíticos só poderão ser introduzidos depois como sistemas derivados ou operacionais, nunca como fontes da verdade alternativas e silenciosas.

## Alternativas rejeitadas

- MongoDB como armazenamento primário.
- Event sourcing na release inicial.
- Múltiplos bancos de dados por módulo antes de existir necessidade operacional.

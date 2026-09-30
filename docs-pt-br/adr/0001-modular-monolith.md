# ADR 0001: Começar como um monolito modular

> Tradução de [`docs/adr/0001-modular-monolith.md`](../../docs/adr/0001-modular-monolith.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-07-30

## Contexto

O CertForge tem várias preocupações de domínio, mas nenhuma necessidade demonstrada de escala ou de organização que justifique serviços distribuídos. Microsserviços logo no início multiplicariam os custos de deploy, consistência, testes e observabilidade antes que o fluxo central de estudo seja validado.

## Decisão

Construir o backend inicial como um monolito modular, com APIs de módulo explícitas, propriedade de domínio isolada e direção de dependência controlada. O Spring Modulith é o mecanismo de apoio pretendido, sujeito à seleção de versão durante o bootstrap da implementação.

## Consequências

- Os fluxos centrais podem usar transações locais.
- Deploy e desenvolvimento permanecem simples.
- As fronteiras precisam ser testadas para que um único processo não se torne um monolito sem estrutura.

## Alternativas rejeitadas

- Microsserviços desde a primeira release.
- Um monolito organizado por camada técnica, com repositórios compartilhados entre domínios.

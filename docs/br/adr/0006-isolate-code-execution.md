# ADR 0006: Isolar a futura execução de código

> Tradução de [`docs/adr/0006-isolate-code-execution.md`](../../adr/0006-isolate-code-execution.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-07-30

## Contexto

Executar código Java fornecido pelo aluno introduz uma fronteira de confiança fundamentalmente diferente da de servir questões. Colocar a execução arbitrária dentro da aplicação principal exporia dados, credenciais, acesso à rede e a disponibilidade do serviço.

## Decisão

Quando for introduzida, a compilação e a execução de Java rodarão em um serviço runner separado e restrito, usando ambientes descartáveis e com recursos limitados. O runner não terá credenciais diretas do banco de dados, nem acesso geral à rede, nem acesso aos segredos da aplicação.

## Consequências

- O runner tem um contrato estreito de job/resultado.
- A complexidade operacional é adiada de propósito até a `v0.5.0`.
- Modelagem de ameaças, quotas, observabilidade, aplicação de patches e controles de abuso específicos do runner são pré-requisitos da release.
- A aplicação principal trata a saída do runner como não confiável e a sanitiza.

## Alternativas rejeitadas

- Compilação e execução de Java no mesmo processo.
- Reutilizar o container da aplicação principal como sandbox de execução.
- Permitir acesso irrestrito à rede ou workspace persistente.

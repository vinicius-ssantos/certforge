# Definição de Pronto

> Tradução de [`docs/engineering/definition-of-done.md`](../../engineering/definition-of-done.md). O inglês é a fonte canônica.

Uma mudança no CertForge só está pronta quando todos os critérios aplicáveis são atendidos.

## Produto

- A issue vinculada e seus critérios de aceitação são satisfeitos.
- A mudança pertence à release ativa ou é uma correção de bloqueio aprovada.
- O comportamento visível ao usuário é demonstrável.
- O escopo e o trabalho adiado são explícitos.

## Design e domínio

- A linguagem de domínio corresponde ao glossário.
- As invariantes são aplicadas na fronteira apropriada.
- Os trade-offs importantes são documentados ou vinculados a uma ADR.
- A compatibilidade retroativa e o impacto de migração são avaliados.

## Qualidade

- Testes unitários cobrem as regras de domínio.
- Testes de integração cobrem a persistência e as fronteiras externas.
- Testes end-to-end cobrem as jornadas críticas do usuário, quando aplicável.
- Os dados de teste não dependem de segredos de produção nem de serviços instáveis.
- O CI está verde.

## Segurança e privacidade

- A autorização é aplicada no servidor.
- Entrada, saída, logs e tratamento de erros são revisados quanto a dados sensíveis.
- As considerações de abuso e de rate limit são tratadas.
- Novas fronteiras de confiança atualizam o modelo de ameaças.
- Dependências e imagens de container são revisadas por ferramentas automatizadas quando introduzidas.

## Acessibilidade

- As interações principais são operáveis por teclado.
- Rótulos, foco, erros, atualizações de status e apresentação de código são acessíveis.
- As verificações automáticas de acessibilidade passam nos fluxos afetados.

## Operações

- Existem logs estruturados e métricas relevantes.
- O comportamento em caso de falha é observável e limitado.
- Os health checks representam uma prontidão acionável, e não uma mera liveness superficial do processo.
- As migrações de banco de dados são testadas e documentadas.

## Documentação

- README, roadmap, arquitetura, API, documentos operacionais e de conteúdo são atualizados quando afetados.
- Uma entrada de changelog é incluída para mudanças notáveis.
- O pull request contém evidências e limitações conhecidas.

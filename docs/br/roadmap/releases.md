# Roadmap de Releases

> Tradução de [`docs/roadmap/releases.md`](../../roadmap/releases.md). O inglês é a fonte canônica.

## Política de releases

Cada release deve criar um resultado demonstrável para o usuário. Marcos exclusivamente de infraestrutura são fatias internas de implementação, não releases de produto. As releases posteriores permanecem como hipóteses até que a anterior seja usada e revisada.

## `v0.1.0` — Study Core

**Resultado:** Um aluno consegue estudar, por tópico, questões revisadas de certificação Java e inspecionar as evidências de progresso.

Inclui as fundações do catálogo de preparação, o perfil de certificação Java, a entrega de questões, a submissão de respostas, a explicação, o histórico de tentativas, o progresso básico por tópico, a administração editorial, o versionamento de revisões de questões, a autenticação, a autorização, a auditabilidade e as fundações operacionais.

Tipos de questão, avaliação e direcionamento por vaga específicos de entrevista estão explicitamente excluídos desta release.

## `v0.2.0` — Adaptive Review

**Resultado:** Um aluno recebe uma fila de revisão direcionada, baseada em erros, confiança, recência e domínio demonstrado.

Capacidades candidatas: caderno de erros, classificação que considera a confiança, agendamento de revisão espaçada, fila diária de revisão, visibilidade de equívocos recorrentes.

## `v0.3.0` — Mock Exams

**Resultado:** Um aluno completa simulações cronometradas e recebe um relatório de pontos fracos baseado em blueprint.

Capacidades candidatas: avaliações cronometradas, marcação de questões, submissão final, distribuição controlada de tópicos, salvaguardas contra questões inéditas, relatório pós-prova.

## `v0.4.0` — Code Analysis

**Resultado:** Um aluno pratica questões sobre compilação, comportamento em tempo de execução e saída de programas, com apresentação de código de alta qualidade.

Esta release ainda usa conteúdo previamente validado e não exige execução arbitrária.

## `v0.5.0` — Secure Java Runner

**Resultado:** Um aluno consegue compilar e executar trechos de Java limitados, com feedback determinístico.

Exige um runner implantado separadamente, controles estritos de recursos, nenhum acesso à rede, ambientes de execução descartáveis, proteção contra abuso e observabilidade específica do runner.

## `v0.6.0` — Study Planner

**Resultado:** Um aluno recebe um plano explicável, baseado em objetivos, tempo disponível, tópicos fracos e obrigações de revisão.

## `v0.7.0` — AI Study Assistant

**Resultado:** Um aluno pode solicitar explicações complementares e variações de prática revisadas, enquanto a correção permanece ancorada em evidências determinísticas e editoriais.

## Direção paralela de produto — Interview Prep

O Interview Prep intencionalmente ainda não recebeu um número de release. Ele pode ser agendado depois que o Study Core for demonstrado e o modelo de aprendizado reutilizável for validado.

Resultado-alvo: um aluno que se prepara para uma entrevista de backend Java consegue praticar questões relevantes para o cargo, explicar decisões técnicas, receber feedback estruturado e revisado, inspecionar tópicos fracos e ensaiar prováveis perguntas de acompanhamento.

Capacidades candidatas:

- trilhas de preparação `INTERVIEW` ao lado das trilhas `CERTIFICATION`;
- taxonomia de tópicos de Java Backend Pleno/Sênior;
- modos de questão objetivo e de resposta guiada;
- rubricas de conceitos esperados, respostas de referência, erros comuns e perguntas de acompanhamento;
- metadados de cargo/senioridade;
- sessões de estudo derivadas de descrições de vaga, com ponderação explícita de tópicos;
- histórico e evidências de fraqueza específicos de entrevista;
- futura experiência de entrevistador simulado;
- futura assistência de IA restrita por critérios revisados, em vez de pontuação opaca.

O Interview Prep deve reutilizar as primitivas de estudo já comprovadas onde for apropriado, mas não deve forçar respostas subjetivas de entrevista a entrar na correção binária no estilo das certificações.

Veja a [direção do Interview Prep](../product/interview-prep.md).

## Gates de release

Uma release só pode ser marcada quando:

- sua jornada de usuário documentada é demonstrável;
- os critérios de aceitação e os testes críticos passam;
- os impactos de segurança e privacidade são revisados;
- as verificações de acessibilidade passam nos fluxos principais;
- as migrações e as considerações de rollback são documentadas;
- existe observabilidade para os caminhos críticos;
- README, changelog e notas de release estão atualizados;
- não há issues bloqueadoras de release em aberto.

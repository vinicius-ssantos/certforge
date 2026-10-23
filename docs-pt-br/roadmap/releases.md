# Roadmap de Releases

> Tradução de [`docs/roadmap/releases.md`](../../docs/roadmap/releases.md). O inglês é a fonte canônica.

## Política de releases

Cada release deve criar um resultado demonstrável para o usuário. Marcos exclusivamente de infraestrutura são fatias internas de implementação, não releases de produto. As releases posteriores permanecem como hipóteses até que a anterior seja usada e revisada.

### O que o tracker tem, e o que segue indeciso

Esta seção existe porque o roadmap e o rastreador de issues diziam coisas diferentes sobre o que o
projeto está construindo, e nenhum dos dois podia ser lido como o plano (#200). As perguntas que ela
levantou foram respondidas em 2026-10-23 e estão registradas abaixo.

De `v0.4.0` a `v0.7.0` não há uma única issue, e isso é esta política funcionando como escrita:
são hipóteses, e abrir issues contra elas agora seria planejar escopo que a própria política diz
para não planejar ainda.

Duas direções têm issues e **nenhuma das duas terá número de release**, decidido pelo dono do
projeto em 2026-10-23 (#200):

| Direção | Marco | Issues | Lugar |
|---|---|---|---|
| Interview Prep | `Interview Prep — foundation` | 18 | direção paralela, sem número |
| Infraestrutura, DevOps e Cloud Native | `Infrastructure, DevOps and Cloud Native tracks` | 13 | direção paralela, sem número |

**Por que nenhuma é numerada.** A sequência numerada é uma progressão do que o produto *faz* —
estudar, simular prova, analisar código, executá-lo com segurança, planejar, assistir. Estas duas
direções são largura de *conteúdo*: acrescentam assuntos para estudar, não capacidades. Numerá-las
afirmaria que o produto ganha algo que não ganha, e faria duas direções de conteúdo competirem pelos
mesmos slots de release com o único revisor que este projeto tem.

**A regra que decorre de haver um revisor só.** Uma direção paralela pode ser planejada a qualquer
momento e é **trabalhada somente quando nenhuma release numerada está em voo**. A restrição não é
capacidade de engenharia; é capacidade de revisão. Toda questão redigida para uma direção paralela
entra na fila à frente das revisões que uma release numerada está esperando, e as revisões são a
parte lenta ([ADR 0005](../adr/0005-ai-not-source-of-truth.md)).

**A condição de agendamento do Interview Prep foi atendida**, e foi isto que a atendeu: o modelo de
aprendizado reutilizável deixou de ser promessa quando o pacote de infraestrutura passou pelo mesmo
maquinário de manifesto, evidência e revisão do pacote Java, que é o que a #166 fechou. Atendida não
é o mesmo que agendada — pela regra acima ela segue sem número e sem ser trabalhada enquanto a
`v0.3.0` não terminar, e suas dezoito issues permanecem abertas, porque backlog pesquisado não é
ruído.

**O épico de infraestrutura não contém mais trabalho de plataforma.** A #166 pedia que o maquinário
de conteúdo generalizasse além do Java e está fechada; a #165 — o modelo de catálogo, os snapshots
de versão de prova e o que uma questão pode declarar sobre um objetivo — fechou com ela. O que resta
sob a #164 é conteúdo e currículo, e está bloqueado pela #177 (governança de fontes) e pela
capacidade de revisão, nessa ordem.

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

## Direção paralela — Infraestrutura, DevOps e Cloud Native

A #164 e suas filhas restantes — trilhas de certificação Kubernetes, AWS e Terraform, Linux e redes,
CI/CD, laboratórios práticos, governança de fontes e ética de conteúdo de exame — são uma direção
paralela sem número de release, no mesmo pé do Interview Prep e pelo mesmo motivo: acrescentam
assuntos para estudar, não capacidades.

A metade de plataforma desta direção está pronta. A #166 generalizou os pacotes de conteúdo, as
checagens de evidência e a validação editorial além do Java, e a #165 resolveu o modelo de catálogo,
os snapshots de versão de prova, o que uma leitura verificada da página de objetivos do fornecedor
registra e o que uma questão pode declarar sobre um objetivo. Uma prova de Kubernetes ou da AWS já
pode ser registrada, o que não era possível enquanto a aplicação exigia release do Java de toda
certificação.

O que resta é conteúdo e currículo, e está ordenado: **primeiro a #177** — a política de fontes, o
mecanismo de monitoramento de versão e a ética de conteúdo de exame — porque nenhum perfil de
certificação deve ser escrito antes de publicadas as regras sobre o que pode ser lido, citado e
declarado. Depois os pacotes, em lotes pequenos o suficiente para serem revisados em vez de
enfileirados.

Um limite que não é questão de agendamento: um perfil de certificação aqui é **material de estudo
autoral**. Nunca é cópia das questões de uma prova, nem derivado delas, nem apresentado como tal, e
nenhuma trilha é rotulada oficial sem uma autorização que hoje não existe.

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

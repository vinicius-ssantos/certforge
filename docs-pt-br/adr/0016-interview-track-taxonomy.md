# ADR 0016: Modelar a trilha de entrevista como uma taxonomia versionada, e mantê-la pequena

> Tradução de [`docs/adr/0016-interview-track-taxonomy.md`](../../docs/adr/0016-interview-track-taxonomy.md). O inglês é a fonte canônica.

- Status: **Aceita** em 2026-10-04 por vinicius-ssantos, como escrita. As decisões 1, 2, 3, 6, 7 e 8 estão implementadas: a taxonomia existe como trilha em DRAFT e versão de taxonomia em DRAFT, e uma questão em um tópico de entrevista realmente publica assim que as duas são ativadas. Todas as oito decisões estão implementadas. O que falta é conteúdo: a trilha fica em DRAFT até existir algum, e ativá-la é um ato deliberado. Cada decisão abaixo diz o que existe.
- Data: 2026-10-04

## Contexto

A [#18](https://github.com/vinicius-ssantos/certforge/issues/18) pede uma trilha `INTERVIEW` revisada para Java Backend Pleno/Sênior, com taxonomia estável, expectativas de senioridade explícitas e pesos canônicos que um blueprint de vaga possa referenciar sem alterar. A [ADR 0014](0014-one-topic-one-track.md) já mandou estruturas de dados, algoritmos, SOLID, padrões de projeto e orientação a objetos para cá, e deixou uma pergunta aberta para a #18: como uma questão pode ser oferecida em mais de um tópico sem ser escrita duas vezes.

Lido do código em vez de lembrado, quatro coisas decidem a maior parte disso.

**1. Publicar uma questão exige uma versão de exame ativa.** `QuestionBankService.doPublish` chama `findActiveTopicContext` e recusa com `topic_not_active` quando não acha nada. `TopicContext` é `(topicId, trackId, examVersionId, int javaRelease)` — os dois últimos não são anuláveis. Servir questões passa então por `findPublishedByTopic(topicId, examVersionId)`, e o índice de unicidade de publicadas é `(question_id, exam_version_id) WHERE status = 'PUBLISHED'`.

Ou seja, uma trilha de entrevista, que por definição não tem exame, **hoje não consegue ter uma única questão publicada nem servida.** Nada disso é hostilidade ao caso de entrevista; é um modelo moldado para certificação fazendo o trabalho dele. Mas significa que a #18 não é só uma questão de taxonomia, e o escopo da issue não nomeia isso.

**2. O schema é mais permissivo que o código.** `qb_question_revision.java_release` e `.exam_version_id` são **anuláveis**. O que os torna obrigatórios é a lógica da aplicação: `RevisionRules.violations` emite `java_release_missing` para toda revisão, e o caminho de publicação precisa do contexto acima. Isso é boa notícia — a primeira questão de entrevista não exige remodelar o banco de questões, só tornar as regras dele condicionais.

**3. Ordem e peso de tópico não têm onde morar numa trilha de entrevista.** `catalog_topic` não tem `position`. A ordem vem de `catalog_exam_version_topic (exam_version_id, topic_id, objective_ref, position)`, que é chaveada por versão de exame. O `objective_ref` mora lá também — corretamente, porque um objetivo pertence a um exame e não a um tópico.

**4. O progresso é atribuído pela sessão, não pela questão.** `study_attempt` carrega `session_id` e `revision_id`, mas nenhum tópico; `study_session.topic_id` é a chave de `progress_topic`. Isso importa para a pergunta que a ADR 0014 deixou, e é o único lugar onde o modelo atual já é geral o bastante.

## Decisão

**1. Generalizar a versão de exame em uma *versão de trilha*, e dar uma à trilha de entrevista.**

`catalog_exam_version` passa a ser `catalog_track_version` — a coisa em que os tópicos são mapeados, pela qual são ordenados e pesados, e à qual as questões publicadas se vinculam. As colunas específicas de exame (`exam_code`, `exam_name`, `java_release`, `objectives_url`) vão para `catalog_certification_exam`, chaveada por versão de trilha, exatamente como `catalog_certification_profile` já separa a identidade de certificação da trilha.

Esta é a decisão com custo real, e está proposta em vez de evitada porque toda alternativa é pior:

- Resolve quatro exigências da #18 de uma vez — identificadores estáveis, ordenação, pesos canônicos, e regras de versionamento e descontinuação — usando um mecanismo que já existe e já é entendido, em vez de inventar um segundo ao lado.
- "No máximo uma versão ativa por trilha" já é um índice. Taxonomias de entrevista precisam exatamente dessa regra: uma versão canônica viva, as antigas preservadas porque questões publicadas se vinculam a elas.
- `qb_question_revision.exam_version_id` passa a ser `track_version_id` e continua significando o que significa: *o contexto publicado para o qual esta revisão foi aprovada*. A [ADR 0003](0003-version-published-questions.md) é preservada, não torcida.

O custo, dito sem rodeio: uma migração que renomeia uma tabela e uma coluna com dados vivos, tocando o caminho de publicação, o de composição de sessão e o agregado de simulado. É a maior mudança desta ADR e deve ser um pull request próprio, antes de qualquer linha de taxonomia ser inserida.

**2. `objective_ref` fica só para certificação; tópicos de entrevista carregam uma `rationale`.**

Um tópico de entrevista não tem objetivo publicado para citar, e inventar um seria o mesmo erro que a ADR 0014 recusou ao não adicionar "Estruturas de dados" à trilha Java SE 21. O que um tópico de entrevista *pode* carregar é por que está na taxonomia — "perguntado na maioria das triagens de backend Pleno/Sênior" é uma afirmação sobre o mercado, não sobre um documento, e deve soar como tal.

Então `catalog_track_version_topic` mantém `position`, ganha um `weight` anulável, e seu `objective_ref` passa a ser anulável com um `CHECK` de que uma versão de certificação sempre tem um. **Um objetivo ausente precisa ser impossível para uma trilha de certificação, e sem sentido para uma de entrevista.**

**3. A primeira taxonomia tem doze tópicos, não vinte e três.**

A [direção de produto](../product/interview-prep.md) lista vinte e três tópicos candidatos. A #18 pede algo "pequeno o suficiente para sustentar um primeiro pacote de conteúdo revisado", e a evidência de quão pequeno está neste repositório: **uma trilha de certificação tem 150 questões, das quais 130 seguem sem revisão humana**, meses adentro. A revisão é o gargalo, é uma pessoa só, e uma taxonomia é uma promessa de preenchê-la.

Doze tópicos de primeiro nível, com os vinte e três dobrados dentro deles como subtópicos:

| # | Tópico | Abrange |
|---|---|---|
| 1 | Linguagem e runtime Java | Java core, coleções, generics, streams, APIs funcionais, fundamentos de JVM |
| 2 | Concorrência | threads, virtual threads, visibilidade de memória, coordenação |
| 3 | Design orientado a objetos | SOLID, padrões de projeto, modelagem OO (ADR 0014) |
| 4 | Estruturas de dados e algoritmos | a lacuna que a ADR 0014 identificou |
| 5 | Spring | Spring, Spring Boot, Spring Security |
| 6 | Persistência | JPA, Hibernate, SQL, transações |
| 7 | Testes | unitário, integração, dublês, do que um teste é evidência |
| 8 | Fronteiras de domínio | fundamentos de DDD, propriedade, contratos entre módulos |
| 9 | Sistemas distribuídos | microsserviços, integração síncrona versus assíncrona, falha |
| 10 | Mensageria | conceitos de Kafka e RabbitMQ, idempotência, retentativas, DLQ, ordenação, consistência |
| 11 | Nuvem e operação | AWS para backend, Docker, Kubernetes, observabilidade, resiliência |
| 12 | System design | compor o que está acima sob restrições |

Concorrência é separada do tópico 1 em vez de dobrada dentro dele, porque é onde os candidatos mais falham e é o único assunto cujo progresso por tópico vale ser lido isoladamente.

**4. Comunicação comportamental e preocupações de sistemas financeiros não entram na primeira taxonomia.**

As duas estão no épico, e as duas estão postergadas pelo mesmo motivo dito de dois jeitos diferentes.

*Comunicação comportamental* não tem correção determinística **nem referência autoritativa**. A [política de conteúdo](../product/content-policy.md) exige referências suficientes para verificação independente, e a ADR 0011 construiu a verificação mecânica de referências em cima disso. Uma questão sobre como descrever um conflito com um colega não pode citar uma especificação. Incluí-la quebraria a política ou isentaria um tópico dela em silêncio, e a segunda opção é pior. **O que precisa ser decidido antes é se a política de conteúdo admite uma classe de questão cuja evidência é só o julgamento editorial** — uma decisão de verdade, não uma formalidade, e não para ser tomada no meio de uma tabela de taxonomia.

*Preocupações de sistemas financeiros* — auditabilidade, precisão, rastreabilidade, prevenção de duplicatas — são genuinamente citáveis e genuinamente valiosas, e estão postergadas pelo motivo mais estreito de que atravessam os tópicos 6, 9, 10 e 12 em vez de ficarem ao lado deles. Uma questão sobre precisão monetária é uma questão de `BigDecimal`; uma sobre prevenção de duplicatas é uma questão de idempotência. Fazer disso um décimo terceiro tópico dividiria o progresso de um assunto que é uma lente, não uma área. **Revisitar como dimensão de blueprint de vaga (#22)**, onde uma lente é exatamente a forma certa.

**5. Senioridade é propriedade da questão, não só da trilha.**

O perfil de entrevista declara um alvo — `PLENO` ou `SENIOR` — porque uma trilha é um alvo de preparação e foi isso que a pessoa escolheu. Mas "expectativas de Pleno/Sênior explícitas em vez de inferidas de texto livre" não se resolve no nível da trilha: o mesmo tópico é perguntado nas duas profundidades, e a diferença é o que a resposta precisa conter.

Então uma revisão ganha um `seniority` anulável para trilhas de entrevista, com o mesmo tratamento condicional de `java_release`: **obrigatório quando a trilha é de entrevista, sem sentido quando é de certificação.** Quem mira Pleno recebe questões de Pleno; quem mira Sênior recebe as duas, porque de um Sênior se espera responder uma questão de Pleno.

**6. `java_release` passa a ser condicional ao tipo da trilha.**

Hoje `RevisionRules` o exige em toda revisão. Uma questão sobre ordenação no Kafka não tem versão do Java, e dar uma a ela para satisfazer um validador seria uma mentira num campo em que o caminho de certificação confia. A regra passa a ser: obrigatório para trilha de certificação, recusado para trilha de entrevista.

**7. Pesos canônicos moram na versão da trilha; um blueprint de vaga nunca escreve no catálogo.**

`weight` em `catalog_track_version_topic` é a expectativa canônica. Um blueprint de vaga (#22) é uma **sobreposição somente de leitura**: guarda os próprios pesos contra ids de tópico e os mostra ao lado dos canônicos, para que "esta vaga enfatiza mensageria mais que a trilha canônica" seja uma frase que o produto consegue dizer. A exigência da #18 de que um blueprint "referencie a taxonomia sem alterá-la" passa a ser um fato de schema — a tabela do blueprint não tem caminho de escrita para `catalog_*` — e não uma convenção que alguém precisa lembrar.

**8. Uma questão continua pertencendo a exatamente um tópico, e o mesmo terreno é escrito duas vezes.**

Esta é a pergunta que a ADR 0014 deixou aberta, e a resposta é a que ela esperava evitar.

O mecanismo existe: o progresso é atribuído por `study_session.topic_id`, não pela revisão, então uma revisão servida em dois tópicos atribuiria corretamente. O que não sobrevive é a revisão editorial. O tópico de uma revisão faz parte de `RevisionContent` e faz parte do que o revisor aprovou; `reviewDigest` inclui `topicId`. Uma questão aprovada como questão de coleções do Java SE 21 **não foi revisada como questão de coleções de entrevista**, porque os dois têm padrões diferentes — um é julgado contra um objetivo de exame, o outro contra o que um entrevistador espera ouvir. Oferecê-la nos dois apresentaria uma revisão como duas.

Então: quando um objetivo de certificação e um tópico de entrevista cobrem o mesmo terreno, a questão é escrita de novo para o segundo enquadramento, e revisada de novo. Isso é um custo real, e a ADR 0014 já aceitou o gêmeo dele para tópicos. A alternativa — uma revisão fazendo o trabalho de duas — é o tipo de exagero silencioso que este projeto foi construído para evitar.

## Consequências

- **Nada nesta ADR é construível sem a decisão 1**, que é uma migração em tabelas vivas. A ordem honesta é: generalizar a versão de trilha, depois tornar as duas regras condicionais, depois inserir a taxonomia, depois escrever conteúdo. Uma trilha de entrevista inserida antes disso seria uma trilha incapaz de guardar uma questão.
- ~~**A mesa editorial ainda não consegue escrever contra a taxonomia, e isso não estava previsto aqui.**~~ **Resolvido:** o `GET /api/editorial/catalog/topics` agora serve a taxonomia aos papéis de conteúdo, e o editor de questões lê dele em vez do catálogo do aluno. Semear também revelou uma segunda instância da mesma suposição: toda consulta de trilha fazia inner join em `catalog_certification_profile`, então uma trilha sem perfil era invisível até para o administrador responsável por ela. As duas estão corrigidas; o texto original fica abaixo porque o raciocínio é o que importa.
  O `useTopics` no app web lê `/api/catalog/tracks` — o endpoint do *aluno*, que serve somente
  trilha ativa com versão ativa. Então enquanto a trilha de entrevista está em `DRAFT`, os tópicos
  dela não aparecem na lista do editor de questões, e não há como escrever conteúdo para ela. É um
  acoplamento latente que só nunca incomodou porque existia uma única trilha permanentemente ativa:
  a mesa editorial não deveria ver apenas o que os alunos veem. Corrigir exige um endpoint de
  tópicos editorial, permitido aos papéis de conteúdo e não ao `CATALOG_MANAGE`, e é o próximo
  passo antes de qualquer conteúdo de entrevista ser escrito.
- **A trilha de entrevista ficará visivelmente vazia por um bom tempo.** Doze tópicos sem questões revisadas é o que isso produz no começo, e a página de trilhas mostraria uma trilha que ninguém consegue praticar. Ou a trilha fica em `DRAFT` até alguns tópicos terem conteúdo, ou a interface diz claramente que um tópico não tem nenhum — a segunda é mais honesta e é o que os estados vazios já fazem em outros lugares.
- O problema de nome da ADR 0014 piora, não melhora: uma trilha chamada "entrevista" passa a ser dona de estruturas de dados, SOLID e system design. "Java Backend — Pleno/Sênior" como *nome* da trilha, com `INTERVIEW` como tipo, é a leitura menos ruim, e o tipo é a coisa em que o código ramifica.
- Postergar comunicação comportamental significa que a primeira trilha de entrevista não faz justamente o que o nome do épico mais sugere a quem lê. Isso deve ser dito na documentação de produto, não descoberto.
- Senioridade numa revisão adiciona uma dimensão à autoria de conteúdo para a qual a mesa editorial ainda não tem campo. É pequeno, e é trabalho.

## Alternativas rejeitadas

- **Dar à trilha de entrevista uma versão de exame falsa** para satisfazer o caminho de publicação. Colocaria `exam_code` e `objectives_url` em algo que não é um exame, e a própria página de administração do catálogo explica a publicação em termos de versões de exame para um administrador. Uma mentira no modelo vira uma mentira na interface.
- **Tornar `examVersionId` anulável em `TopicContext` em vez de generalizá-lo.** Mais barato, e espalha a pergunta "isto é uma certificação?" por todo call site que toca o contexto, onde um `null` só significa *entrevista* se você já souber disso. O tipo deixa de carregar o próprio significado.
- **Todos os vinte e três tópicos agora.** É uma promessa que este projeto hoje não consegue cumprir: 130 questões esperam por um humano na trilha que já existe. Uma taxonomia que ninguém consegue preencher faz o produto parecer maior e ser mais vazio.
- **Comunicação comportamental com respostas avaliadas por IA.** A [ADR 0005](0005-ai-not-source-of-truth.md) proíbe IA como fonte de correção, e uma resposta comportamental não tem critério revisado contra o qual comparar, a menos que alguém escreva um. Não é um atalho em volta da política de conteúdo; é o caso mais difícil dela.
- **Uma trilha `foundation` separada para os tópicos 3 e 4.** A ADR 0014 rejeitou isso e nada mudou; fica registrado só porque uma taxonomia que é dona de estruturas de dados torna a tentação mais forte.
- **Decidir a taxonomia durante a autoria de conteúdo.** A lacuna que a ADR 0014 achou foi achada por perguntar cedo. A versão caríssima disso é descobrir na questão 40 que as fronteiras dos tópicos não se sustentam.

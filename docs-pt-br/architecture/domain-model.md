# Modelo de Domínio Inicial

> Tradução de [`docs/architecture/domain-model.md`](../../docs/architecture/domain-model.md). O inglês é a fonte canônica. Os nomes de agregados, entidades, value objects e eventos permanecem em inglês.

## Candidatos a agregados e entidades

### Catálogo de preparação

- `PreparationTrack`
- `Topic`
- `CertificationProfile`
- `ExamVersion`

`PreparationTrack` é o alvo de preparação estável, visível ao aluno. Uma trilha tem um `TrackKind`, inicialmente `CERTIFICATION` e reservado para um futuro uso de `INTERVIEW`.

A trilha comprometida da `v0.1.0` é uma trilha de certificação Java. Seu `CertificationProfile` é dono dos metadados de provedor/prova, e seu `ExamVersion` é dono do ciclo de vida de objetivos/versão exigido para a correção da certificação.

Os tópicos pertencem a uma trilha de preparação e têm identificadores estáveis, para que as evidências de progresso permaneçam interpretáveis. Os mapeamentos de objetivos específicos de certificação permanecem como metadados explícitos, em vez de ficarem escondidos dentro de campos genéricos de tópico.

Essa generalização é intencionalmente estreita: evita tornar a certificação a abstração raiz permanente, sem adicionar nenhum comportamento de entrevista à `v0.1.0`.

### Banco de questões

- `Question`
- `QuestionRevision`
- `QuestionOption`
- `ContentReview`
- `SourceReference`

`Question` é a identidade lógica. `QuestionRevision` é o artefato publicável imutável. Alternativas, respostas esperadas, explicações, referências, compatibilidade declarada e evidências de revisão pertencem à revisão.

Na `v0.1.0`, os tipos de questão suportados continuam sendo escolha única e múltipla escolha, com correção determinística.

O Interview Prep futuro poderá introduzir metadados de resposta guiada, como conceitos esperados, respostas de referência, erros comuns, perguntas de acompanhamento e expectativas de senioridade. Esses campos não fazem parte da primeira release e não devem ser simulados por meio de campos anuláveis de certificação.

Invariantes centrais:

- uma revisão pertence a exatamente uma questão lógica;
- uma revisão publicada não pode ser editada;
- somente uma revisão aprovada pode ser publicada;
- uma questão tem no máximo uma revisão publicada ativa por contexto declarado de trilha/prova, a menos que um modelo explícito de variantes seja introduzido;
- uma revisão de escolha única tem exatamente uma alternativa esperada;
- uma revisão de múltipla escolha tem pelo menos duas alternativas e pelo menos uma alternativa esperada;
- toda revisão publicada tem uma explicação e uma referência autoritativa;
- revisões depreciadas não podem entrar em novas sessões.

### Estudo

- `StudySession`
- `SessionQuestion`
- `QuestionAttempt`

Uma sessão faz um snapshot dos identificadores das revisões de questão selecionadas. Mudanças na seleção após a criação da sessão não a alteram.

Invariantes centrais:

- uma tentativa referencia uma revisão de questão presente em sua sessão;
- existe uma submissão aceita por questão da sessão, a menos que um modo explícito de nova tentativa seja introduzido;
- a correção objetiva é calculada contra a revisão imutável referenciada;
- alternativas selecionadas, confiança, tempo decorrido e timestamp da submissão são persistidos;
- os detalhes da resposta correta só são divulgados após a submissão aceita;
- sessões concluídas rejeitam novas tentativas.

Futuras respostas guiadas de entrevista exigem um contrato de avaliação distinto. Elas não devem sobrecarregar a semântica objetiva de `correct`.

### Progresso

- `TopicProgressProjection`
- `StudyActivityProjection`

O progresso é um modelo derivado, construído a partir de tentativas e sessões. Ele não é a fonte da verdade das respostas históricas e deve ser reconstruível.

O progresso futuro em entrevistas pode incluir evidências como cobertura de conceitos esperados ou categorias de fraquezas recorrentes, mas indicadores opacos de prontidão gerados por IA não são fonte da verdade.

## Referências de identidade

Os agregados de aprendizado armazenam identificadores estáveis de usuário, em vez de incorporar registros de identidade. Os dados pessoais de perfil são minimizados e separados das evidências de tentativas.

## Value objects importantes

- `PreparationTrackId`
- `TrackKind`
- `CertificationProfileId`
- `ExamVersionId`
- `TopicId`
- `QuestionId`
- `QuestionRevisionId`
- `StudySessionId`
- `AttemptId`
- `JavaRelease`
- `Difficulty`
- `QuestionType`
- `ConfidenceLevel`
- `ElapsedTime`
- `ContentStatus`

## Candidatos a eventos de domínio

- `QuestionRevisionApproved`
- `QuestionRevisionPublished`
- `QuestionRevisionDeprecated`
- `StudySessionStarted`
- `QuestionAttemptSubmitted`
- `StudySessionCompleted`

Os eventos inicialmente apoiam o desacoplamento modular, as projeções e a auditabilidade. Eles não implicam Kafka nem mensageria externa.

## Questões de design em aberto para a implementação

- Se a compatibilidade de certificação pertence diretamente a uma revisão de questão ou a uma associação explícita de trilha/prova.
- Resolvido: `CertificationProfile` é um registro um-para-um da sua trilha e `ExamVersion` tem ciclo de vida próprio. Veja [Catálogo de preparação](preparation-catalog.md).
- Resolvido: por padrão um revisor não pode revisar a própria revisão, e uma instalação com um único mantenedor pode desativar isso explicitamente. Veja [Banco de questões](question-bank.md).
- Resolvido: as sessões expiram de forma preguiçosa após um tempo configurável, sem job agendado. Veja [Sessões de estudo](study-sessions.md).
- Resolvido: o progresso é atualizado de forma síncrona, dentro da transação que registra uma tentativa, por meio de um evento em processo, com reconciliação e reconstrução a partir das tentativas. Veja [Histórico e progresso](history-and-progress.md).

As questões de design exclusivas de entrevista são acompanhadas separadamente e não bloqueiam a primeira release, a menos que exponham um acoplamento irreversível prejudicial.

Essas questões devem ser decididas antes de a issue de implementação afetada ser aceita, e não abstraídas prematuramente.

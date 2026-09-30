# Histórico e Progresso

> Tradução de [`docs/architecture/history-and-progress.md`](../../docs/architecture/history-and-progress.md). O inglês é a fonte canônica.

Issue: #11 — Construir o histórico de tentativas e o progresso por tópico reproduzível. Baseia-se na [submissão de respostas](answer-submission.md) e nas [sessões de estudo](study-sessions.md).

## Princípio

As tentativas persistidas são a evidência. Tudo o que é mostrado aqui é derivado delas e pode ser recalculado, então o progresso de um aluno nunca é uma nota mantida à mão, e nenhum número é mostrado sem que suas entradas sejam visíveis.

## Histórico

Os dois endpoints devolvem apenas os dados do aluno atual, exigem a permissão `STUDY` e têm `Cache-Control: no-store`, porque o histórico de tentativas contém gabaritos (de respostas já dadas).

### Histórico de tentativas

`GET /api/study/history/attempts` devolve as tentativas aceitas, da mais nova para a mais antiga. Cada item traz a sessão, a posição, o tópico, o momento da submissão, as alternativas marcadas, se estava correta, a confiança e o tempo gasto, além da **revisão exata que foi respondida**: id e número da revisão, seu status, tipo, enunciado, explicação geral, cada alternativa com sua correção e explicação, e as referências. A revisão é lida por id no banco de questões, então continua mostrando o texto e o gabarito originais depois que a questão foi corrigida ou depreciada, e `question.revisionStatus` indica quando uma revisão foi substituída.

Filtros: `topicId`, `sessionId`. Questões que nunca foram respondidas nunca aparecem, então o histórico não pode ser usado para ler um gabarito antes da hora.

### Histórico de sessões

`GET /api/study/history/sessions` devolve as sessões da mais nova para a mais antiga com status, quantidade pedida, `answeredCount` e `correctCount`, e timestamps. Não contém conteúdo de questões. Sessões em andamento cujo prazo acabou são expiradas antes, como na lista de sessões.

### Paginação

As páginas usam um cursor por chave (keyset), e não um offset. `size` vai de 1 a 50 (padrão 20), `cursor` é o `nextCursor` opaco da página anterior, e `nextCursor` é `null` na última página. A ordem é `(timestamp, id)` decrescente, em que o id é um desempate de ordem total. Como um cursor nomeia uma linha em vez de contar linhas, novas tentativas ou sessões que chegam na frente enquanto o aluno pagina nunca fazem uma página seguinte pular ou repetir um item. Valores inválidos devolvem `400 invalid_page_size` ou `400 invalid_cursor`.

## Progresso por tópico

`GET /api/progress/topics` devolve uma entrada por tópico das trilhas ativas, na ordem do catálogo (incluindo tópicos sem atividade), seguida de qualquer tópico que tenha dados mas não esteja mais em uma trilha ativa.

| Campo | Significado |
|---|---|
| `attempted` | Tentativas aceitas no tópico |
| `correct` | Dessas, quantas estavam corretas |
| `incorrect` | `attempted - correct` |
| `accuracy` | `correct / attempted`, quatro casas decimais; `null` até algo ser tentado |
| `lastActivityAt` | Momento da tentativa aceita mais recente; `null` se não houver |
| `topicName`, `trackSlug` | Vêm do catálogo |

Não há campo de prontidão, domínio nem previsão. Os testes verificam o conjunto exato de campos.

### O que conta e o que não conta

Estas regras são a definição de progresso:

- **Toda tentativa aceita conta**, qualquer que seja o status da sua sessão. Respostas em uma sessão que depois foi abandonada ou expirou são evidência real e continuam contadas.
- **Uma questão nunca respondida não é tentada nem incorreta.** Questões sem resposta, em qualquer sessão, não somam nada.
- **Uma sessão sem respostas não soma nada**, não importa como terminou.
- **A mesma questão respondida em várias sessões conta a cada vez.** Cada uma é uma tentativa aceita separada. Uma métrica de primeira tentativa é outra visão e fica adiada.
- **As tentativas são atribuídas ao tópico da sua sessão.** A sessão é focada em um tópico, então isso é inequívoco e não é afetado por mudanças posteriores em uma questão.
- Uma submissão rejeitada ou repetida não é uma tentativa e não é contada.

## Como a projeção é mantida

O progresso é armazenado em `progress_topic` (aluno, tópico, attempted, correct, última atividade). O módulo `study` publica um evento `AttemptRecorded` dentro da transação que registra uma nova tentativa, e o módulo `progress` atualiza a linha de forma síncrona nessa mesma transação. A tentativa e o seu progresso, portanto, são confirmados ou desfeitos juntos, e uma repetição idempotente, que não registra nada, não muda nada.

Um lock consultivo por aluno serializa o registro de uma tentativa e a reconstrução, então uma reconstrução nunca pode perder nem contar em dobro uma tentativa que está sendo gravada.

### Reconciliação e reconstrução

- `GET /api/progress/reconciliation` recalcula o progresso esperado a partir das tentativas, compara com as linhas armazenadas em um único snapshot consistente e devolve `{"consistent": bool, "differences": [...]}` listando cada tópico que difere (contagens erradas, linha ausente ou linha sem tentativas por trás).
- `POST /api/progress/rebuild` substitui as linhas do aluno pelas recalculadas e devolve o número de tópicos e quantos foram corrigidos. É idempotente: reconstruir uma projeção saudável não muda nada.
- A reconstrução de todos os alunos (removendo linhas cujas tentativas não existem mais) está disponível para a aplicação, para operações, e é coberta por testes.

A projeção nunca deve divergir em operação normal; isso existe para detectar e reparar os efeitos de um bug ou de uma alteração manual.

## Endpoints

| Endpoint | Descrição |
|---|---|
| `GET /api/study/history/attempts` | Histórico de tentativas com as revisões exatas |
| `GET /api/study/history/sessions` | Histórico de sessões |
| `GET /api/progress/topics` | Progresso por tópico |
| `GET /api/progress/reconciliation` | Compara o progresso armazenado com as tentativas |
| `POST /api/progress/rebuild` | Recalcula o progresso armazenado |

## Adiado

Repetição espaçada, níveis de domínio, previsões de prontidão, streaks, leaderboards, análise entre usuários, relatórios de simulado e acerto na primeira tentativa.

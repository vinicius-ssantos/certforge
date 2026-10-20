# Sessões de Estudo

> Tradução de [`docs/architecture/study-sessions.md`](../../docs/architecture/study-sessions.md). O inglês é a fonte canônica.

Issue: #9 — Implementar sessões de estudo focadas em um tópico e a seleção de questões. Depende do [catálogo de preparação](preparation-catalog.md) e do [banco de questões](question-bank.md).

## O que é uma sessão

O aluno inicia uma sessão para um tópico e recebe um conjunto ordenado de questões publicadas. O conjunto e a ordem ficam fixos quando a sessão começa. Responder às questões está descrito em [submissão de respostas](answer-submission.md); este documento cobre iniciar, consultar, concluir e abandonar uma sessão. A visão da sessão mostra quais questões foram respondidas (`answered`) e a lista mostra `answeredCount`, e nenhum dos dois revela a correção.

## Iniciando uma sessão

`POST /api/study/sessions` com `{"topicId": "...", "questionCount": 5}` (`questionCount` é opcional).

1. O tópico precisa estar ativo no catálogo, caso contrário `404 topic_not_found`. Tópicos em rascunho e inativos são indistinguíveis de tópicos desconhecidos.
2. A quantidade deve estar entre 1 e o máximo do servidor (padrão de 10 questões quando omitida, no máximo 20), caso contrário `400 question_count_out_of_range`.
3. O banco de questões devolve as elegíveis: revisões publicadas e não depreciadas daquele tópico que estejam vinculadas à versão de prova ativa atual do tópico.
4. Se houver menos do que o pedido, o início falha com `409 insufficient_content`, informando `requested` e `available` para o cliente tentar de novo com um número menor. Uma sessão nunca é encurtada em silêncio.
5. O seletor escolhe essa quantidade de questões distintas em ordem aleatória, usando uma fonte de aleatoriedade imprevisível. O cliente não consegue influenciá-la.
6. A sessão e o seu snapshot de questões são gravados, e a sessão é devolvida.

Um aluno tem no máximo uma sessão em andamento por tópico. Um segundo início devolve `409 active_session_exists` com o `sessionId` da que está em andamento. Isso é garantido por um índice único parcial, então inícios concorrentes são seguros: exatamente um tem sucesso.

## A ordem em que as alternativas são mostradas

As questões de uma sessão são sorteadas; as alternativas não eram, e ficam guardadas na ordem em que
foram escritas. Isso transformou um hábito de autoria em informação: nenhuma questão de quatro
alternativas do pacote Java SE 21 tem D como correta — todas as 147 —, então quem percebia eliminava
uma alternativa de graça em todo simulado, e o placar e o relatório de fraqueza mediam o pacote, não
o aluno (#233). Rebalancear as chaves não está disponível, porque o veredito de uma questão revisada
é registrado contra o texto dela, e editar para melhorar a estatística descarta a revisão de uma
pessoa ([ADR 0005](../adr/0005-ai-not-source-of-truth.md)).

Então as alternativas de um aluno são apresentadas em uma ordem derivada do id da sessão e do id da
revisão, pelo `PresentedOrder`:

- ela é **derivada, não sorteada**, então todo payload sobre a mesma questão na mesma sessão
  concorda — a questão ao ser respondida, a resposta ao ser lida depois, a tentativa no histórico —
  entre um refetch, um restart e uma visita posterior, sem guardar nada e sem migração;
- cada alternativa mantém a **chave que o autor deu**, que é o que a resposta envia e o que a
  correção compara, então nada sobre acerto depende da ordem;
- a interface mostra a **posição**, não a chave, porque um selo escrito "D, A, C, B" devolveria a
  ordem autoral à tela. Depois da resposta, quando a alternativa escolhida sobe para o topo, a letra
  dela continua sendo a que tinha quando a questão foi respondida.

A mesa editorial é a exceção deliberada: o revisor vê as chaves autorais, que são as letras usadas
pelo pacote e pelo registro de revisão.

Isso remove uma pista acidental do exame. Não esconde o gabarito: os pacotes são publicados em um
repositório público, e quem os ler vê o que cada questão responde.

## Snapshot e estabilidade

A sessão guarda os ids das revisões e as suas posições. As revisões de questões são imutáveis, então o snapshot basta para manter a sessão estável:

- a publicação posterior de novas questões nunca acrescenta nada a uma sessão existente;
- substituir ou depreciar uma questão não a altera: a sessão continua mostrando as revisões com que foi criada, na mesma ordem. O banco de questões expõe isso por uma leitura própria, segura para o aluno, para revisões que já foram publicadas;
- a tabela do snapshot é congelada pelo banco de dados: as linhas não podem ser atualizadas nem apagadas, e só podem ser inseridas pela transação que cria a sessão.

## Ciclo de vida

```
IN_PROGRESS --complete--> COMPLETED
IN_PROGRESS --abandon---> ABANDONED
IN_PROGRESS --time up---> EXPIRED
```

Os demais estados são terminais. `complete` e `abandon` são ações explícitas do aluno. Qualquer outra transição em uma sessão encerrada devolve `409 session_not_in_progress`, ou `409 session_expired` para uma expirada. Duas requisições disputando para encerrar a mesma sessão têm exatamente um vencedor.

Concluir uma sessão não exige responder a todas as questões.

## Política de expiração

Uma sessão expira quando fica em andamento por mais que `certforge.study.session-ttl` (padrão de 24 horas desde o início). A expiração é preguiçosa e dispensa job agendado: quando uma sessão é lida, ou quando o aluno lista as sessões ou inicia uma nova, toda sessão desse aluno cujo prazo acabou passa a `EXPIRED`. Assim, uma sessão abandonada nunca bloqueia o próximo início do aluno, e o horário de encerramento registrado é o momento em que a expiração foi detectada. Como sessões expiradas e abandonadas contam para o progresso está definido em [histórico e progresso](history-and-progress.md): suas respostas aceitas contam, e sessões sem respostas não somam nada.

## Endpoints

Todos exigem a permissão `STUDY`. Uma sessão pertence ao seu aluno: qualquer outra pessoa recebe `404 session_not_found`.

| Endpoint | Descrição |
|---|---|
| `POST /api/study/sessions` | Inicia uma sessão |
| `GET /api/study/sessions[?status=]` | As sessões do aluno, da mais nova para a mais antiga |
| `GET /api/study/sessions/{id}` | Uma sessão com suas questões |
| `POST /api/study/sessions/{id}/complete` | Conclui |
| `POST /api/study/sessions/{id}/abandon` | Abandona |

## Privacidade

As questões de uma sessão são a projeção `PublishedQuestion`, segura para o aluno: enunciado, tipo, dificuldade, release do Java, tópico e as chaves e textos das alternativas. Não há indicador de correção, explicação de alternativa ou geral, referência, autor, revisor nem justificativa, em uma sessão nova ou em uma antiga. O gabarito fica no banco de questões e é lido no servidor quando uma resposta é submetida (#10).

## Testando a seleção

Em produção a fonte aleatória é `SecureRandom`. Os testes registram um bean `RandomGenerator` primário com seed e um `Clock` controlável, o que torna as sessões reproduzíveis e permite testar a expiração sem esperar. Deliberadamente não há seed, parâmetro nem header na API.

## Configuração

| Propriedade | Padrão | Significado |
|---|---|---|
| `certforge.study.session-ttl` | `24h` | Tempo em que uma sessão pode ficar em andamento |
| `certforge.study.default-question-count` | `10` | Questões quando nenhuma é pedida |
| `certforge.study.max-question-count` | `20` | Maior sessão permitida |

## Adiado

Submissão de respostas e tentativas (#10), histórico e progresso (#11), seleção adaptativa, repetição espaçada, blueprints de simulado, novas tentativas, ponderação por desempenho das questões e sincronização offline.

# ADR 0013: Derivar a fila de revisão da evidência das tentativas, e dizer por que cada item está nela

> Tradução de [`docs/adr/0013-derived-review-queue.md`](../../docs/adr/0013-derived-review-queue.md). O inglês é a fonte canônica.

- Status: **Proposta.** Nada foi construído ainda. Está escrita como recomendação com o raciocínio, para poder ser aceita, ou alterada e então aceita.
- Data: 2026-10-02

## Contexto

A `v0.2.0` Adaptive Review deve dar ao aluno "uma fila de revisão direcionada, baseada em erros, confiança, recência e maestria demonstrada". **Como** essa fila é produzida é a release inteira: a mesma lista de questões ou é um apoio de estudo confiável, ou é uma caixa-preta que manda a pessoa fazer coisas por motivos que ela não consegue inspecionar.

Duas coisas já decididas restringem isso.

**O progresso não tem campo de prontidão, maestria ou previsão.** O `ProgressViews` diz isso em um comentário, e a projeção publicada é contagem, uma acurácia derivada delas, e um instante. O princípio 4 do produto é que o progresso seja explicável e derivado de evidência visível. Um escalonador que emitisse "revise isto, score 0,37" seria o primeiro número opaco do produto.

**A evidência já existe, e é imutável.** Cada `Attempt` registra a revisão, se acertou, uma `Confidence` entre `LOW`, `MEDIUM` e `HIGH`, o tempo gasto e quando aconteceu — e revisões publicadas não mudam por baixo. Nada novo precisa ser capturado para uma primeira fila de revisão.

A resposta padrão é um algoritmo de repetição espaçada como o SM-2: fatores de facilidade e intervalos por item, mutados a cada resposta. Ele escalona bem e explica mal — "seu fator de facilidade caiu para 1,96" não é um motivo sobre o qual o aluno consiga agir, e o estado armazenado deriva da evidência que o produziu, sem jeito de dizer qual dos dois está certo.

## Decisão

**1. A fila é derivada do histórico de tentativas na leitura, não guardada como estado de escalonador.** As tentativas são a evidência; a fila é uma projeção delas, como o progresso por tópico. Ela é, portanto, sempre reproduzível a partir de dados que o aluno já pode ver, e não há uma segunda fonte da verdade para divergir. O progresso mantém uma projeção armazenada **e** um endpoint de reconciliação justamente porque projeções divergem; a fila evita precisar de um não armazenando nada.

Derivar na leitura é um custo, não almoço grátis. A decisão é derivar primeiro e medir com o harness de baseline existente, e acrescentar uma projeção só se uma medição exigir — não por antecipação.

**2. Todo item declara por que está ali, em palavras, de um conjunto fechado de motivos.** Não um score.

- **Errou com confiança alta** — errou tendo dito `HIGH`. É a prioridade máxima, e é o motivo que este produto consegue dar e um app de flashcard não: resposta errada com confiança é **concepção errada**, mais perigosa que lacuna conhecida, porque o aluno não tem razão nenhuma para olhar de novo.
- **Errou** — errou com `MEDIUM` ou `LOW`. Lacuna conhecida.
- **Acertou sem certeza** — acertou tendo dito `LOW`. Um chute que deu certo, que a acurácia sozinha registra como sucesso.
- **Hora de recordar** — acertou com confiança há tempo suficiente para valer provar de novo.

**3. O escalonamento é uma regra declarada, não uma fórmula ajustada.** Depois de a questão ser respondida certo e com confiança, o intervalo até ela voltar começa em um dia e dobra a cada novo acerto confiante consecutivo, até um teto. Qualquer erro zera. Dá para dizer isso a um aluno em uma frase, e a regra pode ser mudada com evidência em vez de ajustando constantes que ninguém interpreta.

**4. A fila ordena, não prevê.** Ela responde "o que vale os seus próximos vinte minutos", que é uma ordenação de evidência. Não responde "você está pronto para a prova", que é previsão. Nenhum campo de prontidão ou maestria é acrescentado por esta release.

## Consequências

- Qualquer item da fila é rastreável a tentativas específicas, o que significa que a funcionalidade pode ser testada como o resto do projeto: afirmando a regra, não um retrato.
- O motivo vai na API como código estável, com o texto no cliente, exatamente como o contrato de erro já funciona. Isso o mantém traduzível, de que a [ADR 0012](0012-interface-language.md) vai precisar.
- "Errou com confiança alta" exige que o aluno tenha dado uma confiança, o que já é obrigatório na submissão.
- Derivar na leitura faz a consulta crescer com o histórico. Os fluxos têm orçamentos medidos pelo `deploy/measure-baseline.mjs`; a fila de revisão ganha um também, e a decisão de acrescentar projeção sai desse número.
- Uma fila derivada não carrega estado por item que um algoritmo futuro possa querer, como um fator de facilidade. Se uma release posterior quiser, é esta ADR que ela terá de substituir, e a troca que estará fazendo é explicitude por qualidade de escalonamento.

## Alternativas rejeitadas

- **SM-2 ou repetição espaçada semelhante.** Escalonamento melhor, explicação pior, e estado mutável por item que pode discordar das tentativas de onde veio. A tese do produto é evidência explicável; este seria o primeiro lugar em que isso deixaria de ser verdade.
- **Uma prioridade numérica única.** Ordenar precisa de ordem, não de número publicado. Um score exposto convida o aluno a tratá-lo como estimativa de prontidão, que é exatamente o que o princípio 4 e o módulo de progresso evitaram até aqui.
- **Capturar sinais novos antes**, como percentis de tempo por questão ou dificuldade autoavaliada. A evidência existente já sustenta uma fila útil hoje; acrescentar campos antes de usar o que está registrado é como um esquema cresce mais rápido que o seu valor.
- **Guardar a fila como projeção desde o início.** Isso é decisão de desempenho, e não há medição que a peça.

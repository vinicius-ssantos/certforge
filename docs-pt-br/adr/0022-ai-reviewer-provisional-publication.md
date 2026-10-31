# ADR 0022: Deixar um revisor de IA aprovar e publicar provisoriamente conteúdo da camada Asserted, com aviso e prazo

> Tradução de [`docs/adr/0022-ai-reviewer-provisional-publication.md`](../../docs/adr/0022-ai-reviewer-provisional-publication.md). O inglês é a fonte canônica.

- Status: **Aceita**, com a decisão 4 (o prazo de confirmação) e a decisão 5 (a expiração derivada)
  substituídas pela [ADR 0025](0025-ai-reviewer-approval-is-final.md): uma aprovação de IA agora é
  definitiva, não provisória. As decisões 1-3, 6 e 7 abaixo continuam valendo como escritas.
- Data: 2026-10-29
- Issue: nenhuma; o responsável pelo produto pediu essa exceção diretamente, consciente de que ela altera a [ADR 0005](0005-ai-not-source-of-truth.md), a [ADR 0011](0011-grade-content-evidence.md) e a [ADR 0018](0018-maintainer-may-review-their-own-work.md)

## Contexto

A [ADR 0011](0011-grade-content-evidence.md) nomeia a restrição real: revisão humana não escala, e um
banco grande o bastante para ser útil precisa de centenas de questões. A resposta foi graduar a
evidência — questões **Verified** carregam um programa compilado e executado que estabelece
mecanicamente o gabarito; questões **Asserted** se apoiam só em prosa e referências e ainda precisam da
revisão técnica completa que a [ADR 0005](0005-ai-not-source-of-truth.md) exige de tudo. Graduar
estreitou o gargalo. Não o removeu: a fila de Asserted continua travada um-para-um no tempo de uma
pessoa, e é exatamente essa restrição que o responsável pelo produto pediu para relaxar nesta ADR.

A ADR 0005 diz com clareza: a IA "não pode aprovar conteúdo... quando validação determinística é
possível," e "[c]onteúdo publicado exige revisão técnica humana." Isso não é uma limitação técnica
sendo contornada aqui — é a promessa central do produto, reafirmada pela
[ADR 0018](0018-maintainer-may-review-their-own-work.md) como "uma pessoa, não uma máquina, é a fonte da
correção técnica." Esta ADR abre uma exceção estreita, declarada e com prazo a essa promessa, em vez de
corroê-la em silêncio — porque a alternativa, uma exceção não declarada ou permanente, foi rejeitada de
cara (ver Alternativas rejeitadas).

Isto não é uma proposta de ligar uma chamada a modelo em tempo real dentro do endpoint de publicação
para julgar correção a cada requisição. É um canal identificado: uma conta que representa uma IA
agindo como revisora, operando pela mesma API editorial que todo revisor humano usa, cujas decisões são
gravadas como o que são e nunca disfarçadas de julgamento humano independente — a mesma forma que a
ADR 0018 já usa para auto-revisão.

## Decisão

**1. Escopo: só revisões da camada Asserted.** Uma revisão com evidência de verificação (um programa
compilado e executado — a camada Verified) nunca é elegível para este caminho; uma revisão Verified
continua exigindo exatamente a aprovação humana que a ADR 0005 e a ADR 0011 já exigem, sem mudança.
Isso ataca o gargalo real — conteúdo sem evidência mecânica atrás dele — em vez de relaxar o julgamento
que um compilador não pode fornecer (plausibilidade de distratores, completude das explicações,
acessibilidade), que o conteúdo Verified ainda precisa de um humano.

**2. Uma permissão nova e mais estreita: `CONTENT_AI_REVIEW`.** Concedida a uma conta dedicada (papel
`AI_REVIEWER`) criada pelo administrador do mesmo jeito que qualquer conta é criada, nunca inferida de
`CONTENT_REVIEW`. É deliberadamente diferente de `CONTENT_REVIEW`: uma conta que só tem
`CONTENT_AI_REVIEW` pode decidir sobre uma revisão Asserted e nada mais, e sua decisão é provisória por
construção (decisão 4), enquanto uma decisão de `CONTENT_REVIEW` é final.

**3. Aprovação por IA aprova e publica, em um passo só, gravada como o que é.** Chamar essa ação numa
revisão Asserted em `TECHNICAL_REVIEW` grava uma decisão de revisão com um código distinto,
`AI_APPROVED` — nunca gravada como `APPROVED`, pelo mesmo motivo que a auto-revisão da ADR 0018 é
gravada como o que aconteceu em vez de disfarçada de revisão independente — e então publica
imediatamente pelas mesmas checagens que `publish` já executa (tópico ativo, Java release de acordo,
objetivo verificado). A via rápida é exatamente isso: um passo, não dois, porque o ponto inteiro é parar
de travar o caminho desse conteúdo até um aluno na agenda de uma pessoa.

**4. Provisória, não permanente: uma janela de confirmação.** Uma publicação `AI_APPROVED` é publicada,
mas provisória, por uma janela configurada (`certforge.editorial.ai-review-confirmation-window`, padrão
14 dias). Dentro dessa janela, qualquer conta com `CONTENT_REVIEW` — menos o autor da revisão, pela
mesma regra de separação que `requireSeparation` já aplica — pode gravar uma decisão de confirmação,
`AI_REVIEW_CONFIRMED`. Uma revisão confirmada passa a ter exatamente a confiança de uma aprovada
normalmente, para sempre, pelo mesmo motivo de uma confirmação ser uma revisão humana independente real
sobre conteúdo real já na frente de um aluno — pelo menos tão rigorosa quanto uma revisão feita sobre um
rascunho.

**5. A expiração é derivada na leitura, nunca uma mutação agendada e guardada.** Uma revisão cuja
decisão `AI_APPROVED` mais recente não tem `AI_REVIEW_CONFIRMED` depois dela e é mais antiga que a
janela deixa de ser elegível no instante em que isso se torna verdade, nas duas leituras que escolhem
algo novo para um aluno estudar — `QuestionBank.eligibleForTopic` e `QuestionBank.eligibleForInterview`.
Nada vira uma coluna de status guardada e nenhum job agendado roda; a regra é avaliada a partir do
histórico de revisões e do relógio a cada vez que uma dessas leituras é servida, no mesmo espírito que a
[ADR 0013](0013-derived-review-queue.md) prefere derivar a guardar estado de agendador. Um aluno já em
sessão continua vendo a revisão que já lhe foi mostrada — `findSnapshotQuestion` e `findPublished` não
mudam — porque a promessa de imutabilidade da ADR 0003 é sobre não reescrever o que um aluno já viu, não
sobre oferecer ou não a mesma coisa a outra pessoa.

**6. Declarada, não só registrada — para o aluno, não só para o desk editorial.** O aluno vê quando uma
questão que está olhando foi revisada por IA e ainda não confirmada independentemente por uma pessoa, do
mesmo jeito que o desk editorial já declara uma auto-revisão. É o mesmo precedente de transparência que
a ADR 0018 fixou: "aceita, nunca disfarçada."

**7. O que não muda.** Publicação da camada Verified. A regra de separação para revisão independente em
toda outra decisão. A [ADR 0004](0004-authorial-content-only.md) — um revisor de IA só julga conteúdo
autoral; não o escreve, e certamente não libera nada antes proibido. A graduação da própria
[ADR 0011](0011-grade-content-evidence.md). A frase de política de IA já existente na política de
conteúdo é estreitada exatamente por esta ADR, não substituída por ela: a IA agora pode aprovar e
publicar provisoriamente, e só nesse único caminho que esta ADR nomeia, com a única declaração e o
único prazo que ela exige.

## Consequências

- Esta é uma exposição explicitamente aceita, não uma afirmação de segurança equivalente: diferente de
  toda outra questão publicada no produto, uma revisão `AI_APPROVED` sem confirmação ainda não foi
  checada por ninguém que, nas palavras da ADR 0018, "ainda não acredita na resposta." A janela limita
  por quanto tempo essa exposição pode durar antes de o conteúdo desaparecer de novo do estudo por conta
  própria.
- A contagem de questões elegíveis de um tópico para um aluno pode encolher por conta própria, sem que
  ninguém tenha agido, no dia em que uma revisão `AI_APPROVED` expira. O desk editorial deve destacar a
  fila de confirmação pendente em algum lugar que um revisor realmente olhe; qual página e com que
  destaque é decisão de implementação, não uma regra que esta ADR fixa.
- O registro de revisão passa a ter três códigos de decisão em vez de dois: `AI_APPROVED` e
  `AI_REVIEW_CONFIRMED` se juntam a `APPROVED` e `CHANGES_REQUESTED`. Nada depois pode ler `AI_APPROVED`
  como `APPROVED`; são strings deliberadamente diferentes exatamente para que uma consulta não possa
  confundi-las por acidente.
- Uma revisão pode ser `AI_APPROVED`, expirar, e ser confirmada depois mesmo assim — confirmação após a
  expiração ainda é aceita e ainda eleva para confiança permanente, porque o conteúdo não mudou, só se
  estava sendo oferecido a novos alunos naquele momento.
- O `deploy/publish-pack.mjs` e o pipeline de pacotes de conteúdo em lote não são afetados por esta ADR:
  é uma decisão sobre o passo de revisão da API editorial viva, não sobre a ferramentação de importação
  de pacotes estáticos que a ADR 0011 também discute.

## Alternativas rejeitadas

- **Aprovação por IA permanente, sem exigir confirmação humana nunca.** Era a forma original da
  proposta. Rejeitada porque tornaria o julgamento da IA final para uma camada inteira de conteúdo sem
  limite de quanto tempo conteúdo não checado poderia ficar na frente de alunos — o oposto do que
  "provisório" deveria significar.
- **Estender a exceção ao conteúdo da camada Verified.** Rejeitada porque o passo humano que resta no
  conteúdo Verified é exatamente o julgamento que um compilador não consegue fazer (plausibilidade,
  completude, acessibilidade), que não é o gargalo que esta ADR existe para aliviar.
- **Uma flag não declarada, visível só para o desk editorial.** Rejeitada pelo mesmo motivo que a ADR
  0018 rejeitou disfarçar auto-revisão: o registro deixaria um aluno acreditar que uma questão foi
  revisada independentemente quando não foi.
- **Uma expiração guardada e agendada (um job em lote que vira o status para expirado).** Rejeitada em
  favor de derivar a expiração no momento da leitura, de acordo com a
  [ADR 0013](0013-derived-review-queue.md): não existe uma segunda fonte da verdade sobre se uma
  revisão está elegível agora, e nada pode divergir do histórico de revisões que a origina.
- **Ligar uma chamada a modelo em tempo real dentro de `publish()` para julgar correção
  automaticamente a cada requisição.** Fora do escopo desta ADR. O que esta decisão cria é uma
  identidade de revisor e um estado de publicação provisória que um agente pode usar pela API editorial
  já existente; não cria, e não deve ser lida como endosso de, um passo de inferência automatizada que
  decide correção dentro do caminho da requisição.

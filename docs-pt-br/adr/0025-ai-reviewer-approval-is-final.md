# ADR 0025: Tornar definitiva a aprovação da revisora de IA, sem etapa de confirmação humana

> Tradução de [`docs/adr/0025-ai-reviewer-approval-is-final.md`](../../docs/adr/0025-ai-reviewer-approval-is-final.md). O inglês é a fonte canônica.

- Status: **Aceita.** A restrição de escopo da decisão 4 é substituída pela [ADR 0026](0026-ai-reviewer-fast-lane-for-every-pack.md), que estende esta via rápida a todo pacote; o restante abaixo continua válido.
- Data: 2026-10-31
- Issue: nenhuma; o responsável pelo produto pediu isso diretamente, consciente de que isso reverte a alternativa que a própria [ADR 0022](0022-ai-reviewer-provisional-publication.md) havia rejeitado ("aprovação de IA permanente, sem nunca exigir confirmação humana") e estreita ainda mais a [ADR 0005](0005-ai-not-source-of-truth.md) e a [ADR 0011](0011-grade-content-evidence.md), além do que a [ADR 0022](0022-ai-reviewer-provisional-publication.md) e a [ADR 0024](0024-ai-reviewer-verified-tier.md) já haviam feito

## Contexto

A ADR 0022 construiu uma exceção divulgada e com prazo à regra da ADR 0005 de que conteúdo
publicado exige revisão técnica humana: uma revisora de IA podia aprovar e publicar uma versão em
um único passo, registrada como `AI_APPROVED`, mas a publicação permanecia provisória até que uma
conta `CONTENT_REVIEW` a confirmasse dentro de um prazo configurado (14 dias por padrão) ou ela
deixasse de ser oferecida para novo estudo. A ADR 0024 ampliou o conteúdo alcançado pela via
rápida; não tocou na exigência de confirmação.

Essa etapa de confirmação era exatamente o gargalo que a ADR 0022 foi escrita para aliviar,
deslocado em vez de removido: uma pessoa ainda tinha que ler de novo cada questão aprovada pela IA,
contra um relógio, ou o crescimento do pacote voltava a escapar por baixo dela. A
[epic #199](https://github.com/vinicius-ssantos/certforge/issues/199) (`v0.3.0` Simulados) nomeou a
mesma restrição com outro nome — "nenhum agente pode encerrar nenhuma parte" da distância entre o
pacote e uma tag — porque essa distância era, na prática, essa mesma etapa de confirmação
multiplicada por cada tópico que a via rápida já alcançava.

O responsável pelo produto foi perguntado diretamente, com o trade-off dito sem rodeios — isso
torna definitivo o julgamento da revisora de IA, sem nada que uma pessoa confira depois, que é
exatamente a alternativa que a própria ADR 0022 rejeitou oito dias antes — e disse que sim,
deliberadamente e nestas palavras: remover o portão humano de vez.

## Decisão

**1. Uma decisão `AI_APPROVED` é definitiva, não provisória.** Ela é elegível para novo estudo
exatamente como uma aprovada normalmente (`APPROVED`), imediatamente e para sempre. Não há prazo de
confirmação, não há expiração, e não há nada que uma conta `CONTENT_REVIEW` precise fazer com ela
depois.

**2. O mecanismo de confirmação é removido, não apenas deixado sem uso.** `confirmAiReview`, o
endpoint `/api/admin/question-revisions/{revisionId}/confirm-ai-review`, o código de decisão
`AI_REVIEW_CONFIRMED`, as leituras derivadas `lapsed`/`pending`/`confirmBy`, `aiReviewConfirmBy` e
`certforge.editorial.ai-review-confirmation-window` são todos apagados do código, não mantidos
adormecidos. Uma via rápida pela metade, que ainda carregasse essa tubulação morta de confirmação,
descreveria errado o que o sistema de fato faz.

**3. A divulgação não muda, e não expira.** O registro continua identificando a revisora de IA como
a revisora, exatamente como antes (o raciocínio da decisão 3 da ADR 0022 — o princípio de
divulgação da ADR 0018 — não é tocado por esta ADR). Quem estuda ainda é informado de que uma
questão foi revisada por uma IA e não por uma pessoa; a única mudança é que essa divulgação deixa
de carregar um prazo ou a afirmação de que a confirmação de uma pessoa está pendente, porque
nenhuma vai chegar e nenhuma é necessária.

**4. O alcance é exatamente o da ADR 0022 e da ADR 0024, não ampliado além disso.** Esta ADR não
toca em quem pode ter `CONTENT_AI_REVIEW`, em quais camadas a via rápida alcança, na regra de
separação que impede uma conta de aprovar sua própria autoria, nem em nada sobre a flag
`--ai-reviewed-only` do próprio `deploy/publish-pack.mjs`, além do fato de que o que ela publica
agora é definitivo, e não provisório, a partir do momento em que publica.

## Consequências

- **As próprias palavras da ADR 0005 deixam de valer sem ressalva.** "Conteúdo publicado exige
  revisão técnica humana" é verdade para toda versão aprovada por `approve`, e falso para uma
  aprovada por `aiApprove`. Esta ADR é a segunda exceção, e maior, a essa frase — a ADR 0022 foi a
  primeira — e esta não deixa mais nenhuma etapa humana no único caminho que cobre. Quem ler a ADR
  0005 deve ler a decisão 2 dela junto com esta ADR e com a ADR 0022/0024, não isoladamente.
- **A exposição real que a ADR 0022 aceitou conscientemente agora é permanente, em vez de ter
  prazo.** A própria seção de consequências da ADR 0022 dizia claramente que uma versão
  `AI_APPROVED` não confirmada "ainda não foi checada por ninguém que... 'não acredite de antemão na
  resposta'." Sob esta ADR, nesse único caminho, ninguém jamais a checa de forma independente, por
  desenho, a menos que uma pessoa escolha lê-la de qualquer forma, fora de qualquer etapa imposta
  pelo sistema.
- **A lacuna de conteúdo que restava na epic #199 se encerra pelo mesmo mecanismo já construído para
  isso.** As 104 questões do pacote Java SE 21 revisadas por IA e publicadas pela via rápida ficam
  imediata e permanentemente elegíveis, que era o que a exigência de cinco por tópico do roteiro do
  simulado precisava; nenhuma ferramenta nova foi necessária além desta ADR e da mudança de código
  que a implementa.
- **Um caminho de leitura mais simples.** `QuestionBankReadService.eligibleForTopic` e
  `eligibleForInterview` não filtram mais nada por um relógio; `AiReview` encolhe de cinco
  predicados derivados para um só (`approved`); `QuestionBankProperties` e `QuestionBankConfig` são
  apagadas por completo, já que a única configuração para a qual existiam deixou de existir.
- **É uma reversão que a própria história do projeto já havia nomeado e rejeitado uma vez, feita
  mesmo assim, por quem tem autoridade para fazê-la.** A ADR 0022 rejeitou "aprovação de IA
  permanente, sem nunca exigir confirmação humana" oito dias antes de esta ADR adotar exatamente
  isso, pela razão declarada de que o próprio custo do backlog — uma pessoa relendo cada questão
  provisoriamente aprovada por IA uma segunda vez, contra um relógio, para sempre — havia se tornado
  o que de fato bloqueava um lançamento, não uma hipótese.

## Alternativas rejeitadas

- **Um prazo de confirmação mais curto ou mais longo, em vez de nenhum.** Considerado e rejeitado:
  qualquer prazo não-zero ainda exige a agenda de uma pessoa para esvaziar o backlog eventualmente,
  que é exatamente o custo que esta ADR remove. Um prazo longo o bastante para nunca valer na
  prática seria esta decisão em substância, com burocracia extra na forma.
- **Manter o endpoint de confirmação, mas torná-lo opcional (silêncio conta como confirmado).**
  Rejeitado como complexidade desnecessária: se o silêncio já conta como definitivo, não há nada
  que uma confirmação explícita adicione, e manter o endpoint só convida o código e a documentação
  a discordar sobre do que de fato depende o status de uma versão.
- **Restringir a remoção só ao pacote Java SE 21, deixando o prazo em vigor de modo geral.**
  Rejeitado: a via rápida é uma propriedade do mecanismo de revisão, não de um pacote, e uma
  exceção específica de um pacote dentro da API editorial viva não tem onde morar naturalmente — a
  contabilidade do `review.json`, delimitada por pacote, é uma preocupação estática separada que a
  ADR 0023 já cobre, não algo em que os códigos de decisão da API viva possam se basear.

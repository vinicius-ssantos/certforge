# ADR 0023: Estender a via rápida da revisora de IA aos scripts de publicação de pacotes de conteúdo

> Tradução de [`docs/adr/0023-ai-reviewer-fast-lane-for-content-packs.md`](../../docs/adr/0023-ai-reviewer-fast-lane-for-content-packs.md). O inglês é a fonte canônica.

- Status: **Aceita**
- Data: 2026-10-29
- Issue: nenhuma; o responsável pelo produto pediu diretamente que a exceção da ADR 0022 alcançasse a
  fila de pacotes de conteúdo (#80 e suas sub-issues por tópico), depois de confirmar que é um sistema
  diferente do desk editorial vivo contra o qual a ADR 0022 foi escrita

## Contexto

A [ADR 0022](0022-ai-reviewer-provisional-publication.md) construiu a via rápida da revisora de IA
contra a API HTTP editorial viva: uma conta com `CONTENT_AI_REVIEW` pode aprovar e publicar uma revisão
`TECHNICAL_REVIEW` da camada Asserted em um passo só, provisoriamente, declarada ao aluno. A #80 e suas
dez sub-issues por tópico (entre elas #141–#148) pedem exatamente o tipo de revisão que esse gargalo
descreve — 130 questões não revisadas de Java SE 21 — mas não são um pedido contra aquela API viva. São
um pedido contra `content/java-se-21/review.json`, lido por `content/record-review.mjs`,
`content/pack.mjs` e `deploy/publish-pack.mjs`.

Esses scripts, ao serem inspecionados, não são um segundo sistema de armazenamento. O
`deploy/publish-pack.mjs` lê um veredito que uma revisora já registrou no `review.json` e então toca a
*mesma* sequência `submit` → `approve` → `publish` da API editorial viva que um navegador tocaria,
usando as credenciais de uma conta passadas na linha de comando. O pacote de conteúdo é texto autoral
esperando ser empurrado por aquela API via script em vez de à mão; o mecanismo da ADR 0022 é
perfeitamente alcançável aqui, uma vez que esses scripts saibam que o novo caminho existe.

Uma diferença real do texto da própria ADR 0022 importa: o `record-review.mjs` já recusa de propósito
uma segunda identidade de revisor — "uma segunda revisora é uma afirmação sobre quem leu a questão;
adicione-a ao review.json deliberadamente em vez de por esta ferramenta." Essa recusa está correta e
permanece; esta ADR é a adição deliberada que ela foi escrita para exigir, não um jeito de contorná-la.

## Decisão

**1. O `review.json` ganha um campo novo, opcional, por questão: `reviewer`.** Ausente, uma entrada
continua significando exatamente o que sempre significou — revisada pela revisora humana nomeada no
topo do arquivo. Presente e igual à string literal `"ai-reviewer"`, significa que essa questão em
particular foi revisada e registrada pela revisora de IA, pelo mesmo motivo que a ADR 0022 grava
`AI_APPROVED` em vez de `APPROVED` no banco vivo: declarado, nunca disfarçado do veredito da revisora
humana. O `reviewStatusOf` de `content/pack.mjs` passa a reportar `entry.reviewer ?? record.reviewer`,
então todo ponto de leitura de `.reviewer` já existente reporta o nome certo sem mudança.

**2. O `content/record-review.mjs` ganha uma flag nova, `--ai-reviewed`, não uma checagem relaxada.**
Ela grava `reviewer: "ai-reviewer"` na entrada em vez de deixar o campo ausente, e é incompatível com
`--reviewer` — passar os dois é recusado, do mesmo jeito que um veredito desconhecido é recusado, porque
a identidade que essa flag grava não é uma afirmação em texto livre, é uma fixa e declarada. Toda outra
regra da ferramenta continua igual: o digest ainda é recalculado a partir da questão como ela está, não
confiado de quem chama, e nada aqui deixa essa flag afirmar um veredito sobre uma questão que ninguém
de fato leu.

**3. Escopo: só questões da camada Asserted, exatamente como a ADR 0022 restringe.** Uma questão com
programa executável e saída verificada (a camada Verified, ADR 0011) não é elegível para
`--ai-reviewed`; a ferramenta a recusa do mesmo jeito que o endpoint vivo recusa uma revisão Verified
passada para `ai-approve`. Das 130 questões não revisadas de Java SE 21 que a #80 conta, este caminho
alcança as conceituais/baseadas em referência (Asserted) entre elas; as da camada Verified continuam
precisando exatamente da revisão humana que a ADR 0011 e a ADR 0022 já exigem, sem mudança.

**4. O `deploy/publish-pack.mjs` toca dois caminhos pelo mesmo pacote, pelo que a entrada de cada
questão diz.** Uma questão cujo `reviewStatusOf(...).reviewer` é `"ai-reviewer"` é publicada por
`submit` (pela conta autora/administradora já em uso) e então uma única chamada `ai-approve`, usando
uma conta dedicada com `CONTENT_AI_REVIEW` — `--ai-reviewer-email`/`--ai-reviewer-password` (ou
`CERTFORGE_AI_REVIEWER_EMAIL`/`CERTFORGE_AI_REVIEWER_PASSWORD`), flags novas ao lado das já existentes
`--reviewer-email`/`--reviewer-password`. Uma questão revisada pela humana nomeada do pacote continua
passando por `submit` → `approve` → `publish` exatamente como antes. Qualquer par de credenciais só é
exigido quando a execução atual de fato tem uma questão que precisa dele — um pacote revisado
inteiramente pela revisora de IA nunca precisa de `--reviewer-email`, e vice-versa. A recusa de
auto-revisão que já existe para a revisora humana (`reviewerEmail === adminEmail`) ganha a mesma
checagem para a conta revisora de IA.

**5. Um script novo, `deploy/grant-ai-reviewer.mjs`, espelha o `deploy/grant-reviewer.mjs`.** Ele cria
ou encontra uma conta e concede `AI_REVIEWER`, recusando se essa conta já tiver `REVIEWER` ou
`ADMINISTRATOR` — a mesma coisa que o próprio Javadoc do
[Role.java](../../src/main/java/dev/certforge/identity/Role.java) já pede desse papel: nunca a mesma
conta de uma revisora humana, porque isso tornaria suas aprovações finais, que é exatamente o que esse
caminho não permite.

**6. O que não muda.** A mecânica do banco vivo que a ADR 0022 já construiu — `AI_APPROVED`,
`AI_REVIEW_CONFIRMED`, a janela de confirmação, a expiração derivada, a declaração ao aluno — se aplica
identicamente a uma questão publicada deste jeito, porque publicá-la chama exatamente o mesmo endpoint.
Uma humana confirmando dentro da janela, ou deixando-a expirar de volta para fora da nova seleção,
funciona exatamente como a ADR 0022 já descreve; nada dessa metade do mecanismo precisou mudar para uma
chamadora via script em vez de navegador.

## Consequências

- O backlog de 130 questões da #80 se divide em duas filas por camada: as da camada Asserted que esta
  ADR alcança, e as da camada Verified, que continuam precisando de uma revisora humana de qualquer
  jeito, a mesma restrição que a ADR 0022 já traçava.
- Uma questão publicada e revisada por IA por este pipeline é exatamente tão provisória quanto uma
  aprovada pelo navegador: declarada ao aluno, e excluída da nova seleção de novo se ninguém com
  `CONTENT_REVIEW` a confirmar dentro da janela. Rodar este script não é o fim da história para aquela
  questão; confirmá-la ainda é.
- O formato de revisora-humana-única já existente do `review.json` é preservado para toda questão que
  este caminho não toca. Quem lê o arquivo sem conhecer esta ADR continua lendo as entradas comuns
  exatamente como antes; só uma entrada que diz `"reviewer": "ai-reviewer"` é nova, e ela diz isso
  claramente.
- O `content/review-integrity.mjs` e o esquema de pacote-manifesto que ele checa não são afetados: esta
  ADR altera o esquema baseado em digest que o `review.json` do `java-se-21` já usa, não o esquema
  baseado em blob do git que um pacote-manifesto usa, que continua sem nenhum caminho de revisora de IA.

## Alternativas rejeitadas

- **Tratar o campo `reviewer` de topo do `review.json` como sobrescrevível por execução.** Rejeitada: a
  revisora humana nomeada do pacote é um fato sobre quem revisou a maior parte dele, e mudá-la para uma
  única invocação deturparia a proveniência de toda outra entrada junto. Um campo por questão só diz o
  que mudou.
- **Pular o `review.json` e chamar `ai-approve` direto de um script pontual, sem tocar no registro de
  revisão do próprio pacote.** Considerada, e rejeitada: a própria definição de pronto da #80 é uma
  entrada no `review.json` por questão, o mesmo artefato que uma revisora humana produziria, e o
  histórico de commits desse arquivo é parte do registro que este projeto mantém. Pular isso publicaria
  conteúdo real enquanto deixaria o estado rastreado da própria issue do backlog dizendo que a questão
  nunca foi revisada.
- **Deixar `--ai-reviewed` também aceitar questões da camada Verified, já que a própria trava do
  endpoint vivo as recusaria de qualquer jeito e o script poderia só mostrar esse erro.** Rejeitada em
  favor de recusar mais cedo, no momento em que o registro é gravado: uma entrada de `review.json` que
  seria recusada no instante em que alguém tentasse publicá-la é um registro pior do que nenhuma
  entrada.

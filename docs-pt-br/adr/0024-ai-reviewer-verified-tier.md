# ADR 0024: Estender a via rápida da revisora de IA à camada Verified, com seu próprio checklist registrado

> Tradução de [`docs/adr/0024-ai-reviewer-verified-tier.md`](../../docs/adr/0024-ai-reviewer-verified-tier.md). O inglês é a fonte canônica.

- Status: **Aceita**
- Data: 2026-10-29
- Issue: nenhuma; o responsável pelo produto pediu diretamente, depois de confirmar que todas as 104
  questões não revisadas da #80 em Java SE 21 são da camada Verified e, portanto, inalcançáveis pela
  [ADR 0022](0022-ai-reviewer-provisional-publication.md) e pela
  [ADR 0023](0023-ai-reviewer-fast-lane-for-content-packs.md) como estavam

## Contexto

A ADR 0022 restringiu a via rápida da revisora de IA ao conteúdo da camada Asserted de propósito: uma
revisão da camada Verified já tem a prova de um compilador de que o gabarito está correto, e o que
restava era exatamente o julgamento que um compilador não consegue fornecer — plausibilidade dos
distratores, completude das explicações, acessibilidade de código e prosa. A ADR 0023 levou essa mesma
restrição aos scripts de pacote de conteúdo. As duas foram escritas honestamente, e as duas, uma vez que
o backlog real foi checado, acabaram restringindo a revisora de IA de exatamente o que a #80 precisa:
toda questão ainda não revisada em `content/java-se-21` agora carrega um programa verificado. Não há
backlog da camada Asserted sobrando para aliviar.

O responsável pelo produto foi perguntado diretamente se deveria levantar a restrição, com o
trade-off dito claramente — a revisora de IA passaria a fazer exatamente o julgamento que a ADR 0022
tinha reservado para uma pessoa — e disse sim.

## Decisão

**1. A restrição da camada Asserted é levantada. A revisora de IA pode aprovar uma revisão da camada
Verified.** O `QuestionBankService.aiApprove` não recusa mais uma por carregar evidência de
verificação; o endpoint vivo `ai-approve` aceita qualquer das duas camadas. O
`content/record-review.mjs --ai-reviewed` também não recusa mais. Todo o resto da via rápida continua
igual: `AI_APPROVED`, nunca disfarçado de `APPROVED`; a janela de confirmação; a expiração derivada; a
declaração ao aluno; a regra de separação de que uma conta não pode aprovar sua própria autoria.

**2. Uma aprovação por IA agora registra quais checagens de política ela de fato fez, do mesmo jeito que
a de uma humana.** O `aiApprove` ganha o mesmo campo `checklist` que o `approve` já tem, validado contra
o mesmo `ReviewChecklist.ITEMS`. Isso era opcional enquanto a via rápida só alcançava conteúdo Asserted,
onde um compilador já tinha resolvido a coisa que um item de checklist como `CODE_VERIFIED` estaria
atestando. Alcançar conteúdo Verified muda isso: a revisora de IA agora é quem atesta a plausibilidade
dos distratores e a completude das explicações, e um `AI_APPROVED` nu, sem escopo declarado, seria um
registro mais fraco do que o caminho humano já mantém para a mesma decisão.

**3. Os scripts de pacote de conteúdo carregam um checklist por questão para uma revisão de IA, onde o
caminho humano carrega um para o pacote inteiro.** `record-review.mjs --ai-reviewed --checklist
ITEM,ITEM` grava os itens marcados na própria entrada da questão no `review.json`; o `reviewStatusOf` os
reporta; o `publish-pack.mjs` os passa para o `ai-approve` em vez de uma lista vazia. O `record.checklist`
único do pacote continua descrevendo o que sua revisora humana nomeada atestou para o pacote como um
todo — sem mudança, e ainda o que uma questão revisada por humano no mesmo pacote carrega para o
`approve`.

**4. O que não muda.** A revisora de IA continua nunca autorando; continua nunca aprovando nada de forma
final — toda publicação de origem IA continua provisória até que uma conta `CONTENT_REVIEW` (nunca a
autora) a confirme dentro da janela, ou ela expire de volta para fora da nova seleção por conta própria.
A declaração ao aluno é idêntica para qualquer das camadas: `PublishedQuestion.aiReviewed` não distingue
qual camada a produziu, porque o que está sendo declarado — julgamento de IA não confirmado — é a mesma
afirmação de qualquer jeito.

## Consequências

- O backlog real da #80 — 104 questões da camada Verified — agora é alcançável pelo mecanismo que este
  projeto já construiu exatamente para isso, em vez de precisar de uma terceira ADR para notar que a
  restrição era a errada a manter.
- O registro da revisora de IA para uma aprovação da camada Verified declara, por questão, quais das
  cinco checagens de política ela fez. Quem lê o `review.json` ou as notas de revisão do desk editorial
  consegue distinguir uma aprovação de IA rasa (nada marcado) de uma completa, do mesmo jeito que já
  consegue para uma humana.
- Esta é uma exposição mais ampla do que a ADR 0022 originalmente aceitou: o julgamento da revisora de
  IA agora vale, provisoriamente, para afirmações que um compilador não consegue checar de forma alguma.
  A janela e a exigência de confirmação são o mesmo limite que já existia; agora carregam mais peso do
  que antes, por desenho, não por omissão.
- O parágrafo de política de IA do `docs/product/content-policy.md` é ampliado para dizer isso: a via
  rápida que ele já nomeava agora também alcança conteúdo da camada Verified, sob a mesma declaração e a
  mesma janela.

## Alternativas rejeitadas

- **Manter a restrição e pedir que uma humana revise as 104 questões em vez disso.** Era a resposta
  padrão até o responsável pelo produto pedir esta ADR diretamente; continua disponível simplesmente não
  usando `--ai-reviewed` numa questão dada, o que a ferramentação continua suportando exatamente como
  antes.
- **Uma janela de confirmação mais curta para aprovações de IA da camada Verified, sob a teoria de que a
  exposição é maior.** Rejeitada por ora como um número sem motivação: os 14 dias da ADR 0022 não foram
  derivados do perfil de risco da camada Asserted de um jeito que tornaria um número diferente
  principiado aqui também. Se evidência futura sugerir que a janela deveria diferir por camada, é isso
  que teria que motivar mudá-la, não a escolha desta ADR de ampliar o escopo.
- **Não registrar um checklist para o caminho ai-approve, como antes.** Rejeitada uma vez que a restrição
  se moveu: uma aprovação nua era tolerável quando nada que ela atestava precisava de julgamento em
  formato humano para se estabelecer; agora que precisa, o registro deveria dizer o que de fato foi
  checado, do mesmo jeito que a ADR 0011 já pede de uma revisão humana.

# ADR 0026: Estender a via rápida da revisora de IA a todo pacote de conteúdo e todo tipo de trilha

> Tradução de [`docs/adr/0026-ai-reviewer-fast-lane-for-every-pack.md`](../../docs/adr/0026-ai-reviewer-fast-lane-for-every-pack.md). O inglês é a fonte canônica.

- Status: **Aceita**
- Data: 2026-10-31
- Issue: nenhuma; o responsável pelo produto pediu isso diretamente, na mesma conversa que produziu
  a [ADR 0025](0025-ai-reviewer-approval-is-final.md), depois de ser avisado claramente sobre o que
  isso reverte: a decisão 4 da [ADR 0025](0025-ai-reviewer-approval-is-final.md) e a decisão 4 da
  [ADR 0022](0022-ai-reviewer-provisional-publication.md) limitavam a via rápida exatamente ao
  pacote de conteúdo que já tinha uma pré-revisão de IA por trás, "sem ampliar além disso". Esta
  ADR amplia mesmo assim, para todo pacote, presente ou futuro.

## Contexto

A ADR 0022, a ADR 0024 e a ADR 0025 construíram e depois tornaram definitiva uma via rápida
divulgada — uma conta com `CONTENT_AI_REVIEW` pode aprovar e publicar uma versão em um único passo,
registrada como `AI_APPROVED` em vez de `APPROVED` — mas cada uma dessas três ADRs disse,
explicitamente, que a via rápida alcançava exatamente o pacote Java SE 21 e nada além dele. Esse
pacote tinha uma história específica por trás da exceção: 130 questões já haviam passado por uma
auditoria técnica de IA na issue #96 antes mesmo de a ADR 0022 existir, e a via rápida formalizou
uma revisão que uma IA já havia feito uma vez, de forma divulgada, em vez de inventar uma nova.

O responsável pelo produto então pediu para que duas novas trilhas de conteúdo fossem construídas
por completo: Interview Prep (épico #17) e as trilhas de certificação de
Infraestrutura/DevOps/Cloud Native (épico #164). Cada uma das issues de autoria de conteúdo
delas — #150 a #158, #167 a #177 — foi escrita com "revisão técnica humana" ou "revisão humana
obrigatória" como critério de aceite explícito e sem ressalvas, porque, no momento em que essas
issues foram abertas, nenhuma via rápida as alcançava: a própria decisão de escopo da ADR 0022
impedia isso.

Autorar esse conteúdo e depois pedir para uma pessoa ler tudo reproduz exatamente o
estrangulamento que a ADR 0022 e a ADR 0025 foram escritas para aliviar, numa escala maior: mais
tópicos, mais domínios, nenhum deles com a auditoria de IA prévia que o pacote Java SE 21 teve. O
responsável foi avisado disso diretamente — que estender a via rápida aqui significa a IA aprovar
e publicar afirmações técnicas em domínios (comportamento de IAM da AWS, semântica do agendador do
Kubernetes, comportamento de estado do Terraform) que ninguém, humano ou IA, verificou de forma
independente antes desta ADR, diferente do histórico prévio do pacote Java SE 21 — e disse sim,
estender para todo conteúdo novo, não só para algumas trilhas.

## Decisão

**1. A via rápida é uma propriedade do mecanismo de revisão, não de um pacote específico.** A
decisão 4 da ADR 0022 e a decisão 4 da ADR 0025 ("o escopo é exatamente o da ADR 0022 e da ADR
0024, sem ampliação adicional") são ambas substituídas. `CONTENT_AI_REVIEW` alcança todo pacote de
conteúdo e todo `trackKind` (`CERTIFICATION`, `INTERVIEW`, `GENERAL`) que este projeto tem ou vier a
ter, sem exigir uma ADR por pacote para admitir um novo.

**2. Nada mais no mecanismo muda.** A mesma conta precisa ter `CONTENT_AI_REVIEW`; a mesma regra de
separação continua recusando que uma conta aprove sua própria autoria; a aprovação continua
registrada como `AI_APPROVED`, nunca disfarçada de `APPROVED` humana comum; a divulgação ao
aprendiz não muda; a aprovação é definitiva, sem etapa de confirmação, exatamente como a ADR 0025
deixou. Esta ADR amplia *quais pacotes* a via rápida alcança, não *o que a via rápida faz*.

**3. Publicar ainda exige uma versão de trilha ativa.** `QuestionBankService.publish` (e portanto
`aiApprove`, que o chama) já recusa publicar numa versão de trilha que não esteja `ACTIVE`
(`topic_not_active`). Esta ADR não muda esse invariante e não ativa nenhuma trilha por si só.
Ativar uma versão de trilha `DRAFT` para `ACTIVE` continua sendo seu próprio ato administrativo
deliberado — o mesmo que o contexto da própria ADR 0022 chamou de algo que "os endpoints
administrativos já existentes fazem; eles não exigem um exame" — e é registrado onde acontece,
separadamente desta decisão.

**4. A pré-revisão de IA em que a ADR 0022 pôde se apoiar para o pacote Java SE 21 não existe para
este conteúdo novo, e esta ADR não fabrica uma.** O checklist que `aiApprove` registra continua
sendo a verificação real que sempre foi — a conta revisora de fato avalia a questão contra o mesmo
checklist de política que uma revisora humana usaria — não uma formalidade. Esta ADR remove a
exigência de *confirmação humana* de todo pacote; não remove a exigência de que uma decisão da
revisora de IA seja uma revisão real, apoiada em checklist.

## Consequências

- **Toda issue de autoria de conteúdo aberta com "revisão humana obrigatória" deixa de ser um
  bloqueio rígido.** #150 a #158 e #167 a #177 podem ser fechadas pelo mesmo mecanismo divulgado,
  definitivo e aprovado por IA que o pacote Java SE 21 já usa, uma vez que o conteúdo exista e passe
  pelo mesmo checklist.
- **A exposição é maior que a da ADR 0025, porque o conteúdo é mais novo e menos examinado.** A
  seção de consequências da ADR 0025 foi honesta ao dizer que ninguém verifica de forma
  independente uma versão `AI_APPROVED` do Java SE 21; aquele pacote já havia passado por uma
  auditoria de IA (#96) antes mesmo de a via rápida existir. Este conteúdo não passou por nenhuma.
  Uma afirmação tecnicamente errada sobre, por exemplo, o comportamento do agendador do Kubernetes
  ou um limite de permissão do IAM agora pode alcançar um aprendiz com base apenas no checklist de
  uma revisora de IA, num domínio sem nenhuma verificação independente prévia.
- **Esta é, de novo, uma reversão que o próprio texto das issues do projeto já nomeava.** Nove
  issues em dois épicos dizem explicitamente que a revisão humana é obrigatória, sem alternativa de
  IA. Esta ADR é a decisão que torna essas frases não mais verdadeiras, tomada da mesma forma que a
  ADR 0025 foi: dita claramente ao responsável, e decidida por ele mesmo assim.
- **Ativar uma trilha continua separado e não é implicado só por esta ADR.** Uma trilha `DRAFT`
  continua invisível aos aprendizes até que alguém ative sua versão, esteja ou não toda questão
  dentro dela `AI_APPROVED`. Onde o responsável também pediu que uma trilha entrasse no ar, essa
  ativação é uma ação administrativa distinta e registrada, não um efeito colateral desta decisão.

## Alternativas rejeitadas

- **Uma ADR nova por pacote, seguindo o próprio padrão da ADR 0022.** Rejeitada porque a decisão do
  responsável foi explicitamente sobre todo pacote atual e futuro, não uma ampliação um a um, e
  escrever nove ADRs quase idênticas para #150 a #158 e #167 a #177 documentaria a mesma decisão
  nove vezes em vez de uma.
- **Exigir uma auditoria de IA prévia específica do pacote (espelhando a #96) antes que sua via
  rápida se aplique.** Considerada, porque essa auditoria é a única coisa que tornou a exceção
  original da ADR 0022 menos exposta do que esta. Rejeitada porque a instrução do responsável foi
  estender o mecanismo agora, para desbloquear o backlog diretamente, não recriar primeiro o
  histórico de auditoria do pacote Java SE 21 para cada trilha nova — fazer isso recriaria
  exatamente o estrangulamento que está sendo removido.

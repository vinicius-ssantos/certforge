# Banco de Questões

> Tradução de [`docs/architecture/question-bank.md`](../../docs/architecture/question-bank.md). O inglês é a fonte canônica.

Issue: #7 — Implementar o banco de questões versionado e o fluxo editorial. Decisões: [ADR 0003](../adr/0003-version-published-questions.md), [política de conteúdo](../product/content-policy.md).

## Modelo

- `Question` é a identidade lógica. Ela nunca muda e não guarda conteúdo.
- `QuestionRevision` é a unidade de conteúdo e de revisão: tipo, tópico, release do Java, dificuldade e justificativa, enunciado, explicação geral, alternativas, referências, autor e decisões de revisão. As tentativas referenciam uma revisão, nunca a questão lógica.
- Cada alternativa tem uma chave (`A`–`H`), texto, um indicador de correção e a sua própria explicação de por que está correta ou incorreta.
- As referências são fontes autoritativas com título e uma URL `https`.
- `ContentReview` registra cada decisão de revisão técnica (`APPROVED` ou `CHANGES_REQUESTED`) com o revisor e um comentário.

## Ciclo de vida

```
DRAFT --submit--> TECHNICAL_REVIEW --approve--> APPROVED --publish--> PUBLISHED --deprecate--> DEPRECATED
  ^                      |
  +---request changes----+
```

| Transição | Permissão | Regras |
|---|---|---|
| criar, editar, iniciar uma correção, submeter | `CONTENT_AUTHOR` | Só o autor da revisão pode editar ou submeter. Edição apenas em `DRAFT`. A submissão exige uma revisão completa |
| aprovar, solicitar mudanças | `CONTENT_REVIEW` | Somente a partir de `TECHNICAL_REVIEW`. O revisor não pode ser o autor (veja abaixo). Solicitar mudanças exige um comentário |
| publicar | `CONTENT_PUBLISH` | Somente a partir de `APPROVED`. Reverifica a completude, exige um tópico ativo e que a release do Java da revisão seja igual à da prova |
| depreciar | `CONTENT_PUBLISH` | Somente a partir de `PUBLISHED` |

Um rascunho pode ser salvo incompleto. Ele só sai de `DRAFT` quando satisfaz todas as regras abaixo.

## Invariantes

Uma revisão completa tem:

- um enunciado, um tópico, uma release do Java, uma dificuldade e sua justificativa, e uma explicação geral;
- pelo menos duas alternativas com chaves únicas, cada uma com texto e explicação;
- exatamente uma alternativa correta em `SINGLE_CHOICE` e pelo menos uma em `MULTIPLE_CHOICE`;
- pelo menos uma referência, cada uma com título e uma URL `https`.

As violações são devolvidas juntas como códigos estáveis (`revision_incomplete` com uma lista `violations`), por exemplo `prompt_missing`, `options_too_few`, `single_choice_requires_exactly_one_correct_option`, `references_missing`.

Outras regras:

- Uma questão tem no máximo uma revisão sendo escrita, revisada ou aprovada por vez (`open_revision_exists`).
- Uma questão tem no máximo uma revisão `PUBLISHED` por versão de prova. Publicar uma correção deprecia a revisão que ela substitui, na mesma transação.
- Revisões depreciadas nunca entram em novas seleções, mas continuam recuperáveis.

## Imutabilidade

O conteúdo só é editável enquanto a revisão está em `DRAFT`. Isso é aplicado duas vezes:

1. No serviço, que rejeita edições fora de `DRAFT`.
2. Em triggers do PostgreSQL nas tabelas de revisão, alternativas e referências. Depois que uma revisão sai de `DRAFT`, alterar seu conteúdo, suas alternativas ou referências, ou apagá-la, falha para qualquer escritor, inclusive SQL direto. Somente colunas de ciclo de vida (status, timestamps, versão da prova, publicador) podem mudar.

Uma correção é uma nova revisão (`POST /api/admin/questions/{id}/revisions`) copiada da mais recente. As revisões existentes e as tentativas que as referenciam nunca são modificadas.

## Separação entre revisor e autor (decisão)

O modelo de domínio deixou em aberto se editor e revisor precisam ser pessoas diferentes. Por padrão, um revisor não pode revisar uma revisão que ele mesmo escreveu (`reviewer_must_differ_from_author`). Uma instalação com um único mantenedor pode desligar isso explicitamente com `certforge.question-bank.require-reviewer-separation=false`. O padrão é ligado porque a revisão independente é o que torna o conteúdo publicado confiável.

## Projeções seguras para o aluno

O contrato de módulo `QuestionBank` expõe quatro leituras para os outros módulos:

| Método | Retorna | Uso |
|---|---|---|
| `eligibleForTopic(topicId)` | `PublishedQuestion`s | Selecionar questões para uma sessão. Somente revisões publicadas vinculadas à versão de prova ativa atual do tópico; vazio para um tópico inativo |
| `findPublished(revisionId)` | `PublishedQuestion` | Mostrar uma questão ao aluno |
| `findSnapshotQuestion(revisionId)` | `PublishedQuestion` | Mostrar a questão de uma sessão mesmo depois de depreciada; vazio para revisões nunca publicadas |
| `findRevision(revisionId)` | `RevisionEvidence`, qualquer status | Verificar a correção e mostrar uma tentativa histórica |

`PublishedQuestion` é seguro para serializar ao aluno antes de a resposta ser submetida: tem o enunciado, o tipo, a dificuldade, a release do Java, o tópico e as chaves e textos das alternativas. Não tem indicadores de correção, explicações de alternativas, explicação geral, referências, revisor, autor nem dados editoriais. Somente revisões publicadas são devolvidas.

`RevisionEvidence` contém o gabarito e as explicações. É evidência do lado do servidor e nunca deve ser serializada ao aluno antes de uma resposta ser aceita. Ainda não existe endpoint HTTP para o aluno ver questões; as APIs de sessão e de tentativa (#9, #10) usarão esses contratos.

## Fatos de auditoria

Aprovação, publicação, substituição e depreciação publicam um `AuditFact` (ator, ação, assunto `question-revision:<id>`, momento) como evento em processo, dentro da mesma transação. Ações: `QUESTION_REVISION_APPROVED`, `QUESTION_REVISION_PUBLISHED`, `QUESTION_REVISION_REPLACED`, `QUESTION_REVISION_DEPRECATED`. O módulo `audit` persiste cada fato na mesma transação, em uma tabela somente de acréscimo; veja [operações](../engineering/operations.md).

## Endpoints

| Endpoint | Permissão |
|---|---|
| `GET /api/admin/questions[?status=]`, `GET /api/admin/questions/{id}` | qualquer uma entre `CONTENT_AUTHOR`, `CONTENT_REVIEW`, `CONTENT_PUBLISH` |
| `POST /api/admin/questions` | `CONTENT_AUTHOR` |
| `POST /api/admin/questions/{id}/revisions` | `CONTENT_AUTHOR` |
| `PUT /api/admin/question-revisions/{id}`, `POST .../{id}/submit` | `CONTENT_AUTHOR` (somente o autor) |
| `POST .../{id}/approve`, `.../request-changes` | `CONTENT_REVIEW` |
| `POST .../{id}/publish`, `.../deprecate` | `CONTENT_PUBLISH` |

Todo comando devolve a visão editorial da questão. Essas respostas incluem o gabarito e são apenas para editores, revisores e publicadores.

## Adiado

Submissão pela comunidade, importação em massa, publicação por IA, análise de desempenho das questões, execução arbitrária de Java, blueprints de simulado, persistência dos fatos de auditoria (#12), um endpoint de questões para o aluno (#9, #10) e ferramentas de comparação de revisões para revisores (#14).

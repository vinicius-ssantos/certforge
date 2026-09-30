# ADR 0003: Versionar questões publicadas imutáveis

> Tradução de [`docs/adr/0003-version-published-questions.md`](../../docs/adr/0003-version-published-questions.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-07-30

## Contexto

Questões, alternativas, respostas e explicações podem precisar de correção. Alterar o conteúdo publicado no lugar mudaria o significado aparente das tentativas históricas e prejudicaria a evidência de estudo e a auditabilidade.

## Decisão

Separar a identidade lógica de `Question` da `QuestionRevision` imutável. A publicação congela uma revisão. Correções criam uma nova revisão, e as tentativas referenciam a revisão exata que foi exibida ao aluno.

## Consequências

- As tentativas históricas permanecem reproduzíveis.
- Correções editoriais exigem substituição explícita e tratamento do ciclo de vida.
- O armazenamento cresce modestamente, mas a integridade melhora de forma substancial.
- As APIs devem distinguir a identidade lógica da questão da identidade da revisão.

## Alternativas rejeitadas

- Editar no lugar as linhas publicadas.
- Copiar o texto completo da questão em cada tentativa como único mecanismo histórico.

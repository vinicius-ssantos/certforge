# Catálogo de Preparação

> Tradução de [`docs/architecture/preparation-catalog.md`](../../docs/architecture/preparation-catalog.md). O inglês é a fonte canônica.

Issue: #6 — Modelar o catálogo de preparação e o perfil de certificação Java. Arquitetura: [ADR 0007](../adr/0007-generalize-preparation-catalog.md).

## Fronteira de agregado (decisão)

O [modelo de domínio](domain-model.md) deixou em aberto se `CertificationProfile` e `ExamVersion` são agregados separados. A `v0.1.0` usa esta fronteira:

| Conceito | É dono de | Ciclo de vida |
|---|---|---|
| `PreparationTrack` | Identidade estável, slug, nome, `TrackKind`, tópicos | `DRAFT` → `ACTIVE` ⇄ `INACTIVE` |
| `CertificationProfile` | Provedor e nome da certificação. Exatamente um por trilha de certificação | Acompanha a trilha |
| `ExamVersion` | Código e nome da prova, release do Java alvo, URL oficial dos objetivos e o mapeamento explícito de tópicos | `DRAFT` → `ACTIVE` ⇄ `INACTIVE`; no máximo um `ACTIVE` por trilha |
| `Topic` | Id estável, slug, nome de exibição, pai opcional | Pertence a uma trilha; só é visível por meio de um mapeamento |

Por que este formato:

- O perfil é identidade estável e nunca precisa de ciclo de vida próprio, então fica como um registro um-para-um da trilha em vez de um agregado separado.
- A versão da prova é a unidade que muda quando uma prova é revisada, então carrega o ciclo de vida, a release do Java alvo e o mapeamento de objetivos.
- Os dados específicos de certificação ficam em `catalog_certification_profile` e `catalog_exam_version`. A tabela genérica `catalog_track` não tem campos de certificação, e não existe nenhum campo de entrevista em lugar algum.

## Visibilidade para o aluno

O aluno só vê uma trilha quando ela está `ACTIVE` **e** tem uma versão de prova `ACTIVE`. Os tópicos são devolvidos na ordem da prova, como uma árvore com no máximo um nível de subtópicos, cada um com o objetivo ao qual corresponde. Conteúdo em rascunho ou inativo nunca é devolvido pela API do aluno nem pelo contrato público `PreparationCatalog`.

## Regras aplicadas pelo módulo

- Somente trilhas `CERTIFICATION` podem ser criadas. `TrackKind.INTERVIEW` é reservado no código e rejeitado por uma constraint do banco; a migração que introduzir comportamento de entrevista a estende (ADR 0007).
- Slugs usam letras minúsculas, dígitos e hífens, com no máximo 64 caracteres, e são únicos (para tópicos: únicos dentro da trilha).
- O `id` e o `slug` de um tópico nunca mudam. Apenas o nome de exibição pode ser corrigido.
- Os mapeamentos de tópicos só podem ser editados enquanto a versão da prova está em `DRAFT`. Uma versão `ACTIVE` fica congelada para que a taxonomia vista pelos alunos seja estável; uma mudança exige uma nova versão da prova.
- Um tópico mapeado deve pertencer à trilha da versão da prova, um subtópico exige que o pai esteja mapeado, e tópicos e posições são únicos por versão da prova.
- Subtópicos não podem ter subtópicos próprios.
- Uma versão da prova só pode ser ativada se a trilha estiver `ACTIVE`, se tiver pelo menos um tópico mapeado e se a trilha não tiver outra versão `ACTIVE` (também garantido por um índice único parcial).
- As URLs de objetivos devem ser `https`.

## Endpoints

Aluno (permissão `STUDY`):

| Endpoint | Descrição |
|---|---|
| `GET /api/catalog/tracks` | Trilhas ativas com sua versão de prova ativa e tópicos |
| `GET /api/catalog/tracks/{slug}` | Uma trilha ativa; caso contrário `404 track_not_found` |

Administração (permissão `CATALOG_MANAGE`). Todo comando devolve a visão atualizada da trilha afetada:

| Endpoint | Descrição |
|---|---|
| `GET /api/admin/catalog/tracks`, `.../tracks/{id}` | Todas as trilhas, incluindo rascunhos |
| `POST /api/admin/catalog/tracks` | Cria uma trilha de certificação em rascunho e seu perfil |
| `POST .../tracks/{id}/activate`, `.../deactivate` | Ciclo de vida da trilha |
| `POST .../tracks/{id}/exam-versions` | Cria uma versão de prova em rascunho |
| `PUT .../exam-versions/{id}/topics` | Substitui o mapeamento de tópicos (somente rascunho) |
| `POST .../exam-versions/{id}/activate`, `.../deactivate` | Ciclo de vida da versão da prova |
| `POST .../tracks/{id}/topics` | Cria um tópico, opcionalmente sob um pai |
| `PUT .../topics/{id}` | Corrige o nome de exibição de um tópico |

As falhas usam as mesmas respostas de problema RFC 9457 da identidade, com códigos estáveis como `slug_already_exists`, `exam_version_not_editable`, `active_exam_version_exists`, `track_not_active`, `exam_version_has_no_topics`, `topic_not_in_track`, `parent_topic_not_mapped`, `duplicate_topic`, `duplicate_position`, `topic_too_deep` e `validation_failed`.

## Dados iniciais e rastreabilidade

`V4__seed_java_certification_catalog.sql` cria a trilha `java-certification` com a prova Oracle Java SE 21 Developer Professional (`1Z0-830`, Java 21) e dez tópicos, um para cada grupo de objetivos publicado da prova:

1. Handling date, time, text, numeric and boolean values
2. Controlling program flow
3. Using object-oriented concepts in Java
4. Handling exceptions
5. Working with arrays and collections
6. Working with streams and lambda expressions
7. Packaging and deploying Java code and using the Java Platform Module System
8. Managing concurrent code execution
9. Using Java I/O API
10. Implementing localization

Cada mapeamento guarda o texto do objetivo em `objective_ref`, e a versão da prova guarda a página oficial de objetivos, `https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830`, de modo que cada tópico é rastreável a uma fonte pública. Os identificadores são fixos, então a identidade dos tópicos é a mesma em todos os ambientes.

> **Revisão necessária antes de publicar conteúdo.** O que está verificado e o que não está:
>
> - A URL da página da prova é a canônica declarada pelos metadados da própria página da Oracle, e `V6__correct_java_exam_source.sql` corrigiu um alias anterior.
> - O [anúncio da prova](https://blogs.oracle.com/oracleuniversity/announcing-oracle-certified-professional-java-se-21-developer-exam-and-java-se-21-programming-complete-course) pela Oracle University confirma as áreas que a prova cobre: data, hora, texto, valores numéricos e booleanos; controle de fluxo e exceções; programação orientada a objetos e funcional, herança, polimorfismo, generics, records e lambdas; streams, arrays, coleções, concorrência, E/S e localização; módulos, empacotamento e deploy. Os dez tópicos cobrem essas áreas.
> - O anúncio remete à página da prova para a lista exata de objetivos, e essa página é renderizada por JavaScript e bloqueia clientes automatizados. O texto exato de cada grupo de objetivos, e a divisão em dez grupos, portanto ainda vêm de resumos secundários.
>
> Um revisor deve comparar `objective_ref` e a lista de tópicos com a página da prova em um navegador e, se diferirem, corrigir os nomes de exibição e os mapeamentos (nomes de exibição podem ser corrigidos sem mudar a identidade). Generics não tem um tópico próprio; decida se precisa de um. Nenhuma questão pode ser publicada nesses tópicos antes dessa revisão.

## Adiado

Trilhas de entrevista, perfis de cargo e senioridade, ingestão de descrições de vaga, avaliação de respostas guiadas, vários provedores de certificação, trilhas criadas pela comunidade, extração automática de objetivos e eventos de auditoria para mudanças no catálogo (veja #12).

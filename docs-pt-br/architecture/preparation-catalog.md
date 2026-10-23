# Catálogo de Preparação

> Tradução de [`docs/architecture/preparation-catalog.md`](../../docs/architecture/preparation-catalog.md). O inglês é a fonte canônica.

Issue: #6 — Modelar o catálogo de preparação e o perfil de certificação Java. Arquitetura: [ADR 0007](../adr/0007-generalize-preparation-catalog.md).

## Fronteira de agregado (decisão)

O [modelo de domínio](domain-model.md) deixou em aberto se `CertificationProfile` e `ExamVersion` são agregados separados. A `v0.1.0` usa esta fronteira:

| Conceito | É dono de | Ciclo de vida |
|---|---|---|
| `PreparationTrack` | Identidade estável, slug, nome, `TrackKind`, tópicos | `DRAFT` → `ACTIVE` ⇄ `INACTIVE` |
| `CertificationProfile` | Provedor e nome da certificação. Exatamente um por trilha de certificação | Acompanha a trilha |
| `ExamVersion` | Código e nome da prova, a release do Java alvo *se a prova for sobre uma*, URL oficial dos objetivos e o mapeamento explícito de tópicos | `DRAFT` → `ACTIVE` ⇄ `INACTIVE`; no máximo um `ACTIVE` por trilha |
| `Topic` | Id estável, slug, nome de exibição, pai opcional | Pertence a uma trilha; só é visível por meio de um mapeamento |

Por que este formato:

- O perfil é identidade estável e nunca precisa de ciclo de vida próprio, então fica como um registro um-para-um da trilha em vez de um agregado separado.
- A versão da prova é a unidade que muda quando uma prova é revisada, então carrega o ciclo de vida, o mapeamento de objetivos e — para uma prova que seja sobre uma — a release do Java alvo. A [ADR 0017](../adr/0017-infrastructure-certification-tracks.md) decidiu que prova de Kubernetes ou AWS não carrega release em vez de carregar uma sintética, então a release é opcional de ponta a ponta: a requisição administrativa pode omitir, a view do aluno serve null, e as duas telas que a mostram deixam de fora em vez de imprimir vazio. Uma questão publicada nessa prova também não pode carregar release, que é a mesma regra `java_release_mismatch` lida do outro lado.
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
| `PUT .../exam-versions/{id}/objectives` | Registra uma leitura verificada da página de objetivos do fornecedor e os objetivos encontrados nela |
| `POST .../exam-versions/{id}/activate`, `.../deactivate` | Ciclo de vida da versão da prova |
| `POST .../tracks/{id}/topics` | Cria um tópico, opcionalmente sob um pai |
| `PUT .../topics/{id}` | Corrige o nome de exibição de um tópico |

As falhas usam as mesmas respostas de problema RFC 9457 da identidade, com códigos estáveis como `slug_already_exists`, `exam_version_not_editable`, `active_exam_version_exists`, `track_not_active`, `exam_version_has_no_topics`, `topic_not_in_track`, `parent_topic_not_mapped`, `duplicate_topic`, `duplicate_position`, `topic_too_deep`, `objectives_need_an_exam`, `duplicate_objective_key` e `validation_failed`.

### O que uma questão declara, e quando isso é conferido

Uma questão diz para quais objetivos de prova ela prepara pelo `objectiveKeys` da sua revisão — as chaves que o fornecedor usa, carregadas por um pacote de conteúdo e armazenadas desde a #165. Declarar não é obrigatório: toda questão do pacote Java SE 21 e toda questão de entrevista não declaram nenhuma.

A declaração é texto livre enquanto a questão é rascunho, e a razão é que rascunho se escreve cedo: antes de o tópico estar mapeado numa versão de prova ativa e, muitas vezes, antes de alguém ter lido os objetivos da prova. Uma chave estrangeira ali recusaria autoria comum. Então a declaração é conferida nos dois momentos em que dá:

- **publicar** recusa chave que o snapshot verificado da prova não lista (`objective_not_verified`), e diz com todas as letras quando ninguém leu a página ainda. É o momento em que a declaração vira declaração para um aluno;
- **registrar uma nova leitura** recusa derrubar objetivo que questão publicada ainda declara (`objective_claimed_by_published_question`), para que os dois não se afastem depois. O catálogo pergunta ao banco de questões pela `PublishedObjectiveClaims`, interface que este módulo declara e o conteúdo implementa, porque conteúdo depende do catálogo e a dependência não pode correr nos dois sentidos.

### Objetivos de prova verificados

Uma versão de prova pode existir antes de alguém ler a página de objetivos do fornecedor — a prova Java SE 21 está exatamente nesse estado. O `PUT .../exam-versions/{id}/objectives` registra uma leitura: o nome da versão segundo o fornecedor, a data, a página HTTPS de onde foi lida, um digest `sha256:` dessa página e os objetivos encontrados nela. A leitura substitui a anterior, porque um snapshot é uma leitura de uma página e objetivo que não está mais listado não é objetivo.

Para que isso serve: a [ADR 0017](../adr/0017-infrastructure-certification-tracks.md) exige que nenhuma certificação seja afirmada sem versão e data de conferência, e a V17 criou as tabelas para isso. Até agora nada na aplicação podia escrever uma, então a verificação não podia ser registrada e nenhum objetivo podia existir para ser citado. Questão citando objetivo é o próximo passo (#165), e ele vai ter de recusar leitura que remova objetivo ainda citado por questão publicada.

Duas regras que as tabelas não conseguem afirmar: só versão de certificação tem página de fornecedor a ler (`objectives_need_an_exam`), e uma chave de objetivo aparece uma vez por leitura (`duplicate_objective_key`). Leitura sem objetivo nenhum é recusada pela própria requisição, já que verificação que não achou nada não verificou nada.

Registrar uma leitura **não** torna questão oficial. Registra o que o fornecedor publicou, para que o material deste projeto possa dizer para qual objetivo ele prepara — nunca que veio da prova.

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
> - O texto exato de cada grupo de objetivos, e a divisão em dez grupos, foram comparados com a página da prova em um navegador em 2026-10-02 e relatados como coincidentes (#68). Essa página é renderizada por JavaScript e bloqueia clientes automatizados, então nenhuma checagem mantém isso verdadeiro: é uma coincidência naquela data, a ser reconferida quando uma versão de prova for adicionada. Ela também saiu do ar para manutenção mais tarde na mesma tarde, então quem for reconferir deve esperar que a fonte fique indisponível às vezes e planejar uma segunda tentativa, em vez de tratar uma falha de carregamento como divergência.
>
> Essa comparação foi feita, então questões podem ser publicadas nesses tópicos. Duas coisas seguem abertas e nenhuma bloqueia publicação: Generics não tem um tópico próprio, o que é julgamento de produto e não erro, e uma nova versão de prova exige repetir a comparação. Nomes de exibição e mapeamentos podem ser corrigidos sem mudar a identidade dos tópicos.

## Adiado

Trilhas de entrevista, perfis de cargo e senioridade, ingestão de descrições de vaga, avaliação de respostas guiadas, vários provedores de certificação, trilhas criadas pela comunidade, extração automática de objetivos e eventos de auditoria para mudanças no catálogo (veja #12).

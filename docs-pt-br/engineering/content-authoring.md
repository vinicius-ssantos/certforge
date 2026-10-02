# Criação e Importação de Conteúdo

> Tradução de [`docs/engineering/content-authoring.md`](../../docs/engineering/content-authoring.md). O inglês é a fonte canônica.

Issue: #8 — Criar o pacote inicial de conteúdo autoral de certificação Java. Política: [política de conteúdo](../product/content-policy.md). Modelo e ciclo de vida: [banco de questões](../architecture/question-bank.md).

## O que o pacote é, e o que não é

`content/java-se-21/` contém um pacote inicial de 20 questões originais para a trilha Oracle Java SE 21 Developer: duas por tópico, de escolha única e de múltipla escolha, do fácil ao difícil. Cada questão tem uma explicação por alternativa, referências autoritativas e uma justificativa de dificuldade.

**Status de revisão: não revisado por uma pessoa.** As questões foram redigidas com apoio de IA, o que a política de conteúdo só permite quando uma pessoa faz depois a revisão técnica. Nada no repositório as publica. O importador as cria como rascunho e as submete para revisão técnica; aprovar e publicar são decisões de pessoas, pelo fluxo editorial. Até isso acontecer, nenhum aluno consegue ver nenhuma delas.

O que a ferramenta comprova automaticamente, a cada build:

- cada questão está completa segundo as invariantes do banco de questões (alternativas, exatamente uma correta em escolha única, explicações, referências https, Java 21);
- cada trecho de código compila com `--release 21` e produz exatamente a saída, ou o erro de compilação, que a questão afirma;
- o gabarito concorda com essa saída: quando uma alternativa tem o texto que o programa imprime, é ela que está marcada como correta, então a questão não pode imprimir uma coisa e apontar outra;
- o pacote cobre os dez tópicos, com os dois tipos de questão e todas as dificuldades, e não há dois enunciados idênticos;
- o pacote inteiro pode ser importado em uma aplicação em execução, reimportado sem duplicar e levado por revisão e publicação.

Ele **não** comprova que uma questão está bem escrita, que não é ambígua nem que suas explicações estão certas. É para isso que serve a revisão humana.

## Estrutura

```
content/
  ContentImporter.java          importador independente, sem dependências
  pack.mjs                      leitura de um pacote, do catálogo e do registro de revisão
  java-se-21/
    review.json                 quem revisou quais questões, quando, e um digest de cada
    t04-finally-return/
      question.json             o corpo da requisição de POST /api/admin/questions
      Main.java                 código mostrado ao aluno e verificado pelo build
      expected.txt              a saída verificada, ou "COMPILE_ERROR: <código do diagnóstico>"
```

- O nome do diretório é o identificador estável: `t<NN>-<slug-curto>`, em que `NN` é o número do tópico.
- `topicId` usa os ids fixos dos tópicos semeados (`a3000000-0000-4000-8000-0000000000NN`), então os mesmos arquivos carregam em qualquer ambiente. Não há identificadores exclusivos de teste.
- Se o enunciado contém `{{snippet}}`, ele é substituído pelo conteúdo de `Main.java`, então o código que o aluno vê é, por construção, o código que o build verificou. Uma questão também pode ter um trecho que é apenas verificado e não exibido (por exemplo os fatos sobre records, em que o código sustenta as afirmações das alternativas).
- Um diretório de trecho pode conter vários arquivos `.java` compilados juntos, por exemplo os resource bundles de `t10-resource-bundle-fallback`. `Main` é o ponto de entrada.
- Questões sem código têm somente `question.json`.

## Escrevendo uma questão

1. Copie um diretório existente do mesmo tipo e tópico.
2. Escreva uma questão original. Não copie nem parafraseie de perto nenhuma prova, livro, curso ou banco de questões. Não afirme que ela se parece com um item real de prova.
3. Mire somente em Java 21 (`javaRelease` deve ser 21 nesta trilha) e evite comportamentos que a especificação deixa sem definição. Uma questão sobre algo que a linguagem não garante é ambígua por construção.
4. Mantenha o código determinístico e independente do sistema operacional, da hora, do locale padrão, da ordem de hash e de threads. A saída deve ser idêntica em todo JDK suportado.
5. Dê 4 ou 5 alternativas. Cada alternativa precisa de uma explicação de por que está correta ou incorreta. Os distratores devem ser erros plausíveis, não pegadinhas de redação.
6. Adicione referências autoritativas com URLs `https` (JLS, JEPs, a API do Java SE 21). Prefira âncoras estáveis.
7. Informe a dificuldade e o porquê.
8. Rode a verificação do pacote:

```bash
./mvnw -Dtest=ContentPackTest test
```

Ela falha com o nome da questão se a saída, o resultado da compilação ou qualquer invariante divergir.

## Importando

Suba a aplicação e o PostgreSQL (veja o [bootstrap do backend](backend-bootstrap.md)) e rode, na raiz do repositório, com as credenciais de uma conta com o papel `EDITOR` (ou `ADMINISTRATOR`):

```bash
java content/ContentImporter.java --base-url http://localhost:8080 --email editor@example.com --password '...'
```

- A conta com a qual você entra passa a ser o autor registrado das revisões importadas. Use uma conta cujo titular assuma a responsabilidade pelo conteúdo.
- Cada questão é criada como rascunho e submetida para revisão técnica. Nada é aprovado nem publicado.
- Questões cujo enunciado já existe são ignoradas, então o comando pode ser executado de novo. A linha de resumo informa `created`, `skipped` e `total`.
- `--dry-run` lista o que seria importado sem contatar o servidor. `--pack` escolhe outro diretório. `CERTFORGE_EMAIL` e `CERTFORGE_PASSWORD` podem substituir `--email` e `--password`.

## Revisando e publicando

O [pacote de revisão de conteúdo](../../docs/release/content-review-packet.md) (em inglês, como as questões) expõe o pacote inteiro para o revisor: cada questão como o aluno a vê, depois o gabarito, as razões, as referências, a saída que o build verificou e, por questão, ou o veredito já registrado ou as conferências abaixo como caixas para marcar. Ele é gerado (`node content/build-review-packet.mjs`) e o CI falha se estiver desatualizado.

Uma revisão concluída é registrada no `review.json` do pacote: o revisor, a data, como revisou, o que a revisão **não** estabelece e, para cada questão, um veredito e um digest de tudo o que ele julgou — o enunciado com seu código, as alternativas, o gabarito, cada explicação, a justificativa de dificuldade, as referências e a saída verificada. O pacote imprime o digest a registrar embaixo de cada questão não revisada.

Esse digest é o ponto. **Edite uma questão revisada e ela volta a contar como não revisada**: o pacote a marca como "changed since review" e imprime um digest novo, e como o CI compara o pacote comitado com um build novo, a mudança não chega à `main` ainda alegando o veredito antigo. Reindentar o JSON não muda nada, porque o digest cobre o que foi lido, não como o arquivo foi formatado. Registrar revisão de uma questão que ninguém leu derruba tudo isso, então não faça.

A revisão é feita por uma conta diferente da do autor, por padrão (`reviewer_must_differ_from_author`; veja o documento do banco de questões para mudar isso em uma instalação com um único mantenedor). O revisor precisa do papel `REVIEWER` e o publicador do papel `ADMINISTRATOR`.

1. Liste o que aguarda revisão: `GET /api/admin/questions?status=TECHNICAL_REVIEW`.
2. Leia cada questão com `GET /api/admin/questions/{id}`. O revisor verifica, como a política de conteúdo exige:
   - existe uma única interpretação defensável do enunciado;
   - a resposta está correta para o Java 21, e qualquer código compila e se comporta como declarado;
   - não há dependência oculta do ambiente nem de comportamento não especificado;
   - os distratores são plausíveis e não são pegadinhas deliberadas sem relação com o objetivo;
   - toda explicação está completa e correta;
   - código e texto são legíveis com tecnologia assistiva;
   - as referências permitem que alguém verifique a resposta de forma independente.
3. Aprove com `POST /api/admin/question-revisions/{revisionId}/approve`, ou devolva com `.../request-changes` e um comentário.
4. Um publicador publica as revisões aprovadas com `.../publish`. Uma questão pode ser corrigida depois criando-se uma nova revisão; a publicada é substituída e mantida no histórico.

### Fazendo tudo isso de uma vez

Com uma revisão registrada no pacote, o `deploy/publish-pack.mjs` percorre o fluxo inteiro por você — criar, submeter, aprovar, publicar — levando o veredito registrado como comentário da aprovação e o `checklist` do registro como o que o revisor atesta:

```sh
just reviewer reviewer@example.com 'uma senha longa'   # uma vez: a segunda conta que a aprovação exige
just publish-content reviewer@example.com 'uma senha longa'
```

Ele automatiza a digitação, não o julgamento, e recusa duas coisas para não poder alegar revisão que não existe:

- **Questão cujo digest registrado não bate mais é segurada**, não publicada, porque ninguém revisou o texto que sairia. A execução relata e sai com código diferente de zero.
- **A conta de revisor nunca é inventada.** O semeador de demonstração registra um revisor descartável porque as questões dele são dados descartáveis; aqui isso gravaria um revisor fictício na procedência de conteúdo real, então a conta é passada e precisa existir antes.

Ele também recusa revisor que seja o autor, pula enunciados que já estão no banco (então rodar de novo completa em vez de duplicar) e imprime no fim o autor, o revisor e o publicador de registro. Com `--dry-run` ele relata o que publicaria sem contatar nada.

Uma questão ambígua ou contestada não deve ser publicada. Corrija-a ou deixe-a em rascunho.

### Antes de publicar qualquer coisa nesta trilha

Os nomes dos tópicos e o texto dos objetivos semeados por `V4__seed_java_certification_catalog.sql` estão apenas parcialmente verificados. O [anúncio da prova](https://blogs.oracle.com/oracleuniversity/announcing-oracle-certified-professional-java-se-21-developer-exam-and-java-se-21-programming-complete-course) pela Oracle University confirma as áreas que a prova cobre, mas o texto exato dos objetivos vem de resumos secundários, porque a página da prova é renderizada por JavaScript e bloqueia clientes automatizados. Compare antes os tópicos com a página oficial (`https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830`) em um navegador; veja o [catálogo de preparação](../architecture/preparation-catalog.md).

## O seu próprio material de estudo

Um mantenedor pode ter licença de material que não tem direito de redistribuir: um simulado oficial, o banco de questões de um livro, um curso. `content/private/` é onde isso fica. O git ignora, e o CI falha se qualquer arquivo ali for versionado, porque o `.gitignore` apenas pede — um `git add -f`, ou um `git add -A` distraído de outro diretório, passa por ele.

Isso pesa mais aqui do que num projeto privado. **Este repositório é público e Apache-2.0**, então um arquivo comitado em `content/` não é só publicado: ele é sublicenciado a todo mundo que clonar, e esse não é um direito que licença de estudo conceda a ninguém.

Os scripts já funcionam sobre qualquer diretório, então um pacote privado não precisa de suporte especial:

```sh
node deploy/publish-pack.mjs --pack content/private --reviewer-email ... --reviewer-password ...
```

Ele precisa do próprio `review.json`, como qualquer pacote, e esse é um bom lugar para escrever em `caveats` o que o material é e por que não está no repositório.

### As duas formas de isso vazar mesmo assim

O diretório ignorado resolve o caso óbvio. Dois outros não são óbvios:

1. **Capturas de tela.** O `just screenshots` captura páginas de um stack **em execução** para `docs/release/screenshots/`, e esses PNGs são versionados. Recapture contra o stack de teste ponta a ponta, cujas questões são as da própria suíte, e nunca contra uma instância com conteúdo privado carregado: a captura de uma questão licenciada é uma cópia dela, no repositório público, numa forma que nenhuma busca por texto vai achar.
2. **Derivação, que é a que realmente custa.** Copiar é o caso fácil de evitar. A armadilha é ler a questão de alguém, entendê-la, e então escrever *a sua versão* dela no pacote autoral. Reescrever não desfaz derivação; obra derivada é protegida igual. A linha que se sustenta é: aprenda **o assunto** na especificação, não **a questão** no banco deles. Se uma questão em `content/java-se-21/` existe porque você viu a deles, ela não pertence ali, por mais que você tenha reescrito.

Nenhum teste confere a segunda. É disciplina, e o único papel da automação aqui é tornar o caminho de arquivo impossível de errar por descuido.

## O pacote inicial

| Tópico | Questões |
|---|---|
| 1 Data, hora, texto, valores numéricos e booleanos | `t01-integer-boxing-guarantee`, `t01-localdate-plus-months` |
| 2 Controle de fluxo | `t02-pattern-switch-guard`, `t02-switch-dominance` |
| 3 Orientação a objetos | `t03-overload-null`, `t03-record-facts` |
| 4 Exceções | `t04-finally-return`, `t04-try-with-resources-order` |
| 5 Arrays e coleções | `t05-list-remove-overload`, `t05-immutable-and-fixed-size-lists` |
| 6 Streams e lambdas | `t06-stream-laziness`, `t06-stream-facts` |
| 7 Empacotamento e módulos | `t07-requires-transitive`, `t07-exports-and-opens` |
| 8 Concorrência | `t08-virtual-thread-daemon`, `t08-executor-close` |
| 9 E/S em Java | `t09-read-all-lines`, `t09-serialization-facts` |
| 10 Localização | `t10-resource-bundle-fallback`, `t10-locale-to-string` |

Quatro questões são conceituais e não têm código executável, então o build não consegue verificá-las: `t01-integer-boxing-guarantee`, `t06-stream-facts`, `t07-requires-transitive` e `t07-exports-and-opens`. Elas dependem apenas das referências, então os revisores devem ler essas referências com atenção redobrada.

## Adiado

Um banco abrangente em escala comercial, publicação gerada por IA, submissões da comunidade, análise de desempenho das questões e execução arbitrária de código do aluno.

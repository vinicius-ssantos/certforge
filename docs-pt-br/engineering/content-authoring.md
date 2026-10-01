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
  java-se-21/
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
mvn -Dtest=ContentPackTest test
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

O [pacote de revisão de conteúdo](../../docs/release/content-review-packet.md) (em inglês, como as questões) expõe o pacote inteiro para o revisor: cada questão como o aluno a vê, depois o gabarito, as razões, as referências, a saída que o build verificou e as conferências abaixo como caixas para marcar. Ele é gerado (`node content/build-review-packet.mjs`) e o CI falha se estiver desatualizado.

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

Uma questão ambígua ou contestada não deve ser publicada. Corrija-a ou deixe-a em rascunho.

### Antes de publicar qualquer coisa nesta trilha

Os nomes dos tópicos e o texto dos objetivos semeados por `V4__seed_java_certification_catalog.sql` estão apenas parcialmente verificados. O [anúncio da prova](https://blogs.oracle.com/oracleuniversity/announcing-oracle-certified-professional-java-se-21-developer-exam-and-java-se-21-programming-complete-course) pela Oracle University confirma as áreas que a prova cobre, mas o texto exato dos objetivos vem de resumos secundários, porque a página da prova é renderizada por JavaScript e bloqueia clientes automatizados. Compare antes os tópicos com a página oficial (`https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830`) em um navegador; veja o [catálogo de preparação](../architecture/preparation-catalog.md).

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

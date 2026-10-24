# Direção do Interview Prep

> Tradução de [`docs/product/interview-prep.md`](../../docs/product/interview-prep.md). O inglês é a fonte canônica.

## Status

**Direção futura do produto — não comprometida com a `v0.1.0`.**

Este documento define o formato pretendido da preparação para entrevistas técnicas, para que a arquitetura inicial não torne essa capacidade desnecessariamente cara depois. Ele não é permissão para implementar comportamento exclusivo de entrevista antes de o Study Core estar completo.

## Problema

Entrevistas técnicas testam mais do que o reconhecimento de uma alternativa correta. Espera-se que o candidato explique conceitos, compare trade-offs, raciocine sobre falhas, analise código, discuta arquitetura e responda a perguntas de acompanhamento com a profundidade adequada.

Um modelo genérico de quiz é, portanto, insuficiente. O Interview Prep precisa de evidências estruturadas sem fingir que toda resposta tem um único valor de verdade binário.

## Primeiro perfil-alvo

A trilha de entrevista inicial deve ser:

**Java Backend — Pleno/Sênior**

### A taxonomia, como foi semeada

Doze tópicos, decididos pela [ADR 0016](../adr/0016-interview-track-taxonomy.md) e inseridos pela `V14` como trilha em rascunho e versão de taxonomia em rascunho. Os vinte e três candidatos que este documento listava estão dobrados dentro desses doze como assunto deles, não descartados.

| # | Tópico | Peso | O que abrange |
|---|---|---|---|
| 1 | Linguagem e runtime Java | 5 | Java core, coleções, generics, streams, APIs funcionais, fundamentos de JVM |
| 2 | Concorrência | 4 | threads, virtual threads, visibilidade de memória, coordenação |
| 3 | Design orientado a objetos | 5 | SOLID, padrões de projeto, modelagem OO |
| 4 | Estruturas de dados e algoritmos | 3 | as propriedades por baixo das coleções, e o custo de uma operação |
| 5 | Spring | 5 | Spring, Spring Boot, Spring Security |
| 6 | Persistência | 5 | JPA, Hibernate, SQL, transações |
| 7 | Testes | 4 | unitário, integração, dublês, do que um teste é evidência |
| 8 | Fronteiras de domínio | 3 | fundamentos de DDD, propriedade, contratos entre módulos |
| 9 | Sistemas distribuídos | 4 | microsserviços, integração síncrona versus assíncrona, falha |
| 10 | Mensageria | 4 | conceitos de Kafka e RabbitMQ, idempotência, retentativas, DLQ, ordenação, consistência |
| 11 | Nuvem e operação | 3 | AWS para backend, Docker, Kubernetes, observabilidade, resiliência |
| 12 | System design | 3 | compor o que está acima sob restrições |

O peso é um julgamento editorial sobre o que uma triagem de backend Pleno/Sênior pergunta, numa escala de 1 a 5 — não é medição. Um blueprint de vaga pode discordar dele sem reescrever a taxonomia.

**Dois assuntos da lista anterior estão deliberadamente ausentes, e quem lê não deveria ter que descobrir isso.** *Comunicação comportamental* não tem referência autoritativa, e a [política de conteúdo](content-policy.md) exige uma. A [ADR 0019](../adr/0019-behavioural-preparation-is-guidance-not-grading.md) decidiu como ela pode existir: como orientação revisada na forma de resposta guiada, declarando o próprio tipo de evidência, **sem pontuação alguma** e sem entrar em número de prontidão, e como modo de prática em vez de tópico canônico — então ela segue ausente da lista acima de propósito, e deixou de estar ausente do produto. *Preocupações de sistemas financeiros* — auditabilidade, precisão, rastreabilidade, prevenção de duplicidade — são uma lente que atravessa os tópicos 6, 9, 10 e 12, não uma décima terceira área, e pertencem a um blueprint de vaga. Então a primeira trilha de entrevista ainda não faz aquilo que a palavra "entrevista" mais sugere.

### Onde estruturas de dados terminam e coleções começam

O tópico 1 absorveu "Collections e generics", então a fronteira que importa é entre o tópico 1 e o tópico 4, e é esta: **o tópico 1 é a API, o tópico 4 são as propriedades por baixo dela.**

- "Qual `Map` preserva a ordem de inserção?" e "o que `Collectors.toMap` faz com chave duplicada?" são **tópico 1**: respondem-se conhecendo a biblioteca do Java.
- "Por que uma busca em tabela hash não é sempre tempo constante?", "quando um array ganha de uma lista encadeada mesmo com assintótica pior?", "o que uma árvore te dá que uma tabela hash não dá?" são **tópico 4**: respondem-se conhecendo a estrutura, em qualquer linguagem.

Questão que se responde lendo o Javadoc é tópico 1. Questão que seria a mesma em outra linguagem é tópico 4. Quando uma questão precisa genuinamente dos dois, ela vai onde está o *raciocínio*, não onde está o nome do tipo.

### Que profundidade uma questão pode assumir

**Raciocinar sobre comportamento e custo, nunca escrever um algoritmo do zero.** Dois motivos, e o primeiro é estrutural: a plataforma não executa código de quem estuda, e não vai antes da `v0.5.0` ([ADR 0006](../adr/0006-isolate-code-execution.md)), então a questão precisa ser respondível sem rodar nada. O segundo é que uma entrevista de backend pede muito mais para *escolher* e *justificar* uma estrutura do que para implementá-la.

Então uma questão pode assumir que a pessoa lê código e raciocina sobre complexidade, e não pode exigir uma implementação funcionando. "Qual destes é O(log n) e por quê" está no escopo; "escreva uma inserção balanceada" não está, e nem seria avaliável aqui se estivesse.

O primeiro pacote de conteúdo deve dar ênfase ao backend Java/Spring, em vez de tentar cobrir todos os domínios de entrevista.

## Trilhas de preparação

Uma trilha futura tem um tipo:

- `CERTIFICATION`
- `INTERVIEW`

Os perfis de certificação mantêm os metadados específicos da prova. Os perfis de entrevista poderão incluir, no futuro:

- família de cargo;
- senioridade-alvo;
- expectativas de tecnologia;
- contexto opcional de empresa/vaga;
- expectativas de tópicos ponderadas.

Uma descrição de vaga específica pode gerar um blueprint de estudo temporário, sem se tornar a taxonomia canônica permanente.

## Modos de questão e de avaliação

### Objetivo

Itens objetivos têm correção determinística.

Exemplos:

- escolha única;
- múltipla escolha;
- saída de código;
- resultado de compilação;
- resultado determinístico de depuração.

As evidências podem incluir:

- resposta selecionada;
- correção;
- confiança;
- tempo decorrido.

### Resposta guiada

Itens de resposta guiada avaliam cobertura e raciocínio, em vez de uma resposta binária.

Exemplos:

- explicar SOLID;
- comparar fila e tópico;
- explicar como reduzir o acoplamento entre domínios;
- projetar um consumidor de mensagens idempotente;
- discutir REST versus mensageria;
- explicar um incidente de produção ou uma decisão de engenharia.

Uma revisão de resposta guiada revisada pode conter:

- conceitos esperados;
- resposta de referência;
- pontos obrigatórios versus opcionais;
- erros comuns;
- prováveis perguntas de acompanhamento;
- expectativa de senioridade;
- referências autoritativas.

A plataforma não deve converter isso automaticamente em um valor determinístico falso de `correct=true/false`.

## Exemplo de item de resposta guiada

**Enunciado:** Por que dois domínios devem evitar compartilhar a mesma entidade JPA ou a mesma tabela de banco de dados?

**Conceitos esperados:**

- propriedade da persistência;
- redução de acoplamento;
- evolução independente do schema;
- fronteiras de domínio;
- contratos estáveis entre módulos/serviços;
- trade-offs explícitos de consistência.

**Resposta de referência:** Uma explicação concisa e revisada que mostre essas ideias.

**Acompanhamento:** E se os dois domínios precisarem dos mesmos dados?

**Fraqueza comum:** tratar uma entidade de ORM como o contrato de integração.

## Preparação específica para uma vaga

**Construída, e decidida pela [ADR 0021](../adr/0021-job-description-blueprints-explain-every-weight.md).** O aluno cola uma descrição de vaga e recebe um blueprint: os tópicos canônicos sobre os quais o anúncio realmente fala, cada um com um peso de 1 a 5 na mesma escala que a taxonomia usa, e a lista dos requisitos que ele não conseguiu situar.

O peso é uma contagem, não uma opinião. Um ponto por termo distinto daquele tópico encontrado na descrição, limitado a 5, casado contra um dicionário revisado de termos por tópico. Então cada peso tem palavras por trás:

| Tópico | Peso | Porque o anúncio disse |
|---|---|---|
| Spring | 2 | "spring boot", "spring" |
| Mensageria | 1 | "kafka" |
| Nuvem e operações | 1 | "kubernetes" |

Quatro coisas que o blueprint não faz, e cada uma é uma regra em código com teste:

- **Ele não pondera com um modelo.** A #22 adia ponderação opaca só por IA, e o motivo é que um peso é um conselho sobre onde alguém vai gastar uma semana. Um modelo pode propor termos para o dicionário, que um humano revisa; ele não pode entregar ao aluno um número sem nada por trás.
- **Ele não mexe na taxonomia canônica.** Os pesos editoriais da tabela acima continuam o que são para todo mundo. Um blueprint construído para uma taxonomia e aplicado a outra é recusado de saída, em vez de reinterpretado em silêncio.
- **Ele não adivinha o que não entendeu.** Um framework interno da empresa volta nomeado, como requisito que ninguém reconheceu, para o aluno pesar por conta própria.
- **Ele não diz nada sobre o aluno.** Nenhum fit, nenhuma prontidão para a vaga, nenhuma probabilidade de proposta, nenhuma experiência inferida. Ele pesa tópicos; não avalia pessoas. O aluno também pode sobrepor qualquer peso, e aí o registro diz que o peso foi dele e não do anúncio.

Uma sessão iniciada a partir de um blueprint sorteia suas perguntas na ordem dos pesos, então os tópicos em que o anúncio se apoiou são os que a sessão cobra.

## Evidências de progresso

A preparação para entrevistas pode reutilizar:

- histórico de tentativas;
- confiança;
- tempo decorrido;
- progresso por tópico;
- caderno de erros;
- revisão espaçada.

Evidências adicionais podem incluir:

- cobertura dos conceitos esperados;
- conceitos ausentes recorrentes;
- dificuldade nas perguntas de acompanhamento;
- confiança autodeclarada versus cobertura revisada.

Qualquer indicador agregado de prontidão deve permanecer explicável.

## Fronteira da IA

No futuro, a IA poderá:

- sugerir explicações complementares;
- propor variações de prática;
- conduzir entrevistas simuladas conversacionais;
- comparar uma resposta com critérios revisados;
- identificar possíveis conceitos ausentes.

A IA não deve:

- publicar questões silenciosamente;
- se tornar a fonte autoritativa de correção técnica;
- inventar citações;
- atribuir notas opacas de contratação;
- afirmar que uma resposta subjetiva está definitivamente correta sem critérios revisados.

## Princípio de entrega

O Interview Prep só deve ser introduzido depois que o Study Core demonstrar que as primitivas subjacentes de questão, sessão, tentativa, progresso, editorial e auditoria são úteis no estudo real.

Onde o comportamento de certificação e o de entrevista diferirem, prefere-se tipos de domínio explícitos a campos genéricos anuláveis ou semântica sobrecarregada.

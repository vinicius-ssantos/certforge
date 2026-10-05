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

**Dois assuntos da lista anterior estão deliberadamente ausentes, e quem lê não deveria ter que descobrir isso.** *Comunicação comportamental* não tem referência autoritativa, e a [política de conteúdo](content-policy.md) exige uma; se a política admite uma questão cuja evidência é só julgamento editorial é algo a decidir antes de o tópico existir. *Preocupações de sistemas financeiros* — auditabilidade, precisão, rastreabilidade, prevenção de duplicidade — são uma lente que atravessa os tópicos 6, 9, 10 e 12, não uma décima terceira área, e pertencem a um blueprint de vaga. Então a primeira trilha de entrevista ainda não faz aquilo que a palavra "entrevista" mais sugere.

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

Um fluxo futuro poderá aceitar uma descrição de vaga e produzir um blueprint de estudo explícito, por exemplo:

- Java — alta;
- Spring — alta;
- microsserviços — alta;
- mensageria — alta;
- AWS — alta;
- preocupações do domínio financeiro — média.

O blueprint gerado deve mostrar por que cada tópico foi selecionado. Ele não deve reescrever silenciosamente a trilha de entrevista canônica nem fabricar requisitos de experiência.

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

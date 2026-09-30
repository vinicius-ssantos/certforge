# Direção do Interview Prep

> Tradução de [`docs/product/interview-prep.md`](../../product/interview-prep.md). O inglês é a fonte canônica.

## Status

**Direção futura do produto — não comprometida com a `v0.1.0`.**

Este documento define o formato pretendido da preparação para entrevistas técnicas, para que a arquitetura inicial não torne essa capacidade desnecessariamente cara depois. Ele não é permissão para implementar comportamento exclusivo de entrevista antes de o Study Core estar completo.

## Problema

Entrevistas técnicas testam mais do que o reconhecimento de uma alternativa correta. Espera-se que o candidato explique conceitos, compare trade-offs, raciocine sobre falhas, analise código, discuta arquitetura e responda a perguntas de acompanhamento com a profundidade adequada.

Um modelo genérico de quiz é, portanto, insuficiente. O Interview Prep precisa de evidências estruturadas sem fingir que toda resposta tem um único valor de verdade binário.

## Primeiro perfil-alvo

A trilha de entrevista inicial deve ser:

**Java Backend — Pleno/Sênior**

Taxonomia candidata de tópicos:

- Java Core;
- Collections e generics;
- Streams e APIs funcionais;
- concorrência e fundamentos da JVM;
- Spring e Spring Boot;
- Spring Security;
- JPA e Hibernate;
- SQL e transações;
- testes;
- SOLID e design patterns;
- fronteiras de domínio e fundamentos de DDD;
- microsserviços;
- integração síncrona versus assíncrona;
- mensageria;
- conceitos de Kafka e RabbitMQ;
- idempotência, retries, DLQ, ordenação e consistência;
- fundamentos de AWS para engenheiros de backend;
- Docker e Kubernetes;
- observabilidade e resiliência;
- system design;
- comunicação comportamental;
- preocupações de sistemas financeiros, como auditabilidade, precisão, rastreabilidade e prevenção de duplicidade.

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

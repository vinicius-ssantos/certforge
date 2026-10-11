# Manifest content review packet

Generated from content/java-backend-interview by content/build-manifest-review-packet.mjs.
Do not edit this packet by hand. Edit the pack and regenerate it. Human verdicts live in content/java-backend-interview/review.json.

Pack: java-backend-interview-foundation | Track: java-backend-interview (INTERVIEW) | Version: Taxonomy 2026.1 | Language: pt-BR | Editorial status: DRAFT

Review state: 0/12 reviewed; 0 changed since review; 12 never reviewed.

Automated validation checks schema and digest stability. It does not establish technical correctness.

## How to review

1. Read the learner prompt first and answer it without reading the criteria.
2. Compare with the reviewed material and verify every technical claim against the references.
3. Apply the checklist. If the item is ambiguous or misleading, request changes.
4. Record only questions personally reviewed in content/java-backend-interview/review.json using the digest printed under the item.
5. A semantic edit changes the digest and invalidates the recorded verdict.

## Questions

| # | Question | Topic ID | Type | Seniority | Difficulty | Review |
|---:|---|---|---|---|---|---|
| 1 | t01-java-equals-hashcode-key | a3000000-0000-4000-8000-000000000101 | GUIDED_RESPONSE | PLENO | MEDIUM | **not reviewed** |
| 2 | t02-concurrency-volatile-visibility | a3000000-0000-4000-8000-000000000102 | GUIDED_RESPONSE | SENIOR | HARD | **not reviewed** |
| 3 | t03-oop-payment-strategy-boundary | a3000000-0000-4000-8000-000000000103 | GUIDED_RESPONSE | PLENO | MEDIUM | **not reviewed** |
| 4 | t04-dsa-priority-queue-scheduler | a3000000-0000-4000-8000-000000000104 | GUIDED_RESPONSE | PLENO | MEDIUM | **not reviewed** |
| 5 | t05-spring-constructor-injection | a3000000-0000-4000-8000-000000000105 | GUIDED_RESPONSE | PLENO | MEDIUM | **not reviewed** |
| 6 | t06-persistence-n-plus-one | a3000000-0000-4000-8000-000000000106 | GUIDED_RESPONSE | PLENO | HARD | **not reviewed** |
| 7 | t07-testing-idempotency-strategy | a3000000-0000-4000-8000-000000000107 | GUIDED_RESPONSE | SENIOR | HARD | **not reviewed** |
| 8 | t08-domain-boundaries-shared-table | a3000000-0000-4000-8000-000000000108 | GUIDED_RESPONSE | SENIOR | HARD | **not reviewed** |
| 9 | t09-distributed-retry-storm | a3000000-0000-4000-8000-000000000109 | GUIDED_RESPONSE | SENIOR | HARD | **not reviewed** |
| 10 | t10-messaging-kafka-idempotent-consumer | a3000000-0000-4000-8000-000000000110 | GUIDED_RESPONSE | SENIOR | HARD | **not reviewed** |
| 11 | t11-cloud-kubernetes-probes | a3000000-0000-4000-8000-000000000111 | GUIDED_RESPONSE | PLENO | MEDIUM | **not reviewed** |
| 12 | t12-system-design-aws-orders-idempotency | a3000000-0000-4000-8000-000000000112 | GUIDED_RESPONSE | SENIOR | HARD | **not reviewed** |

## 1. t01-java-equals-hashcode-key

Topic ID: a3000000-0000-4000-8000-000000000101
Type: GUIDED_RESPONSE | Seniority: PLENO | Difficulty: MEDIUM

### As the learner sees it

> Você criou um value object `Money` e pretende usá-lo como chave de um `HashMap`. A classe sobrescreve `equals()`, mas não `hashCode()`. O que pode dar errado? Como você projetaria esse tipo para que ele seja uma chave segura e previsível?

### Reviewed response criteria

Reference answer:

Se dois objetos são iguais segundo `equals()`, o contrato de `hashCode()` exige que produzam o mesmo hash. Sobrescrever apenas `equals()` pode fazer duas instâncias semanticamente iguais serem tratadas de modo inconsistente por uma coleção hash. `equals()` e `hashCode()` devem derivar do mesmo estado lógico. Além disso, os campos que participam dessa identidade devem permanecer estáveis enquanto o objeto estiver armazenado como chave; mudar esse estado depois de `put()` pode tornar a entrada difícil de localizar. Para um value object como `Money`, imutabilidade costuma ser uma escolha natural. Colisões de hash continuam possíveis: hash igual não implica igualdade.

Expected concepts:
- REQUIRED: Objetos iguais por equals devem produzir o mesmo hashCode — É a condição do contrato de Object relevante para coleções baseadas em hash.
- REQUIRED: equals() e hashCode() devem usar o mesmo estado lógico — Critérios incompatíveis quebram a consistência entre igualdade e hashing.
- REQUIRED: O estado que participa da identidade deve permanecer estável enquanto o objeto é chave — Mudar campos usados no hash depois da inserção pode impedir a localização normal da chave.
- OPTIONAL: Colisão de hash não significa igualdade — Chaves diferentes podem compartilhar um hash e ainda precisam ser diferenciadas.

Common mistakes:
- Dizer que HashMap compara somente o número de hash.
- Afirmar que objetos diferentes precisam obrigatoriamente ter hashes diferentes.
- Ignorar mutabilidade de campos usados por equals()/hashCode() depois do put().

Likely follow-ups:
- O que muda se Money for implementado como record?
- Por que usar apenas um identificador técnico em equals/hashCode pode ou não fazer sentido para uma entidade JPA?

### Why this difficulty

Exige relacionar o contrato de igualdade do Java ao comportamento de uma coleção hash e perceber o risco de estado mutável, não apenas recitar equals/hashCode.

### References

- Object.equals/hashCode — Java SE 25: https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html
- HashMap — Java SE 25: https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:91da9fc852fa4368c7f1516a39b2db4eed645806c7e9a3602f86883e4d913056
Comments:

&nbsp;

## 2. t02-concurrency-volatile-visibility

Topic ID: a3000000-0000-4000-8000-000000000102
Type: GUIDED_RESPONSE | Seniority: SENIOR | Difficulty: HARD

### As the learner sees it

> Dois threads compartilham `int value` e `volatile boolean ready`. O thread A executa `value = 42; ready = true;`. O thread B espera até observar `ready == true` e então lê `value`. Que garantia `volatile` fornece nesse caso? E por que transformar um `int counter` em `volatile` não torna `counter++` thread-safe?

### Reviewed response criteria

Reference answer:

Uma escrita em uma variável `volatile` happens-before uma leitura posterior dessa mesma variável que observa a escrita. Assim, quando B observa `ready == true`, as ações anteriores em A, incluindo `value = 42`, tornam-se visíveis a B pela relação happens-before. A garantia principal aqui é de visibilidade e ordenação do padrão de publicação. Já `counter++` é uma operação composta de leitura, cálculo e escrita. Tornar o campo volatile não transforma essa sequência inteira em uma atualização atômica; dois threads podem ler o mesmo valor e perder uma atualização. Para incremento concorrente é necessário um mecanismo com a atomicidade apropriada, como sincronização ou uma classe atômica, conforme o caso.

Expected concepts:
- REQUIRED: A escrita volatile e a leitura correspondente estabelecem uma relação happens-before — Essa relação é a base formal da publicação de value através de ready.
- REQUIRED: As escritas anteriores a ready=true ficam visíveis ao consumidor que observa ready=true — A transitividade do happens-before conecta a escrita comum em value à leitura posterior.
- REQUIRED: volatile não torna uma operação read-modify-write composta automaticamente atômica — counter++ envolve múltiplas ações e pode sofrer lost update.
- OPTIONAL: A alternativa depende do padrão de acesso, por exemplo synchronized ou tipos atômicos — A escolha de coordenação deve seguir a semântica necessária.

Common mistakes:
- Dizer que volatile torna qualquer operação sobre a variável atômica.
- Explicar somente como 'vai para a memória principal' sem falar de happens-before.
- Concluir que value também precisa obrigatoriamente ser volatile nesse padrão específico de publicação.

Likely follow-ups:
- Como você implementaria um contador concorrente com alto volume de atualizações?
- Quando synchronized é preferível a uma classe atômica?

### Why this difficulty

Exige distinguir visibilidade e ordenação do Java Memory Model de atomicidade e explicar happens-before, uma fonte comum de respostas superficiais sobre volatile.

### References

- JLS 17.4.5 — Happens-before Order: https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html#jls-17.4.5

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:5ffc86589884bec9acae50dc4f160166f23594c714bff7d5bc7a823dbaf5637b
Comments:

&nbsp;

## 3. t03-oop-payment-strategy-boundary

Topic ID: a3000000-0000-4000-8000-000000000103
Type: GUIDED_RESPONSE | Seniority: PLENO | Difficulty: MEDIUM

### As the learner sees it

> Um `PaymentService` possui um `switch` crescente por tipo de pagamento e cada novo meio altera a mesma classe. Como você avaliaria uma refatoração com Strategy e injeção de dependências? Em que situação manter o `switch` ainda pode ser a escolha mais simples?

### Reviewed response criteria

Reference answer:

Quando cada tipo de pagamento encapsula comportamento realmente diferente e novos tipos são adicionados com frequência, uma abstração de estratégia pode mover cada política para uma implementação própria e permitir que o serviço orquestre por contrato em vez de conhecer todos os detalhes concretos. As implementações podem ser fornecidas ao serviço por construção/configuração, reduzindo a criação direta de dependências e facilitando testes e substituição. Isso não significa que um container de DI automaticamente satisfaz DIP nem que todo `switch` é ruim. Se o conjunto de casos é pequeno, estável, local e a abstração criaria mais indireção do que valor, um `switch` explícito pode ser mais legível. A decisão deve considerar coesão, razão de mudança, extensibilidade real e custo cognitivo.

Expected concepts:
- REQUIRED: Strategy é útil quando há comportamentos intercambiáveis com uma abstração comum — O ganho vem de encapsular variações reais, não de eliminar sintaxe condicional por si só.
- REQUIRED: Composição e dependência de abstrações podem reduzir conhecimento de implementações concretas — O orquestrador passa a depender do contrato necessário ao comportamento.
- REQUIRED: Injeção de dependência é um mecanismo e não prova, sozinha, que o design segue DIP — Ainda é possível injetar abstrações inadequadas ou detalhes de infraestrutura no domínio.
- OPTIONAL: Um switch pequeno, estável e local pode ser mais simples que uma hierarquia prematura — KISS/YAGNI e custo de indireção fazem parte do trade-off.

Common mistakes:
- Dizer que qualquer switch viola OCP.
- Equacionar uso do container Spring com Dependency Inversion correta.
- Criar uma classe Strategy para cada caso sem uma variação de comportamento relevante.

Likely follow-ups:
- Como você selecionaria a estratégia sem colocar outro switch gigante em um lugar diferente?
- Que sinais indicariam que a abstração Strategy ficou mais complexa do que o problema?

### Why this difficulty

Exige reconhecer quando polimorfismo/composição reduzem acoplamento sem transformar Strategy ou injeção de dependência em regras absolutas.

### References

- Spring Framework — Dependencies and configuration in detail: https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html
- JLS 9 — Interfaces: https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:70b80bc590c7e414f2e5b58b54761cd2b7d272b7c1afa7f7b75e2154f9180a34
Comments:

&nbsp;

## 4. t04-dsa-priority-queue-scheduler

Topic ID: a3000000-0000-4000-8000-000000000104
Type: GUIDED_RESPONSE | Seniority: PLENO | Difficulty: MEDIUM

### As the learner sees it

> Você precisa implementar um scheduler em memória que recebe tarefas com prioridades diferentes e deve retirar repetidamente a tarefa de maior prioridade. Por que uma fila de prioridade é uma candidata melhor do que manter uma lista totalmente ordenada a cada inserção? Quais limitações de `PriorityQueue` em Java você explicaria antes de adotá-la?

### Reviewed response criteria

Reference answer:

Uma fila de prioridade mantém o elemento de maior prioridade lógica na cabeça segundo seu comparador sem manter uma ordenação total observável de todos os elementos. Em Java, `PriorityQueue` oferece `offer` e `poll` em O(log n) e `peek` em O(1), o que combina bem com inserir e retirar repetidamente o próximo trabalho. Ordenar uma lista inteira após cada inserção tende a fazer trabalho desnecessário quando só o próximo elemento importa. A implementação Java não é thread-safe, não aceita `null`, e percorrer seu iterator não garante ordem de prioridade. Remover ou localizar um elemento arbitrário é O(n). O comparador também precisa definir a prioridade e o desempate de forma coerente com o domínio.

Expected concepts:
- REQUIRED: A estrutura deve ser escolhida pelas operações dominantes, não apenas pelo nome da coleção — Aqui predominam inserção e extração do próximo elemento.
- REQUIRED: PriorityQueue oferece offer/poll O(log n) e peek O(1) — Essas garantias documentadas justificam a escolha para o padrão descrito.
- REQUIRED: O iterator de PriorityQueue não percorre necessariamente em ordem de prioridade — A heap mantém apenas as propriedades necessárias para a cabeça, não uma lista totalmente ordenada.
- OPTIONAL: Remoção/consulta arbitrária pode custar O(n) — Isso pode mudar a escolha se cancelamentos por id forem frequentes.

Common mistakes:
- Afirmar que todos os elementos de PriorityQueue ficam iteráveis em ordem.
- Dizer que toda operação da fila de prioridade é O(log n).
- Ignorar que a implementação Java não é thread-safe.

Likely follow-ups:
- O que mudaria se o scheduler precisasse cancelar tarefas por id com muita frequência?
- Como você trataria prioridades iguais e starvation?

### Why this difficulty

Exige escolher a estrutura pela operação dominante e conhecer as propriedades de custo e ordenação de uma fila de prioridade.

### References

- PriorityQueue — Java SE 25: https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/PriorityQueue.html

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:385b19fe90095f51c812213346b20b0dd84f5a20c88a6fbdfaf4de0a7939b9b6
Comments:

&nbsp;

## 5. t05-spring-constructor-injection

Topic ID: a3000000-0000-4000-8000-000000000105
Type: GUIDED_RESPONSE | Seniority: PLENO | Difficulty: MEDIUM

### As the learner sees it

> Em um serviço Spring, por que constructor injection costuma ser uma boa escolha para dependências obrigatórias? Se o construtor passou a receber sete ou oito colaboradores, você resolveria isso trocando tudo para field injection? O que investigaria?

### Reviewed response criteria

Reference answer:

Constructor injection torna as dependências obrigatórias explícitas no momento da criação e permite construir o objeto já em estado utilizável. O Spring também consegue resolver essas dependências pelo construtor, e testes unitários podem instanciar a classe diretamente sem depender de reflexão do container. Setter injection pode ser adequada para dependências genuinamente opcionais. Um construtor muito grande não é um motivo para esconder dependências com field injection; é um sinal para investigar se a classe acumulou responsabilidades, se alguns colaboradores pertencem a outra abstração/coesa ou se existe orchestration legítima que justifique a quantidade. Refatorar só para reduzir a contagem de parâmetros, agrupando dependências sem relação, também pode apenas esconder o problema.

Expected concepts:
- REQUIRED: Constructor injection explicita e exige dependências necessárias na criação — O estado válido da classe fica visível na assinatura do construtor.
- REQUIRED: Field injection não corrige excesso de responsabilidades; apenas oculta dependências — A questão de design continua existindo mesmo que a assinatura pareça menor.
- REQUIRED: Muitos colaboradores são um sinal para investigar coesão e responsabilidades — Pode haver um service orchestration legítimo, mas a causa deve ser examinada.
- OPTIONAL: Setter injection pode servir para dependências realmente opcionais — A própria documentação Spring diferencia dependências obrigatórias e opcionais.

Common mistakes:
- Afirmar que Spring proíbe setter ou field injection.
- Criar um objeto Dependencies apenas para esconder oito parâmetros sem ganhar uma abstração coerente.
- Confundir facilidade do container com qualidade automática do desenho.

Likely follow-ups:
- Quando um construtor grande é aceitável em um application service/orchestrator?
- Como constructor injection ajuda testes sem transformar todo teste em teste de implementação?

### Why this difficulty

Exige explicar constructor injection como contrato de dependências obrigatórias e reconhecer que muitos parâmetros podem indicar problema de coesão, sem tratar a regra como dogma.

### References

- Spring Framework — Dependencies and configuration in detail: https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:4df1907fe94965039c7016a3345e865d0b8bfc2b5d10ce0af801c0cba843f35c
Comments:

&nbsp;

## 6. t06-persistence-n-plus-one

Topic ID: a3000000-0000-4000-8000-000000000106
Type: GUIDED_RESPONSE | Seniority: PLENO | Difficulty: HARD

### As the learner sees it

> Um endpoint carrega 100 pedidos e depois acessa o cliente e os itens de cada pedido durante a montagem do DTO. Em produção aparecem centenas de consultas SQL para uma única requisição. Como você investigaria esse N+1 e quais opções de correção consideraria sem simplesmente marcar todas as associações como EAGER?

### Reviewed response criteria

Reference answer:

Primeiro eu confirmaria o padrão com logs/estatísticas SQL ou profiling: uma consulta para a lista seguida por consultas repetidas ao acessar associações é o sinal típico. A correção deve partir dos dados que aquele caso de uso realmente precisa. Dependendo do formato, pode ser um fetch join, entity graph, projeção/DTO query ou batching, sempre verificando cardinalidade, duplicação de linhas, paginação e volume carregado. Tornar tudo EAGER globalmente costuma trocar N+1 por over-fetching e pode criar consultas grandes ou imprevisíveis em outros casos. Também separaria a fronteira transacional do problema: LazyInitializationException e N+1 são problemas diferentes. Depois da mudança, mediria novamente número de queries e volume/result set.

Expected concepts:
- REQUIRED: Confirmar N+1 observando uma consulta principal seguida por consultas repetitivas de associações — Diagnóstico deve ser baseado no SQL/telemetria e no padrão de acesso.
- REQUIRED: Escolher o plano de fetch por caso de uso — Fetch join, entity graph, projeção ou batching são ferramentas com trade-offs diferentes.
- REQUIRED: EAGER global não é uma correção universal e pode causar over-fetching — A estratégia deve evitar tanto consultas repetidas quanto carregamento desnecessário.
- OPTIONAL: Revalidar quantidade de queries, cardinalidade e volume depois da mudança — Uma alteração de fetch pode introduzir duplicação, paginação problemática ou outra regressão.

Common mistakes:
- Resolver automaticamente marcando todas as relações como EAGER.
- Confundir N+1 com LazyInitializationException.
- Adicionar cache antes de entender por que as consultas estão sendo geradas.

Likely follow-ups:
- Que cuidado você teria com fetch join de coleção e paginação?
- Quando uma projeção específica para leitura seria melhor que carregar o aggregate inteiro?

### Why this difficulty

Exige diagnosticar N+1 a partir do padrão de acesso e escolher uma estratégia de fetch adequada ao caso de uso sem recorrer a EAGER global como correção automática.

### References

- Hibernate ORM — Introduction (fetching and N+1): https://docs.hibernate.org/stable/orm/introduction/html_single/

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:5330c5a9cb697b9a754aade9226eee7d865e8909903b39f4ae33e35cf71429f2
Comments:

&nbsp;

## 7. t07-testing-idempotency-strategy

Topic ID: a3000000-0000-4000-8000-000000000107
Type: GUIDED_RESPONSE | Seniority: SENIOR | Difficulty: HARD

### As the learner sees it

> Um consumer recebe eventos de pagamento e precisa ser idempotente: o mesmo evento pode chegar novamente, mas o efeito de negócio não pode ser duplicado. Como você desenharia a estratégia de testes para ter confiança nessa propriedade, desde testes rápidos até integração com banco?

### Reviewed response criteria

Reference answer:

Eu separaria as evidências. Regras puras, como geração/validação da chave de idempotência e decisões de domínio, podem ter testes unitários rápidos e determinísticos. A propriedade crítica de não duplicar o efeito precisa de testes de integração contra o mecanismo real de persistência: aplicar o mesmo event id duas vezes, inclusive em execuções concorrentes quando relevante, e verificar tanto o estado de negócio quanto o registro durável de deduplicação. Um banco real em container é mais representativo para constraints, isolamento e transações do que substituir o repositório por mock. Para o fluxo de mensageria, testaria redelivery/retry em uma camada apropriada e validaria os efeitos observáveis, não apenas chamadas internas. Relógio, ids e backoff devem ser controláveis para evitar flakiness. Testes de contrato podem cobrir o formato do evento; E2E fica para poucos caminhos críticos, não como única evidência.

Expected concepts:
- REQUIRED: Testes unitários cobrem regras puras; a garantia transacional/idempotente exige integração com o mecanismo real relevante — Mocks não demonstram comportamento de constraint, isolamento ou commit no banco.
- REQUIRED: O mesmo identificador deve ser exercitado mais de uma vez e o efeito de negócio observado não pode duplicar — A propriedade é sobre efeito, não apenas sobre uma função retornar o mesmo valor.
- REQUIRED: Testar concorrência/redelivery quando fazem parte do modo real de falha — Duplicatas podem surgir por retry, crash ou processamento simultâneo.
- OPTIONAL: Controlar tempo, ids e espera para evitar testes flakey — Determinismo melhora confiabilidade e diagnóstico da suíte.
- OPTIONAL: Contrato do evento e E2E são camadas adicionais com escopos distintos — Cada nível prova uma coisa diferente e tem custo diferente.

Common mistakes:
- Mockar o repositório e concluir que a constraint/transação real está correta.
- Verificar somente que um método foi chamado uma vez, em vez do efeito de negócio persistido.
- Depender de sleeps longos e temporização real para testar retries.

Likely follow-ups:
- Como você testaria duas entregas concorrentes do mesmo evento?
- Quando um banco em memória seria evidência insuficiente para esse caso?

### Why this difficulty

Exige montar uma estratégia de testes por tipo de evidência, incluindo idempotência, transação e redelivery, sem reduzir tudo a mocks ou a um único teste E2E.

### References

- JUnit 5 User Guide: https://junit.org/junit5/docs/current/user-guide/
- Testcontainers — Database containers: https://java.testcontainers.org/modules/databases/

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:9928834511c75a5e794b5c6a63caae639127ed3324364fc28544999da5198862
Comments:

&nbsp;

## 8. t08-domain-boundaries-shared-table

Topic ID: a3000000-0000-4000-8000-000000000108
Type: GUIDED_RESPONSE | Seniority: SENIOR | Difficulty: HARD

### As the learner sees it

> Os módulos Billing e Support compartilham a mesma entidade JPA `Customer` e escrevem diretamente na mesma tabela. No começo isso acelerou o desenvolvimento, mas agora mudanças de schema e regras de um módulo quebram o outro. Como você redesenharia essa fronteira? Compartilhar a tabela é sempre errado?

### Reviewed response criteria

Reference answer:

O problema principal é que os dois contextos passaram a compartilhar não apenas dados, mas também modelo de persistência, invariantes e ciclo de mudança. Eu procuraria definir quem é dono de cada dado e quais informações o outro contexto realmente precisa. A integração pode ocorrer por um contrato explícito — por exemplo API, evento, projeção/read model ou uma interface entre módulos — em vez de ambos manipularem a mesma entidade ORM. Isso permite evolução mais independente e torna as decisões de consistência explícitas. Em um monólito pequeno e com um único modelo/coordenador, compartilhar uma base física pode ser perfeitamente aceitável; o ponto é evitar ownership ambíguo e coupling por detalhes de schema. Separar bancos por princípio, sem necessidade operacional ou de domínio, também pode adicionar custo desnecessário.

Expected concepts:
- REQUIRED: Definir ownership dos dados e invariantes por fronteira de domínio — Sem um dono claro, qualquer módulo pode alterar regras que o outro implicitamente depende.
- REQUIRED: Não usar a mesma entidade ORM como contrato de integração entre contextos — Isso vaza detalhes de persistência e acopla a evolução do modelo.
- REQUIRED: Integrar por contratos explícitos e escolher conscientemente a consistência necessária — APIs, eventos ou projeções tornam dependências e trade-offs observáveis.
- OPTIONAL: Banco físico compartilhado não é automaticamente errado em todo sistema — O risco depende de ownership, autonomia desejada e custo de operação.

Common mistakes:
- Responder apenas 'um banco por microserviço' sem discutir ownership ou consistência.
- Trocar a entidade compartilhada por um DTO compartilhado global e manter o mesmo acoplamento semântico.
- Adotar eventos para tudo sem considerar latência, consistência e complexidade.

Likely follow-ups:
- Como o contexto Support obtém dados de cliente sem assumir o schema de Billing?
- Quando você manteria dois módulos no mesmo banco, mas ainda assim separaria ownership?

### Why this difficulty

Exige raciocinar sobre ownership de dados e acoplamento de evolução, sem transformar DDD ou banco por serviço em dogma.

### References

- Microsoft Learn — Data sovereignty per microservice: https://learn.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/data-sovereignty-per-microservice

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:38c78b4408cb7fee7a0f531ddf5c67695e662279149ba09e75f7500c6f792761
Comments:

&nbsp;

## 9. t09-distributed-retry-storm

Topic ID: a3000000-0000-4000-8000-000000000109
Type: GUIDED_RESPONSE | Seniority: SENIOR | Difficulty: HARD

### As the learner sees it

> Uma requisição atravessa três serviços. Cada camada possui timeout de 2 segundos e faz até três tentativas imediatas contra a próxima camada. Durante uma degradação do banco, o tráfego explode e piora a indisponibilidade. O que está acontecendo e como você redesenharia timeout/retry para evitar esse retry storm?

### Reviewed response criteria

Reference answer:

Retries aumentam carga justamente quando a dependência já está degradada, e retries em várias camadas se multiplicam. O primeiro passo é definir timeouts a partir do orçamento de latência e do comportamento real da dependência, evitando esperar além do valor útil ao chamador. Eu concentraria retries em uma camada apropriada em vez de repetir o mesmo comportamento em cada hop, usaria um número limitado de tentativas com exponential backoff e jitter e imporia budgets/limites de retry. Só repetiria operações seguras ou idempotentes, ou adicionaria uma chave/semântica de idempotência. Circuit breaker ou load shedding podem ajudar a parar trabalho sem chance razoável de sucesso, mas precisam de tuning para não criar outra instabilidade. Métricas de timeout, retries, saturação e taxa de sucesso devem mostrar se a política está ajudando.

Expected concepts:
- REQUIRED: Retries em camadas diferentes podem se multiplicar e amplificar carga na dependência degradada — Cada camada pode repetir chamadas que já são repetidas abaixo dela.
- REQUIRED: Timeout deve respeitar orçamento de latência e características reais da dependência — Esperas arbitrárias podem consumir todo o deadline ou falhar prematuramente.
- REQUIRED: Retries devem ser limitados e espaçados com backoff e jitter — Isso reduz sincronização de clientes e pressão contínua sobre a dependência.
- REQUIRED: A operação precisa ser segura para retry ou possuir idempotência explícita — Repetir uma operação com efeito não idempotente pode duplicar resultados.
- OPTIONAL: Circuit breaking/load shedding e retry budgets são mecanismos complementares — Eles limitam trabalho quando a chance de sucesso é baixa.

Common mistakes:
- Aumentar o número de retries durante a falha sem limitar a carga.
- Usar o mesmo timeout fixo em todas as camadas sem considerar o deadline fim a fim.
- Adicionar circuit breaker e manter retries ilimitados, tratando-o como solução isolada.

Likely follow-ups:
- Em qual camada você colocaria o retry se só pudesse escolher uma?
- Como você escolheria timeouts usando p95/p99 sem causar falsos timeouts em excesso?

### Why this difficulty

Exige analisar retries como problema sistêmico: timeout, multiplicação entre camadas, backoff, jitter, idempotência e limites de carga.

### References

- AWS Builders' Library — Timeouts, retries, and backoff with jitter: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
- AWS Builders' Library — Making retries safe with idempotent APIs: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:8573852b6fca4efc894ed89dc4397c4d0915a62273310f9bc96a6fffae043afb
Comments:

&nbsp;

## 10. t10-messaging-kafka-idempotent-consumer

Topic ID: a3000000-0000-4000-8000-000000000110
Type: GUIDED_RESPONSE | Seniority: SENIOR | Difficulty: HARD

### As the learner sees it

> Um consumer Kafka grava uma alteração no PostgreSQL e cai antes de confirmar o offset. Ao reiniciar, a mesma mensagem pode ser entregue novamente. Como você evita duplicar o efeito de negócio? Dizer apenas 'Kafka é exactly-once' resolve esse caso?

### Reviewed response criteria

Reference answer:

Se o efeito no banco foi commitado mas o offset não, a mensagem pode ser lida novamente; isso é a janela clássica de redelivery. O consumer precisa tratar a repetição como parte normal do fluxo. Uma abordagem é carregar no evento um identificador estável e persistir de forma durável o registro de processamento/deduplicação na mesma transação do efeito de negócio, usando constraint/registro de inbox conforme o modelo. Se o id já foi aplicado, a nova entrega não repete o efeito. O offset só deve avançar de acordo com a semântica de processamento escolhida. As garantias de exactly-once do Kafka têm escopo específico e não tornam automaticamente uma transação em um banco externo parte da mesma atomicidade. Efeitos em outro serviço exigem estratégia adicional, como API idempotente, outbox/saga ou reconciliação.

Expected concepts:
- REQUIRED: Commit no banco antes do offset cria uma janela legítima de redelivery — Após o crash, o broker não sabe que o efeito externo já aconteceu.
- REQUIRED: Usar uma identidade estável do evento e deduplicação durável — A mesma entrega lógica precisa ser reconhecida depois de restart/rebalance.
- REQUIRED: Deduplicação e efeito de negócio devem ser atomicamente consistentes quando estão no mesmo banco — Registrar o id separado do efeito pode criar outra janela de inconsistência.
- REQUIRED: Garantia exactly-once do Kafka não engloba automaticamente um banco externo — O escopo das garantias deve ser entendido em vez de usado como slogan.
- OPTIONAL: Side effects remotos podem exigir idempotência/outbox/saga/reconciliação adicional — Não há uma transação local simples que cubra todos os recursos externos.

Common mistakes:
- Confiar apenas em auto-commit de offset para impedir duplicatas de negócio.
- Guardar ids processados só em memória.
- Afirmar que exactly-once do Kafka inclui automaticamente qualquer banco ou API externa.

Likely follow-ups:
- Como você faria essa deduplicação com uma unique constraint?
- O que muda se o efeito for uma chamada para um gateway de pagamento externo?

### Why this difficulty

Exige separar delivery do broker de idempotência do efeito de negócio e raciocinar sobre a janela entre commit externo e commit do offset.

### References

- KafkaConsumer 4.1 — offset and delivery semantics: https://kafka.apache.org/41/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html
- Apache Kafka — Design: https://kafka.apache.org/41/design/design/

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:ac6c0dfd6f3cd27f1968ca94166cd383be36d4cf91260c45f0f08181c9b4e2b0
Comments:

&nbsp;

## 11. t11-cloud-kubernetes-probes

Topic ID: a3000000-0000-4000-8000-000000000111
Type: GUIDED_RESPONSE | Seniority: PLENO | Difficulty: MEDIUM

### As the learner sees it

> Uma aplicação Java no Kubernetes usa o mesmo endpoint de health para startup, readiness e liveness. Esse endpoint consulta o banco. Quando o banco fica lento por alguns minutos, os pods começam a reiniciar e a recuperação piora. Como você redesenharia as probes e qual é a responsabilidade de cada uma?

### Reviewed response criteria

Reference answer:

As probes respondem perguntas diferentes. Startup probe protege aplicações que precisam de tempo para iniciar; enquanto ela não passa, liveness e readiness não precisam provocar decisões prematuras. Readiness decide se o pod deve receber tráfego: quando ele não consegue atender requisições de forma útil, pode ficar temporariamente fora dos endpoints sem ser reiniciado. Liveness deve indicar que o processo entrou em um estado do qual não consegue se recuperar sozinho; falhar nela provoca restart. Colocar uma dependência externa como o banco no liveness pode reiniciar pods saudáveis durante uma indisponibilidade compartilhada e transformar uma falha de dependência em restart storm. Eu manteria liveness focada no estado interno recuperável do processo, usaria readiness para capacidade de servir quando a dependência for realmente obrigatória e configuraria thresholds/timeouts de acordo com o comportamento real da aplicação.

Expected concepts:
- REQUIRED: Startup probe protege a janela de inicialização antes das demais decisões — É útil para aplicações lentas para iniciar sem inflar artificialmente o liveness.
- REQUIRED: Readiness controla participação no tráfego e não reinicia o container — Falha de readiness remove o pod dos endpoints enquanto ele não está pronto para servir.
- REQUIRED: Liveness sinaliza necessidade de restart por falha interna não recuperável — Seu efeito operacional é reiniciar o container.
- REQUIRED: Dependência externa no liveness pode causar cascata/restart storm — Uma falha comum do banco pode provocar restart de processos que estavam saudáveis.
- OPTIONAL: Thresholds e timeouts precisam refletir startup e recuperação reais — Probes agressivas demais podem virar a própria fonte da indisponibilidade.

Common mistakes:
- Dizer que readiness e liveness fazem a mesma coisa.
- Colocar todas as dependências externas no liveness por padrão.
- Aumentar indefinidamente os thresholds sem corrigir a semântica da probe.

Likely follow-ups:
- Quando a indisponibilidade do banco deveria afetar readiness?
- Como você investigaria um CrashLoopBackOff causado por probes?

### Why this difficulty

Exige distinguir startup, readiness e liveness pela consequência operacional e perceber que uma dependência externa no liveness pode amplificar uma falha.

### References

- Kubernetes — Liveness, Readiness, and Startup Probes: https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/
- Kubernetes — Configure Liveness, Readiness and Startup Probes: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:4a2e52ff922001a184428b929aa1197a10ef5f90b6ee9f1db66f57aa2f926158
Comments:

&nbsp;

## 12. t12-system-design-aws-orders-idempotency

Topic ID: a3000000-0000-4000-8000-000000000112
Type: GUIDED_RESPONSE | Seniority: SENIOR | Difficulty: HARD

### As the learner sees it

> Projete o fluxo de criação e pagamento de pedidos de um backend Java na AWS. O cliente pode repetir a mesma requisição por timeout, o pedido precisa ser persistido antes do processamento assíncrono, workers podem receber mensagens duplicadas e toda mudança financeira precisa ser auditável e rastreável. Como você desenharia o fluxo e quais garantias você não prometeria?

### Reviewed response criteria

Reference answer:

Eu começaria definindo uma chave de idempotência/identidade do comando na borda e uma constraint ou registro durável que impeça criar dois pedidos para a mesma operação lógica. A criação do pedido e a intenção de publicar o evento precisam ficar consistentes; uma forma comum é uma transação local no banco que grava o estado e um outbox, seguida por publicação assíncrona. SQS Standard oferece alta disponibilidade e pelo menos uma entrega, portanto consumidores precisam continuar idempotentes e usar uma identidade estável ao aplicar efeitos. Para pagamentos, cada transição relevante deve manter trilha de auditoria/correlation id sem registrar segredos, e chamadas externas precisam de idempotência/reconciliação próprias. Observabilidade deve ligar request, pedido, mensagem e worker por ids, com métricas de backlog, falha, retry e DLQ. IAM segue least privilege. Eu não prometeria exatamente uma execução fim a fim entre HTTP, RDS, SQS e um provedor externo; a arquitetura busca efeitos de negócio idempotentes, recuperação e consistência explícita, não uma transação ACID global.

Expected concepts:
- REQUIRED: Idempotency key/identidade estável na entrada com garantia durável de unicidade — Retries do cliente não podem criar dois efeitos lógicos.
- REQUIRED: Persistência do pedido e intenção de publicação precisam evitar a dual-write inconsistente — Outbox ou mecanismo equivalente conecta a transação local à entrega assíncrona recuperável.
- REQUIRED: Consumidores de SQS Standard devem tolerar redelivery e manter efeitos idempotentes — A fila pode entregar mais de uma cópia de uma mensagem.
- REQUIRED: Auditoria e trace/correlation ids devem conectar as mudanças sem expor segredos — Rastreabilidade é requisito de domínio e operacional, não apenas logging genérico.
- REQUIRED: IAM deve aplicar least privilege por componente — Cada serviço/worker recebe somente ações e recursos necessários.
- REQUIRED: Não existe promessa automática de exactly-once/ACID global entre banco, fila e sistema externo — A solução precisa declarar as fronteiras de consistência e mecanismos de recuperação.
- OPTIONAL: Métricas, DLQ, alarms e reconciliação sustentam operação e recuperação — Falhas assíncronas precisam ser observáveis e tratáveis depois do request original.

Common mistakes:
- Confiar que SQS Standard nunca entregará duplicatas.
- Fazer write no banco e publish na fila sem estratégia para falha entre as duas operações.
- Chamar a arquitetura de exactly-once fim a fim sem delimitar a garantia.
- Usar uma role ampla compartilhada por todos os componentes.

Likely follow-ups:
- Como você implementaria o outbox e garantiria que registros antigos fossem republicados?
- Onde você armazenaria a trilha de auditoria e quais dados evitaria registrar?
- O que mudaria se a ordem estrita de eventos por pedido fosse obrigatória?

### Why this difficulty

Exige compor idempotência, transação local, mensageria at-least-once, observabilidade, segurança e trade-offs de consistência em uma arquitetura coerente.

### References

- Amazon SQS — Standard queues: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html
- AWS Builders' Library — Making retries safe with idempotent APIs: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/
- AWS IAM — Security best practices: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- AWS Well-Architected — Reliability design principles: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html

### Evidence declaration

{"type":"reference-backed"}

### Review

- [ ] The prompt has one defensible interpretation.
- [ ] The technical claims and reviewed criteria are correct at the declared seniority.
- [ ] The difficulty rationale matches what the question actually asks.
- [ ] The references let a reviewer verify the technical claims independently.
- [ ] The wording and structure are readable and accessible.
- [ ] The item is original CertForge material and is not represented as a leaked/company interview question.
- [ ] The reference answer is defensible rather than an artificially unique answer.
- [ ] Required expected concepts are genuinely required for this prompt and seniority.
- [ ] Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.
- [ ] The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.

Verdict: [ ] approve  [ ] request changes  [ ] do not publish
Digest to record: sha256:c870035c4f882be792c1b44b0958ec9d322382a6d4c1ba1fa9224091efd95440
Comments:

&nbsp;

## Summary

| # | Question | Verdict | Reviewer | Date |
|---:|---|---|---|---|
| 1 | t01-java-equals-hashcode-key |  |  |  |
| 2 | t02-concurrency-volatile-visibility |  |  |  |
| 3 | t03-oop-payment-strategy-boundary |  |  |  |
| 4 | t04-dsa-priority-queue-scheduler |  |  |  |
| 5 | t05-spring-constructor-injection |  |  |  |
| 6 | t06-persistence-n-plus-one |  |  |  |
| 7 | t07-testing-idempotency-strategy |  |  |  |
| 8 | t08-domain-boundaries-shared-table |  |  |  |
| 9 | t09-distributed-retry-storm |  |  |  |
| 10 | t10-messaging-kafka-idempotent-consumer |  |  |  |
| 11 | t11-cloud-kubernetes-probes |  |  |  |
| 12 | t12-system-design-aws-orders-idempotency |  |  |  |

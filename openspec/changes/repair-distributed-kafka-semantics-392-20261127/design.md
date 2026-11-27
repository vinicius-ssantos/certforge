## Independent technical audit and exact corrections

1. **iv292-timeout-budget-call-chain (key A)** — A 5-second upstream deadline must stop the caller after five seconds; independently configured child timeouts may continue wasting resources, not make the upstream client take ten seconds. Primary vendor/author documentation: Google SRE Addressing Cascading Failures.

2. **iv292-vector-clocks-causal-ordering (key A)** — Lamport scalar timestamps preserve necessary causal order but cannot infer causality or recognize concurrent pairs; vector timestamps can identify incomparable events. Primary vendor/author documentation: Lamport original paper and Cambridge Distributed Systems notes.

3. **iv293-at-most-once-silent-message-loss (key B)** — Kafka auto-commit executes through poll after configured interval, not independent background timer interrupting one synchronous record processor. Polling ahead of asynchronous work can commit offsets before effects complete. Primary vendor/author documentation: Apache Kafka KafkaConsumer Javadoc.

4. **iv293-idempotent-consumer-dedup-processed-message-ids (key B)** — Deduplication of a remote ledger side effect must be atomically enforced by the ledger (stable key) or equivalent; a local check-then-remote-call does not ensure exactly-once effects. Primary vendor/author documentation: Chris Richardson Idempotent Consumer.

5. **iv293-exactly-once-requires-idempotent-processing-or-transactional-outbox (key A)** — Kafka transactional EOS is scoped to Kafka; a transactional outbox makes local business-row-plus-outbox intent atomic, but does not magically atomic-commit unrelated external API effects and Kafka consumer offsets. Primary vendor/author documentation: Confluent Delivery Semantics; Chris Richardson Transactional Outbox.

6. **iv293-outbox-relay-poller-cdc-marks-sent (key A)** — Polling publisher marks outbox rows after publish, while CDC relays follow committed binlog/WAL using durable connector checkpoints; CDC does not universally mutate each source outbox row. Primary vendor/author documentation: Debezium Outbox Event Router; microservices.io Transactional Outbox.

7. **iv294-read-your-writes-primary-routing (key D)** — A fixed short primary-routing window is best-effort if replica lag exceeds it; strict RYW needs primary until a replica proves it has applied the user's write version. Primary vendor/author documentation: Werner Vogels Eventually Consistent.

8. **iv286-stateful-lambda-parallel-stream-race (key B)** — SynchronizedSet protects atomic HashSet add operations but does not make stateful parallel map output deterministic; ordering and contention remain. Primary vendor/author documentation: Java SE 21 Stream API specification.

9. **iv288-constructor-injection-circular-detection (key B)** — Field injection can sometimes tolerate early-reference cycles only when enabled; Spring Boot 2.6+ disables circular dependencies by default so both kinds fail unless configured otherwise. Primary vendor/author documentation: Spring Boot 2.6 release notes.

## Explicit editorial withholding

Each changed question had no prior V2 approval. Revisions preserve all answer keys, and any V2 record is blocked until the source-only PR passes strict OpenSpec, content integrity, exact-head GitHub CI/CodeQL and independent review and is integrated. No bulk signoff or fabricated human gate is permitted.

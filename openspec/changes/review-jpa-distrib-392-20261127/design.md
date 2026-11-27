## Independent V2 audit — Hibernate/JPA and distributed systems

Each exact learner prompt, all four answer texts, three distractor explanations, overall rationale and cited original vendor/author documentation were inspected separately. A correct-key flag alone is never sufficient evidence. Twenty-eight individual checks follow:

1. **iv290-derived-query-method-naming-mismatch — B.** The derived method refers to Department.title, absent from Department (which has name); Spring Data's default eager repository proxy bootstrap fails with PropertyReferenceException rather than awaiting an invocation. **Primary-source provenance:** Spring Data JPA Reference, Query Method Details.

2. **iv290-entitygraph-fetch-join-fixes-n-plus-one — C.** Explicit JPQL JOIN FETCH populates Order.lines via SQL join in the same select, eliminating separate per-parent lazy initialization for the question's nonpaged example. **Primary-source provenance:** Jakarta Persistence 3.1 specification, fetch joins.

3. **iv290-equals-hashcode-generated-id-before-persist — D.** An id-based hashCode changes when a generated id is assigned; a HashSet does not relocate a stored element to its new bucket, so contains may fail. **Primary-source provenance:** Hibernate ORM User Guide, entity equality/identifier.

4. **iv290-flush-vs-commit-auto-flush-trigger — C.** AUTO flush can synchronize overlapping pending entity changes before an affected JPQL query; flush executes SQL without committing transaction and is reversible on rollback. **Primary-source provenance:** Hibernate ORM FlushMode Javadoc.

5. **iv290-flyway-versioned-migrations-core-idea — D.** Explicit reviewed ordered versioned SQL migrations with schema-history tracking differ from automatic inferred ddl-auto=update evolution. **Primary-source provenance:** Redgate Flyway official migrations guide.

6. **iv290-lazy-proxy-getclass-vs-instanceof — D.** Hibernate lazy association proxies can subclass Product; literal getClass equality rejects subclass even when representing the same entity, while instanceof/appropriate unproxy strategies accommodate proxy type. **Primary-source provenance:** Hibernate ORM HibernateProxy Javadoc and Lazy Associations.

7. **iv290-lost-update-no-locking-scenario — A.** Two transactions read balance 100 and each write 50; without @Version or locking a stale update can silently overwrite the other debit. **Primary-source provenance:** Jakarta Persistence LockModeType docs.

8. **iv290-n-plus-one-lazy-collection-loop — B.** One parent select followed by one select per accessed uninitialized lazy Order.lines collection yields 201 SQL statements for 200 orders in the described unbatched scenario. **Primary-source provenance:** Hibernate ORM User Guide, fetching.

9. **iv290-onetomany-manytoone-default-fetch-type — B.** Jakarta Persistence sets @ManyToOne EAGER by default and @OneToMany LAZY by default; lines stay unloaded when never accessed. **Primary-source provenance:** Jakarta Persistence ManyToOne Javadoc.

10. **iv290-persistence-context-entity-states — C.** em.persist makes a new entity managed in the active persistence context; subsequent status mutation is flushed during transaction commit without merge/save. **Primary-source provenance:** Jakarta Persistence specification, Persisting an Entity Instance.

11. **iv290-projection-vs-full-entity-fetch — A.** A narrow interface projection can select only required scalar properties instead of hydrating large text/blob columns; the question's top-level fields are straightforward. **Primary-source provenance:** Spring Data JPA Projections reference.

12. **iv290-second-level-cache-stale-external-update — A.** External direct SQL updates bypass Hibernate SessionFactory cache synchronization and can leave configured L2 Product entries stale. **Primary-source provenance:** Hibernate ORM User Guide, second-level caching.

13. **iv290-version-optimistic-lock-exception — C.** @Version makes conditional UPDATE check original version; second concurrent updater gets 0 rows/OptimisticLockException at flush/commit rather than silently overwriting. **Primary-source provenance:** Jakarta Persistence OptimisticLockException docs.

14. **iv292-at-least-once-idempotent-consumer — D.** At-least-once transport can replay a request after crash, so side-effect handlers require idempotency; broker offset configuration alone does not confer effect-level exactly once. **Primary-source provenance:** Original messaging delivery-semantics and idempotent consumer sources.

15. **iv292-bulkhead-thread-pool-isolation — D.** Bulkheads isolate worker resources per dependency so a stalled downstream cannot consume the entire caller's shared thread pool; timeout/retry alone do not partition resources. **Primary-source provenance:** Azure Architecture Center Bulkhead pattern.

16. **iv292-cap-theorem-misreading-no-partition — B.** CAP's availability-versus-consistency choice concerns network partitions; it is not a universal prohibition on consistency and availability in healthy network operation. **Primary-source provenance:** Gilbert and Lynch CAP formalization.

17. **iv292-circuit-breaker-half-open-state — B.** A half-open breaker allows limited trial calls to test recovery, then returns to closed or open based on results. **Primary-source provenance:** Martin Fowler Circuit Breaker.

18. **iv292-circuit-breaker-vs-retry-backoff — B.** Retry/backoff handles transient failures with controlled attempts; circuit breaking suppresses calls during sustained downstream faults, preventing cascades. **Primary-source provenance:** Martin Fowler Circuit Breaker; Google SRE cascading failures.

19. **iv292-client-timeout-server-succeeded — B.** Client's timeout indicates missing acknowledgement, not evidence server rolled back; retries can duplicate effects and need a stable idempotency key. **Primary-source provenance:** AWS Builders Library — Making retries safe with idempotent APIs.

20. **iv292-distributed-tracing-shared-trace-id — A.** Propagating W3C trace context correlates spans of a distributed request; matching traceId with distinct spanIds allows cross-service critical path diagnosis. **Primary-source provenance:** W3C Trace Context.

21. **iv292-eventual-consistency-visible-bug — B.** A read replica may serve stale values shortly after primary commit, a user-visible eventual-consistency window rather than necessarily failed write. **Primary-source provenance:** Werner Vogels Eventually Consistent.

22. **iv292-hardcoded-instance-ips-service-discovery — B.** Fixed instance IPs break under scaling/failover; service discovery locates currently healthy instances at request time. **Primary-source provenance:** Azure service discovery architectural guidance.

23. **iv292-idempotency-key-retried-post — C.** Retried POST after server-side success can duplicate charges absent server-enforced idempotency key, even if first HTTP response was lost. **Primary-source provenance:** Stripe API idempotent requests.

24. **iv292-read-your-writes-narrower-guarantee — A.** RYW guarantees a writer's later read sees its own write; it does not impose global strong consistency for other clients. **Primary-source provenance:** MongoDB causal consistency read/write concerns.

25. **iv292-saga-choreography-vs-orchestration-tradeoff — C.** Choreography coordinates local transactions through events; orchestration centralizes sequencing/compensating decisions, trading direct coupling for central coordinator complexity. **Primary-source provenance:** Azure Saga pattern.

26. **iv292-saga-orchestration-compensating-actions — B.** Saga reverses completed local steps with compensations after later failures; compensation is not identical to distributed ACID rollback. **Primary-source provenance:** Microsoft Azure Saga architecture.

27. **iv292-two-phase-commit-microservices-problem — A.** 2PC participants can hold transaction locks in prepared state while waiting for a coordinator, reducing availability under failure. **Primary-source provenance:** Microsoft Azure Saga/2PC comparison.

28. **iv292-wall-clock-skew-event-ordering — D.** Clock skew means wall-clock timestamps are not reliable evidence of causal event ordering; use logical causality/context. **Primary-source provenance:** Lamport time and logical clocks.

## Withheld pending source review

Five topics were intentionally not stamped: OSIV and transaction lifetime, ambiguous L2-cache defaults, Flyway locking claim, non-universal server-side LB extra-hop cost, and ZooKeeper minority read behavior before disconnect. These should receive source-only corrections where needed, with separate new digests afterward. Other ongoing source-only corrections are tracked in PR #522 and the recently merged source PR #521; those are not approved by this review.

## Integrity and release gates

No learner content files or `pack.json` are touched. Use canonical V2 digest/checklist per ID. CI must check exact head and an independent Codex read must finish with zero blocking findings. Merge requires SHA lease and green postmerge CI; archive OpenSpec separately. Pack remains DRAFT.

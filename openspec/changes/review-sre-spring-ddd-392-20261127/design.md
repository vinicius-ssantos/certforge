## Individually evaluated editorial decisions — 2026-11-27

The reviewer inspected the twenty-three approved exact prompts, correct alternative, three distractors, each option rationale, overall explanation and original author/vendor source. Independently visited first-party Google SRE, Kubernetes, Oracle and Fowler/microservices references. These entries alone are eligible for content-bound V2 approval.

1. **iv158-cpu-spike-blocked-threads — C.** BLOCKED monitor acquisition explains contention but not CPU execution; the RUNNABLE/background workers require diagnosis. A wrongly equates blocked with spin; B adds contenders; D claims GC evidence not in dump. **Primary reference(s):** Oracle Java SE 21 Thread.State and GC tuning.

2. **iv158-cpu-throttle-container-limits — D.** Kubernetes short-window CPU throttling metrics can reveal latency despite low averaged CPU, while A/B/C do not diagnose throttling. **Primary reference(s):** Kubernetes official resource-management and CPU assignment docs.

3. **iv158-cross-service-trace-correlation — A.** Only a distributed trace with matching downstream spans attributes a specific slow checkout request; B correlates only timestamps, C logs locally, D guesses cause. **Primary reference(s):** Google SRE Monitoring Distributed Systems and Effective Troubleshooting.

4. **iv158-db-lock-retry-storm — B.** Retries amplify contended row-lock queues; backoff/jitter or circuit breaker reduces inflight pressure. A kills one holder, C adds contenders, D increases wait. **Primary reference(s):** Google SRE Addressing Cascading Failures.

5. **iv158-downstream-timeout-cascade — C.** Bound retry budgets and dependency capacity to avoid exhausting shared worker pools; A still permits unbounded retries, B waits on external owner, D only increases pool. **Primary reference(s):** Google SRE Cascading Failures and Handling Overload.

6. **iv158-latency-after-deploy — A.** First correlate an observed latency regression with rollout timestamp and compare changed configuration; B/C/D speculate or add variables. **Primary reference(s):** Google SRE Effective Troubleshooting.

7. **iv158-pool-exhaustion-n-plus-one — B.** Many near-identical SELECTs plus low DB CPU point to N+1 round trips; batch/join at the query source before scaling pools, replicas or failing faster. **Primary reference(s):** Google SRE Effective Troubleshooting; Jakarta Persistence Criteria Fetch.

8. **iv288-configurationproperties-vs-value-type-safety — A.** Grouped type-safe configuration binding and JSR-303 validation are the purpose of ConfigurationProperties; Value does not bind a nested validated bean by itself, manual environment access is unnecessary. **Primary reference(s):** Spring Boot official Externalized Configuration.

9. **iv288-exclude-autoconfigured-datasource — C.** Exclude DataSourceAutoConfiguration explicitly via annotation or spring.autoconfigure.exclude; Primary only chooses bean and empty URL is not an exclusion signal. **Primary reference(s):** Spring Boot official Auto-configuration.

10. **iv288-readonly-transaction-what-it-changes — D.** Transactional(readOnly=true) is a hint to transaction manager/provider and may optimize flushing, not an automatic SQL rejecter or replica router. **Primary reference(s):** Spring Framework official Transactional Javadoc.

11. **iv288-starter-mechanics-debug-report — B.** Starters are dependency aggregators; the Boot conditions evaluation report via debug/actuator explains auto-configuration outcomes. Decompilation or build-time scanning claims are false. **Primary reference(s):** Spring Boot official Build Systems and Auto-configuration.

12. **iv157-ddd-when-excessive-crud — D.** A simple Tag CRUD with DB uniqueness does not justify speculative aggregates/services/repository layers solely for DDD ceremony; A database, B team size, C blanket pattern use are wrong criteria. **Primary reference(s):** Martin Fowler AnemicDomainModel and DDD discussion.

13. **iv157-repository-domain-abstraction — C.** Exposing JPA Specification to domain callers leaks persistence vocabulary; not a universal performance, cache or API correctness issue. **Primary reference(s):** Martin Fowler Repository (PoEAA).

14. **iv157-shared-jpa-entity-risk — D.** Shared mutable JPA entity/table couples Catalog and Inventory schemas and model ownership; it is not inherently deadlock-prone, forbidden by JPA, or prescribed by bounded-context practice. **Primary reference(s):** Chris Richardson microservices.io Database per Service.

## Deliberately unapproved source issues

The concurrent-withdrawal aggregate claim is undergoing separate source-only correction (#517); older Spring MVC method-validation and MySQL default-isolation claims plus non-atomic payment idempotency and overconfident GC leak attribution require correction before V2 signoff. The constructor-injection circular-dependency question must be version-scoped for modern Boot defaults before approval. No approval should ever be inferred from mere presence in the pack.

## Integrity

Use only `content/record-ai-review.mjs`, one invocation per verified question, to compute exact V2 digests against question/pack. Source content and publication state stay unchanged. Follow exact CI/CodeQL, independent Codex, SHA-guarded squash and separate archival OpenSpec phases.


## Additional nine independently reviewed design-pattern questions

Verified against the original author-hosted pattern catalog and the current complete question JSON (all four options and explanations). These decisions extend the fourteen SRE/Spring/DDD items above; they are **not bulk inferred** from the existing answer flags.

15. **iv156-builder-optional-parameters — B.** Builder addresses a combinatorial eight-optional-filter object; a two-required-field immutable value object needs no builder; A/C/D conflate immutability, record construction or validation with builder applicability. **Primary source:** Refactoring.Guru /design-patterns/builder.

16. **iv156-chain-of-responsibility-validation-pipeline — C.** C uses reorderable handlers with reject-or-forward; A fixes call sequence in one class, B selects one check, D invokes observers without stop/short circuit. **Primary source:** Refactoring.Guru /design-patterns/chain-of-responsibility.

17. **iv156-decorator-cross-cutting-caching — D.** D composes independently stackable typed caching/logging wrappers around CatalogService; A subclass multiplication, B boolean flags in core, C unnecessary reflective name dispatch. **Primary source:** Refactoring.Guru /design-patterns/decorator.

18. **iv156-facade-subsystem-simplification — A.** A exposes one simple order-placement entry point covering inventory/pricing/payment/shipping; B adapter requires an incompatible client interface; C mere sequential calls are not CoR; D swappable strategy not requested. **Primary source:** Refactoring.Guru /design-patterns/facade.

19. **iv156-factory-method-vs-constructor — B.** A one-implementation fixed return factory adds speculative indirection; A blanket factory rule, C future interface and D mandatory static-method claims are incorrect. **Primary source:** Refactoring.Guru /design-patterns/factory-method.

20. **iv156-observer-vs-pubsub — C.** For the specifically defined synchronous same-ApplicationContext Spring observer listeners versus durable Kafka topic, only C recognizes broker producer independence from running subscribers; A/B/D obscure the distinct delivery coupling. **Primary source:** Refactoring.Guru /design-patterns/observer; Spring ApplicationContext official reference.

21. **iv156-proxy-vs-decorator — D.** D identifies lazy virtual proxy for controlling subject instantiation versus stackable timing decorator; A/B/C conflate same wrapper structure or incorrectly require java.lang.reflect.Proxy. **Primary source:** Refactoring.Guru /design-patterns/proxy and /design-patterns/decorator.

22. **iv156-repository-vs-dao — A.** A distinguishes Spring Data's persistence convenience from duplicated query/filtering logic across services without domain-facing seam; B equates framework type with architectural boundary, C JDBC-only overstatement, D DTO leaves filtering duplicated. **Primary source:** Martin Fowler /eaaCatalog/repository.html; Spring Data JPA core concepts.

23. **iv156-strategy-payment-conditional — B.** B isolates payment-specific processing in independently composable strategies and replaces swelling branch chain with lookup; A private helpers leave dispatch, C construction factory leaves branches, D mixes data type with algorithm hierarchy. **Primary source:** Refactoring.Guru /design-patterns/strategy.

**NOT APPROVED — iv156-template-method-report-pipeline.** Independent Codex review of PR #520 identified a false contrast: composition with a Strategy can also preserve a fixed load → transform → write sequence if the enclosing ReportJob enforces it. Key C remains a valid Template Method example, but the source explanation incorrectly claims Strategy cannot enforce the sequence; approval withheld until a separate source-only correction and later exact-digest V2 review.

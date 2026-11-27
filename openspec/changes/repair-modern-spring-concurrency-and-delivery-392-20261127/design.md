## Source-only editorial repair evidence

1. **Spring isolation / PostgreSQL.** The original prompt incorrectly described both PostgreSQL and MySQL/InnoDB as typically READ_COMMITTED; MySQL/InnoDB's documented default is REPEATABLE READ. The corrected prompt explicitly scopes PostgreSQL READ COMMITTED and gives a precise separate SELECT plus unguarded arithmetic UPDATE example. Correct answer B now includes SERIALIZABLE with serialization failure retry, row lock before read/check, or atomic conditional UPDATE. Primary sources: PostgreSQL https://www.postgresql.org/docs/current/transaction-iso.html and MySQL https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html; original Spring @Transactional Javadoc retained.

2. **Spring MVC 6.1+ method validation.** The original question incorrectly required class-level `@Validated` for directly constrained `@RequestParam`. Spring MVC 6.1 added native method validation when a Bean Validation provider is configured; class-level `@Validated` selects an AOP-based route instead. The corrected B is version-scoped and accurate; primitive `long` still supports `@Min`. Primary source: Spring Framework official MVC validation https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html; original core validation guide retained.

3. **Charge idempotency.** The original correct C described checking/recording a key prior to effect without explicitly requiring atomicity; this could still race with concurrently redelivered messages. C now requires durable uniqueness plus atomic coordination with charge, or payment-provider idempotency semantics. Prior Google SRE references retained. The answer remains C and no review record is created.

4. **GC old-gen occupancy.** A rising post-full-GC floor shows retained live-set growth but could represent intentionally expanding cache or changing workload rather than definitively unused objects. D and its rationale now prescribe repeated heap histograms/dumps and retained-object analysis to distinguish a leak. Existing Oracle Java SE 21 GC/troubleshooting references retained.

## Strict separation

No `review.json`, `pack.json`, question keys, human signoffs, publication metadata or deployment changes are in this source-only change. Recomputed V2 digests (if approved) can only be added by a subsequent independent review PR after merge.

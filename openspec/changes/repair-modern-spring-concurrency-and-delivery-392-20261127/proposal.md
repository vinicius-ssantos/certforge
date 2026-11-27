## Why

Issue #392's backlog includes four questions with technically imprecise or outdated statements. Their current source text must be corrected before any individual V2 approval. No human or AI editorial signoff is permitted in this source-only PR.

## What changes

- `iv288-transactional-isolation-level-default-wrong`: remove wrong claim that MySQL/InnoDB usually defaults to READ_COMMITTED; specify PostgreSQL READ COMMITTED and the concrete unguarded arithmetic UPDATE causing the stock race; require SERIALIZABLE with retries, row locking, or guarded update.
- `iv288-valid-vs-validated-nested-group`: remove pre-Spring-6.1 assumption that class-level `@Validated` is required for controller constraints; test built-in MVC method validation introduced in 6.1 and distinguish the alternative AOP route.
- `iv158-queue-backlog-duplicate-charges`: clarify idempotency-key handling must be atomic with charge or be enforced by a payment provider, not naive non-atomic check-then-charge.
- `iv158-heap-growth-old-gen`: describe retained live-set growth as potential leak/cache, not proof that all retained objects are unneeded; compare heap histograms/dumps.

All four correct answer keys remain B, B, C, D respectively; all learner-facing revisions are followed by independent V2 review only after source correction integration.

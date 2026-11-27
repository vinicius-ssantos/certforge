## Why

Issue #392's `iv157-protect-invariant-aggregate` currently claims that checking sufficient funds and updating a balance inside one ordinary transaction is enough to guarantee correct concurrent withdrawals. That can lose a committed debit under common isolation levels if two transactions read the same stale balance. The pre-existing `APPROVED` count on `main` excludes this question; it must not be signed off until the learner-facing claim is fixed.

## What changes

- Clarify that every successfully committed withdrawal must be reflected in the final balance, besides the balance never becoming negative.
- Preserve gabarito B but explicitly require optimistic version conflict detection/retry with fresh balance or pessimistic row locking before check; update the explanatory text and the incorrect A alternative's limitation.
- Add original source documentation from Spring Data JPA locking and PostgreSQL transaction-isolation docs, retaining Fowler's DDD Aggregate reference.
- Do not alter `review.json`, do not issue an AI or human approval, do not publish the DRAFT pack.

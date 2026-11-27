## Technical correction evidence (no review verdict)

**Prior problem:** `withdraw(amount)` plus a regular transaction, without explicit concurrency protection, is not enough when two transactions read an old account balance and independently write new balances. A CHECK constraint may prevent a negative stored number, yet cannot by itself guarantee that two successful debits are both accounted for when stale values overwrite each other. This is the lost-update hazard.

**Corrected key B:** The aggregate root owns the balance invariant. To make concurrent withdrawals safe, persistence must serialize or reject conflicting read-modify-write sequences: lock the account row pessimistically *before* checking the balance, or use optimistic version checking and retry the operation against a freshly loaded balance on conflict. The application treats a withdrawal as successful only once the transaction commits. An isolated ordinary transaction is not claimed to be sufficient.

**Other alternatives:** A's unconstrained public setter plus CHECK alone does not guarantee correct debit accounting. C applies first and validates afterward; D checks outside the aggregate root and allows other callers to bypass validation.

**Original sources:**
- Martin Fowler, *DDD_Aggregate*, `https://martinfowler.com/bliki/DDD_Aggregate.html` — entry point and invariants.
- Official Spring Data JPA Reference, *Locking*, `https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html` — lock modes for repository query methods.
- Official PostgreSQL Documentation, *Transaction Isolation*, `https://www.postgresql.org/docs/current/transaction-iso.html` — READ COMMITTED update visibility and serialization semantics.

**Editorial gate:** This PR changes source content and technical references only; it SHALL NOT create or modify any `review.json` record. Independent subsequent review must inspect this exact new content and compute a fresh V2 digest before approval.

## ADDED Requirements

### Requirement: Account withdrawal interview question SHALL describe concurrency-safe aggregate invariant enforcement

The `iv157-protect-invariant-aggregate` source SHALL distinguish aggregate invariant checking from concurrency control. Correct answer B SHALL require either a lock acquired before reading the balance or an optimistic version conflict and retry with fresh state. The source correction SHALL retain key B and SHALL NOT record an AI or human approval.

#### Scenario: Two simultaneous withdrawals on one balance

- **GIVEN** two concurrent requests read the same initial account balance
- **WHEN** either attempts to commit a stale debit
- **THEN** the stated design uses row locking or an optimistic version conflict with retry against fresh state to prevent success based on stale balance.

#### Scenario: Editorial integrity

- **GIVEN** one learner-facing question is edited
- **THEN** its future AI review digest SHALL be generated only in a later separate review PR after the source correction is integrated.
- **AND** the pack remains DRAFT and the human acceptance gate remains open.

## Why

On exact `main` source commit `3130acc0f90331919a66616bed2c67d613260e07`, issue #392 has 121/208 approved individual V2 records. Twenty-eight additional Hibernate/JPA and distributed systems questions have individually checked technical answers and original primary sources. Five other related questions were deliberately excluded because their explanations are ambiguous, framework-dependent or inaccurate.

## What changes

- Record exactly 28 independent `ai-reviewer` V2 APPROVED records using canonical `content/record-ai-review.mjs`, against the exact current question and pack digests.
- Preserve all question source JSONs, answer keys, existing reviews, pack manifest and DRAFT status.
- Explicitly exclude `iv290-dirty-checking-no-explicit-save` (transaction/OSIV qualifier), `iv290-first-level-vs-second-level-cache-scope` (cache configuration assumption), `iv290-migration-idempotency-concurrent-startup` (Flyway locking-disable claim), `iv292-client-side-vs-server-side-load-balancing` (network-hop generalization), `iv292-cp-system-partition-scenario` (minority ZooKeeper reader may briefly serve until disconnect). These require further checking and possibly source correction.

## Impact

After merge: 149/208 individually approved (71.6%), leaving 59 pending. No human signoff, publication, deployment or automatic issue closure. Issue #392 and human UX/accessibility #428 stay OPEN.

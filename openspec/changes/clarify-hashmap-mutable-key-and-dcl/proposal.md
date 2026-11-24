## Why

Issue #392's individual technical review revealed two unreviewed Java interview questions that could be interpreted too broadly: a mutable HashMap key was not clearly shown to change its bucket, and a broken double-checked locking example didn't specify the non-final state for which the unsafe-publication observation is relevant. Accurate questions must avoid accidental alternate readings before recording V2 review approvals.

## What Changes

1. Clarify that a `CacheKey` mutation changes the hash selecting a **different bucket index** without an intervening rehash; explain why lookup by the same reference then fails. Add official Java SE 21 HashMap Javadoc to existing Map and Object references. Preserve key C.
2. Clarify that `Helper` has an ordinary non-final `state` initialized to 42; an unsynchronized reader can see non-null `helper` but stale/default state 0. Update correct option C and explanations, explicitly distinguishing JLS §17.5 final-field semantics and modern safe-publication solutions. Preserve key C.

## Impact

Two unreviewed question sources plus this OpenSpec change. Do not update `review.json` or the pack metadata in this correction PR. The pack remains DRAFT; no deployment, publication or human editorial sign-off.

## Why

Issue #392 tracks the 208-question Java backend interview DRAFT pack. After PR #445 merged, 32 individually AI-reviewed questions have V2 source-matched verdicts, leaving 176 unreviewed. A separate set of six Java 21 concurrency, resource-management and priority-queue questions was independently checked against the JDK 21 API, JLS 21 and Oracle Java documentation. No bulk approval is implied.

## What Changes

Record exactly six new AI-attributed V2 source digests for these individually verified questions in this explicit order:

1. `iv286-reentrantlock-vs-synchronized` — B.
2. `iv286-synchronized-happens-before` — A.
3. `iv286-system-gc-no-guarantee` — B.
4. `iv286-stream-laziness-short-circuit-infinite` — A.
5. `iv286-deadlock-inconsistent-lock-order` — B.
6. `iv154-heap-priority-queue` — D.

No question source text, original review verdicts or pack metadata changes. Record accurate `ai-reviewer` attribution, no invented human sign-off.

## Impact

The only content edit is `content/java-backend-interview/review.json`, with this scoped OpenSpec change. On merge, 32 reviewed becomes 38 out of 208; 170 remain unreviewed. The pack remains `DRAFT`, issue #392 stays open and there is no deploy/publishing.

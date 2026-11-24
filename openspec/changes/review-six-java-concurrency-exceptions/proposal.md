## Why

Issue #392's 208-question Java backend interview pack must receive genuinely verified per-question decisions before editorial publication. Three scenario defects were corrected in merged PR #443. Three other questions were cross-checked against Oracle's Java SE 21 API and Oracle Java Tutorials and, where applicable, executed on JDK 21.

## What Changes

Record six distinct `AI_APPROVED` entries, each with the current source-bound V2 digest and `ai-reviewer` attribution: polymorphism (B), JUnit fixture isolation (C), volatile compound-increment atomicity (B), try-with-resources suppressed exceptions (D), streams single-use (D), and checked versus unchecked exception recoverability (C).

## Impact

Only `content/java-backend-interview/review.json` and OpenSpec records. Existing 26 recorded decisions remain untouched; pack stays DRAFT and #392 remains open. When and only when integrated this batch increases current recorded reviews to 32/208, leaving 176 unreviewed. No deploy or editorial publication.

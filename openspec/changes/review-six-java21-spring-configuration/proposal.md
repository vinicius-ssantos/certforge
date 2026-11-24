## Why

Issue #392 still has 168 unreviewed Java backend interview questions after the merged PR #449 (40/208 approved). The fast lane requires individual, technically justified source-bound AI review, not mass approval. Six unreviewed Java Collections/Spring Boot questions were evaluated against first-party Oracle Java SE 21 API and official Spring Framework/Boot reference documentation. Full prompts, four options, distractor explanations, and rationale were checked individually.

## What Changes

Record precisely six current V2 SHA-256-digest `AI_APPROVED` entries under truthful `ai-reviewer` attribution, in this explicit order:

1. `iv286-arraylist-vs-linkedlist-access-pattern`: **B**.
2. `iv288-self-invocation-bypasses-transactional-proxy`: **B**.
3. `iv288-profile-specific-bean-missing-from-active-profile`: **B**.
4. `iv288-component-scan-bean-not-found`: **B**.
5. `iv288-property-source-precedence-env-vs-yaml`: **C**.
6. `iv288-transactional-propagation-required-vs-requires-new`: **B**.

## Impact

Only `content/java-backend-interview/review.json` and this OpenSpec change. All existing 40 review entries and all question files remain unchanged; `pack.json` remains DRAFT. Upon merge, reviewed count increases to 46 of 208 with 162 pending. Issue #392 must remain OPEN. Human UX acceptance issue #428 remains separate and open. There is no package publication, release or deploy.

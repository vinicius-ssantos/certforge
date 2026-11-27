## Why

Issue #392 requires independently verified, exact-digest AI reviews of each Java backend interview question. `main` holds 75/208 approved questions as of `e926fcd5`; these four have no current recorded review.

## What changes

- Individually source-check `iv152-duplicated-validation-single-source`, `iv152-premature-abstraction-future-proof`, `iv152-tight-coupling-concrete-dependency` and `iv155-contract-testing`.
- Record four disclosed `ai-reviewer` V2 verdicts only after confirming each answer key, all three distractors, the explanation and original author references.
- Preserve the question files, answer keys, `pack.json` `DRAFT`, human accessibility gate #428 and all deploy/publishing boundaries.

Nothing in this change declares the full issue #392 complete or substitutes AI review for a human accessibility sign-off.

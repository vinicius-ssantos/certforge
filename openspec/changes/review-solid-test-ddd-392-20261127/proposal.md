## Why

Issue #392 has 79 individually approved AI-reviewer V2 questions against 208 on commit `768c6ec6db4b216adb8d771c605506c0e90b736d`. Twenty additional questions about SOLID, simplicity, testing and DDD have had their prompts, all four options, explanations and primary vendor/author references reviewed individually; their current V2 entries are absent.

## What changes

- Record twenty individual `ai-reviewer` APPROVED verdicts only for the listed question IDs and their exact canonical V2 digests.
- Preserve every question, answer, explanation, reference, and `pack.json` DRAFT metadata; source descriptions below document case-by-case verification.
- Exclude `iv157-protect-invariant-aggregate`: its current explanation mistakenly implies that wrapping balance check + debit in a transaction guarantees correctness under concurrent withdrawals, ignoring lost-update hazards without concurrency control. It must receive a source-only correction before an eventual V2 signoff.
- Keep issue #392, human UX/a11y acceptance issue #428 and all publication/deployment gates open.

## Impact

After integration this batch would bring approved coverage to 99/208 (47.6%), leaving 109 pending. No bulk waiver, content publication or deploy.

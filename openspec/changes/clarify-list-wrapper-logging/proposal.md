## Why

Issue #392 requires genuine technical verification of every unreviewed Java backend interview question. Review of `iv150-composition-over-inheritance` found a correctness gap: claiming that forwarding `add` and `addAll` captures **every** addition ignores other `List` mutators and writable views.

## What Changes

Clarify option A, answer reasoning, and cite Java SE 21 `List`/`ListIterator` contracts. Keep the correct answer A. Preserve the interview pack in `DRAFT` without silently granting an AI approval.

## Impact

One unreviewed question source and this OpenSpec change. No user data, deploy, review.json mutation or automatic publication.

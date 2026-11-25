## Why

Issue #392 requires individual, source-bound reviews for 208 Java backend interview questions. Correction PR #458 fixed Mockito spy copied-state behavior but independent Codex P2 on editorial PR #471 uncovered a remaining learner-facing ambiguity between the **classic Meszaros/Fowler recording-stub test spy** and **Mockito.spy(existingObject)**. The Mockito review was removed from #471; PR #472 then separately repaired the actual prompt, correct answer and rationales without recording approval. Correction #472 squash-merged into main as `606071c2bc9f2e96de5b7abf00ef4c5baee9663b`, after all 8 CI/CodeQL checks and a clean Codex review.

## What Changes

Independently review the exact *post-#472 merged* `iv155-mock-stub-fake-spy` source and add **one** source-bound V2 verdict:
- Unique correct answer **D** now explicitly scopes the spy to `Mockito.spy(existingObject)`, whose unstubbed real methods execute on the spy's copied state and do not forward to the supplied original.
- The prompt explicitly distinguishes Meszaros/Fowler's classic recording-stub test spy; the wrong options A/B/C, their rationales and all full explanations were independently rechecked.
- Reviewer is disclosed as `ai-reviewer`; the new digest matches the exact main source and all **54** prior approvals remain unchanged.

## Boundaries

Only a single new `review.json` entry and this OpenSpec; no question, pack metadata, application, CI, publication, deployment or human-acceptance edits. Once merged, **55/208** individually source-reviewed, **153 pending**, issue #392 remains OPEN, `editorialStatus` remains DRAFT. User accessibility evidence issue #428 is unchanged and open.

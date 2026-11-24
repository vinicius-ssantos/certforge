## Technical source correction

- [x] Read both unreviewed questions including all distractors and reasons.
- [x] Check mutable-key semantics in Oracle Java SE 21 Map/HashMap and hashCode contracts.
- [x] Use JDK 21 to confirm different-bucket hash mutation results in failed get and unchanged map size.
- [x] Clarify key mutation/bucket assumptions and add first-party HashMap reference; preserve key C.
- [x] Check broken DCL with JSR-133 expert group and JLS SE 21 §§17.4–17.5.
- [x] Scope Helper to non-final state and update answer C to precise visibility semantics.
- [x] Leave both review.json entries absent and the interview pack DRAFT with no deployment.
- [x] Confirm all CI/CodeQL/strict OpenSpec checks and review for the correction PR.
- [x] Merge the repair, separately review exact new V2 digests and archive OpenSpec after that work completes.

### Completion and integration evidence — 2026-11-24

- PR #448 was squash-merged into `main` with all eight required Java/Web/Playwright/release-image E2E/security/CodeQL checks successful and no unresolved blocking review comments.
- Exact individually attributed `ai-reviewer` V2 review entries were recorded separately from source repairs: editorial PR #447 for six Java 21 questions; PR #448 only corrected two sources; PR #449 reviewed those two post-repair sources. No human approval is implied.
- Issue #392 remains OPEN with 40/208 reviewed and 168 pending. The interview pack stays `DRAFT`, no deployment or publication; UX/E2E human acceptance issue #428 remains OPEN and separately active.

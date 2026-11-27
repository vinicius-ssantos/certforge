## Implementation

- [x] Identify remaining two Wikipedia-only question reference arrays.
- [x] Verify head-insertion complexity against University of Toronto original teaching material.
- [x] Verify domain-service terminology using Martin Fowler and InfoQ DDD primary expert/publisher sources.
- [x] Update references only, preserving answer keys A/A, body and editorial status.
- [x] Validate strict OpenSpec, clean diff and content integrity tests.
- [x] Exact-head CI/CodeQL and independent Codex review, then squash merge source-only fix.
- [x] Independently review each merged question and record its own V2 verdict/digest.
- [x] Archive OpenSpec after all source/review integrations.

## Completion evidence — 2026-11-26

- Source-only PR #504: SHA-pinned squash `84904d6d533daf405b0ad1a0d86fcb5925370536`, 8/8 CI/CodeQL successful, independent Codex review with zero findings and unresolved threads. Correct keys A/A preserved; only references arrays modified.
- Individually source-checked V2 PR #505: exact branch SHA `0887fd89117ccd53d1ea289ee6881457b0955354`, 8/8 CI/CodeQL successful, Codex complete without findings or unresolved threads; SHA-pinned squash `76019953688428a1733e645cef1aa589008e0e35`.
- `iv154-linked-list-vs-array-insert`: A, `ai-reviewer` APPROVED, digest `sha256:5ed9ca6e1afd6e53b26fb413872ee3f355659f4f55c9786f1822556603fde619`. University of Toronto course notes on O(1) head insertion versus O(n) array shifts.
- `iv157-domain-service-when-needed`: A, `ai-reviewer` APPROVED, digest `sha256:9bab0d8a6dd0c4a31660d29338b3b654ae6eee7772619bb24e2b923eb3019eac`. Martin Fowler Evans Classification and InfoQ original publisher reference; business-domain rules spanning two aggregates.
- Local review-integrity tests: 15/15 passed and diffs clean; **73/208** individual V2 approvals, **135 pending**. Pack `DRAFT` and issue #392 OPEN. Human UX/a11y gate #428 not modified. No content publication/deploy and no fabricated human signoff.

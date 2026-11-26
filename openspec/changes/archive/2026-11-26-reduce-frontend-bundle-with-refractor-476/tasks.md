## Measured implementation and verification

- [x] Reproduce exact current main gzip total: 217,086/217,088 bytes (2 bytes spare).
- [x] Reproduce combined React Router 8.5.2 + React Query 5.108.2 regression: 217,321/217,088 bytes (233 bytes over).
- [x] Rule out Terser substitution and nonfunctional code-splitting tweaks as insufficient/worse.
- [x] Identify Refractor/Prism AST and remove unnecessary syntax-highlighter rendering layers while retaining four grammars.
- [x] Replace the highlighter with a safe escaped React token renderer and remove obsolete package and TypeScript types.
- [x] Verify unchanged strict 155/212 KiB budgets: 213,508 bytes with existing versions; 213,775 bytes with both future dependency upgrades.
- [x] Confirm final targeted YAML/HCL + existing Prompt regression suite, full lint/types/unit tests and OpenSpec strict validation.
- [x] Confirm 8/8 fresh CI/CodeQL/Maven/Web/Playwright/release-image/secret-scan checks on exact renderer PR #477 head `3c028767f0795e6b947fd2d0576a1e2dcf75f31c`, and completed GitHub Codex review with 0 findings and 0 unresolved threads.
- [x] Squash-merge renderer-only PR #477, then separately rebase, revalidate and squash-merge both Dependabot PRs #467 and #469 under independent exact-head 8/8 CI and Codex review. Keep #476 OPEN until this archival PR is merged and verified.
- [x] Prepare completed OpenSpec archive and permanent `web-bundle-performance` specification in a documentation-only PR; keep issue #428 OPEN for actual human accessibility evidence and do not deploy.

### Verified integration and superseded patch-version note — 2026-11-26

- PR #477 (`3c028767f0795e6b947fd2d0576a1e2dcf75f31c`) independently reviewed by GitHub Codex (`completed`, 0 findings, zero unresolved) after 8/8 CI, squash-merged as `318c01b68c7aeb2f8985c918d45f8f1e98c82afb`. The post-merge main CI also passed 8/8.
- Dependabot PR #467 (React Router `8.5.2`) rebased as `711b31d4cd2ca7edb43cbb7658628ebb12a6ce26`; 8/8 exact-head CI, clean completed Codex, zero unresolved; squash-merged as `f55a82e4b6074579d53ef6bdda8ec653eb474606`. Post-merge main CI also passed 8/8.
- Dependabot PR #469 originally targeted React Query `5.108.2` but automatically rebased to **`5.108.4`**. The final exact head `d0e2196c8339c079a2021a37e15dcc95613a8761` passed 8/8 CI and completed Codex review with 0 findings and zero unresolved; squash-merged as `d5a38c9b796b92d2ac50772933fa58c6493dd5b4`. All previous local `5.108.2` calculations are historical, not release evidence for `5.108.4`.
- On the final Router `8.5.2`, Query `5.108.4`, Refractor `5.0.0` combination, independently ran lint, typecheck, 355 unit tests, production build, npm clean install, API contract, and OpenSpec strict 10/10. **Exact total JS gzip `213,778 / 217,088` bytes**, **3,310 bytes** margin (initial 153.0 KiB vs 155 KiB). JS budgets were never increased.
- Because Dependabot advanced the accepted Query patch version, this archival PR adjusts **only the archived delta scenario** from `5.108.2` to `5.108.4` and promotes that truthful version into the permanent specification. Historical proposal/design and initial regression measurements are preserved unchanged for audit traceability.
- Archival is docs-only. Close #476 **only after** the archive PR passes CI/Codex and merges. #392 interview pack remains DRAFT; #428 human device/assistive-technology acceptance remains OPEN; no deploy/release/content publication.

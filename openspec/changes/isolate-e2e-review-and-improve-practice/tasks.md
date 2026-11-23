## Implementation
- [x] 1.1 Independent review project and database; retain release volume.
- [x] 1.2 Independent local E2E project, explicit API URL and manual fixture-seeding guard.
- [x] 1.3 Obvious, accessible catalogue search disclosure.
- [x] 1.4 Track/topic orientation in practice sessions.
- [x] 1.5 Timed, nonpersistent resume notifications in practice/mock.
- [x] 1.6 Regression tests and docs.
- [x] 1.7 Disable unavailable certification-topic actions when the published count is known to be zero.
- [x] 1.8 Clarify empty states: non-misleading home action, track-level notice, single source-language note.
- [x] 1.9 Learner-safe general-topic published counts with regression tests, enabling/disabling practice per topic.
- [x] 1.10 Activate existing DevOps taxonomy in isolated review via the audited catalog API.
- [x] 1.11 Publish only digest-verified AI approvals in isolated review (104 Java, 30 DevOps); retain 46 Java and 70 DevOps human sign-offs without fabricating account-level reviews.

## Verification and review
- [x] 2.1 Backend `just test-backend`, TypeScript, lint, 318 frontend tests, API contract, production build and JS/CSS budgets pass locally. Earlier E2E on a separate disposable project: 55 passed, 17 skipped; latest E2E awaits PR CI.
- [x] 2.2 Review stack starts separately with zero questions and distinct volume; release data remains intact.
- [x] 2.3 Browser inspection at 320px, 390px and desktop, including the published Java and DevOps track (10 Java topics enabled, 5 DevOps topics enabled, 5 unavailable) with 0 axe violations and no 390px overflow; physical phone and real screen reader acceptance remains separate under #428.
- [ ] 2.4 Latest CI and reviewer acceptance; sync and archive only afterward.

## Follow-up: owner-reviewed topic availability (2026-11-22)
- [x] 3.1 Confirm the two disabled Java topics have 15 current, digest-matched owner APPROVED questions each and are genuinely absent from :8082.
- [x] 3.2 Import just t01/t02 through the restricted, opt-in, audit-disclosed ADMINISTRATOR self-review flow; do not invent another reviewer or relax domain approval checks.
- [x] 3.3 Verify 164 PUBLISHED total, 15 each in t01/t02, idempotent repeated importer runs, and both buttons enabled via authenticated browser at 390px.
- [x] 3.4 Add content tests to the CI-tested content/*.test.mjs group and record exact provenance in the review environment handoff.
- [ ] 3.5 Confirm latest PR #430 CI and human acceptance before OpenSpec archive.

## Follow-up: cohesive tertiary navigation (2026-11-22)
- [x] 4.1 Style dashboard queue/progress and History active-session links as neutral tertiary product actions using existing design tokens and 44px targets.
- [x] 4.2 Preserve native anchor semantics, accessible names and visible keyboard focus; use subdued hover and forced-colors contrast.
- [x] 4.3 Add regression tests for original destinations, link semantics and visual-action grouping.
- [x] 4.4 Verify light/dark mobile and desktop screenshots and local web quality gates; no horizontal overflow, 0 axe violations, computed 44px targets and neutral ink colors.
- [ ] 4.5 E2E/CI and human review gate before sync/archive.

## Follow-up: eliminate manual E2E browser/API cross-target (Codex P2)
- [x] 5.1 Use one validated disposable E2E API target for seeding and local preview proxy, with no implicit release proxy fallback under opt-in.
- [x] 5.2 Refuse release/review/remote endpoints, mismatched external browser/API ports and unknown existing preview listeners before writes; retain GitHub Actions' ephemeral stack behavior.
- [x] 5.3 Add safety tests and document the supported isolated run commands.
- [x] 5.4 Run 29 safety regression cases, reject unqualified CLI before setup, verify manual preview without E2E_BASE_URL on disposable :8086 (2 desktop/mobile passes), and run the full isolated E2E suite (57 passed, 17 skipped); TypeScript, ESLint, 349 web tests, build/budgets and strict OpenSpec pass.
- [ ] 5.5 Verify GitHub CI/CodeQL on the new head, respond to/resolve the P2 review thread and obtain separate human UX acceptance before OpenSpec archive.

## Follow-up: reject frontend dev proxy as E2E API (Codex P2)
- [x] 6.1 Replace the unsafe local API-port denylist with an allowlist requiring the disposable Compose API :8086.
- [x] 6.2 Add regression cases for Vite dev proxies :5173/:5174 and arbitrary alternate ports, even when the browser uses the permitted :8083 stack.
- [x] 6.3 Update run documentation and OpenSpec to prohibit arbitrary local API ports; continue to distinguish port validation from verifying the underlying backend identity.
- [x] 6.4 Validate the developer proxy :5173 rejection, approved :8086 browser smoke (desktop/mobile), 353 web tests, TypeScript, ESLint, bundle budgets and strict OpenSpec locally.
- [ ] 6.5 Confirm latest GitHub CI/CodeQL, respond to the second P2 review thread and obtain separate human UX acceptance before merge/archive.

## Follow-up: touch targets in table navigation
- [x] 7.1 Review 39 authenticated route/viewport samples; distinguish unconfirmed contrast on gradients/overlaps from actual violations.
- [x] 7.2 Improve hit areas of table-heading, back-navigation and progress-review anchors without affecting inline prose links or routes.
- [x] 7.3 Add a computed-height/color Playwright regression for history row links.
- [ ] 7.4 Validate updated review browser, build/CI and human acceptance for actual devices, screen readers and native forced colors.

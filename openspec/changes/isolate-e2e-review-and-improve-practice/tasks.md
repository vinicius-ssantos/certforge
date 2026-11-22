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

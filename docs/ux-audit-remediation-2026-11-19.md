# UX/UI audit remediation — 2026-11-19

Implements the 22 findings from `CertForge_Auditoria_UX_UI_2026-11-19.pdf`, audited against main `12533f1e062c20d7759f8009dfa95c6270beb6a1`. OpenSpec change: `remediate-ux-audit`. Visual tokens, reviewed content and backend contracts remain the basis of the implementation.

## Point-by-point traceability

| Finding | Implemented decision | Evidence |
| --- | --- | --- |
| UX-01 | Recover failed/empty interview prerequisites separately from dependent queries. Retry the failed catalogue; explain unavailable plan tracks. | EvidencePage, BlueprintPage; four empty/503 recovery tests |
| UX-02 | Keep guided writing in session memory through reference comparison; warn before discard; clear on advancement, closure, expiry or session change. Never serialize the writing. | GuidedItem, InterviewSessionPage; privacy/request and navigation tests; browser comparison and discard focus |
| UX-03 | Expose native radio/checkbox indicators in choices without letter badges, including concept lists. Keep native semantics, click labels and forced-color handling. | styles.css; browser option/concept inspection and selection navigation; assistive-technology acceptance remains manual |
| UX-04 | Collapse the question map on narrow screens, expose its current position and return focus to the selected question. Keep the desktop map. | MockExamPage; 320/390 CSS-pixel browser viewports, selection retained through map navigation |
| UX-05 | Remove unsupported weight-editing promises. Explain that unmapped requirements are outside the plan and link to topic selection. | EN/PT copy, BlueprintPage; existing plan tests |
| UX-06 | Link every evidence topic to a preselected interview topic. State that the summary cannot reopen the original answer. | EvidencePage, InterviewsPage; contextual topic test |
| UX-07 | Distinguish completion from abandonment in both languages. | EN/PT session labels; existing completion tests and browser reference screen |
| UX-08 | Count nonempty pending drafts matching the current revision at delivery. Offer recovery without sending or saving them. | MockExamPage, Confirm; recovery/no-POST tests, including focus when already on that question |
| UX-09 | Initially focus cancellation and restore trigger focus on cancel. Recovery actions retain their own destination focus. | Confirm; unit tests and updated keyboard/publishing E2E assertions |
| UX-10 | Deep-link progress to specific topic anchors, focus asynchronously loaded targets, and carry misconception topic/reason into review URLs. | ProgressPage, TrackPage, GeneralTrackPage, ReviewPage; topic-link and URL-filter regression tests |
| UX-11 | Describe reaching the practice target rather than mastery; place correct/attempted counts with accuracy. | EN/PT labels, ProgressPage; progress regression test and mobile inspection |
| UX-12 | Simplify mock instructions, interview topic names, evidence introduction and plan caveat while retaining privacy, scoring and hiring limits. | EN/PT catalogues; tests retain explicit limitation checks |
| UX-13 | Apply the existing 44px touch token to small actions and numeric/search fields; associate the interview count with its range hint. | styles.css, InterviewsPage; DOM/visual review |
| UX-14 | Render decision tables as labelled rows on narrow screens, retaining table/row/header semantics and primary topic actions. | ProgressPage, MockExamResultPage, ScrollableTable; browser widths and CTA bounds |
| UX-15 | Put empty availability before the overview; suppress explore and empty overview unless a real continuation/review action exists. | TracksPage; empty-catalogue regression |
| UX-16 | Present explanation before optional verification disclosure, omit empty evidence, and reduce explanation typography. | AnswerFeedback; existing feedback/evidence tests |
| UX-17 | Add a local unsaved prompt preview using the learner renderer and section navigation. Keep validation, dirty blocker and explicit save. | RevisionEditor; preview/no-POST test and existing editorial suite |
| UX-18 | Expose an optional safe installation support URL; explicitly state its absence and direct visitors to their invitation/address sender. | LoginPage, web/README.md; anonymous-help regression; no account recovery service added |
| UX-19 | Make the brand a link to home for authenticated users and sign-in for visitors. | Layout; anonymous brand-link test and browser navigation |
| UX-20 | Include the first nonempty prompt line, bounded to 90 characters, alongside the revision in the page heading/title. | QuestionPage; updated content/revision assertions in unit and E2E sources |
| UX-21 | Add a collapsed name/provider catalogue search with clear and no-match recovery. | TracksPage; provider and no-match regression |
| UX-22 | Group result score, interpretation and details compactly; offer a direct link to topic follow-up inside the score panel. | MockExamResultPage, styles.css; browser result/CTA inspection |

## Validation

- Frontend suite: 314 tests, 28 files passed. Added 13 regression cases beyond the audited 301-test baseline.
- Lint, TypeScript including E2E sources, production build, API type drift and existing bundle budgets pass. No dependency or budget increases. Final measured gzip: initial JS 152.6KB / 155KB, total JS 211.4KB / 212KB, CSS 8.2KB / 12KB.
- OpenSpec strict validation passes. Deltas remain active for review; no archival or human acceptance is claimed.
- Browser QA used the production build with an isolated synthetic API, never production learner data. The mock question heading began at y=447px in the 390px frame and y=497px in the 320px frame, within the 844px first viewport. Native scrollbars leave 375/305px content widths respectively.
- Map navigation returned focus to the question and retained its selection. Guided comparison displayed the original writing and reference together; attempting to leave focused the safe stay action. Evidence 503 ended in retry; empty catalogue ended in an explicit empty state.
- At 390px, progress and result documents had equal scroll/client width (375px). The result practice action was entirely visible horizontally (x=234..345px). The score interpretation and topic follow-up are grouped.
- One browser axe scan of the dependency-error state reported 0 violations (23 passing checks, 0 incomplete). This limited scan does not establish complete accessibility conformance.

## Deliberate boundaries and review

Weight editing/mapping (UX-05) is resolved using the audit's permitted alternative: honest copy and the existing topic-practice path, not a new editor. Evidence cannot retrieve original guided writing (UX-06), which has never been sent; the interface states this limitation. Support configuration is public build-time configuration, not a password reset endpoint.

The 320/390 checks use real browser iframe CSS viewports, not physical phones. Screen-reader, operating-system forced-colors and full device/browser-matrix acceptance remain human review items. Existing backend-integrated E2E scenarios were updated where wording/focus changed; their execution belongs to CI and is not claimed by the local component suite. Human visual acceptance remains unchecked in OpenSpec. No content publication, merge, release or deployment is performed by this change.

## Rollback

Revert the frontend remediation commit and its documentation. There is no database migration, new persisted data or API change to reverse.

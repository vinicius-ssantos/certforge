# UI redesign accessibility evidence

Generated for the `feat/ui-redesign` work on 2026-10-08.

This document refreshes the accessibility evidence invalidated by the full visual redesign. It does
not rewrite the historical `v0.1.0` or `v0.2.0` readiness records: those documents describe what
was checked for those releases at the time. This evidence describes the redesigned interface that
has not been merged yet.

## Automated evidence refreshed

The redesigned interface was exercised against an isolated release-like Docker stack so the normal
local CertForge instance and its data were not modified.

- `just check`: **passed**.
  - backend/unit/integration checks completed successfully;
  - web unit suite: **179/179 passed**;
  - TypeScript strict typecheck, including E2E sources: **passed**;
  - ESLint: **0 errors**, with the pre-existing `react-hooks/exhaustive-deps` warning in
    `MockExamPage.tsx`;
  - production build: **passed**;
  - bundle budget: **144.0 KB JS gzip / 170 KB**, **5.9 KB CSS gzip / 12 KB**.
- Playwright against the isolated release stack: **42 passed, 16 intentionally skipped, 0 failed**.
  The exercised suite covers desktop and mobile, axe, keyboard operation, reflow and accessibility
  tree assertions.
- The redesign itself exposed two accessibility regressions and the tests caught both:
  1. the first segmented-control treatment visually hid the native confidence radios in a way that
     made direct programmatic activation impossible; the native input now covers the full segment
     transparently while retaining semantics and keyboard behavior;
  2. horizontally scrollable mobile data tables were not keyboard-focusable. Wide tables now use a
     shared `ScrollableTable` component whose named scroll region is a keyboard focus stop.
- The full screenshot set in `docs/release/screenshots/` was regenerated after those fixes:
  **15/15 screenshots**.

## What the screenshots now cover

The regenerated evidence includes sign-in, tracks, track detail, study question on desktop and
mobile, answer feedback, session completion, history, historical session review, progress,
editorial queue, revision editor validation, technical review, publish confirmation and catalog
track detail.

The redesign adds or materially changes:

- the light/dark token system, spacing/typography scales and readable-content measure;
- study-session eyebrow hierarchy, visual progress rail and segmented confidence control;
- explicit answered/flagged/current markers in mock-exam navigation;
- clearer topic rows with separate copy and practice action;
- tabular numeric presentation on progress;
- a two-panel editorial revision layout;
- keyboard-accessible horizontal table regions on narrow viewports.

## Deliberately not claimed

The `.verified` visual treatment exists in the stylesheet, but `AnswerFeedback` does **not** show
the pack's `expected.txt` output. That output is currently build/review evidence in the content
pack and is not persisted into question revisions or exposed through the learner feedback contract.
Displaying it would require a deliberate domain/API change; the UI must not invent or reconstruct
that evidence client-side.

## Human evidence still required before merge

The automated evidence is complete. The human part of Script C is **not** complete for this redesign
until the project owner checks the redesigned screens.

The owner still needs to judge, rather than merely test mechanically:

1. keyboard-only order: whether the order feels natural and common actions are not tedious;
2. screen-reader experience: whether status announcements are timely, ordered and not duplicated;
3. dark-scheme comfort and whether status colors still read naturally;
4. 200%/400% zoom and phone-width usability beyond the absence of technical overflow;
5. overall visual hierarchy, density and readability of the regenerated screenshots.

**Do not merge `feat/ui-redesign` until that human review is explicitly accepted.**


## Human visual approval

On 2026-10-08 the project owner reviewed the regenerated redesign screenshots and explicitly
approved the visual direction. This closes the **visual approval** gate for opening the redesign PR.

It is not recorded as evidence of a manual NVDA session, a human keyboard-only traversal, or a
human 200%/400% zoom exercise. Automated Playwright/axe/reflow/keyboard coverage remains the
evidence for those mechanics until a separate manual accessibility session is performed.

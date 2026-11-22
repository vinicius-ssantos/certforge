## Why
The 2026-11-19 audit of main 12533f1 identified 22 usability findings, including blocked dependency states, silent loss of interview writing and ambiguous selection indicators. Resolve these in one traceable change while preserving CertForge's visual identity and API contracts.

## What Changes
- Recover from empty and failed dependencies; preserve private interview drafts in memory and distinguish completion from abandonment.
- Make selections, mobile mock navigation, pending submission and cancellation explicit.
- Connect diagnostics to contextual practice; correct unsupported promises and overconfident progress labels.
- Improve mobile tables, feedback hierarchy, editorial preview, access help and catalogue navigation.
- Document each UX-01–UX-22 decision and its validation.

## Capabilities
### New Capabilities
None.
### Modified Capabilities
- `frontend-navigation`: accessible controls, contextual destinations, responsive decisions, catalogue and access recovery.
- `study-workflows`: dependency recovery, private interview drafts, honest signals and mock completion.
- `code-analysis-feedback`: explanation-first feedback and local editorial preview.

## Impact
Frontend components, locale catalogues, styles and regression tests; OpenSpec artifacts and audit traceability. No new API, dependency, account recovery service, automatic grading, publication or deployment. Private interview text remains memory-only. Manual visual acceptance remains a reviewer action.

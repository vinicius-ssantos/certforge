## Why

The frontend audit identified a lost mock-exam draft, mismatched editorial filters and fragmented study navigation. The follow-up should bring the Tracks redesign and its verification into one reviewable change.

## What Changes

- Protect draft answers and improve mock navigation, results and review.
- Surface published study opportunities and current sessions using existing account-scoped data.
- Make editorial filters shareable, improve mobile tables, and separate optional route payloads.

## Capabilities

### New Capabilities

- `study-workflows`: continuous practice, mock exams and follow-up.
- `frontend-navigation`: navigation and filtering across learner and editorial views.

### Modified Capabilities

None. This is the initial specification of these existing surfaces.

## Impact

React frontend, localized copy, API consumers, bundle checks and browser tests. The private study notebook remains a separate data source.

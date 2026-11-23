## Why
The local release :8081 database contains automated E2E question fixtures and synthetic exam objectives. Those are not certification study content. Existing E2E commands can share the release volume. The study UI also hides its search affordance, omits session topic context and displays the resumed-session notice after progressing.

## What Changes
- Separate review (:8082) and E2E (:8083) Compose projects and database volumes from release (:8081); preserve all current volumes.
- Require explicit opt-in to local E2E fixture seeding.
- Show catalogue search chevron, study track/topic breadcrumb and transient resume notices.
- Preserve reviewed technical text, approval digests and language; document that changing interface locale does not translate source content.
- Replace misleading empty-study calls to action with accurate catalogue guidance, display one unavailable-track notice instead of ten repeats, and disclose source language.
- Expose published-question counts for active general taxonomies so unavailable practice cannot be offered by mistake.
- Allow an explicit review-only activation of the already migrated DevOps taxonomy and publication through existing digest-verified editorial commands; no automatic approval of human sign-offs.

## Capabilities
### Modified Capabilities
- `frontend-navigation`: clarify catalogue disclosure and session context.
- `study-workflows`: transient resume status and data source separation.

## Impact
Compose, justfile, E2E guard, a learner-safe study availability API, frontend, tests and docs. No migration, data deletion, automatic question publication or production deployment. In the isolated local :8082 installation, existing AI-reviewed approvals were explicitly published by the maintainer workflow, leaving human-reviewed sign-offs pending their own account-level editorial decisions.

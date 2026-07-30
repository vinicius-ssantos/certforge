# ADR 0003: Version immutable published questions

- Status: Accepted
- Date: 2026-07-30

## Context

Questions, options, answers, and explanations may require correction. Mutating published content in place would alter the apparent meaning of historical attempts and undermine study evidence and auditability.

## Decision

Separate logical `Question` identity from immutable `QuestionRevision`. Publication freezes a revision. Corrections create a new revision, and attempts reference the exact revision shown to the learner.

## Consequences

- Historical attempts remain reproducible.
- Editorial corrections require explicit replacement and lifecycle handling.
- Storage increases modestly but integrity improves substantially.
- APIs must distinguish logical question identity from revision identity.

## Rejected alternatives

- Editing published rows in place.
- Copying full question text into every attempt as the only historical mechanism.

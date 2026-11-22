## Context
See proposal.md. Existing React Query, native form inputs, dialog and route blockers provide the required primitives. Bundle budgets leave little space; no dependencies are introduced.

## Goals / Non-Goals
Maintain visual tokens and API contracts. This is frontend remediation, not a new grading, recovery or persistence system.

## Decisions
- Lift guided writing into session memory. Block navigation while nonempty and clear on explicit advancement/closure; never serialize it. Persistent storage was rejected to preserve privacy.
- Show native choice indicators for choices without letter badges, including forced-colors; keep native semantics.
- Collapse mobile mock navigation while keeping desktop map visible. Do not autosave pending answers; disclose them in confirmation.
- Use existing topic links and query criteria for contextual actions. Correct unsupported weight promises instead of creating a new mapping editor.
- Keep explanation first, evidence in native details, and draft preview local. Use responsive labelled decision rows and existing type scales.
- Support help accepts an optional safe deployment URL; otherwise explicitly describes absence and the installation contact route.

## Risks / Trade-offs
- Memory-only writing is lost on confirmed exit or reload → explicit warning and lifecycle copy.
- Responsive table semantics and mobile navigation can regress → component tests and browser inspection.
- Human visual acceptance is separate from automated evidence → leave reviewer acceptance outstanding in tasks.

## Migration Plan
No data migration. Review PR and deploy through the normal release process; rollback the frontend commit if necessary. Do not archive until acceptance.

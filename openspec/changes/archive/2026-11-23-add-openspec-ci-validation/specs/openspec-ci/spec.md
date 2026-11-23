## ADDED Requirements

### Requirement: CI validates changes, permanent specs and archived task completion
Every GitHub pull request SHALL run version-pinned OpenSpec CLI validation
of all active change deltas and canonical capability specifications in
strict noninteractive mode. CI SHALL independently reject archived changes
that contain unchecked implementation tasks.

#### Scenario: A valid OpenSpec project is pushed
- **WHEN** a PR passes the current active change, canonical spec, and
  archive checklist validators
- **THEN** the OpenSpec CI steps succeed and the normal CI checks continue.

#### Scenario: An invalid canonical specification is introduced
- **WHEN** a controlled malformed specification is temporarily introduced
- **THEN** strict validation returns failure attributed to that spec
- **AND** the fixture is removed before subsequent CI steps.

### Requirement: Automation does not grant human UX acceptance
An automated OpenSpec gate SHALL NOT mark UX device, screen-reader or native
high-contrast tests as completed, and SHALL NOT archive changes that remain
blocked on human acceptance.

#### Scenario: A pending human UX review exists
- **WHEN** the CI validates specifications while issue #428 is still open
- **THEN** the technical validation may pass without changing the open
  human acceptance tasks or declaring WCAG conformance.

# Definition of Done

A CertForge change is done only when all applicable criteria are met.

## Product

- Linked issue and acceptance criteria are satisfied.
- The change belongs to the active release or is an approved blocker fix.
- User-visible behavior is demonstrable.
- Scope and deferred work are explicit.

## Design and domain

- Domain language matches the glossary.
- Invariants are enforced in the appropriate boundary.
- Important trade-offs are documented or linked to an ADR.
- Backward compatibility and migration impact are assessed.

## Quality

- Unit tests cover domain rules.
- Integration tests cover persistence and external boundaries.
- End-to-end tests cover critical user journeys when applicable.
- Test data does not rely on production secrets or unstable services.
- CI is green.

## Security and privacy

- Authorization is enforced server-side.
- Input, output, logging, and error handling are reviewed for sensitive data.
- Abuse and rate-limit considerations are addressed.
- New trust boundaries update the threat model.
- Dependencies and container images are reviewed through automated tooling when introduced.

## Accessibility

- Primary interactions are keyboard operable.
- Labels, focus, errors, status updates, and code presentation are accessible.
- Automated accessibility checks pass for affected flows.

## Operations

- Structured logs and relevant metrics exist.
- Failure behavior is observable and bounded.
- Health checks represent actionable readiness, not superficial process liveness.
- Database migrations are tested and documented.

## Documentation

- README, roadmap, architecture, API, operational, and content documents are updated when affected.
- Changelog entry is included for notable changes.
- The pull request contains evidence and known limitations.

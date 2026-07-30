# ADR 0001: Start as a modular monolith

- Status: Accepted
- Date: 2026-07-30

## Context

CertForge has multiple domain concerns but no demonstrated scaling or organizational need for distributed services. Early microservices would multiply deployment, consistency, testing, and observability costs before the core study workflow is validated.

## Decision

Build the initial backend as a modular monolith with explicit module APIs, isolated domain ownership, and controlled dependency direction. Spring Modulith is the intended support mechanism, subject to version selection during implementation bootstrap.

## Consequences

- Core workflows can use local transactions.
- Deployment and development remain simple.
- Boundaries must be tested so a single process does not become an unstructured monolith.
- A module may be extracted later only with evidence that operational or organizational independence justifies it.

## Rejected alternatives

- Microservices from the first release.
- A package-by-technical-layer monolith with shared repositories across domains.

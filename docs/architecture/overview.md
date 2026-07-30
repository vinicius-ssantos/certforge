# Architecture Overview

## Style

CertForge begins as a modular monolith. The goal is independent domain boundaries and cohesive transactions without introducing network distribution before it is justified.

## Initial modules

### `identity`

Authentication, account lifecycle, roles, and permissions. Other modules consume stable identity identifiers and authorization decisions rather than identity persistence details.

### `certification-catalog`

Certification tracks, exam versions, topics, ordering, lifecycle, and Java-version compatibility.

### `question-bank`

Question identities, immutable revisions, options, expected answers, explanations, references, editorial workflow, publication, and deprecation.

### `study`

Study-session lifecycle, question selection, answer submission orchestration, and learner-facing result disclosure.

### `progress`

Attempt-derived summaries and query models. Persisted attempts remain the evidence source; progress projections can be rebuilt.

### `audit`

Security- and integrity-relevant administrative events, especially question lifecycle changes.

## Dependency direction

- `study` may reference published question contracts but cannot modify editorial content.
- `progress` consumes attempt facts and does not own study-session commands.
- `question-bank` references catalog identifiers but does not own the catalog.
- `identity` must not depend on learning modules.
- Administrative interfaces orchestrate module capabilities but do not bypass domain rules.

## Persistence

PostgreSQL is the source of truth. Each module owns its tables conceptually, even when one database is used. Cross-module writes must occur through module APIs and explicit transactional boundaries, not arbitrary repository access.

Flyway manages schema changes. Production migrations must be forward-safe, observable, and tested against PostgreSQL.

## Interfaces

The first application may expose a web API consumed by a separate web frontend. Public contracts are version-conscious, validation errors are stable, and learner APIs avoid exposing answer material before an attempt is submitted.

## Future runner boundary

The code runner is intentionally excluded from the modular monolith. When introduced, it will receive bounded execution jobs through a narrow contract, return sanitized results, and have no direct access to the main database or internal credentials.

## Technology direction, not implementation commitment

The expected stack is modern Java, Spring Boot, Spring Modulith, PostgreSQL, Flyway, Maven, Testcontainers, a TypeScript web frontend, and Playwright. Exact versions are chosen during the implementation bootstrap and recorded separately.

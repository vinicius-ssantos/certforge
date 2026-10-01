# Changelog

All notable changes to CertForge will be documented here.

The project follows Semantic Versioning once application releases begin. During the documentation foundation phase, changes remain under `Unreleased`.

## [Unreleased]

### Fixed

- Flyway now keeps its history table in `public` regardless of the database user name. With the documented user `certforge`, the schema of the same name became the current schema after the first start, so readiness reported the schema as not migrated and the next start failed.

### Added

- Learner history, session review and topic progress pages, and end-to-end tests with Playwright and axe on desktop and mobile viewports, run in CI against the real backend and PostgreSQL (#13).
- Learner study flow in the web app: start a practice session from a topic, resume the one in progress, single and multiple choice questions with confidence, idempotent submission with feedback, explanation and references, finish or end a session, and expired-session states, with focus managed across questions and results (#13).
- Learner web app foundation: a contract-first React client generated from the backend OpenAPI contract, sign-in and registration, track browsing, accessible layout with automated checks, and a web CI job (#13, ADR 0009).
- Persisted audit trail for editorial transitions, request correlation, a single safe error contract, metrics, liveness and readiness probes, and an operations guide with incident triage (#12).
- Learner attempt and session history with keyset pagination, and rebuildable topic progress with reconciliation (#11).
- Idempotent answer submission with server-side grading, immutable attempt evidence, and answer disclosure only after an accepted submission (#10).
- Topic-focused study sessions with an immutable question snapshot, lazy expiration, one session in progress per topic, and learner-safe payloads (#9).
- Initial authorial Java SE 21 content pack (20 questions, verified code), content importer and content authoring guide. The pack awaits human technical review and is not published (#8).
- Versioned question bank with immutable revisions, the editorial lifecycle, database-enforced immutability and learner-safe projections (#7).
- Preparation catalog with the Java certification profile, exam versions, stable topics and seeded Oracle Java SE 21 (1Z0-830) taxonomy (#6).
- Identity, session authentication, role and permission authorization, and abuse protection (#5, ADR 0008).
- Enforced modular monolith boundaries with Spring Modulith: initial modules, declared allowed dependencies, architecture tests in CI, and module conventions (#4).
- Product vision and principles.
- Explicit scope and non-goals.
- Release roadmap from `v0.1.0` through `v0.7.0`.
- Detailed `v0.1.0` Study Core definition.
- Initial domain model and modular architecture.
- Editorial content policy and lifecycle.
- Security and future runner threat model.
- Initial architecture decision records.
- Contribution and definition-of-done rules.

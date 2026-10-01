# Changelog

All notable changes to CertForge will be documented here.

The project follows Semantic Versioning once application releases begin. During the documentation foundation phase, changes remain under `Unreleased`.

## [Unreleased]

### Fixed

- Failures the web framework raises before a controller runs (an unknown path, a method or content type the endpoint does not take, an unacceptable representation) now answer with the same problem body as every other error: a stable `code` and the request id, and none of the framework’s own text. They used to leave both out. Found by the new error inspection (#15).
- Security updates found by the first image scan: Tomcat 11.0.25 (a critical advisory in 11.0.24), Jackson 3.1.7 and 2.21.7 (high advisories), and operating-system package upgrades in both images (#15).
- Built assets are no longer inlined as `data:` URIs, which a strict Content Security Policy blocks; fonts would have failed to load in production (#15).
- Ending a study session early now moves focus to the confirmation and back, instead of leaving keyboard and screen-reader users on a button that had disappeared (#14).
- Flyway now keeps its history table in `public` regardless of the database user name. With the documented user `certforge`, the schema of the same name became the current schema after the first start, so readiness reported the schema as not migrated and the next start failed.

### Added

- Release validation that runs in CI: an authorization matrix generated from the application’s own request mappings (an endpoint without an access rule fails; each role is refused what it lacks and admitted to what it has; state-changing endpoints refuse a missing CSRF token), an answer-privacy journey in a real browser (responses, page, storage, cache headers, direct API access, built bundle), a historical-integrity journey (an answer keeps showing the revision the learner saw after the question is replaced), and an inspection of errors, metrics and logs of the running stack (#15).
- A release-like environment: backend and web images, an nginx proxy with a strict Content Security Policy and security headers, PostgreSQL, and a `release` CI job that scans the images, checks the proxy (including that a forged `X-Forwarded-For` cannot get around rate limiting) and runs the whole end-to-end suite against the images (#15).
- Editorial history by name: the editorial view of a question now says who wrote, reviewed and published each revision (by email address, staff-only endpoints). A review records the content-policy checklist items the reviewer ticked (`checklist`, optional, fixed codes, migration V11); it is shown in the review notes and does not gate approval. The web app uses both (#14).
- Comparison of a revision with the one before it (word by word, field by field, announced in words as well as marked) and protection of unsaved edits in the question editor, by link, back button or closing the tab (#14).
- Review and publication in the web app: a reviewer reads the question as the learner will see it and approves it or sends it back with a comment; an administrator publishes (after a confirmation) or retires a revision; an author starts a new revision of a published question. Covered end to end by a test that takes one question from draft to published through three accounts (#14).
- Editorial desk in the web app: question queue with status filters, the draft editor (save unfinished work, send for review with a list of what is missing that links to each field), and a read-only revision view that shows the question as the learner will see it before the answer key. Staff-only, shown by permission (#14).
- A shared visual system (editorial desk look, light and dark tokens, bundled fonts) applied to the whole web app, and fenced code blocks in questions now render as code for learners and reviewers. See the web interface guidelines (#14).
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

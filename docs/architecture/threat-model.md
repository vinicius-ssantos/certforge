# Initial Threat Model

## Scope

This document covers the documentation-defined product and records future code-execution risks early. It is not a substitute for feature-specific security reviews.

## Assets

- Account credentials and sessions.
- Learner attempt and progress data.
- Unpublished questions, expected answers, and explanations.
- Editorial approvals and audit history.
- Database credentials and application secrets.
- Future runner capacity and host isolation.

## Trust boundaries

- Browser to web application.
- Web frontend to backend API.
- Learner endpoints to administrative endpoints.
- Application to PostgreSQL.
- Future application to isolated runner.
- Maintainer automation to GitHub and deployment systems.

## Initial threats and controls

### Premature answer disclosure

Threat: Learners retrieve expected answers through API payloads, identifiers, logs, caches, or error messages before submitting.

Controls: Separate learner delivery models from editorial models; serialize no answer metadata in unanswered flows; avoid answer material in logs and client bundles; use `no-store` where appropriate; test privacy boundaries.

### Unauthorized content mutation

Threat: A learner or insufficiently privileged editor approves or publishes a question.

Controls: Explicit permissions, server-side authorization, audit events, immutable published revisions, administrative endpoint tests.

### Historical integrity loss

Threat: Editing a question changes what an old attempt appears to have contained.

Controls: Attempts reference immutable revision identifiers; corrections create new revisions; no cascading replacement of attempt evidence.

### Account abuse

Threat: Credential stuffing, brute force, session theft, enumeration, or privilege escalation.

Controls: Secure password handling or trusted identity provider, rate limits, generic authentication errors, secure cookie or token practices, session revocation, authorization tests, minimal account data.

### Injection and unsafe rendering

Threat: Malicious question prose or code snippets trigger SQL injection, XSS, or unsafe Markdown rendering.

Controls: Parameterized persistence, output encoding, restrictive Markdown processing, content security policy, dependency review, browser-level tests.

### Sensitive telemetry

Threat: Logs or traces capture credentials, expected answers, full submitted content, or unnecessary personal data.

Controls: Structured allowlisted telemetry fields, redaction, bounded retention, access controls, negative tests.

## Status at v0.1.0

Each control above as it was built, and what proves it. "CI" means it runs on every change.

| Threat | Control as built | Proof |
|---|---|---|
| Premature answer disclosure | Learner payloads are separate types with no correctness, reasons, explanation or references; the answer arrives only in the response to an accepted submission; signed-in responses are `no-store`; a session of another learner is `404`, not `403`; answers appear in no log line | `AttemptSubmissionIT`, `StudySessionIT`; `privacy.spec.ts` inspects every response, the page, browser storage, cache headers, direct API access and the built bundle in a real browser; `verify-privacy.mjs` scans the logs (CI) |
| Unauthorized content mutation | Explicit permissions checked on the server; revisions immutable once submitted (also enforced by database triggers); publishing needs an approved revision and a different reviewer by default; audit events | `AuthorizationMatrixIT` is built from the application's own request mappings, so an endpoint without an access rule fails the build, and checks each role in both directions plus CSRF on every state-changing endpoint; `QuestionBankIT` (CI) |
| Historical integrity loss | Attempts and session snapshots reference immutable revision ids; replacing a question creates a new revision and retires the old one | `history-integrity.spec.ts`: an answer keeps showing the revision the learner saw after the question is replaced; `HistoryIT` (CI) |
| Account abuse | bcrypt, length-based password policy, per-address and per-account throttling, generic sign-in errors, server-side sessions that are revoked on role change or disabling, CSRF double-submit | `IdentityIT`, `CsrfFlowIT`; the proxy cannot be used to forge the client address (below) |
| Injection and unsafe rendering | Parameterized SQL; question text rendered as text, never as HTML (code only in fenced blocks); a Content Security Policy that allows only the app's own origin; no inline styles or scripts | `prompt.test.tsx`; `verify-release.sh` checks the policy; the end-to-end suite fails any page that triggers a policy violation, and runs axe in both colour schemes (CI) |
| Sensitive telemetry | Fixed label sets with a cap on distinct values; request ids are random; logs hold no answers or credentials | `OperabilityIT`; `verify-privacy.mjs` checks metric tags and logs after real traffic (CI) |

## Threats found while validating v0.1.0

Validation against the release images found these; each is fixed and tested.

- **Error bodies that left the contract.** Failures raised before a controller runs (unknown path, wrong method or content type) answered with the framework's own body, with no `code` and no request id and with text about the server. Now every error has the same body (`FrameworkErrorContractIT`).
- **Client address behind a proxy.** The throttles key on the client address, so behind a proxy everyone would share one bucket, and a proxy that appended to `X-Forwarded-For` would let a client pick its own. The release proxy overwrites the header and the backend reads it; `verify-release.sh` proves a forged header does not get around the limit.
- **Vulnerable dependencies.** The first image scan found critical Tomcat advisories (including security-constraint and authentication bypasses) and high Jackson advisories in versions managed by Spring Boot 4.1.1. They are overridden in `pom.xml`, and the scan now fails the build on any fixable high or critical finding.
- **A policy the app would have broken.** The strict Content Security Policy blocks `data:` fonts, which the build inlined. The build no longer inlines assets.

## Residual risks and accepted limits

Known, stated, and not hidden by the tests above.

- **No email verification and no password reset** (ADR 0008). An account's email is unverified, and a forgotten password needs an administrator.
- **Rate limiting is in memory per instance.** Run a single backend instance until it has a shared store.
- **TLS is not in the images.** Terminate it in front of the web container and set `SESSION_COOKIE_SECURE=true` (see the release environment document).
- **Staff see each other's email addresses** as author, reviewer and publisher names, in staff-only endpoints. Learners never do.
- **Backups hold password hashes and every learner's answers** and must be protected accordingly; restoring one can revive revoked sessions, so end all sessions after a restore (see the operations guide).
- **Content correctness is a human judgment.** The checklist a reviewer ticks is recorded as evidence of what they say they checked; it does not make a question right. The initial content pack has had that review, by the project owner rather than an independent third party, and [its record](../../content/java-se-21/review.json) says so plainly along with what it does not cover.
- **The vulnerability scan covers packages, not logic.** It is not a substitute for this document.

## Future runner threats

Before `v0.5.0`, a dedicated runner review must address:

- arbitrary code execution and sandbox escape;
- fork bombs and process exhaustion;
- CPU, memory, disk, inode, and output exhaustion;
- network access and exfiltration;
- host filesystem and container-runtime access;
- secret and environment-variable access;
- cross-job contamination;
- malicious bytecode, agents, native libraries, reflection, and subprocesses;
- infinite loops and long compilation;
- abusive automation and denial of service;
- unsafe diagnostic output.

Required direction: disposable restricted environments, no network, no database credentials, read-only base image, bounded writable storage, non-root execution, strict time and resource limits, job quotas, output truncation, image provenance, patching, and runner-specific monitoring.

## Review cadence

Update this document when a new trust boundary, personal-data field, administrative capability, external integration, or execution mechanism is introduced.

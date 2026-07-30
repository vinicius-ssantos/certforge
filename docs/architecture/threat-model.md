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

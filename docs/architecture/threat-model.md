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

## Mock exam threats (v0.3.0)

The mock exam (ADR 0015) is a second, timed delivery path over the same published question pool "Premature answer disclosure" above already covers, with its own trust boundary: a learner is sitting a run that is meant to measure them, and the one property it must never lose is that nothing on the way to the terminal result says which option is correct.

### Delayed feedback bypass via the shared practice pool

Threat: Practice and the mock draw from the same published questions, and practice hands over the answer key, explanations, references and verification output the moment an attempt is submitted. A learner could point `POST /api/study/sessions` or an attempt at `revisionIds` their own open mock had already drawn and read the key while the mock's clock still ran — deterministically, since the planner draws five per topic per session, so every topic of a ten-topic blueprint could be read this way at once.

Controls: The revisions of an open mock leave the practice pool for as long as it is open, so asking for one by name through practice gets the same refusal an unpublished revision gets rather than a new, learnable failure; a topic whose only otherwise-publishable questions are all under examination reports the same shortage it already reports for any other cause. A session started *before* the mock keeps its own snapshot and cannot be pulled back into the pool rule retroactively, so submitting an attempt for a question the learner is currently being examined on is refused directly at the point that would hand over the key — the refusal names the mock in the way, not the question, because nothing is wrong with the question.

Found and fixed in #207 (merged), by an internal audit of this release's own promise rather than by an external report. It is the reason this section exists rather than only restating "Premature answer disclosure" with a new noun.

### Deadline authority

Threat: A learner's browser, not the server, decides when a mock ends — stopping the clock locally, replaying a stale deadline after a reconnect, or submitting after the true deadline with a browser clock set back.

Controls: The deadline is server-computed and server-enforced at every mutating call (`respond`, `finish`); the client only renders the countdown it is handed. A run already past its deadline refuses a new answer and finishes itself on the next contact rather than trusting the client to call `finish`.

### Irreversible-submit framing

Threat: A learner submits early by mistake, or is misled about the cost of doing so, and an irrecoverable zero stands in for fifty answers never attempted.

Controls: `finish` is refused without a prior confirmation step naming exactly how many questions are still unanswered; the unanswered count becomes the score's miss count rather than a null or a smaller denominator, so the number a learner is warned about is the same number that then counts against them. `zz-mock-exam.spec.ts` exercises the warning text and the resulting score denominator end to end, not just the refusal.

### Status at v0.3.0

| Threat | Control as built | Proof |
|---|---|---|
| Delayed feedback bypass via the shared practice pool | Revisions under an open mock are excluded from the practice pool; an attempt on a question under examination is refused; a pre-existing session's own snapshot is unaffected | `AttemptSubmissionIT`, `StudySessionIT` (#207); `zz-mock-exam.spec.ts` confirms no answer material reaches the page or its markup while `IN_PROGRESS`, including on revisiting an answered question |
| Deadline authority | Deadline is computed and enforced server-side on every mutating call; an expired run finishes on next contact | `MockExamServiceTest`, `MockExamPersistenceIT` |
| Irreversible-submit framing | `finish` requires a confirmation naming the unanswered count; that count becomes the miss count in the score | `zz-mock-exam.spec.ts` |
| Sensitive telemetry, extended to mock paths | The mock endpoint family stays inside the same fixed-label, capped-cardinality metrics convention as the rest of the API | `verify-privacy.mjs`'s metrics cardinality check, whose ceiling was raised from 50 to 100 distinct tag values once the mock exam's own route templates were first exercised at the release-stack level (#358) — a sanity bound against unbounded growth, not the leak check itself |

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

## Hands-on lab runner threats (#175)

This section is distinct from "Future runner threats" above, which was written for ADR 0006's
Java-execution runner: that runner compiles and runs text inside a language runtime with no
legitimate need for raw syscalls, devices, or kernel capabilities. #175's labs are categorically
wider — the learner needs to drive a real Docker daemon or Kubernetes cluster, which is the entire
point of the lab. [ADR 0027](../adr/0027-isolate-hands-on-lab-execution.md) and
[the isolation plan](hands-on-labs-isolation.md) are the design response; this section records the
threats they answer, in this document's own format, so it stays reviewable alongside everything
else here.

### Container/VM escape to the host

Threat: a learner's commands inside a lab exploit a kernel or hypervisor bug to reach the host
running other learners' sessions or this application's own infrastructure.

Controls: microVM-class isolation instead of a plain container sharing the host kernel — one
Vercel Sandbox (a Firecracker microVM) per session, per [ADR 0028](../adr/0028-vercel-sandbox-for-
hands-on-labs.md), superseding ADR 0027 decision 1's self-hosted Kata Containers/gVisor; non-root
execution inside the guest; a minimal, audited guest base image rebuilt on a patching cadence; no
capability ever granted at the host level.

### Host Docker socket or privileged-container exposure

Threat: the orchestrator mounts the host's `/var/run/docker.sock` or runs a lab `--privileged` to
make a nested Docker/Kubernetes runtime work the easy way — both documented, direct routes to
host-level compromise.

Controls: both are forbidden outright by #175's acceptance criteria and by ADR 0027 decision 2; a
nested daemon runs only inside the guest microVM's own kernel, which the host does not trust
regardless of what runs inside it.

### Kubernetes control-plane or credential leakage

Threat: an ephemeral cluster's kubeconfig or a service-account token leaves the session, or a
lab's own RBAC-escalation exercise is used to pivot beyond its single ephemeral cluster.

Controls: the cluster's API server is reachable only from inside the microVM's own network
namespace, never exposed to the host network; kubeconfig is generated fresh per session, lives
only inside the guest, and is destroyed with the VM; no token issued for one session has scope
beyond that session's own ephemeral cluster.

### Resource exhaustion inside a session

Threat: a learner's shell spins unbounded processes, allocates unbounded memory, fills disk, or
runs a cryptominer.

Controls: a hard `timeoutSeconds` and `vcpus` per `LabSpec`, enforced by the Vercel Sandbox
platform as the primary boundary; disk is capped at the platform's 64 GB/session ceiling. There is
no platform-level process-count cap ([ADR 0028](../adr/0028-vercel-sandbox-for-hands-on-labs.md)
decision 5) — a fork bomb or unbounded allocation is contained to that one microVM (it cannot
reach the host or other sessions) but is not stopped short of `timeout` or the disk ceiling.
In-guest cgroups remain defense in depth only; unconditional destroy at timeout.

### Network egress and exfiltration

Threat: a lab session is used to reach arbitrary internet hosts — exfiltrating data, relaying
abuse traffic, or reaching a cryptomining pool.

Controls: default-deny egress (`network.egress: none` in every `LabSpec` unless explicitly
justified); the one permitted exception (`image-pull-only`) is scoped to a single pinned registry
and is expected to stay unused once base images are pre-cached.

### Supply-chain risk in lab images and fixtures

Threat: a compromised base image or a fixture bundle ships a backdoor that activates inside the
guest.

Controls: every `LabSpec` image is pinned by digest, never a floating tag; fixtures are static
bundles committed to this repository and reviewed like any other change, never fetched live at
session start; pinned digests are periodically re-scanned the same way release images already are.

### Evaluator spoofing

Threat: a learner manipulates an in-guest agent that reports lab completion, so it always claims
success regardless of the real end state.

Controls: the grader is a separate process outside the learner's shell context, reading final
state through the orchestrator's own access path, never trusting anything the learner's shell
writes — ADR 0027 decision 4.

### Cross-session contamination

Threat: a microVM, its filesystem, or its generated credentials are reused between sessions or
between learners, leaking one learner's lab state into the next.

Controls: destroy-on-exit is unconditional — on success, failure, timeout, or orchestrator error —
and nothing about a session (image layer cache aside) is ever reused for a different session.

### Abusive automation against the lab orchestrator

Threat: scripted abuse starts many lab sessions to exhaust host capacity, independent of anything
that happens inside any one session.

Controls: per-account rate limiting on lab starts, the same pattern already proven for sign-in
throttling (`IdentityIT`); a capacity ceiling with graceful queuing or rejection rather than
over-provisioning host resources. Under ADR 0028 this abuse is also a direct cost (billable vCPU
time, egress, and exposed-port traffic per session), not only a capacity concern.

### Vendor dependency and a verified Kubernetes-node limitation

Threat: this is not an in-session attack, but a design risk ADR 0028 introduces — lab availability
now depends on a third party's platform uptime, and this project's own three prototype labs need
nested containers (Docker, or a Kubernetes cluster) to work inside that platform's microVM.

Controls: smoke-tested 2026-11-13 in two throwaway, non-persistent sandboxes. Docker nests cleanly
(`dockerd` starts, `docker run hello-world` works end-to-end) — the multi-stage-build lab's
requirement is verified, not assumed. Both `kind` and `k3s` fail to bring up a Kubernetes node,
with the same underlying cause: a cgroup v2 delegation failure for the node's `ContainerManager`
subtree, hit one nesting level earlier by `k3s` (which needs no Docker and runs as a guest process
specifically to avoid `kind`'s extra nesting level) than by `kind` — evidence this is a property
of the sandbox's root cgroup hierarchy, not a defect in either tool. The readiness-probe and
Service-selector labs are **not** cleared as currently conceived; see
`docs/architecture/hands-on-labs-isolation.md`'s Rollout section for the full evidence and the
untried directions (Connect private networking, a pre-booted custom image) a future, separately-
scoped investigation would need to check. The orchestrator holds the only credential to the
Sandbox API (ADR 0028 decision 3); no credential needed for lab operation is ever placed inside
the sandbox, so a Vercel-side compromise of one lab session cannot by itself expose this project's
own platform credential. Phase 1 (static diagnosis) has no dependency on Vercel at all and is
unaffected if the platform is unavailable.

### Unsafe diagnostic output

Threat: logs or crash dumps capture a learner's raw shell transcript, which is unbounded user
content even though it is not one of this application's own secrets.

Controls: the same bounded, allowlisted telemetry fields as the rest of this document — session
id, resource usage, and the grader's structured verdict are logged by default; the raw transcript
is never captured unless a separate, access-controlled, retention-bounded abuse investigation
specifically needs it.

### Status

None of the above is built. This section, together with ADR 0027 and its isolation plan, was
reviewed and accepted by the product owner on 2026-11-08 (PR #350), satisfying #175's first
acceptance criterion before any of Phase 2's code is written.

## Review cadence

Update this document when a new trust boundary, personal-data field, administrative capability, external integration, or execution mechanism is introduced.

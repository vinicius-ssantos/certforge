# Proposal

## Why

`v0.5.0` ("Secure Java Runner") has been a one-line roadmap hypothesis since the release plan was written, with no design, no ADR beyond the high-level isolation policy (ADR 0006), and no capability spec. Meanwhile `#175` built and got security review for almost the exact isolation shape ADR 0006 asks for (disposable, resource-bounded, no DB credentials, no general network access) — just for a different learner-facing behavior (Kubernetes/Docker labs, ADR 0027-0030). This proposal gives v0.5.0 a concrete shape grounded in what that review already approved, instead of starting isolation design from zero a second time.

## What Changes

- A learner can submit a short Java snippet that completes an author-written, editorially-reviewed scaffold (not a free-form program from scratch), have it compiled and run in a disposable sandbox, and see a deterministic pass/fail verdict with the actual compiled source and recorded output — the same evidence shape `VerificationEvidence` already renders for pre-recorded v0.4 evidence, but honestly labeled as live rather than recorded.
- No interactive terminal and no learner-facing shell for this capability: the submission is one text blob, graded by the same non-interactive "orchestrator runs the command, never the learner" discipline `#175`'s grader already uses (ADR 0027 decision 4). This sidesteps re-opening the hard problem ADR 0029 solved (a restricted shell safe for live typed input) — there is no live typed input here.
- The underlying disposable-sandbox lifecycle (create a session from a pinned image, run a bounded command, read its result, destroy the session) is extracted from `dev.certforge.labs.internal` into a capability-neutral location so both the Infrastructure/DevOps labs direction and this certification-specific capability depend on one reviewed implementation instead of two.

## Capabilities

### New Capabilities

- `secure-java-execution`: a learner can submit a snippet completing an author-authored scaffold and receive a deterministic compiled/executed verdict, isolated per ADR 0006/0028's existing policy.

### Modified Capabilities

(none — `code-analysis-feedback` stays exactly what it is today: pre-recorded evidence for practice and terminal mock review. It explicitly states code is never compiled or run in the browser and nothing here changes that; this proposal adds a distinct, new capability rather than loosening that one.)

## Impact

- Backend: a new `dev.certforge.coderunner` (name open to a better one) module, depending on an extracted, capability-neutral sandbox client (today's `VercelSandboxClient` logic, currently private to `labs.internal`). No change to `LabsController`, `LabOrchestratorRouter`, or either existing lab orchestrator's behavior.
- Content/editorial: a new question-authoring shape (scaffold + insertion point + expected-output check), reviewed by the same editorial workflow every other question type already goes through — no new review mechanism.
- Web: a new submission UI and a verdict view, likely able to reuse `VerificationEvidence`'s data shape with different framing copy (see design.md).
- This proposal captures a design-ready direction, not a decision: the exact submission contract (scaffold + insertion point vs. something looser) and whether `v0.5.0` is worth scheduling now, ahead of `v0.4.0`'s own tag, remain the product owner's call before any implementation task starts.

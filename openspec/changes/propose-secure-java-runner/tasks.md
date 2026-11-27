# Tasks

This change is a design-ready proposal, not an implementation go-ahead. Per `proposal.md`'s closing line, whether `v0.5.0` is scheduled now — and the submission-shape decision already made in `design.md` on the product owner's explicit delegation — still want the product owner's review of this document before task 1.1 starts. The breakdown below is what implementation looks like once that happens.

## 1. Extract the shared sandbox primitive

- [ ] 1.1 Move `VercelSandboxClient` (and its properties/config) out of `dev.certforge.labs.internal` into a capability-neutral location (e.g. `dev.certforge.platform.sandbox`), as a pure move with no behavior change; verify `LabsSessionIT` and `VercelSandboxClientTest` still pass unchanged against the moved code.
- [ ] 1.2 Update `SandboxLabOrchestrator` to depend on the moved client; verify no other reference to the old package path remains (`grep` clean) and the full Maven test suite for `dev.certforge.labs` still passes.

## 2. Backend: the execution capability

- [ ] 2.1 Define the scaffold/insertion-point/expected-output authoring contract as a new record type, mirroring `LabFixture`/`LabEvaluation`'s shape; verify with a unit test that a spec missing any required field is rejected the same way `LabSpecValidator` rejects an incomplete `LabSpec`.
- [ ] 2.2 Implement the submit-and-grade orchestration: create a short-timeout, 1-vCPU sandbox session from a digest-pinned JDK image, write the completed scaffold, run `javac` then the compiled class via the non-interactive `cmd` call, capture exit code/stdout/stderr, stop the session. `VercelSandboxClient.runToCompletion()` today only returns an exit code, so output capture is new code here, not inherited from Labs; enforce a byte limit on captured stdout/stderr during retrieval (per `docs/architecture/threat-model.md`'s "output truncation" requirement) with defined truncation/verdict behavior for a completion that prints past the limit, since the sandbox's 1-vCPU/timeout bounds compute but not response size. Verify with an integration test exercising a passing and a failing submission end-to-end (mirroring `LabsSessionIT`'s own structure, Vercel client mocked), plus a test asserting a completion that exceeds the output limit is truncated with a clear verdict rather than consumed in full.
- [ ] 2.3 Sanitize the (now bounded) sandbox output (compiler diagnostics, program output) before it leaves this module, per `design.md`'s untrusted-output risk; verify with a test asserting markup/control-sequence-bearing output round-trips as inert text, not interpreted content.
- [ ] 2.4 Add the new REST endpoint(s) with the same `STUDY` authority convention every other learner-facing endpoint uses; verify with an integration test that an anonymous caller is refused.

## 3. Content authoring

- [ ] 3.1 Author 3-5 pilot scaffolds covering a spread of Java SE 21 topics already in the catalog, each reviewed through the existing human editorial workflow (no new review mechanism); verify each has a recorded reviewer decision before use in task 4.
- [ ] 3.2 Document the authoring format in `docs/engineering/content-authoring.md`, alongside the existing question-authoring conventions; verify a second author can follow it to produce a new scaffold without asking a clarifying question the doc should have answered.

## 4. Web

- [ ] 4.1 Submission UI: a single text input bound to the scaffold's insertion point, shown beside the scaffold's fixed surrounding code (reusing the existing `Prompt`/code-block rendering); verify with a component test that the scaffold's fixed parts are not editable.
- [ ] 4.2 Verdict UI: a sibling of `VerificationEvidence` sharing its `files[]+output` data shape, with copy that honestly says the result is live, not recorded (per `design.md`); verify with a component test asserting the pass and fail cases both state the outcome in words, not color alone, and pass an axe accessibility check in both color schemes.
- [ ] 4.3 i18n strings (EN + PT-BR) and routing, following the existing per-feature module convention (see `web/src/labs/` from the hands-on-labs change for the most recent precedent); verify `npm run typecheck`, `npm run lint`, `npm test` all pass.

## 5. Verify

- [ ] 5.1 End-to-end: a learner submits a passing and a failing completion for at least one pilot scaffold and sees the correct verdict, exercised the same way `#175`'s own real-browser verification was done for hands-on labs (scripted, against a built production bundle); record what was and was not exercised against a real sandbox credential, the same disclosure discipline `expose-hands-on-labs-in-web` used for its own unverified Vercel path.
- [ ] 5.2 Security review pass specifically on task 2.3's sanitization boundary, separate from re-verifying the inherited isolation properties from `#175` — `design.md` flags this as new ground, not precedent, and it should get its own explicit sign-off before this change is considered ready to archive.

## Workflow follow-up

- Sync `secure-java-execution` into `openspec/specs/` and archive this change only after CI is green on the implementing PR's own head and the product owner has explicitly accepted both outstanding decisions named in `proposal.md` and the security review in task 5.2.

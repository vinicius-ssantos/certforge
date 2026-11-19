## 1. Verify baseline and approve scope

- [x] 1.1 Audit representative fixed Java SE 21 questions: compile success, expected failure, runtime output, modules and concurrency; compare authored explanations with observed feedback. Evidence: `docs/release/v0.4.0-gap-audit.md` (six named samples, no editorial approval implied).
- [x] 1.2 Record reproducible gaps in practice and finalized mock review, including accessibility and answer-disclosure timing. Confirm what is already met by `Prompt.tsx`. Evidence: `docs/release/v0.4.0-gap-audit.md`; terminal mock omits existing verification evidence, and repeated fixed heading IDs require care.
- [x] 1.3 Obtain explicit owner approval of the minimal v0.4.0 outcome and pilot acceptance criteria; decide whether existing fields/components suffice. Owner approved on 2026-11-18: terminal mock code-evidence parity via existing API/component (PR #416), plus individual human editorial review of six representative Java questions. This is **scope approval**, not answer-key approval.

## 2. Deliver only approved gaps

- [x] 2.1 Select a bounded, representative content pilot; retain deterministic Java 21 proof and require human technical/editorial approval for authored explanations. Six named Java SE 21 examples and their pending acceptance checklist are recorded in `docs/review/v04-code-analysis-pilot-20261118.md`; none is editorially approved by the owner's scope approval.
- [ ] 2.2 Implement only necessary code-behavior feedback improvements using existing contracts first. Keep active mock feedback concealed.
- [ ] 2.3 Verify mobile/desktop accessibility, semantic code and safe CSP-compatible rendering; no arbitrary execution or secret-bearing endpoints.

## 3. Quality and release readiness

- [ ] 3.1 Add unit, integration and E2E checks for code behavior explanation, incorrect distractor feedback and mock answer-disclosure boundary.
- [ ] 3.2 Run Java Maven verify, web tests/typecheck/lint/build, security checks, OpenSpec strict validation and full PR CI.
- [ ] 3.3 Conduct owner visual and content acceptance against the pilot, without bypassing human review.
- [ ] 3.4 Sync/close accepted spec delta, archive this change and prepare scoped v0.4.0 release readiness evidence.

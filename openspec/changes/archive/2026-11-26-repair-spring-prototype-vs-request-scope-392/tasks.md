## Implementation

- [x] Verify actual singleton/prototype/request scope semantics against Spring official reference.
- [x] Correct option C and explanation to emphasize method-local/request scope or explicit fresh prototype lookup.
- [x] Retain correct key C and leave `review.json`/`pack.json` untouched in the source PR.
- [x] Validate strict OpenSpec, content tests and exact branch diff.
- [x] Obtain passing exact-head CI/CodeQL and independent Codex review; merge by squash after gates.
- [x] Separately review merged source with V2 digest and independent gate.
- [x] Archive change with evidence after integration.

## Completion evidence (2026-11-26)

- Source-only PR #493: squash `614ae869f6e83afe1d1c84820d6917a0f1e23575`, 8/8 exact-head CI/CodeQL successful, independent Codex review without findings.
- Individually reviewed V2 entry in PR #494: squash `f5d359b3712b78faf639b39f0012af5f56b6a400`, 8/8 exact-head CI/CodeQL successful, independent Codex review without findings.
- Question `iv288-singleton-vs-prototype-scope-mutable-state`: correct **C**, `ai-reviewer` APPROVED, digest `sha256:28b1111e0546652bebc0b64d2908a932f1e23c6850a86333b3c59af767e56660`.
- Verified main 63/208 approvals with 145 remaining, pack DRAFT. Issue #392 and human accessibility issue #428 remain OPEN. No content publication or deploy.

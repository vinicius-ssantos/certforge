## Source-only repair

- [x] Identify overclaim and independently verify original vendor documentation for lost updates and locking.
- [x] Correct question prompt, correct option B, option A explanation, difficulty rationale and overall explanation without changing correct key.
- [x] Attach official primary references, preserve all unrelated options and metadata, and leave `review.json` untouched.
- [x] Strict OpenSpec 11/11 valid, focused content/review-integrity tests 24/24 passed, exact diff restricted to one source question plus OpenSpec.
- [ ] Open source-only PR; require exact-head CI/CodeQL and independent Codex before squash merge.
- [ ] Verify postmerge CI, archive OpenSpec separately and only then re-review the changed question in another independent V2 PR.

## Technical source repair

- [x] Inspect question prompt, four options, explanations and existing official Spring reference.
- [x] Confirm Spring MVC @ResponseBody vs @RestController response-body behavior using official documentation.
- [x] Confirm Jackson @JsonProperty property/accessor/constructor semantics using versioned primary API.
- [x] Correct the wrong-option B rationale while retaining answer A and all other content.
- [x] Add a first-party versioned Jackson reference and preserve pack DRAFT without a new review verdict.
- [x] Run strict OpenSpec, full Maven/Web/E2E/release/CodeQL/security checks and address reviewers.
- [x] Merge source correction, then separately review new V2 digest and archive the completed OpenSpec in a follow-up.

### Verified integration evidence — 2026-11-24

- PR #452 was squash-merged into main after all **eight** required CI/CodeQL checks succeeded, with no unresolved blocking review findings.
- PR #451 recorded six individually checked and truthful ai-reviewer V2 decisions, correcting both P2 Spring distractor explanations and recomputing their digests before merge; PR #452 fixed the separate @JsonProperty content source without an AI verdict; PR #453 independently reviewed that corrected source and recorded one new AI-attributed digest.
- Issue #392 remains OPEN with **47/208 reviewed and 161 pending**. Interview pack stays DRAFT, no deploy or publication. Human UX/E2E acceptance issue #428 remains OPEN with its active OpenSpec change unarchived.

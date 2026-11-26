## Implementation

- [x] Verify `@WebMvcTest` and `@MockitoBean` documented behavior in official Spring sources.
- [x] Clarify that required collaborators are explicitly mocked rather than automatically mocked by the slice.
- [x] Preserve option D, untouched distractors and `DRAFT`, with no premature `review.json` entry.
- [x] Validate strict OpenSpec, question integrity and exact branch diff.
- [x] Complete CI/CodeQL and independent Codex review, then squash merge source repair.
- [x] Perform separate V2 editorial review bound to merged source digest.
- [x] Archive this OpenSpec after both PRs are integrated.

## Completion evidence — 2026-11-26

- Source-only PR #496: 8/8 exact-head checks SUCCESS, independent Codex no findings, squash `aa8adf440739c14354ba81bfa63fc9210d177242`.
- Separate exact-source V2 PR #499: 8/8 exact-head checks SUCCESS, independent Codex no findings, squash `9c1b38c6994eebebd3976a70c91c18711f8f5484`.
- Question `iv288-springboottest-vs-webmvctest-slice`: correct **D**, `ai-reviewer` APPROVED, digest `sha256:29b60b599783dbce3484cd728187fa676a05bf9e03b045f060052066ed6425c1`.
- Final checked main 250b88dc435b054bb5065078f81c16098a063943: 71/208 V2 reviews, 137 pending; `editorialStatus: DRAFT`, #392 and human accessibility gate #428 remain OPEN. No publication, deployment or invented human signoff.

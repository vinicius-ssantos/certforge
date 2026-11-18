# OpenSpec workflow

CertForge keeps implementation changes reviewable with OpenSpec's `spec-driven` schema.
The source of truth for a capability is `openspec/specs/<capability>/spec.md`.
Proposed work lives in `openspec/changes/<change-name>/` until it is completed and
archived. The archived change preserves the proposal, design, delta specs and task history.

## Run the CLI

OpenSpec is not required to be globally installed. With Node.js and npm available,
run the pinned version from the repository root:

```sh
npx -y @fission-ai/openspec@2.1.0 list
npx -y @fission-ai/openspec@2.1.0 validate --specs
```

For a new behavior change:

1. Create a named change using `openspec new change <name>`.
2. Write the proposal, design, delta requirements and testable tasks before implementation.
3. Review the scope and implementation constraints, then implement on a feature branch.
4. Check off tasks only after their evidence passes. Run `openspec validate --specs`
   and relevant Java, web and browser tests; require PR CI and human visual review where applicable.
5. Sync accepted requirements into `openspec/specs/`, archive the completed change,
   and verify the final diff before merging the PR.

The `.agents/skills/` and `.claude/skills/` copies provide agent-specific OpenSpec
workflows. Those skill files do not bypass code review, branch protection or the
editorial controls for question content. Existing changes may use their recorded
workflow steps, but unpublished answers are not automatically approved or published.

## Example: Windows line endings in question prompts

The archived `support-crlf-question-prompts` change specifies consistent display
for LF, CRLF and mixed line endings. The change normalizes only text sent to the
frontend renderer; authored content and editorial integrity hashes are unchanged.
The component test verifies paragraph boundaries, code fences, highlighting,
indentation, blank lines and keyboard access.

`openspec/changes/archive/` is an evidence trail, not a queue of incomplete work.

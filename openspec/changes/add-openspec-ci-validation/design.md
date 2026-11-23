## CI gate design

The existing Web CI job already runs Node 24 and is required for PR merges.
Using it avoids introducing a new runner while protecting all repository
branches that trigger the workflow.

The OpenSpec v2.1.0 CLI entrypoint supports:
- validate --all --strict --no-interactive for active changes and specs;
- validate --archived --strict --no-interactive to fail if archived changes
  have unchecked tasks.

The version is pinned to @fission-ai/openspec@2.1.0 rather than latest.
Running in the repository root is mandatory because the existing job
defaults run.working-directory to web.

A negative smoke fixture in openspec/specs/ci-invalid-spec-smoke is created
only during the CI job and removed via trap. A direct, JSON-formatted fixture validation MUST exit nonzero and report
exactly one spec item with valid=false and a structural ERROR about its
requirement/scenario. Aggregate or unrelated CLI failures cannot count as a pass.

The gate is a structural policy. It cannot verify human device/AT testing or
technical correctness of a question, and SHALL NOT be used to close issue #428.

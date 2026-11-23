# OpenSpec validation in GitHub CI

The CI web job uses Node 24 and the explicitly pinned OpenSpec CLI version 2.1.0.
Every pull request and push to main checks both active change specifications and
canonical specifications, then independently checks archived task completion.

Run the same commands from the repository root locally:

    npx --yes @fission-ai/openspec@2.1.0 validate --all --strict --no-interactive
    npx --yes @fission-ai/openspec@2.1.0 validate --archived --strict --no-interactive

These flags were checked against the upstream CLI entrypoint at tag v2.1.0.
The archived scope detects unchecked tasks inside openspec/changes/archive;
it does not replay archived delta specifications. The all scope validates the
active change deltas and canonical specs.

A CI-only negative control creates an intentionally malformed spec under a
temporary root-relative path, expects the strict validator to reject it, and
verifies the failure names the malformed spec. A shell trap removes the file
whether the negative test passes or fails. This prevents a missing CLI or a
generic runtime error from accidentally counting as a successful rejection.

The CI checks validate specification structure, not runtime correctness or
human acceptance. UX assistive-technology/device sign-off still requires real
human evidence in issue #428. They do not publish content, change permissions,
perform a deployment or archive incomplete changes.

If npm cannot retrieve the pinned package, the CI step fails rather than
silently skipping validation. A future change may vendor a locked CLI tool
if reproducible offline execution is required.

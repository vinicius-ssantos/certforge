## Why

CI did not validate OpenSpec at all, so the archival PR #433 could only be
checked structurally when the local Windows workspace was offline. This
left an avoidable governance gap tracked in issue #434.

## What Changes

Use a version-pinned OpenSpec CLI in the existing Node 24 frontend CI job.
Validate all active changes and canonical specs with strict diagnostics,
validate archived change task completion separately, and assert strict
validation rejects a controlled malformed spec.

## Impact

The GitHub CI workflow, an engineering runbook and an OpenSpec change only.
No application code, content approval, database, user data or deploy changes.
The #428 human UX acceptance gate remains separate and unresolved.

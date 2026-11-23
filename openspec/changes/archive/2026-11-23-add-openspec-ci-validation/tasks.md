## CI OpenSpec validation

- [x] Confirm OpenSpec CLI 2.1.0 supports --all, --archived, --strict and --no-interactive from the upstream tagged source.
- [x] Add the version-pinned positive OpenSpec checks in the existing Node 24 frontend CI job.
- [x] Add a controlled negative specification fixture that must be rejected and identify its own name.
- [x] Document matching local commands and the limits of automated validation.
- [x] Confirm the complete GitHub CI and CodeQL on PR #435, including all three OpenSpec checks (CI run 45216632674; CodeQL run 45216632563).
- [x] Review and squash-merge PR #435 (commit 0d0730a855ba0862084e17f64917f6df2f9dd676), then close issue #434 while keeping human UX acceptance #428 open.

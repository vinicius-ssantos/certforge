## CI OpenSpec validation

- [x] Confirm OpenSpec CLI 2.1.0 supports --all, --archived, --strict and --no-interactive from the upstream tagged source.
- [x] Add the version-pinned positive OpenSpec checks in the existing Node 24 frontend CI job.
- [x] Add a controlled negative specification fixture that must be rejected and identify its own name.
- [x] Document matching local commands and the limits of automated validation.
- [ ] Confirm the complete GitHub CI and CodeQL on this PR, including the new OpenSpec checks.
- [ ] Review and merge the change, then update issue #434 without closing the human UX acceptance gate #428.

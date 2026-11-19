## 1. Contract and implementation
- [x] 1.1 Expose the configured study limit in the review queue and regenerate API types.
- [x] 1.2 Bound practice actions after filtering; keep the displayed queue complete.

## 2. Verification
- [x] 2.1 Add regression coverage for expanded queues, custom limits and filtered order.
- [x] 2.2 Run frontend checks, Java checks, and strict OpenSpec validation.
- [x] 2.3 Verify the exact PR head CI, including integration contract and E2E checks.

Evidence (2026-11-19): [CI 44561949927](https://github.com/vinicius-ssantos/certforge/actions/runs/44561949927) and [CodeQL 44561949854](https://github.com/vinicius-ssantos/certforge/actions/runs/44561949854) passed on implementation commit `1bf5681703a3ed6465bfb5c709055e61a2281a2d`. Frontend: 301 tests passed; lint, typecheck, generated API types, build and size budgets passed. Playwright: 55 passed, 17 intentionally skipped. Maven verify passed, including runtime OpenAPI equality (2 tests) and ReviewQueueIT (14 tests, including the non-default session policy). Release image security checks, E2E, performance baseline, and backup/restore rehearsal passed. Strict OpenSpec change validation and four permanent specs passed locally.

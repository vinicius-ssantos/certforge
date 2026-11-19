## 1. Contract and implementation
- [x] 1.1 Expose the configured study limit in the review queue and regenerate API types.
- [x] 1.2 Bound practice actions after filtering; keep the displayed queue complete.

## 2. Verification
- [x] 2.1 Add regression coverage for expanded queues, custom limits and filtered order.
- [ ] 2.2 Run frontend checks, Java checks, and strict OpenSpec validation.
- [ ] 2.3 Verify the exact PR head CI, including integration contract and E2E checks.

Local evidence: frontend suite 300/300 passed before the additional compatibility regression; review suite 16/16 passed including the compatibility case. Lint, typecheck, API types and production build/budget passed. Java integration and exact runtime OpenAPI equality will be verified in PR CI (local host has Java 21 and no Docker; project requires Java 25).

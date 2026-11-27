## Source-only repair checklist

- [x] Individually inspect all nine original questions, every answer alternative, detailed rationale and original references.
- [x] Verify vendor/publisher documentation: Kafka, Spring Boot, Java Streams, Lamport/vector clock research, outbox/CDC and RYW semantics.
- [x] Rewrite nine source JSON files while preserving all original correct keys; add needed original references.
- [x] Strict OpenSpec 14/14 valid and focused review/content-integrity tests 24/24 passed; git diff restricted to nine source question JSON and OpenSpec.
- [ ] Create source-only PR and obtain exact-head CI/CodeQL plus independent Codex review without blocking findings.
- [ ] SHA-guarded squash, post-merge CI, archive OpenSpec in docs-only PR and individually re-review corrected text under #392.

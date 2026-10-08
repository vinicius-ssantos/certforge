# Java Backend interview foundation pack

Status: **DRAFT — human technical review required before any item can be approved or published.**

This is the first small authorial pack for the `java-backend-interview` track. It intentionally contains one guided-response question for each of the twelve topics in `Taxonomy 2026.1`, so the product can demonstrate a complete interview-preparation session without pretending to have broad coverage.

## Editorial boundary

- Questions are original CertForge material and are not represented as leaked, remembered or company-specific interview questions.
- AI may assist drafting, but it cannot approve technical correctness.
- Every item is `GUIDED_RESPONSE`: there is no objective `correct=true/false` key.
- Each revision carries a reference answer, required/optional expected concepts, common mistakes, follow-up prompts, difficulty, seniority and authoritative references.
- `reference-backed` means CI validates structure and review-digest stability. It does **not** mean CI proved the technical claims.
- Human verdicts belong in `review.json` and remain valid only while the semantic digest matches.

## Source policy: java-backend-authoritative-v1

Prefer primary, public technical sources that independently support the reviewed claim: Java/JLS, Spring, Hibernate/Jakarta, JUnit/Testcontainers, Apache Kafka, Kubernetes, AWS service documentation and primary platform architecture guidance.

Version-sensitive claims must cite a versioned source or be phrased so the stable invariant is what is being reviewed. A citation does not turn an engineering heuristic into a deterministic rule.

## Initial coverage

The twelve questions map one-to-one to the twelve topics in `Taxonomy 2026.1`. Child issues #150–#158 expand individual areas; this foundation pack does not close those broader content issues by itself. Behavioral interview content remains deferred pending #159.

Generate the human-review surface with:

`node content/build-manifest-review-packet.mjs --pack content/java-backend-interview --out docs/release/java-backend-interview-review-packet.md`

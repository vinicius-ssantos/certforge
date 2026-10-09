# Multi-track content pack contract — implementation design (#166)

Status: PROPOSED. This is a design contract, **not yet implemented**. Legacy `content/java-se-21` continues unchanged.

## Problem

The current `content/pack.mjs` reads taxonomy from the Java SE 21 V4 seed, inlines `Main.java`, and computes the review digest with `javaRelease`. Java 21's reference whitelist, compiler checks and publish importer cannot simply be applied to Docker, Kubernetes or AWS content. A broad change to that code risks retroactively invalidating 20 reviewed Java questions and 130 unreviewed drafts.

## Proposed manifest

Each new pack adds `pack.json` to its root:

```json
{
  "schemaVersion": 1,
  "packId": "infrastructure-devops-foundations",
  "trackSlug": "infrastructure-devops-foundations",
  "trackKind": "GENERAL",
  "trackVersion": "2026.1",
  "language": "pt-BR",
  "sourcePolicy": "infrastructure-official-v1",
  "evidenceProfile": "static-v1",
  "editorialStatus": "DRAFT"
}
```

Certification packs instead use `trackKind: "CERTIFICATION"` and a `certification` object with `provider`, `examCode`, `providerVersion`, `snapshotDigest` and `verifiedOn`. Reject an exam content pack without a matching verified objective snapshot. Certification profiles are **authored study material**, never copies of proprietary exam questions.

## Question schema

Reuse existing question `prompt`, `options`, `type`, `difficulty`, `difficultyRationale`, `explanation`, `references`, `topicId`; add `objectiveKeys` (certification only) and `evidence` metadata. For non-Java tracks `javaRelease` must not be required or silently defaulted. Exactly one correct option for single-choice; multi-choice needs explicit cardinality; each distractor receives an explanation.

## Evidence adapters

- `reference-backed`: citations to versioned official product documentation; checks URL syntax, version and permitted source domains but does **not** claim logical proof.
- `dockerfile-static`: syntax/lint with a pinned tool, no daemon privileges, host socket or network.
- `kubernetes-schema`: schema validation for explicitly pinned Kubernetes API version, strictly offline.
- `github-actions-static`: YAML/actionlint static checks, no workflow execution.
- `hcl-static`: formatting/validation with fixed terraform binary; no `apply`, cloud authentication or paid resources.
- Existing `java-program`: unchanged Java 21 compilation and output verification.

Every adapter returns an evidence result with tool/version, fixture digest, status and reason. No adapter can approve or publish.

## Editorial workflow and compatibility

1. `readPack` resolves the manifest; **no manifest** selects the current Java 21 legacy loader verbatim.
2. Existing Java 21 semantic `reviewDigest` and `verifiedDigest` must produce exactly the same values; include golden tests against current `review.json`.
3. New packs use a versioned `reviewDigestV2` including track/version, objective keys and evidence contract, without changing the existing algorithm.
4. Import uses stable IDs; dry-run validates catalog version and references; repeated import is idempotent.
5. Import creates only DRAFT or TECHNICAL_REVIEW revisions. Publication requires a human reviewer distinct from author and explicit publisher authorization.
6. Recheck digest on every edit, and refuse publication when source policy, exam snapshot or verified output changes.
7. Show objective coverage and missing objectives explicitly; never report exam readiness based on a count of topics.

## Suggested implementation sequence

- [ ] Extract the legacy Java pack reader without modifying its effective output.
- [ ] Add typed manifest parser and schema validation with fixture-based tests.
- [ ] Add the generic question reader and validation interface.
- [ ] Add source policies by provider and adapter type.
- [ ] Add deterministic static adapters in isolated, pinned tooling.
- [ ] Refactor the importer and review packet generation behind pack dispatch.
- [ ] Regression: all existing Java pack digests and generated review packet match.
- [ ] E2E: non-Java pack import twice; zero duplicates; no unpublished content exposed.
- [ ] Security review for any execution adapter; out-of-scope to execute user-controlled shells in app.

## Explicit non-goals

No automatic external scraping, no automatic source verification, no bypass of the editorial review, no generic remote shell execution, no unversioned exam claims, and no learner-facing GENERAL tracks in this first step.

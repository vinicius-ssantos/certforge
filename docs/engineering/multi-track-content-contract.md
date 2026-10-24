# Multi-track content pack contract — implementation design (#166)

Status: PARTLY IMPLEMENTED. Legacy `content/java-se-21` continues unchanged, and the sections below say which parts of this contract are code and which are still a proposal. The manifest, the question schema, the source policy, the review record, the offline artifact checks and the evidence profiles exist, in `content/pack-manifest.mjs`, `content/manifest-pack.mjs`, `content/review-integrity.mjs`, `content/embedded-artifacts.mjs` and `content/evidence.mjs`; the Terraform, GitHub Actions and container-tool adapters do not.

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
  "evidenceProfile": "reference-backed-v1",
  "editorialStatus": "DRAFT"
}
```

Certification packs instead use `trackKind: "CERTIFICATION"` and a `certification` object with `provider`, `examCode`, `providerVersion`, `snapshotDigest` and `verifiedOn`. Reject an exam content pack without a matching verified objective snapshot. Certification profiles are **authored study material**, never copies of proprietary exam questions.

## Question schema

Reuse existing question `prompt`, `options`, `type`, `difficulty`, `difficultyRationale`, `explanation`, `references`, `topicId`; add `objectiveKeys` (certification only) and `evidence` metadata. For non-Java tracks `javaRelease` must not be required or silently defaulted. Exactly one correct option for single-choice; multi-choice needs explicit cardinality; each distractor receives an explanation.

## Evidence profiles and types — implemented

Every question carries an `evidence` descriptor. There is no silent absence: a question nothing
mechanical checks says `reference-backed`, and `content/evidence.mjs` counts those as the pack's
unchecked ones, which is what `node content/stage-editorial-pack.mjs` prints before an import.

A pack's `evidenceProfile` names which of the types its questions may claim. Only these profiles
exist, and a pack claiming any other name fails the manifest rather than passing unread:

| Profile | Admits |
| --- | --- |
| `reference-backed-v1` | `reference-backed` |
| `static-check-v1` | `reference-backed`, `shell-static-check`, `yaml-static-check`, `manifest-schema-check` |

A claim that a *machine* looked has to point at something a machine here reads, and
`content/evidence.mjs` refuses one that does not:

- `reference-backed`: official pages, within the pack's source policy, over HTTPS. The weakest and
  the honest label — the reviewer's reading is the only check. It claims no logical proof.
- `shell-static-check`: a `dockerfile` block, linted instruction by instruction. A `bash` transcript
  does **not** corroborate it, because nothing here lints shell.
- `yaml-static-check`: a `yaml` block, checked for shape — tabs, indentation steps, duplicate
  sibling keys. This is not a YAML parser and says nothing about meaning.
- `manifest-schema-check`: a `yaml` block that declares `apiVersion` and `kind`, checked against the
  Kubernetes version the pack records, so a removed API version fails.
- `runnable-isolated-test`: named by #166 and admitted by no profile, because nothing in this
  repository runs one for a manifest pack. The Java pack compiles and runs every question's
  programme, and it is not a manifest pack.

No check here can approve or publish, and a passing check is not a review.

## Evidence adapters — still proposed

- `github-actions-static`: YAML/actionlint static checks, no workflow execution.
- `hcl-static`: formatting/validation with a fixed terraform binary; no `apply`, cloud
  authentication or paid resources.
- A container-tool adapter for Dockerfiles and manifests, pinned, with no daemon privileges, host
  socket or network — stronger than the offline checks above, which need no tool at all.
- Existing `java-program`: unchanged Java 21 compilation and output verification.

Each would record tool, version, fixture digest, status and reason, and each needs a profile that
admits it before a question may claim it.

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

No automatic external scraping, no automatic source verification, no bypass of the editorial review, no generic remote shell execution, no unversioned exam claims, and no learner-facing GENERAL tracks in this first step of the *import pipeline* described above.

That non-goal was about the pipeline, not about whether a learner could ever reach a GENERAL track once one existed. #176 has since given the catalog and the UI a general-track read path, the structural twin of the interview one: `GET /api/catalog/general-tracks(/{slug})` and a card beside certification tracks on the home page. It changes nothing here -- an `ACTIVE` general track is still something a human has to set, there is still no importer that writes one, and the seeded `infrastructure-devops-foundations` track stays `DRAFT`, unreachable by this read, until its content pack has been through the review this document is about.

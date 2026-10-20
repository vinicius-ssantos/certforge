# Content packs

Authorial question packs and the tool that imports them.

- `java-se-21/` — the Oracle Java SE 21 Developer pack: 150 original questions, fifteen per topic. The initial 20 and the 13 later Topic 01 questions carry recorded human reviews; 117 questions remain deliberately unreviewed.
- `java-se-21/review.json` — who reviewed those questions, when, and what the review does not establish. Each reviewed question carries a digest of the text that was judged and one of the output the build proved, so a question edited afterwards stops counting as reviewed instead of inheriting the verdict — while writing a program for a question that had none keeps the verdict, because that only adds evidence for a claim already read.
- `pack.mjs` — reading a pack, the catalog it binds to, and its review record.
- `answer-tells.mjs` and each pack's `answer-tells.json` — what a pack gives away about its own answer key, and the ledger holding that level. Both packs leak: `java-se-21` has no four-option question whose correct answer is D, and `infrastructure-devops-foundations` makes the longest option the correct one in 54 of 70. Neither is a wrong answer; both let a learner score above chance without reading the question, which is what [#233](https://github.com/vinicius-ssantos/certforge/issues/233) tracks.
- `build-review-packet.mjs` — builds the packet a technical reviewer works from ([docs/release/content-review-packet.md](../docs/release/content-review-packet.md)): each question as a learner sees it, the answer key and reasons, the verified output, and either the recorded verdict or the policy checks as boxes to tick. Regenerate it with `node content/build-review-packet.mjs`; CI fails if it is out of date.
- `ContentImporter.java` — imports a pack into a running CertForge through the editorial API. Run it with `java content/ContentImporter.java --email ... --password ...`.

**Thirty-three of the one hundred and fifty questions now carry a recorded human technical review by the project owner** ([the record](java-se-21/review.json), [the packet](../docs/release/content-review-packet.md)): the initial 20 were reviewed on 2026-10-02, and the 13 later Topic 01 questions were reviewed on 2026-10-07 in #139. The remaining 117 authorial-expansion questions remain AI-assisted drafts awaiting human technical review. Across the full 150-question pack, 69 questions currently carry runnable verification programs and 81 are conceptual/reference-backed; the reviewed set currently contains 30 runnable and 3 conceptual questions. The generated packet derives the current state and dates from the record, so it cannot silently extend an older verdict to new text.

The build checks that every code snippet compiles for Java 21 and prints what the question says, and that the option carrying that output is the one marked correct. It cannot judge wording, ambiguity or the quality of the explanations. The importer only creates drafts and submits them for review; it never approves or publishes, so a review recorded here still has to be entered in the editorial desk by a reviewer account before anything can go out.

How to write, verify, import, review and publish questions: [docs/engineering/content-authoring.md](../docs/engineering/content-authoring.md) (Portuguese: [docs-pt-br/engineering/content-authoring.md](../docs-pt-br/engineering/content-authoring.md)).


## Infrastructure and DevOps drafts (issues #165–#167)

`infrastructure-devops-foundations/` is a **DRAFT** general-knowledge pack with its first
authorial Docker question. A draft catalog track and ten topic IDs are seeded by V18;
the pack is not learner-facing and its question has **no recorded human review**.

For this new format, stage a validated set of editorial API requests without publishing:

```sh
just test-content   # or: node --test content/*.test.mjs
node content/stage-editorial-pack.mjs content/infrastructure-devops-foundations /tmp/certforge-infra-stage
java content/ContentImporter.java --pack /tmp/certforge-infra-stage --dry-run
# Optional with an authorized author account against an initialized CertForge instance:
# java content/ContentImporter.java --pack /tmp/certforge-infra-stage --email ...
```

Choose a **new** staging directory; the staging command will not overwrite an existing
one. It only writes local request JSON. The existing Java importer optionally sends
those requests and submits each revision for technical review; it never approves or
publishes. The server must have applied migrations through V18 first.

Staging prints what the pack's questions stand on before anything is imported, and
refuses a question that claims a check nothing here performs. A question nothing
mechanical checks says so — `reference-backed` — and the count of those is printed,
because for them the reviewer's reading is the only check. The profiles and what each
type answers to are in
[`docs/engineering/multi-track-content-contract.md`](../docs/engineering/multi-track-content-contract.md).

Caveats: this is a narrow, temporary compatibility adapter. The editorial API does
not yet persist `objectiveKeys`, snapshot digests or evidence results; these fields
remain in the source pack. **Certification packs are rejected by the staging
adapter** until their objective evidence can be persisted. The offline checks are
shape checks, not tool runs: no pinned container, Kubernetes or Terraform tool runs
over a pack, so no profile admits `runnable-isolated-test`. The Java SE 21 pack,
digests and its established import path are unchanged.

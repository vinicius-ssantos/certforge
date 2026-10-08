# Content packs

Authorial question packs and the tool that imports them.

- `java-se-21/` — the Oracle Java SE 21 Developer pack: 150 original questions, fifteen per topic. The initial 20 and the 13 later Topic 01 questions carry recorded human reviews; 117 questions remain deliberately unreviewed.
- `java-se-21/review.json` — who reviewed those questions, when, and what the review does not establish. Each reviewed question carries a digest of the text that was judged and one of the output the build proved, so a question edited afterwards stops counting as reviewed instead of inheriting the verdict — while writing a program for a question that had none keeps the verdict, because that only adds evidence for a claim already read.
- `pack.mjs` — reading a pack, the catalog it binds to, and its review record.
- `build-review-packet.mjs` — builds the packet a technical reviewer works from ([docs/release/content-review-packet.md](../docs/release/content-review-packet.md)): each question as a learner sees it, the answer key and reasons, the verified output, and either the recorded verdict or the policy checks as boxes to tick. Regenerate it with `node content/build-review-packet.mjs`; CI fails if it is out of date.
- `ContentImporter.java` — imports a pack into a running CertForge through the editorial API. Run it with `java content/ContentImporter.java --email ... --password ...`.

**Thirty-three of the one hundred and fifty questions now carry a recorded human technical review by the project owner** ([the record](java-se-21/review.json), [the packet](../docs/release/content-review-packet.md)): the initial 20 were reviewed on 2026-10-02, and the 13 later Topic 01 questions were reviewed on 2026-10-07 in #139. The remaining 117 authorial-expansion questions remain AI-assisted drafts awaiting human technical review. Across the full 150-question pack, 69 questions currently carry runnable verification programs and 81 are conceptual/reference-backed; the reviewed set currently contains 30 runnable and 3 conceptual questions. The generated packet derives the current state and dates from the record, so it cannot silently extend an older verdict to new text.

The build checks that every code snippet compiles for Java 21 and prints what the question says, and that the option carrying that output is the one marked correct. It cannot judge wording, ambiguity or the quality of the explanations. The importer only creates drafts and submits them for review; it never approves or publishes, so a review recorded here still has to be entered in the editorial desk by a reviewer account before anything can go out.

How to write, verify, import, review and publish questions: [docs/engineering/content-authoring.md](../docs/engineering/content-authoring.md) (Portuguese: [docs-pt-br/engineering/content-authoring.md](../docs-pt-br/engineering/content-authoring.md)).

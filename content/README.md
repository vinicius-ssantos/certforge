# Content packs

Authorial question packs and the tool that imports them.

- `java-se-21/` — the Oracle Java SE 21 Developer pack: 100 original questions, ten per topic. The initial 20 carry the recorded review; the 80 later questions are deliberately still unreviewed.
- `java-se-21/review.json` — who reviewed those questions, when, and what the review does not establish. Each reviewed question carries a digest of the text that was judged and one of the output the build proved, so a question edited afterwards stops counting as reviewed instead of inheriting the verdict — while writing a program for a question that had none keeps the verdict, because that only adds evidence for a claim already read.
- `pack.mjs` — reading a pack, the catalog it binds to, and its review record.
- `build-review-packet.mjs` — builds the packet a technical reviewer works from ([docs/release/content-review-packet.md](../docs/release/content-review-packet.md)): each question as a learner sees it, the answer key and reasons, the verified output, and either the recorded verdict or the policy checks as boxes to tick. Regenerate it with `node content/build-review-packet.mjs`; CI fails if it is out of date.
- `ContentImporter.java` — imports a pack into a running CertForge through the editorial API. Run it with `java content/ContentImporter.java --email ... --password ...`.

**Twenty of the one hundred questions were technically reviewed on 2026-10-02 by the project owner, who reported no errors** ([the record](java-se-21/review.json), [the packet](../docs/release/content-review-packet.md)). The other eighty are later authorial expansions and remain AI-assisted drafts awaiting technical review. The generated packet records that mixed state instead of extending the old verdict to new text. Of the newest forty, ten carry runnable verification programs and thirty are conceptual; among the reviewed twenty, three are conceptual as well. The packet derives the complete current list, so it cannot go stale.

The build checks that every code snippet compiles for Java 21 and prints what the question says, and that the option carrying that output is the one marked correct. It cannot judge wording, ambiguity or the quality of the explanations. The importer only creates drafts and submits them for review; it never approves or publishes, so a review recorded here still has to be entered in the editorial desk by a reviewer account before anything can go out.

How to write, verify, import, review and publish questions: [docs/engineering/content-authoring.md](../docs/engineering/content-authoring.md) (Portuguese: [docs-pt-br/engineering/content-authoring.md](../docs-pt-br/engineering/content-authoring.md)).

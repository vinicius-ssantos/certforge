# Content Authoring and Import

Issue: #8 — Create the initial authorial Java certification content pack. Policy: [content policy](../product/content-policy.md). Model and lifecycle: [question bank](../architecture/question-bank.md).

## What the pack is, and what it is not

`content/java-se-21/` holds 150 original questions for the Oracle Java SE 21 Developer track: fifteen per topic, single-choice and multiple-choice, easy to hard. Every question has a per-option explanation, authoritative references, and a difficulty rationale.

**Review status: mixed.** Some of the pack carries a recorded human verdict and the rest does not; how much is in [`content/README.md`](../../content/README.md), where the figures are checked against the record, and which questions in the generated packet. The ones a person has not reviewed were drafted with AI assistance from the Java SE 21 specifications and API documentation. Nothing in the repository publishes an unreviewed question: the importer creates drafts and submits them for technical review, and publishing remains a human editorial decision.

What the tooling does prove, automatically, on every build:

- each question is complete under the question-bank invariants (options, exactly one correct option for single-choice, explanations, references, Java 21);
- every code snippet compiles with `--release 21` and produces exactly the output, or the compile error, that the question states;
- the answer key agrees with that output: when an option carries the text the program prints, that option is the one marked correct, so a question cannot print one thing and point at another;
- the pack covers all ten topics with both question types and all difficulties, and no two prompts are identical;
- the whole pack can be imported into a running application, re-imported without duplicates, and taken through review and publication.

It does **not** prove that a question is well-written, unambiguous, or that its explanations are right. That is what human review is for.

## Layout

```
content/
  ContentImporter.java          standalone importer, no dependencies
  pack.mjs                      reading a pack, its catalog and its review record
  java-se-21/
    review.json                 who reviewed which questions, when, and digests of each
    t04-finally-return/
      question.json             the request body of POST /api/admin/questions
      Main.java                 code shown to learners and verified by the build
      expected.txt              the verified output, or "COMPILE_ERROR: <diagnostic code>"
```

- The directory name is the stable identifier: `t<NN>-<short-slug>`, where `NN` is the topic number.
- `topicId` uses the fixed ids of the seeded topics (`a3000000-0000-4000-8000-0000000000NN`), so the same files load in any environment. No test-only identifiers are involved.
- If the prompt contains `{{snippet}}`, it is replaced by the contents of `Main.java`, so the code learners see is, by construction, the code the build verified. A question may also have a snippet that is only verified and not shown (for example the record facts, where the code backs statements in the options).
- A snippet directory may contain several `.java` files that are compiled together, for example the resource bundles of `t10-resource-bundle-fallback`. `Main` is the entry point.
- Questions without code have only `question.json`.

## Writing a question

1. Copy an existing directory of the same type and topic.
2. Write an original question. Do not copy or closely paraphrase any exam, book, course or question bank. Do not claim it resembles a real exam item.
3. Target Java 21 only (`javaRelease` must be 21 for this track) and avoid behavior the specification leaves unspecified. A question about something the language does not guarantee is ambiguous by construction.
4. Keep code deterministic and independent of the operating system, time, locale defaults, hash ordering and threads. Output must be identical on every supported JDK.
5. Give 4 or 5 options. Every option needs an explanation of why it is correct or incorrect. Distractors must be plausible mistakes, not trick wording.
6. Add authoritative references. Only three sources are accepted, and the build enforces it (ADR 0011):
   - the Java SE specifications, `https://docs.oracle.com/javase/specs/...`, scoped to `se21`;
   - the API documentation, `https://docs.oracle.com/en/java/javase/21/...`;
   - a JEP, `https://openjdk.org/jeps/...`, which needs no scoping because it describes one release.

   Prefer stable anchors. A reference to another release, or to any other site however good, fails the build: before ADR 0011 the only check was the `https://` prefix, which a dead link or the Java 17 page both satisfy. What no check can do is tell whether the reference supports the claim — that stays with the reviewer.
7. State the difficulty and why.
8. Run the pack verification:

```bash
./mvnw -Dtest=ContentPackTest test
```

It fails with the question name if the output, compile result or any invariant differs.

### What the quality gate checks, and what it cannot

Rule 5 above was prose for a long time, and prose does not fail a build. `content/pack-quality.mjs`
now checks the part of it that is mechanical, over the pack as a whole rather than one question at a
time, because that is where these faults are visible:

- **No two options of a question may carry the same explanation.** Three options under one sentence
  are one explanation printed three times, whatever the sentence says.
- **No explanation may be reused by two questions.** A sentence that fits every wrong answer in the
  pack is the template that was filled in, left in place: it is about none of them.
- **A reference title must name the page, not the site.** "Official documentation" is true of every
  page on the host, so it tells a reviewer who wants to check the claim nothing, and a screen reader
  reading forty identical links tells them less.
- **No two options of a question may read the same.** One of them is marked correct, so a learner who
  reads both carefully still has to guess, and knowing the subject does not help. Only what a
  renderer forgives is forgiven here — Unicode composition and runs of whitespace, which HTML
  collapses anyway. Case is not: `t01-boolean-parseboolean` offers `"TRUE"` and `"TrUe"` because
  `Boolean.parseBoolean` ignores case, and three Topic 10 questions turn on `PT-br` against `pt-BR`,
  so a check that lowercased would refuse four correct questions as ambiguous.

What it cannot check is whether an explanation is *right*, or whether a distractor is a mistake
someone would actually make. That is a named human's, by ADR 0005, and no count in that file moves
it. The gate only refuses text that cannot be an explanation of the option it sits under.

### What the pack gives away about its own key

A pack can be entirely correct and still be a poor examination, if the right answer can be picked
without reading the question. `content/answer-tells.mjs` measures the two tells that are mechanical
and records what each pack already leaks in its own `answer-tells.json`, so the number cannot
quietly grow — and cannot be left behind once a leak is closed, which would let the next one in
behind it.

Both packs leak, in opposite ways, and neither is visible from inside a single question:

- `java-se-21` has **no four-option question whose correct answer is D** — all 147 of them, so a
  learner who notices eliminates an option for free. Its option lengths say nothing.
- `infrastructure-devops-foundations` spreads its keys evenly and gives itself away by **length**:
  the longest option is the correct one in 54 of 70, against a chance of about one in four.

So when you write a question: vary which key carries the answer, and do not let the correct option
be the long careful one while the distractors are short. Both are easier to get right while writing
than to repair afterwards, because repairing one means editing the question, and editing a reviewed
question discards the verdict recorded against its text.

The ledger is a record, not a target, and the gate cannot fix either pack: #233 covers stopping the
Java pack's tell where the options are presented to a learner, which costs no review.

### Code inside a question

A snippet in a prompt is read as the thing being taught, so `content/embedded-artifacts.mjs` checks
every fenced block in a pack: a Dockerfile by instruction, YAML for shape — tabs, indentation in
steps of two, a key set twice among siblings — and both for what they declare themselves to be.
**Every fence must name its language.** An unlabelled block gets no highlighting from the renderer
and no check from here, because nothing can tell whether it is broken YAML or prose with a colon in
it.

A block that does not declare itself whole is treated as the fragment it is. `ENTRYPOINT` beside
`CMD` with no `FROM` is a Dockerfile fragment, and `spec:` with a `replicas:` under it is a YAML
fragment; demanding an `apiVersion` of those would only teach authors to paste whole manifests to
satisfy a tool. A block *does* declare itself whole by carrying `FROM`, or `apiVersion` with `kind`,
and then the rules for a file apply: what must come first, which stage a `COPY --from` may name,
whether the Kubernetes recorded for the pack still serves that API version.

That last one is why `pack.json` carries `platformVersions`. It is the floor at which the pack's own
snippets are valid — one entry per platform the pack actually embeds — and it is checked rather than
declared: the gate derives the floor from the files (a named build stage or `COPY --from` needs
17.05, a BuildKit mount 18.09, a heredoc 23.0) and refuses a pack that records less than its own
Dockerfiles need. A manifest obliges the pack to record a Kubernetes version, and a manifest naming
an API version that version has removed fails: applied to such a cluster it would be rejected
outright, so the question would be teaching something that cannot run.

`quality-debt.json` beside a pack records what that pack is known to owe, by question name, so the
gate could be switched on over content that does not pass it yet. CI refuses anything the ledger
does not already list — **and anything the ledger lists that has since been fixed**, so paying a
debt means deleting its line in the same commit. A pack with no ledger has to be clean. Run it with
`just test-content`, which `just check` now includes; before this, the content checks ran only in
CI, which is why a content mistake could pass locally and fail on the pull request.

## Importing

Start the application and PostgreSQL (see [backend bootstrap](backend-bootstrap.md)), then run, from the repository root, with the credentials of an account that has the `EDITOR` role (or `ADMINISTRATOR`):

```bash
java content/ContentImporter.java --base-url http://localhost:8080 --email editor@example.com --password '...'
```

- The account you sign in with becomes the author of record of the imported revisions. Use an account whose holder takes responsibility for the content.
- Each question is created as a draft and submitted for technical review. Nothing is approved or published.
- Questions whose prompt already exists are skipped, so the command can be run again. The summary line reports `created`, `skipped` and `total`.
- `--dry-run` lists what would be imported without contacting the server. `--pack` selects another directory. `CERTFORGE_EMAIL` and `CERTFORGE_PASSWORD` can replace `--email` and `--password`.

## Reviewing and publishing

Reviewing in the product itself goes through **Review one by one** (`/editorial/review`), offered on the editorial desk to an account that may review. It is a worklist rather than a list: every question waiting for a decision, one at a time, grouped so a topic is finished before the next begins and **ordered so the thinnest topic comes first** — a mock needs five published questions in each topic, so deciding where there are two unblocks something and deciding where there are five does not, with everything the reviewer judges on the screen and the next question arriving as soon as this one is decided. `a` moves focus to Approve, `p` to Request changes, `s` skips; a skipped question stays in the queue and is offered again at the end of the walk, unless you came back and decided it. **Previous question** goes back to one you have passed. For an account that also publishes, approving does not move on: the publish step appears on the same question, and the walk continues once the question is finished — otherwise approving would carry it off the screen before it could be published. **Publish as soon as I approve** turns those two presses into one. It is off until you turn it on, it is remembered in your browser alone, and while it is on the button reads **Approve and publish** with what that means beside it, so the irreversible half is written on the control rather than hidden in a dialog. It is still two requests, so the record of what happened is the same as doing it by hand — and if the publish fails, the walk stays on the question, which is then approved and unpublished, and says so. The address carries the question on screen, so a reload or a browser Back returns to your place rather than to the top of the list. Two things the screen says before you press: how far through you are, and — when the revision is yours — that approving it will be refused, because the reviewer has to be someone other than the author, and the account that imports a pack authors every question in it.

**There is deliberately no way to decide more than one question at once**, and the keys move focus rather than press. The only promise this product makes is that a person checked each question (ADR 0005), and a screen that makes approving cheaper than reading would be a machine for producing approvals nobody read — nothing takes an approval back. What the worklist makes cheaper is reaching the question.
The [content review packet](../release/content-review-packet.md) lays the whole pack out for a reviewer: each question as the learner sees it, then the answer key, reasons, references, the output the build verified, and either the verdict already recorded or the checks below as boxes to tick. It is generated (`node content/build-review-packet.mjs`) and CI fails if it is out of date.

A finished review is recorded in the pack's `review.json`: the reviewer, a default review date, how they reviewed, what the review does not establish, and for each question a verdict plus two digests. When a pack is reviewed in batches, an entry may carry its own `reviewedOn`; that date overrides the pack-level default for that question so later approvals do not rewrite the provenance of earlier ones. `digest` covers everything the reviewer judged — the prompt with its code, the options, the answer key, every explanation, the rationale and the references. `verified` covers the output the build proved, or is `null` for a question that carries no program. The packet prints both under each question, ready to paste.

Record it with `just record-review <question> <verdict>` rather than by hand. Until recently nothing in this repository wrote that file — six tools read it, and the entries were typed from the packet, which means copying a sha256 by eye once per question. That is transcription, not judgement, and it is the part a person gets wrong: a mistyped digest records a verdict against text nobody read. The recipe takes the verdict as an argument with **no default**, refuses a verdict it does not know and a question the pack does not have, recomputes the digest from the question as it stands, and rebuilds the packet so CI sees the same thing. Running it twice writes nothing the second time, because nothing was reviewed twice. It cannot produce a verdict, only write yours down.

Those digests are the point. **Edit a reviewed question and it counts as unreviewed again**: the packet marks it "changed since review" and prints new digests, and because CI compares the committed packet with a fresh build, the change cannot reach `main` while still claiming the old verdict.

The two are weighed differently, because the two kinds of change are not the same:

| What you do | The review |
|---|---|
| Change a word of the prompt, an option, the key, an explanation, the rationale or a reference | **lost** |
| Make the program print something else | **lost** — the question no longer does what was reviewed |
| Delete the program | **lost** — the evidence the packet showed is gone |
| **Write a program for a question that had none** | **kept**, and noted as better supported than when the verdict was given |
| Reindent the JSON | kept; the digest covers what was read, not how the file was written |

That fourth row matters. Folding the verified output into one digest would mark a question unreviewed *for being verified*, which punishes exactly the move [ADR 0011](../adr/0011-grade-content-evidence.md) wants to encourage: nothing the reviewer read changed, and the claim now has a program behind it.

Recording a review for a question nobody read defeats all of this, so do not.

Review is done by a different account from the author by default (`reviewer_must_differ_from_author`; see the question-bank document to change this for a single-maintainer setup). The reviewer needs the `REVIEWER` role and the publisher the `ADMINISTRATOR` role.

1. List what awaits review: `GET /api/admin/questions?status=TECHNICAL_REVIEW`. The answer is a page of 25 — read `total` and walk `page` if there is more, or ask for `size=100`.
2. Read each question with `GET /api/admin/questions/{id}`. The reviewer checks, as the content policy requires:
   - there is one defensible interpretation of the prompt;
   - the answer is correct for Java 21, and any code compiles and behaves as stated;
   - there is no hidden dependency on the environment or on unspecified behavior;
   - distractors are plausible and not deliberate tricks unrelated to the objective;
   - every explanation is complete and right;
   - code and prose are readable with assistive technology;
   - the references let someone verify the answer independently.
3. Approve with `POST /api/admin/question-revisions/{revisionId}/approve`, or send it back with `.../request-changes` and a comment.
4. A publisher publishes approved revisions with `.../publish`. A question can be corrected later by creating a new revision; the published one is replaced and kept for history.

A question that is ambiguous or disputed must not be published. Fix it, or leave it in draft.

### Doing all of that at once

Once a review is recorded in the pack, `deploy/publish-pack.mjs` walks the whole workflow for you — create, submit, approve, publish — carrying the recorded verdict as the approval comment and the record's `checklist` as what the reviewer attests to:

```sh
just reviewer reviewer@example.com 'a long password'   # once: the second account approval needs
just publish-content reviewer@example.com 'a long password'
```

It automates the typing, not the judgement, and refuses twice so that it cannot claim a review that does not exist:

- **A question whose recorded digest no longer matches is held back**, not published, because nobody has reviewed the text that would go out. The run reports it and exits non-zero.
- **The reviewer account is never invented.** The demo seeder registers a throwaway reviewer because its questions are throwaway data; here that would write a fictional reviewer into the provenance of real content, so the account is passed in and must already exist.

It also refuses a reviewer that is the author, skips prompts already in the bank so a second run tops up instead of duplicating, and prints the author, reviewer and publisher of record at the end. `--dry-run` reports what it would publish without contacting anything.

### Before publishing anything in this track

**Done.** The topic names and objective wording seeded from `V4__seed_java_certification_catalog.sql` were compared with Oracle's [exam page](https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830) in a browser on 2026-10-02 and reported to match, including the three lines the secondary summaries disagreed about (#68). No migration was needed.

It took a person because the page is rendered by JavaScript and refuses automated clients, so this is not something CI can keep true. **Re-check it when a new exam version is added**, and treat the match as of that date rather than as a permanent property; see [preparation catalog](../architecture/preparation-catalog.md).

## Your own study material

A maintainer may hold a licence to material they have no right to redistribute: an official practice exam, a book's question bank, a course. `content/private/` is where that lives. Git ignores it, and CI fails if any file under it is ever tracked, because `.gitignore` only asks — a `git add -f` or a stray `git add -A` from a different directory gets through it.

This matters more here than in a private project. **This repository is public and Apache-2.0**, so a file committed under `content/` is not merely published: it is sublicensed to everyone who clones it, and that is not a right a licence to study grants anyone.

The scripts already work on any directory, so a private pack needs no special support:

```sh
node deploy/publish-pack.mjs --pack content/private --reviewer-email ... --reviewer-password ...
```

It needs its own `review.json`, like any pack, and that is a useful place to write down in `caveats` what the material is and why it is not in the repository.

### The two ways this leaks anyway

The ignored directory handles the obvious case. Two others are not obvious:

1. **Screenshots.** `just screenshots` captures pages from a *running* stack into `docs/release/screenshots/`, and those PNGs are committed. Recapture them against the end-to-end test stack, whose questions are the suite's own fixtures, and never against an instance holding private content: a screenshot of a licensed question is a copy of it, in the public repository, in a form no text search will ever find.
2. **Derivation, which is the one that actually costs you.** Copying is the easy case to avoid. The trap is reading someone's question, understanding it, and then writing *your own version* of it into the authorial pack. Rewording does not undo derivation; a derivative work is protected the same way. The line that holds is: learn **the subject** from the specification, not **the question** from their bank. If a question in `content/java-se-21/` exists because you saw theirs, it does not belong there however much you rewrote it.

No test can check the second one. It is a discipline, and the only thing automation does here is make the file path impossible to get wrong by accident.

## The initial pack

| Topic | Questions |
|---|---|
| 1 Date, time, text, numeric and boolean values | `t01-integer-boxing-guarantee`, `t01-localdate-plus-months` |
| 2 Controlling program flow | `t02-pattern-switch-guard`, `t02-switch-dominance` |
| 3 Object-oriented concepts | `t03-overload-null`, `t03-record-facts` |
| 4 Exceptions | `t04-finally-return`, `t04-try-with-resources-order` |
| 5 Arrays and collections | `t05-list-remove-overload`, `t05-immutable-and-fixed-size-lists` |
| 6 Streams and lambdas | `t06-stream-laziness`, `t06-stream-facts` |
| 7 Packaging and modules | `t07-requires-transitive`, `t07-exports-and-opens` |
| 8 Concurrency | `t08-virtual-thread-daemon`, `t08-executor-close` |
| 9 Java I/O | `t09-read-all-lines`, `t09-serialization-facts` |
| 10 Localization | `t10-resource-bundle-fallback`, `t10-locale-to-string` |

Every question in the pack now carries a programme the build compiles for Java 21, runs, and checks prints what the question claims — the three that were conceptual when this was written (`t01-integer-boxing-guarantee`, `t06-stream-facts` and `t07-exports-and-opens`) were converted, and `t07-exports-and-opens` became a module graph. A programme is evidence for the answer and not a review: a question with one still awaits a person, and the review packet derives the complete current state rather than repeating it here. This paragraph used to repeat it, said sixty-nine of the hundred and fifty were runnable long after all of them were, and ended by claiming it could not go stale.

`t07-requires-transitive` used to be a fourth. It now carries a three-module graph under `modules/`, where `app` requires only `lib`, uses a type from `util`, and compiles because `lib` declares `requires transitive util` — remove the `transitive` and the build fails with `package u is not visible`. That is the conversion [ADR 0011](../adr/0011-grade-content-evidence.md) asks for, and it kept its recorded review, because nothing the reviewer read changed.

The other three are harder, and two of them may not be worth converting:

- `t01-integer-boxing-guarantee` probably cannot be converted at all. It asks what the specification *guarantees*, and a program only shows what one JVM did; the cache above 127 is explicitly unspecified, so a program printing `false` for 1000 would prove nothing about the rule.
- `t06-stream-facts` and `t07-exports-and-opens` are fact lists where one program can show some claims but not all. `peek` existing "mainly to support debugging" is a statement about intent, and `opens` not granting compile-time access needs a compilation that *fails*. Verifying those honestly needs several verification cases per question, positive and negative, which the harness does not do yet — and a program that proved three of five options while the packet said "a program backs this question" would be worse than none.

## Deferred

A comprehensive commercial-scale bank, AI-generated publication, community submissions, question-performance analytics, and arbitrary learner code execution.

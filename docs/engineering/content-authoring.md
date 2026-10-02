# Content Authoring and Import

Issue: #8 — Create the initial authorial Java certification content pack. Policy: [content policy](../product/content-policy.md). Model and lifecycle: [question bank](../architecture/question-bank.md).

## What the pack is, and what it is not

`content/java-se-21/` holds an initial pack of 20 original questions for the Oracle Java SE 21 Developer track: two per topic, single-choice and multiple-choice, easy to hard. Every question has a per-option explanation, authoritative references, and a difficulty rationale.

**Review status: not reviewed by a human.** The questions were drafted with AI assistance, which the content policy allows only when a person then reviews them technically. Nothing in the repository publishes them. The importer creates them as drafts and submits them for technical review; approving and publishing are decisions for people, through the editorial workflow. Until that happens no learner can see any of them.

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

The [content review packet](../release/content-review-packet.md) lays the whole pack out for a reviewer: each question as the learner sees it, then the answer key, reasons, references, the output the build verified, and either the verdict already recorded or the checks below as boxes to tick. It is generated (`node content/build-review-packet.mjs`) and CI fails if it is out of date.

A finished review is recorded in the pack's `review.json`: the reviewer, the date, how they reviewed, what the review does not establish, and for each question a verdict plus two digests. `digest` covers everything the reviewer judged — the prompt with its code, the options, the answer key, every explanation, the rationale and the references. `verified` covers the output the build proved, or is `null` for a question that carries no program. The packet prints both under each question, ready to paste.

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

1. List what awaits review: `GET /api/admin/questions?status=TECHNICAL_REVIEW`.
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

The topic names and objective wording seeded from `V4__seed_java_certification_catalog.sql` are only partly verified. Oracle University's [announcement of the exam](https://blogs.oracle.com/oracleuniversity/announcing-oracle-certified-professional-java-se-21-developer-exam-and-java-se-21-programming-complete-course) confirms the areas the exam covers, but the exact objective wording comes from secondary summaries, because the exam page is rendered by JavaScript and blocks automated clients. Compare the topics with the official page (`https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830`) in a browser first; see [preparation catalog](../architecture/preparation-catalog.md).

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

Four questions are conceptual and have no runnable code, so the build cannot check them: `t01-integer-boxing-guarantee`, `t06-stream-facts`, `t07-requires-transitive` and `t07-exports-and-opens`. They rely on their references alone, so reviewers should read those references with extra care.

## Deferred

A comprehensive commercial-scale bank, AI-generated publication, community submissions, question-performance analytics, and arbitrary learner code execution.

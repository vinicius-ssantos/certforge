# Content Authoring and Import

Issue: #8 — Create the initial authorial Java certification content pack. Policy: [content policy](../product/content-policy.md). Model and lifecycle: [question bank](../architecture/question-bank.md).

## What the pack is, and what it is not

`content/java-se-21/` holds an initial pack of 20 original questions for the Oracle Java SE 21 Developer track: two per topic, single-choice and multiple-choice, easy to hard. Every question has a per-option explanation, authoritative references, and a difficulty rationale.

**Review status: not reviewed by a human.** The questions were drafted with AI assistance, which the content policy allows only when a person then reviews them technically. Nothing in the repository publishes them. The importer creates them as drafts and submits them for technical review; approving and publishing are decisions for people, through the editorial workflow. Until that happens no learner can see any of them.

What the tooling does prove, automatically, on every build:

- each question is complete under the question-bank invariants (options, exactly one correct option for single-choice, explanations, https references, Java 21);
- every code snippet compiles with `--release 21` and produces exactly the output, or the compile error, that the question states;
- the pack covers all ten topics with both question types and all difficulties, and no two prompts are identical;
- the whole pack can be imported into a running application, re-imported without duplicates, and taken through review and publication.

It does **not** prove that a question is well-written, unambiguous, or that its explanations are right. That is what human review is for.

## Layout

```
content/
  ContentImporter.java          standalone importer, no dependencies
  java-se-21/
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
6. Add authoritative references with `https` URLs (JLS, JEPs, the Java SE 21 API). Prefer stable anchors.
7. State the difficulty and why.
8. Run the pack verification:

```bash
mvn -Dtest=ContentPackTest test
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

### Before publishing anything in this track

The topic names and objective wording seeded from `V4__seed_java_certification_catalog.sql` are only partly verified. Oracle University's [announcement of the exam](https://blogs.oracle.com/oracleuniversity/announcing-oracle-certified-professional-java-se-21-developer-exam-and-java-se-21-programming-complete-course) confirms the areas the exam covers, but the exact objective wording comes from secondary summaries, because the exam page is rendered by JavaScript and blocks automated clients. Compare the topics with the official page (`https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830`) in a browser first; see [preparation catalog](../architecture/preparation-catalog.md).

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

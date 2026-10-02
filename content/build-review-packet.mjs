#!/usr/bin/env node
// Builds the packet a technical reviewer works from: every question of a pack exactly as a learner
// will see it, then the answer key, the reasons, the references, the output the build verified, and
// either the recorded human review or the content policy's checks as boxes to tick. The packet is
// generated, never edited by hand, so it always matches the pack and its review record.
//
// A question edited after it was reviewed shows up here as needing a new review, because the digest
// recorded in review.json no longer matches what the question now says. CI compares this file with
// a fresh build, so that change cannot reach main unnoticed.
//
// Usage: node content/build-review-packet.mjs [--pack content/java-se-21] [--out docs/release/content-review-packet.md]
import { writeFileSync } from "node:fs";
import { readPack, readTopics, readReviewRecord, reviewStatusOf, orphansIn } from "./pack.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};
const pack = option("pack", "content/java-se-21");
const out = option("out", "docs/release/content-review-packet.md");

const CHECKS = [
  "There is one defensible interpretation of the prompt.",
  "The answer is correct for Java 21, and any code compiles and behaves as stated.",
  "There is no hidden dependency on the environment or on unspecified behavior.",
  "The wrong options are plausible, and not tricks unrelated to the objective.",
  "Every explanation is complete and right, including the reasons for the wrong options.",
  "Code and prose are readable with assistive technology.",
  "The references let someone verify the answer independently.",
];

const topics = readTopics();
const questions = readPack(pack, topics);
const record = readReviewRecord(pack);

const orphans = orphansIn(record, questions);
if (orphans.length > 0) {
  console.error(`review.json reviews questions that are not in ${pack}: ${orphans.join(", ")}`);
  console.error("Remove them from the record, or restore the questions.");
  process.exit(1);
}

const status = new Map(questions.map((question) => [question.name, reviewStatusOf(record, question)]));
const withState = (state) => questions.filter((question) => status.get(question.name).state === state);
const reviewed = withState("reviewed");
const changed = withState("changed");
const unreviewed = withState("unreviewed");

const lines = [];
const add = (text = "") => lines.push(text);

add("# Content review packet");
add();
add(`Generated from \`${pack}\` by \`content/build-review-packet.mjs\`. **Do not edit by hand**: regenerate it, and make changes in the pack. Verdicts live in \`${pack}/review.json\`.`);
add();

// The state of the review, as the record and the questions themselves say it is — never as prose
// someone remembered to update.
if (reviewed.length === questions.length) {
  add(`**All ${questions.length} questions were reviewed by ${record.reviewer} (${record.reviewerRole}) on ${record.reviewedOn}, and none has been edited since.** ${record.method}`);
} else if (reviewed.length === 0) {
  add(`**None of these ${questions.length} questions has been reviewed by a person.** They are AI-assisted drafts.`);
} else {
  add(`**${reviewed.length} of ${questions.length} questions carry a current review** by ${record.reviewer}, recorded on ${record.reviewedOn}. ${changed.length} ${changed.length === 1 ? "has" : "have"} been edited since being reviewed and ${changed.length === 1 ? "needs" : "need"} a new one; ${unreviewed.length} ${unreviewed.length === 1 ? "has" : "have"} never been reviewed. Each is marked below.`);
}
add();
add("The build checks that every code snippet compiles for Java 21 and prints what the question says (the \"Verified by the build\" lines), and that an option carrying that output is the one marked correct. It cannot judge wording, ambiguity, the quality of the explanations or whether the question tests the exam objective. That is what a human review is for.");
add();

if (record?.caveats?.length) {
  add("## What this review does not establish");
  add();
  record.caveats.forEach((caveat) => add(`- ${caveat}`));
  // Derived rather than written into the record, which is what let an earlier hand-written list go
  // stale the moment a question gained a program.
  const unverified = questions.filter((question) => question.expected === null);
  add(
    unverified.length === 0
      ? "- Every question in this pack now carries a program the build runs."
      : `- Nothing is verified by the build in ${unverified.length} of the ${questions.length} questions: ${unverified.map((question) => `\`${question.name}\``).join(", ")}.`,
  );
  add();
}

add("## How to review");
add();
add("1. Read each question as a learner would, **without** looking at the answer key, and answer it yourself.");
add("2. Compare with the answer key and the reasons. Run the code if there is any doubt.");
add("3. Make the checks below yourself. A question that is ambiguous or disputed must not be published: write what is wrong under it.");
add(`4. Record the verdict in \`${pack}/review.json\`: your name, the date, and for each question its verdict and the digest printed under it. A question you did not look at must not get an entry.`);
add("5. Then, in the editorial desk, approve it (a person other than the author) or request changes with the comment you wrote here.");
add("6. Check the objective wording of the topics against Oracle's page for the exam (see \"Before publishing anything in this track\" in the [content authoring guide](../engineering/content-authoring.md)).");
add();
add("The checks, from the [content policy](../product/content-policy.md):");
add();
CHECKS.forEach((check, index) => add(`${index + 1}. ${check}`));
add();
add("## Questions");
add();

const MARK = {
  reviewed: (state) => `reviewed ${state.reviewedOn}`,
  changed: () => "**changed since review**",
  unreviewed: () => "**not reviewed**",
};

add("| # | Question | Topic | Type | Difficulty | Runnable code | Review |");
add("|---:|---|---|---|---|---|---|");
questions.forEach((q, index) => {
  const state = status.get(q.name);
  add(
    `| ${index + 1} | [\`${q.name}\`](#${index + 1}-${q.name}) | ${topics.get(q.topicId)?.name ?? q.topicId} | ${q.type === "SINGLE_CHOICE" ? "single" : "multiple"} | ${q.difficulty.toLowerCase()} | ${q.expected === null ? "no (conceptual)" : q.code && q.prompt.includes(q.code) ? "yes, shown" : "yes, not shown"} | ${MARK[state.state](state)} |`,
  );
});
add();

questions.forEach((q, index) => {
  const topic = topics.get(q.topicId);
  const state = status.get(q.name);
  add(`## ${index + 1}. ${q.name}`);
  add();
  add(`**Topic:** ${topic?.name ?? q.topicId}${topic?.objective ? ` (exam objective: "${topic.objective}")` : ""}  `);
  add(`**Type:** ${q.type === "SINGLE_CHOICE" ? "single choice" : "multiple choice, select all that apply"} · **Difficulty:** ${q.difficulty.toLowerCase()} · **Java release:** ${q.javaRelease}`);
  add();
  add("### As the learner sees it");
  add();
  add(q.prompt.split("\n").map((line) => (line === "" ? ">" : `> ${line}`)).join("\n"));
  add();
  q.options.forEach((option) => add(`- **${option.key}** ${option.text}`));
  add();
  add("### Answer key and reasons");
  add();
  q.options.forEach((option) => {
    add(`- **${option.key}: ${option.correct ? "correct" : "incorrect"}.** ${option.explanation}`);
  });
  add();
  add("### Explanation");
  add();
  add(q.explanation);
  add();
  add("### Why this difficulty");
  add();
  add(q.difficultyRationale);
  add();
  add("### References");
  add();
  q.references.forEach((reference) => add(`- [${reference.title}](${reference.url})`));
  add();
  add("### Verified by the build");
  add();
  if (q.expected === null) {
    add("Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.");
  } else {
    const shown = q.code !== null && q.prompt.includes(q.code);
    add(
      shown
        ? "The code in the question compiles for Java 21 and prints:"
        : `A program the learner does not see backs this question. It compiles for Java 21 and prints:`,
    );
    add();
    add("```text");
    add(q.expected || "(no output)");
    add("```");
    // A reviewer cannot judge whether a proof is a proof without seeing it, and for a
    // verification-only program the prompt does not show it.
    if (!shown) {
      add();
      add(`That program, ${q.program.length === 1 ? "in one file" : `across ${q.program.length} files`}:`);
      q.program.forEach((file) => {
        add();
        add(`\`${file.path}\`:`);
        add();
        add("```java");
        add(file.body);
        add("```");
      });
    }
  }
  add();
  add("### Review");
  add();
  if (state.state === "reviewed") {
    add(`**${state.verdict === "APPROVED" ? "Approved" : state.verdict}** by ${state.reviewer} on ${state.reviewedOn}. The question has not changed since, so that verdict still applies.`);
    if (state.verificationAdded) {
      add();
      add("A program has been written for it since that review. Nothing the reviewer read changed, and the claim now has a program behind it, so the verdict stands and is better supported than when it was given.");
    }
    add();
    add("A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:");
  } else if (state.state === "changed") {
    add(`**${state.whatChanged === "the verified output" ? "This question now prints something other than what it printed when" : "This question was edited after"} ${state.reviewer} reviewed it on ${state.reviewedOn}, so it is unreviewed again.** Review it and replace its entry in \`${pack}/review.json\` with the digests below.`);
  }
  add();
  CHECKS.forEach((check) => add(`- [ ] ${check}`));
  add();
  add("**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish");
  add();
  add(`To record: \`"digest": "${state.currentDigest ?? ""}"\`, \`"verified": ${state.currentVerified === null || state.currentVerified === undefined ? "null" : `"${state.currentVerified}"`}\``);
  add();
  add("**Comments:**");
  add();
  add("&nbsp;");
  add();
});

add("## Summary of the review");
add();
add("| # | Question | Verdict | Reviewer | Date |");
add("|---:|---|---|---|---|");
questions.forEach((q, index) => {
  const state = status.get(q.name);
  const cells =
    state.state === "reviewed"
      ? [state.verdict?.toLowerCase() ?? "", state.reviewer ?? "", state.reviewedOn ?? ""]
      : [state.state === "changed" ? "needs a new review" : "", "", ""];
  add(`| ${index + 1} | \`${q.name}\` | ${cells[0]} | ${cells[1]} | ${cells[2]} |`);
});
add();

writeFileSync(out, `${lines.join("\n")}\n`);
console.log(
  `${questions.length} questions written to ${out}: ${reviewed.length} reviewed, ${changed.length} changed since review, ${unreviewed.length} never reviewed`,
);

#!/usr/bin/env node
// Builds the packet a technical reviewer works from: every question of a pack exactly as a learner
// will see it, then the answer key, the reasons, the references, the output the build verified, and
// the content policy's checks as boxes to tick. The packet is generated, never edited by hand, so it
// always matches the pack.
//
// Usage: node content/build-review-packet.mjs [--pack content/java-se-21] [--out docs/release/content-review-packet.md]
import { readdirSync, readFileSync as readRaw, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Read as LF whatever the checkout used, so the packet is the same on every machine and in CI.
const readFileSync = (path, encoding) => readRaw(path, encoding).replace(/\r\n/g, "\n");

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};
const pack = option("pack", "content/java-se-21");
const out = option("out", "docs/release/content-review-packet.md");

// Topic names and the exam objective each is mapped to, from the seeded catalog.
const seed = readFileSync("src/main/resources/db/migration/V4__seed_java_certification_catalog.sql", "utf8");
const topics = new Map();
for (const match of seed.matchAll(/\('(a3000000-[0-9a-f-]+)', 'a1000000-[0-9a-f-]+', '[^']+', '([^']+)'\)/g)) {
  topics.set(match[1], { name: match[2] });
}
for (const match of seed.matchAll(/\('a2000000-[0-9a-f-]+', '(a3000000-[0-9a-f-]+)', '([^']+)', (\d+)\)/g)) {
  const topic = topics.get(match[1]);
  if (topic) {
    topic.objective = match[2];
    topic.position = Number(match[3]);
  }
}

const CHECKS = [
  "There is one defensible interpretation of the prompt.",
  "The answer is correct for Java 21, and any code compiles and behaves as stated.",
  "There is no hidden dependency on the environment or on unspecified behavior.",
  "The wrong options are plausible, and not tricks unrelated to the objective.",
  "Every explanation is complete and right, including the reasons for the wrong options.",
  "Code and prose are readable with assistive technology.",
  "The references let someone verify the answer independently.",
];

const directories = readdirSync(pack, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const questions = directories.map((name) => {
  const dir = join(pack, name);
  let raw = readFileSync(join(dir, "question.json"), "utf8");
  const main = join(dir, "Main.java");
  const code = existsSync(main) ? readFileSync(main, "utf8").trimEnd() : null;
  const expected = existsSync(join(dir, "expected.txt")) ? readFileSync(join(dir, "expected.txt"), "utf8").trimEnd() : null;
  if (raw.includes("{{snippet}}")) {
    raw = raw.replace("{{snippet}}", () => JSON.stringify(code).slice(1, -1));
  }
  return { name, code, expected, ...JSON.parse(raw) };
});

questions.sort(
  (a, b) => (topics.get(a.topicId)?.position ?? 99) - (topics.get(b.topicId)?.position ?? 99) || a.name.localeCompare(b.name),
);

const lines = [];
const add = (text = "") => lines.push(text);

add("# Content review packet");
add();
add(`Generated from \`${pack}\` by \`content/build-review-packet.mjs\`. **Do not edit by hand**: regenerate it, and make changes in the pack.`);
add();
add("**None of these questions has been reviewed by a person.** They are AI-assisted drafts. The build checks that every code snippet compiles for Java 21 and prints what the question says (the \"Verified by the build\" lines), and that an option carrying that output is the one marked correct. It cannot judge wording, ambiguity, the quality of the explanations or whether the question tests the exam objective. That is what this review is for.");
add();
add("## How to review");
add();
add("1. Read each question as a learner would, **without** looking at the answer key, and answer it yourself.");
add("2. Compare with the answer key and the reasons. Run the code if there is any doubt.");
add("3. Tick the checks you made yourself. A question that is ambiguous or disputed must not be published: write what is wrong under it.");
add("4. Record a verdict. Then, in the editorial desk, approve it (a person other than the author) or request changes with the comment you wrote here.");
add("5. Check the objective wording of the topics against Oracle's page for the exam (see \"Before publishing anything in this track\" in the [content authoring guide](../engineering/content-authoring.md)).");
add();
add("The checks, from the [content policy](../product/content-policy.md):");
add();
CHECKS.forEach((check, index) => add(`${index + 1}. ${check}`));
add();
add("## Questions");
add();
add("| # | Question | Topic | Type | Difficulty | Runnable code |");
add("|---:|---|---|---|---|---|");
questions.forEach((q, index) => {
  add(`| ${index + 1} | [\`${q.name}\`](#${index + 1}-${q.name}) | ${topics.get(q.topicId)?.name ?? q.topicId} | ${q.type === "SINGLE_CHOICE" ? "single" : "multiple"} | ${q.difficulty.toLowerCase()} | ${q.code ? "yes" : "no (conceptual)"} |`);
});
add();

questions.forEach((q, index) => {
  const topic = topics.get(q.topicId);
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
  if (q.code) {
    add(`The code in the question compiles for Java 21 and prints:`);
    add();
    add("```text");
    add(q.expected ?? "(no output)");
    add("```");
  } else {
    add("Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references, so read them with extra care.");
  }
  add();
  add("### Review");
  add();
  CHECKS.forEach((check) => add(`- [ ] ${check}`));
  add();
  add("**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish");
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
questions.forEach((q, index) => add(`| ${index + 1} | \`${q.name}\` | | | |`));
add();

writeFileSync(out, `${lines.join("\n")}\n`);
console.log(`${questions.length} questions written to ${out}`);

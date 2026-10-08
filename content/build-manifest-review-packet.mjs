#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import {
  manifestOrphansIn,
  manifestReviewStatusOf,
  readManifestPack,
  readManifestReviewRecord,
} from "./manifest-pack.mjs";

const args = process.argv.slice(2);
function option(name, fallback) {
  const at = args.indexOf("--" + name);
  return at >= 0 ? args[at + 1] : fallback;
}

const packDir = option("pack", "content/java-backend-interview");
const out = option("out", "docs/release/java-backend-interview-review-packet.md");

const commonChecks = [
  "The prompt has one defensible interpretation.",
  "The technical claims and reviewed criteria are correct at the declared seniority.",
  "The difficulty rationale matches what the question actually asks.",
  "The references let a reviewer verify the technical claims independently.",
  "The wording and structure are readable and accessible.",
  "The item is original CertForge material and is not represented as a leaked/company interview question.",
];

const guidedChecks = [
  "The reference answer is defensible rather than an artificially unique answer.",
  "Required expected concepts are genuinely required for this prompt and seniority.",
  "Optional concepts, mistakes and follow-ups improve the exercise without inventing hidden requirements.",
  "The criteria do not imply deterministic correct/incorrect or a hiring/readiness score.",
];

const objectiveChecks = [
  "The answer key is deterministic and the selected correct option(s) are defensible.",
  "Every materially plausible wrong option has a correct explanation.",
];

const loaded = readManifestPack(packDir);
const manifest = loaded.manifest;
const questions = loaded.questions;
const record = readManifestReviewRecord(packDir);
const orphans = manifestOrphansIn(record, questions);
if (orphans.length > 0) {
  console.error("review.json names missing questions: " + orphans.join(", "));
  process.exit(1);
}

const statuses = new Map();
for (const question of questions) {
  statuses.set(question.name, manifestReviewStatusOf(record, manifest, question));
}
const byState = (value) => questions.filter((q) => statuses.get(q.name).state === value);
const reviewed = byState("reviewed");
const changed = byState("changed");
const unreviewed = byState("unreviewed");

const lines = [];
const add = (value = "") => lines.push(value);
const quote = (value) => String(value).split("\n").map((line) => line ? "> " + line : ">").join("\n");

add("# Manifest content review packet");
add();
add("Generated from " + packDir + " by content/build-manifest-review-packet.mjs.");
add("Do not edit this packet by hand. Edit the pack and regenerate it. Human verdicts live in " + packDir + "/review.json.");
add();
add("Pack: " + manifest.packId + " | Track: " + manifest.trackSlug + " (" + manifest.trackKind + ") | Version: " + manifest.trackVersion + " | Language: " + manifest.language + " | Editorial status: " + manifest.editorialStatus);
add();
add("Review state: " + reviewed.length + "/" + questions.length + " reviewed; " + changed.length + " changed since review; " + unreviewed.length + " never reviewed.");
add();
add("Automated validation checks schema and digest stability. It does not establish technical correctness.");
add();

if (record && Array.isArray(record.caveats) && record.caveats.length > 0) {
  add("## Recorded caveats");
  add();
  for (const caveat of record.caveats) add("- " + caveat);
  add();
}

add("## How to review");
add();
add("1. Read the learner prompt first and answer it without reading the criteria.");
add("2. Compare with the reviewed material and verify every technical claim against the references.");
add("3. Apply the checklist. If the item is ambiguous or misleading, request changes.");
add("4. Record only questions personally reviewed in " + packDir + "/review.json using the digest printed under the item.");
add("5. A semantic edit changes the digest and invalidates the recorded verdict.");
add();

add("## Questions");
add();
add("| # | Question | Topic ID | Type | Seniority | Difficulty | Review |");
add("|---:|---|---|---|---|---|---|");
questions.forEach((question, index) => {
  const current = statuses.get(question.name);
  let label = "**not reviewed**";
  if (current.state === "reviewed") label = "reviewed " + (current.reviewedOn || "");
  if (current.state === "changed") label = "**changed since review**";
  add("| " + (index + 1) + " | " + question.name + " | " + question.topicId + " | " + question.type + " | " + (question.seniority || "n/a") + " | " + question.difficulty + " | " + label + " |");
});
add();

questions.forEach((question, index) => {
  const current = statuses.get(question.name);
  add("## " + (index + 1) + ". " + question.name);
  add();
  add("Topic ID: " + question.topicId);
  add("Type: " + question.type + " | Seniority: " + (question.seniority || "n/a") + " | Difficulty: " + question.difficulty);
  add();
  add("### As the learner sees it");
  add();
  add(quote(question.prompt));
  add();

  if (question.type === "GUIDED_RESPONSE") {
    const guided = question.guidedResponse;
    add("### Reviewed response criteria");
    add();
    add("Reference answer:");
    add();
    add(guided.referenceAnswer);
    add();
    add("Expected concepts:");
    for (const concept of guided.expectedConcepts) {
      add("- " + (concept.required ? "REQUIRED" : "OPTIONAL") + ": " + concept.text + (concept.explanation ? " — " + concept.explanation : ""));
    }
    add();
    if ((guided.commonMistakes || []).length > 0) {
      add("Common mistakes:");
      for (const value of guided.commonMistakes) add("- " + value);
      add();
    }
    if ((guided.followUps || []).length > 0) {
      add("Likely follow-ups:");
      for (const value of guided.followUps) add("- " + value);
      add();
    }
  } else {
    add("### Answer key and reasons");
    add();
    for (const answer of question.options) {
      add("- " + answer.key + ": " + (answer.correct ? "correct" : "incorrect") + " — " + answer.text + " — " + answer.explanation);
    }
    add();
    add("Explanation:");
    add(question.explanation);
    add();
  }

  add("### Why this difficulty");
  add();
  add(question.difficultyRationale);
  add();
  add("### References");
  add();
  for (const reference of question.references) {
    add("- " + reference.title + ": " + reference.url);
  }
  add();
  add("### Evidence declaration");
  add();
  add(question.evidence ? JSON.stringify(question.evidence) : "No executable evidence declared; correctness rests on references and human review.");
  add();
  add("### Review");
  add();
  if (current.state === "reviewed") {
    add(current.verdict + " by " + current.reviewer + " on " + current.reviewedOn + ". The digest still matches.");
    add();
  } else if (current.state === "changed") {
    add("Changed since the previous human review. The old verdict no longer applies.");
    add();
  }
  for (const check of commonChecks) add("- [ ] " + check);
  for (const check of (question.type === "GUIDED_RESPONSE" ? guidedChecks : objectiveChecks)) add("- [ ] " + check);
  add();
  add("Verdict: [ ] approve  [ ] request changes  [ ] do not publish");
  add("Digest to record: " + current.currentDigest);
  add("Comments:");
  add();
  add("&nbsp;");
  add();
});

add("## Summary");
add();
add("| # | Question | Verdict | Reviewer | Date |");
add("|---:|---|---|---|---|");
questions.forEach((question, index) => {
  const current = statuses.get(question.name);
  const verdict = current.state === "reviewed" ? current.verdict : current.state === "changed" ? "needs new review" : "";
  const reviewer = current.state === "reviewed" ? (current.reviewer || "") : "";
  const date = current.state === "reviewed" ? (current.reviewedOn || "") : "";
  add("| " + (index + 1) + " | " + question.name + " | " + verdict + " | " + reviewer + " | " + date + " |");
});
add();

writeFileSync(out, lines.join("\n") + "\n");
console.log(questions.length + " questions written to " + out + ": " + reviewed.length + " reviewed, " + changed.length + " changed, " + unreviewed.length + " unreviewed");

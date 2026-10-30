#!/usr/bin/env node
// Publishes a reviewed content pack through the real editorial workflow, carrying the verdict a
// person recorded in the pack's review.json.
//
// ADR 0005 rejects publishing AI-drafted questions automatically, and this does not do that. Two
// refusals keep it honest:
//
//   1. A question whose recorded digest no longer matches what the question says is not published.
//      Nobody has reviewed the text that would go out, so publishing it would claim a review that
//      does not exist.
//   2. The reviewer account is given on the command line and never invented. The demo seeder
//      registers a throwaway reviewer because its questions are throwaway data; doing that here
//      would write a fictional reviewer into the provenance of real content.
//
// What this automates is the typing, not the judgement.
//
// This script prints no email address. Its output is a provenance report that gets pasted into
// issues and captured in CI logs, where an address outlives the run; the provenance identifier the
// project uses is the handle in review.json, and the account-level detail is stored on each
// revision and shown in the editorial desk. CodeQL flags the clear-text case, so a message that
// names an account will fail the build rather than slip through.
//
// Usage: node deploy/publish-pack.mjs --reviewer-email ... --reviewer-password ...
//                                     [--ai-reviewer-email ... --ai-reviewer-password ...]
//                                     [--url http://localhost:8081] [--pack content/java-se-21] [--dry-run]
//        BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are the author's and the publisher's.
//
// A question whose review.json entry names "ai-reviewer" (ADR 0023) is published through a single
// ai-approve call on the --ai-reviewer-* account instead of the ordinary approve-then-publish on
// --reviewer-*. Either pair is required only when the run actually has a question that needs it.
//
// --ai-reviewed-only restricts the run to those AI-reviewed questions and does not require
// --reviewer-email/--reviewer-password at all, even when the pack also holds human-approved
// questions: it leaves every one of those untouched rather than publish them under a reviewer
// account this run did not ask for. A human-approved question's publish stays a separate run, with
// the actual reviewer's own credentials -- this flag exists so the AI reviewer's lane never needs
// them to clear a credential check for work it is not doing.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Session, signInAdmin } from "./lib/session.mjs";
import { readPack, readReviewRecord, reviewStatusOf } from "../content/pack.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};
const dryRun = args.includes("--dry-run");
const aiReviewedOnly = args.includes("--ai-reviewed-only");

const url = option("url", process.env.E2E_BASE_URL ?? "http://localhost:8081");
const pack = option("pack", "content/java-se-21");
const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
const reviewerEmail = option("reviewer-email", process.env.CERTFORGE_REVIEWER_EMAIL);
const reviewerPassword = option("reviewer-password", process.env.CERTFORGE_REVIEWER_PASSWORD);
const aiReviewerEmail = option("ai-reviewer-email", process.env.CERTFORGE_AI_REVIEWER_EMAIL);
const aiReviewerPassword = option("ai-reviewer-password", process.env.CERTFORGE_AI_REVIEWER_PASSWORD);

function refuse(...message) {
  console.error(...message);
  process.exit(2);
}

// ---- what the record says, before anything is contacted ----------------------------------------

const questions = readPack(pack);
const record = readReviewRecord(pack);
if (!record) {
  refuse(
    `${pack} has no review.json, so nothing in it has been reviewed.`,
    "\nA person reviews it from docs/release/content-review-packet.md and records the verdict there.",
  );
}

// A manifest pack records its reviews the other way round: content/review-integrity.mjs binds each
// verdict to the question file's git blob, while this script compares the digest content/pack.mjs
// computes against the one the Java pack's review.json stores. Run over a manifest pack it does not
// simply fail. It prints "edited after <reviewer> reviewed it" for every question, which is a false
// statement about a person's review — and the surest way to teach an operator to ignore the warning
// that exists to protect the pack this scheme does cover.
if (existsSync(join(pack, "pack.json"))) {
  const caveats = [record.caveats ?? []].flat().filter((caveat) => typeof caveat === "string");
  refuse(
    `${pack} is a manifest pack. Its reviews are recorded against each question's git blob and checked`,
    "\nby content/review-integrity.mjs, not by the digest scheme this publisher reads, so it would report",
    "\nevery question as edited since its review. That is untrue, and this refuses rather than print it.",
    caveats.length > 0 ? `\n\nThe record states what it is:\n  ${caveats.join("\n  ")}` : "",
    "\n\nTurning those sign-offs into editorial decisions is a separate step, taken in the editorial desk",
    "\nwith the reviewer's own account.",
  );
}

const approved = [];
const held = [];
for (const question of questions) {
  const status = reviewStatusOf(record, question);
  if (status.state === "reviewed" && status.verdict === "APPROVED") {
    approved.push({ question, status });
  } else {
    held.push({ question, status });
  }
}

if (held.length > 0) {
  console.error(`Holding back ${held.length} of ${questions.length} question(s), not reviewed as they now stand:`);
  for (const { question, status } of held) {
    const why =
      status.state === "changed"
        ? `edited after ${status.reviewer} reviewed it on ${status.reviewedOn}`
        : status.state === "unreviewed"
          ? "no recorded review"
          : `recorded verdict is ${status.verdict}`;
    console.error(`  ${question.name}: ${why}`);
  }
  console.error("");
}
const approvedAi = approved.filter(({ status }) => status.reviewer === "ai-reviewer");
const approvedHuman = approved.filter(({ status }) => status.reviewer !== "ai-reviewer");
const toPublish = aiReviewedOnly ? approvedAi : approved;

if (toPublish.length === 0) {
  refuse(
    aiReviewedOnly
      ? "Nothing in this pack is both AI-reviewed and approved. Nothing to publish."
      : "Nothing in this pack is both reviewed and approved. Nothing to publish.",
  );
}

console.log(`${approved.length} question(s) carry a current recorded approval.`);
if (aiReviewedOnly && approvedHuman.length > 0) {
  console.log(
    `--ai-reviewed-only: leaving ${approvedHuman.length} human-approved question(s) untouched;`,
    "publish those separately with --reviewer-email/--reviewer-password.",
  );
}
if (dryRun) {
  for (const { question } of toPublish) {
    console.log(`would publish ${question.name}`);
  }
  console.log(`\ndry run: nothing was contacted. ${held.length} held back.`);
  process.exit(held.length > 0 ? 1 : 0);
}

// ---- the accounts ------------------------------------------------------------------------------

if (!adminEmail || !adminPassword) {
  refuse("Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD to the administrator's.");
}
if (!aiReviewedOnly && approvedHuman.length > 0 && (!reviewerEmail || !reviewerPassword)) {
  refuse(
    "Provide --reviewer-email and --reviewer-password for an existing account with the REVIEWER role:",
    `${approvedHuman.length} approved question(s) were reviewed by a person, not the AI reviewer.`,
    "\nThis script does not create one: the reviewer it records must be the person who did the review.",
  );
}
if (reviewerEmail === adminEmail) {
  refuse(
    "The reviewer you passed is the administrator, which authors and publishes here, so it cannot review.",
    "\nThe release refuses it too (reviewer_must_differ_from_author). Use a second account.",
  );
}
if (approvedAi.length > 0 && (!aiReviewerEmail || !aiReviewerPassword)) {
  refuse(
    "Provide --ai-reviewer-email and --ai-reviewer-password for an account with the AI_REVIEWER role",
    `(ADR 0023): ${approvedAi.length} approved question(s) were reviewed by the AI reviewer, not a person.`,
    "\nCreate or grant one with: just grant-ai-reviewer <email> <password>",
  );
}
if (aiReviewerEmail === adminEmail) {
  refuse(
    "The AI-reviewer account you passed is the administrator, which authors and publishes here, so it",
    "\ncannot review either. The release refuses it too (reviewer_must_differ_from_author).",
  );
}

async function body(response) {
  return response.text();
}

const admin = new Session(url);
await signInAdmin(admin, adminEmail, adminPassword);
const reviewer = new Session(url);
if (!aiReviewedOnly && approvedHuman.length > 0) {
  try {
    await reviewer.signIn(reviewerEmail, reviewerPassword);
  } catch (error) {
    refuse(`The reviewer account you passed could not sign in: ${error.message}`);
  }
}
const aiReviewer = new Session(url);
if (approvedAi.length > 0) {
  try {
    await aiReviewer.signIn(aiReviewerEmail, aiReviewerPassword);
  } catch (error) {
    refuse(`The AI-reviewer account you passed could not sign in: ${error.message}`);
  }
}

// Prompts already in the bank, in any state, so a second run tops up instead of duplicating.
// The queue pages, so this walks every page: stopping at the first would hide the rest of the
// bank and make this publish duplicates of what is already there.
const existing = new Set();
for (let page = 0; ; page += 1) {
  const listed = await admin.call("GET", `/api/admin/questions?size=100&page=${page}`);
  if (!listed.ok) {
    refuse(`Listing the question bank failed with ${listed.status}: ${await body(listed)}`);
  }
  const { items } = JSON.parse(await body(listed));
  if (items.length === 0) break;
  for (const question of items) existing.add(question.prompt);
}

// ---- the workflow ------------------------------------------------------------------------------

let published = 0;
let skipped = 0;
for (const { question, status } of toPublish) {
  if (existing.has(question.prompt)) {
    console.log(`skip      ${question.name} (already in the bank)`);
    skipped += 1;
    continue;
  }

  const { name, code, expected, ...revision } = question;
  const created = await admin.call("POST", "/api/admin/questions", { body: revision });
  if (created.status !== 201) {
    refuse(`Writing ${name} failed with ${created.status}: ${await body(created)}`);
  }
  const revisionId = JSON.parse(await body(created)).revisions[0].id;

  const isAi = status.reviewer === "ai-reviewer";
  const comment = isAi
    ? `Approved by the AI reviewer on ${status.reviewedOn}, recorded in ${pack}/review.json against ` +
      `${status.recordedDigest} (ADR 0023). Provisional until a CONTENT_REVIEW account confirms it.`
    : `Approved by ${status.reviewer} on ${status.reviewedOn}, recorded in ${pack}/review.json ` +
      `against ${status.recordedDigest}. ${record.method}`;
  // The AI-reviewer fast lane (ADR 0022) approves and publishes in the same call; the human path
  // still has two separate steps, by a different account each.
  const steps = isAi
    ? [
        [admin, "submit", undefined],
        [aiReviewer, "ai-approve", { comment, checklist: status.checklist ?? [] }],
      ]
    : [
        [admin, "submit", undefined],
        [reviewer, "approve", { comment, checklist: record.checklist ?? [] }],
        [admin, "publish", undefined],
      ];
  for (const [who, step, payload] of steps) {
    const response = await who.call("POST", `/api/admin/question-revisions/${revisionId}/${step}`, { body: payload });
    if (!response.ok) {
      const detail = await body(response);
      if (step === "approve" && response.status === 403) {
        refuse(`The reviewer account may not approve. Grant it the REVIEWER role with 'just reviewer', then run this again.\n${detail}`);
      }
      if (step === "ai-approve" && response.status === 403) {
        refuse(
          `The AI-reviewer account may not ai-approve. Grant it the AI_REVIEWER role with`,
          `'just grant-ai-reviewer', then run this again.\n${detail}`,
        );
      }
      refuse(`The ${step} of ${name} failed with ${response.status}: ${detail}`);
    }
  }
  console.log(`published ${name}${isAi ? " (AI-reviewed, provisional)" : ""}`);
  published += 1;
}

console.log(`\npublished=${published} skipped=${skipped} held=${held.length} total=${questions.length}`);
// The provenance of record is the accounts, and it is stored on each revision; this summary names
// the recorded reviewer, which is a handle, and prints no address. Output like this ends up pasted
// into issues and CI logs, and an email address in one outlives the run.
console.log("Carrying the per-question reviewer and review date recorded in review.json.");
console.log("The author, reviewer and publisher of record are the accounts used; the editorial desk shows them per revision.");
if (held.length > 0) {
  console.log(`\n${held.length} question(s) were held back; see above.`);
  process.exit(1);
}

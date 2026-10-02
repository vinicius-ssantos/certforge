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
//                                     [--url http://localhost:8081] [--pack content/java-se-21] [--dry-run]
//        BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are the author's and the publisher's.
import { Session } from "./lib/session.mjs";
import { readPack, readReviewRecord, reviewStatusOf } from "../content/pack.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};
const dryRun = args.includes("--dry-run");

const url = option("url", process.env.E2E_BASE_URL ?? "http://localhost:8081");
const pack = option("pack", "content/java-se-21");
const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
const reviewerEmail = option("reviewer-email", process.env.CERTFORGE_REVIEWER_EMAIL);
const reviewerPassword = option("reviewer-password", process.env.CERTFORGE_REVIEWER_PASSWORD);

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
        ? `edited after ${record.reviewer} reviewed it on ${record.reviewedOn}`
        : status.state === "unreviewed"
          ? "no recorded review"
          : `recorded verdict is ${status.verdict}`;
    console.error(`  ${question.name}: ${why}`);
  }
  console.error("");
}
if (approved.length === 0) {
  refuse("Nothing in this pack is both reviewed and approved. Nothing to publish.");
}

console.log(`${approved.length} question(s) carry a current approval by ${record.reviewer} (${record.reviewedOn}).`);
if (dryRun) {
  for (const { question } of approved) {
    console.log(`would publish ${question.name}`);
  }
  console.log(`\ndry run: nothing was contacted. ${held.length} held back.`);
  process.exit(held.length > 0 ? 1 : 0);
}

// ---- the accounts ------------------------------------------------------------------------------

if (!adminEmail || !adminPassword) {
  refuse("Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD to the administrator's.");
}
if (!reviewerEmail || !reviewerPassword) {
  refuse(
    "Provide --reviewer-email and --reviewer-password for an existing account with the REVIEWER role.",
    "\nThis script does not create one: the reviewer it records must be the person who did the review.",
  );
}
if (reviewerEmail === adminEmail) {
  refuse(
    "The reviewer you passed is the administrator, which authors and publishes here, so it cannot review.",
    "\nThe release refuses it too (reviewer_must_differ_from_author). Use a second account.",
  );
}

async function body(response) {
  return response.text();
}

const admin = new Session(url);
await admin.signIn(adminEmail, adminPassword);
const reviewer = new Session(url);
try {
  await reviewer.signIn(reviewerEmail, reviewerPassword);
} catch (error) {
  refuse(`The reviewer account you passed could not sign in: ${error.message}`);
}

// Prompts already in the bank, in any state, so a second run tops up instead of duplicating.
const listed = await admin.call("GET", "/api/admin/questions");
if (!listed.ok) {
  refuse(`Listing the question bank failed with ${listed.status}: ${await body(listed)}`);
}
const existing = new Set(JSON.parse(await body(listed)).map((question) => question.prompt));

// ---- the workflow ------------------------------------------------------------------------------

let published = 0;
let skipped = 0;
for (const { question, status } of approved) {
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

  const comment =
    `Approved by ${record.reviewer} on ${record.reviewedOn}, recorded in ${pack}/review.json ` +
    `against ${status.recordedDigest}. ${record.method}`;
  const steps = [
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
      refuse(`The ${step} of ${name} failed with ${response.status}: ${detail}`);
    }
  }
  console.log(`published ${name}`);
  published += 1;
}

console.log(`\npublished=${published} skipped=${skipped} held=${held.length} total=${questions.length}`);
// The provenance of record is the accounts, and it is stored on each revision; this summary names
// the recorded reviewer, which is a handle, and prints no address. Output like this ends up pasted
// into issues and CI logs, and an email address in one outlives the run.
console.log(`Carrying the verdict ${record.reviewer} recorded on ${record.reviewedOn}.`);
console.log("The author, reviewer and publisher of record are the accounts used; the editorial desk shows them per revision.");
if (held.length > 0) {
  console.log(`\n${held.length} question(s) were held back; see above.`);
  process.exit(1);
}

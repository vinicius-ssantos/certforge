#!/usr/bin/env node
// Publishes a manifest pack's AI-reviewed questions through the real editorial workflow, carrying
// the verdict content/record-ai-review.mjs recorded in the pack's review.json (ADR 0022-0026).
//
// deploy/publish-pack.mjs refuses a manifest pack outright: it reads and writes the legacy Java
// digest scheme, which a manifest pack's `trackVersion`/`certification.snapshotDigest` are not
// part of. This is the manifest-pack counterpart, and it is AI-reviewer-only by design: a manifest
// pack's only other recorded acceptance today (content/review-integrity.mjs's git-blob-sha scheme,
// `infrastructure-devops-foundations` alone) is explicitly NOT an editorial decision -- its own
// review.json says so -- so this script never reads or publishes from it. Only an entry this
// pack's review.json names `"reviewer": "ai-reviewer"` is ever published here.
//
// Two refusals keep it honest, mirroring publish-pack.mjs:
//
//   1. A question whose recorded V2 digest no longer matches what the question (or the pack's own
//      certification snapshot) says is not published. Nobody reviewed the text that would go out.
//   2. The AI-reviewer account is given on the command line and never invented.
//
// What this automates is the typing, not the judgement.
//
// Usage: node deploy/publish-manifest-pack.mjs --pack content/cncf-kcna-certification
//                                              --ai-reviewer-email ... --ai-reviewer-password ...
//                                              [--url http://localhost:8081] [--dry-run]
//        BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are the author's and the publisher's.
import { Session, signInAdmin } from "./lib/session.mjs";
import { readManifestPack, readReviewRecordV2, reviewStatusOfV2 } from "../content/manifest-pack.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};
const dryRun = args.includes("--dry-run");

const url = option("url", process.env.E2E_BASE_URL ?? "http://localhost:8081");
const pack = option("pack");
const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
const aiReviewerEmail = option("ai-reviewer-email", process.env.CERTFORGE_AI_REVIEWER_EMAIL);
const aiReviewerPassword = option("ai-reviewer-password", process.env.CERTFORGE_AI_REVIEWER_PASSWORD);

function refuse(...message) {
  console.error(...message);
  process.exit(2);
}

if (!pack) {
  refuse("Usage: node deploy/publish-manifest-pack.mjs --pack content/<pack> --ai-reviewer-email ... --ai-reviewer-password ...");
}

// ---- what the record says, before anything is contacted ----------------------------------------

const { manifest, questions } = readManifestPack(pack);
const record = readReviewRecordV2(pack);
if (!record) {
  refuse(
    `${pack} has no review.json, so nothing in it has been reviewed.`,
    "\nRecord a verdict first: node content/record-ai-review.mjs --pack " + pack + " --question <name> --verdict APPROVED",
  );
}

const approved = [];
const held = [];
for (const question of questions) {
  const status = reviewStatusOfV2(record, manifest, question);
  if (status.state === "reviewed" && status.verdict === "APPROVED" && status.reviewer === "ai-reviewer") {
    approved.push({ question, status });
  } else {
    held.push({ question, status });
  }
}

if (held.length > 0) {
  console.error(`Holding back ${held.length} of ${questions.length} question(s), not AI-reviewed as they now stand:`);
  for (const { question, status } of held) {
    const why =
      status.state === "changed"
        ? `edited (or the pack's certification snapshot moved) since it was reviewed on ${status.reviewedOn}`
        : status.state === "unreviewed"
          ? "no recorded review"
          : status.reviewer !== "ai-reviewer"
            ? `recorded reviewer is ${status.reviewer}, not the AI reviewer -- this script does not publish human sign-offs`
            : `recorded verdict is ${status.verdict}`;
    console.error(`  ${question.name}: ${why}`);
  }
  console.error("");
}

if (approved.length === 0) {
  refuse("Nothing in this pack is both AI-reviewed and approved as it now stands. Nothing to publish.");
}

console.log(`${approved.length} of ${questions.length} question(s) carry a current AI-reviewer approval.`);
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
if (!aiReviewerEmail || !aiReviewerPassword) {
  refuse(
    "Provide --ai-reviewer-email and --ai-reviewer-password for an account with the AI_REVIEWER role",
    "(ADR 0023). Create or grant one with: just grant-ai-reviewer <email> <password>",
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
const aiReviewer = new Session(url);
try {
  await aiReviewer.signIn(aiReviewerEmail, aiReviewerPassword);
} catch (error) {
  refuse(`The AI-reviewer account you passed could not sign in: ${error.message}`);
}

// Prompts already in the bank, in any state, so a second run tops up instead of duplicating.
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
for (const { question, status } of approved) {
  if (existing.has(question.prompt)) {
    console.log(`skip      ${question.name} (already in the bank)`);
    skipped += 1;
    continue;
  }

  const { name, type, topicId, difficulty, difficultyRationale, prompt, explanation, options, references, objectiveKeys } = question;
  // Only the fields `RevisionRequest` (QuestionAdminController) actually declares. `evidence` is
  // this content scheme's own bookkeeping (content/pack-manifest.mjs), not part of that contract.
  const revision = { type, topicId, difficulty, difficultyRationale, prompt, explanation, options, references, objectiveKeys };
  const created = await admin.call("POST", "/api/admin/questions", { body: revision });
  if (created.status !== 201) {
    refuse(`Writing ${name} failed with ${created.status}: ${await body(created)}`);
  }
  const revisionId = JSON.parse(await body(created)).revisions[0].id;

  const comment =
    `Approved by the AI reviewer on ${status.reviewedOn}, recorded in ${pack}/review.json against ` +
    `${status.recordedDigest} (ADR 0022-0026). Final: no confirmation step follows this.`;
  // The AI-reviewer fast lane (ADR 0022) approves and publishes in the same call.
  for (const [who, step, payload] of [
    [admin, "submit", undefined],
    [aiReviewer, "ai-approve", { comment, checklist: status.checklist ?? [] }],
  ]) {
    const response = await who.call("POST", `/api/admin/question-revisions/${revisionId}/${step}`, { body: payload });
    if (!response.ok) {
      const detail = await body(response);
      if (step === "ai-approve" && response.status === 403) {
        refuse(
          `The AI-reviewer account may not ai-approve. Grant it the AI_REVIEWER role with`,
          `'just grant-ai-reviewer', then run this again.\n${detail}`,
        );
      }
      refuse(`The ${step} of ${name} failed with ${response.status}: ${detail}`);
    }
  }
  console.log(`published ${name} (AI-reviewed)`);
  published += 1;
}

console.log(`\npublished=${published} skipped=${skipped} held=${held.length} total=${questions.length}`);
console.log("Carrying the per-question AI-reviewer approval and review date recorded in review.json.");
console.log("The author and AI-reviewer of record are the accounts used; the editorial desk shows them per revision.");
if (held.length > 0) {
  console.log(`\n${held.length} question(s) were held back; see above.`);
  process.exit(1);
}

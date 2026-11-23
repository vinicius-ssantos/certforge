#!/usr/bin/env node
// Explicitly import the owner's previously approved Java t01/t02 questions into the
// throwaway review installation. Not a general self-approval mechanism.
// The repository records the owner's existing verdicts; the local ADMINISTRATOR
// account is allowed to self-review (CONTENT_SELF_REVIEW) and the editorial audit
// must show that the author and reviewer are the SAME account, not a fictitious peer.
import { Session, signInAdmin } from "./lib/session.mjs";
import { readPack, readReviewRecord, reviewStatusOf } from "../content/pack.mjs";

const base = process.env.CERTFORGE_REVIEW_URL ?? "http://127.0.0.1:8082";
if (!["http://127.0.0.1:8082", "http://localhost:8082"].includes(base)) {
  throw new Error("Owner-reviewed importer may run only on the isolated local review stack :8082.");
}
const apply = process.argv.includes("--apply");
if (process.argv.slice(2).some((arg) => arg !== "--apply")) {
  throw new Error("Usage: node deploy/publish-owner-reviewed-local.mjs [--apply]");
}
const pack = "content/java-se-21";
const record = readReviewRecord(pack);
if (record?.reviewer !== "vinicius-ssantos" || record?.reviewerRole !== "project owner and maintainer") {
  throw new Error("Maintainer's existing review record is missing or changed.");
}
const selected = readPack(pack).filter((q) => /^t0[12]-/.test(q.name));
if (selected.length !== 30 || selected.filter((q) => q.name.startsWith("t01-")).length !== 15
    || selected.filter((q) => q.name.startsWith("t02-")).length !== 15) {
  throw new Error("Unexpected t01/t02 manifest size: refusing partial or expanded import.");
}
for (const question of selected) {
  const status = reviewStatusOf(record, question);
  if (status.state !== "reviewed" || status.verdict !== "APPROVED"
      || status.reviewer !== record.reviewer) {
    throw new Error(`Refusing ${question.name}: no current matching owner-approved digest.`);
  }
}
if (!apply) {
  console.log("DRY RUN: 30 current owner-approved questions (15 t01 + 15 t02) eligible.");
  console.log("No HTTP request was sent. To publish only to local review :8082, pass --apply.");
  process.exit(0);
}
if (!process.env.BOOTSTRAP_ADMIN_EMAIL || !process.env.BOOTSTRAP_ADMIN_PASSWORD) {
  throw new Error("Supply the existing review admin credentials as environment variables.");
}
const session = new Session(base);
await signInAdmin(session, process.env.BOOTSTRAP_ADMIN_EMAIL, process.env.BOOTSTRAP_ADMIN_PASSWORD);

async function json(method, path, body) {
  const r = await session.call(method, path, body === undefined ? undefined : { body });
  if (!r.ok) throw new Error(`${method} ${path}: HTTP ${r.status} ${await r.text()}`);
  return r.json();
}
const me = await json("GET", "/api/auth/me");
if (!me.roles?.includes("ADMINISTRATOR")) {
  throw new Error("Current signed-in identity is not the local ADMINISTRATOR with CONTENT_SELF_REVIEW.");
}
const existing = new Map();
for (let page = 0; ; page++) {
  const { items } = await json("GET", `/api/admin/questions?size=100&page=${page}`);
  if (items.length === 0) break;
  for (const question of items) existing.set(question.prompt, question);
}
let published = 0, skipped = 0;
for (const question of selected) {
  // Existing published material must not be duplicated or silently rewritten.
  const already = existing.get(question.prompt);
  if (already) {
    if (already.latestStatus !== "PUBLISHED") {
      throw new Error(`Question ${question.name} exists as ${already.latestStatus}, not PUBLISHED; refusing to skip or duplicate it.`);
    }
    console.log(`skip ${question.name} (already PUBLISHED)`);
    skipped++;
    continue;
  }
  const { name, code, expected, ...revision } = question;
  const created = await json("POST", "/api/admin/questions", revision);
  const id = created.revisions?.[0]?.id;
  if (!id) throw new Error(`Created question ${name} without a revision ID`);
  await json("POST", `/api/admin/question-revisions/${id}/submit`);
  const status = reviewStatusOf(record, question);
  const note = `LOCAL REVIEW OWNER SELF-REVIEW (not an independent reviewer). Prior owner record ${record.reviewer}, ${status.reviewedOn}; current question digest ${status.recordedDigest}. Author and reviewer are the same authenticated ADMINISTRATOR account, allowed by CONTENT_SELF_REVIEW. ${record.method}`;
  await json("POST", `/api/admin/question-revisions/${id}/approve`, {
    comment: note, checklist: record.checklist ?? [],
  });
  await json("POST", `/api/admin/question-revisions/${id}/publish`);
  console.log(`published ${name} (owner self-review disclosed)`);
  published++;
}
console.log(`DONE: published=${published}, already-present=${skipped}, selected=${selected.length}`);

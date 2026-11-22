#!/usr/bin/env node
// Explicitly activate a migrated review catalogue entry; publishes no questions.
// Restricted to the local review stack to protect release and E2E projects.
import { Session, signInAdmin } from "./lib/session.mjs";

const url = process.env.CERTFORGE_REVIEW_URL ?? "http://127.0.0.1:8082";
const slug = process.argv[2];
if (!["http://127.0.0.1:8082", "http://localhost:8082"].includes(url)) {
  throw new Error("This helper only works against the isolated :8082 review stack.");
}
if (!slug) throw new Error("Usage: node deploy/activate-review-track.mjs <existing-track-slug>");
const admin = new Session(url);
await signInAdmin(admin, process.env.BOOTSTRAP_ADMIN_EMAIL, process.env.BOOTSTRAP_ADMIN_PASSWORD);
async function json(method, path) {
  const r = await admin.call(method, path);
  if (!r.ok) throw new Error(`${method} ${path} failed with HTTP ${r.status}: ${await r.text()}`);
  return r.json();
}
const catalog = await json("GET", "/api/admin/catalog/tracks");
let track = catalog.find((entry) => entry.slug === slug);
if (!track) throw new Error(`No existing seeded track with slug ${slug}`);
if (track.status !== "ACTIVE") {
  track = await json("POST", `/api/admin/catalog/tracks/${track.id}/activate`);
  console.log(`Activated track ${slug}`);
}
const candidates = track.examVersions.filter((entry) => entry.status === "ACTIVE" || entry.status === "DRAFT");
if (candidates.length !== 1) throw new Error(`Expected one active-or-draft taxonomy version, found ${candidates.length}`);
const version = candidates[0];
if (version.status !== "ACTIVE") {
  if (version.topics.length === 0) throw new Error("Refusing to activate a version with no topic mappings");
  await json("POST", `/api/admin/catalog/exam-versions/${version.id}/activate`);
  console.log(`Activated version ${version.label} with ${version.topics.length} topic mappings`);
}
console.log(`Catalog activation verified: ${slug}`);

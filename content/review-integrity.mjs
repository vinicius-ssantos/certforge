// Verify explicit human sign-offs against the exact Git blob bytes of each question.
// This is NOT an editorial API approval and must never cause automatic publication.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { readManifestPack } from "./manifest-pack.mjs";

export function gitBlobSha(buffer) {
  return createHash("sha1").update(`blob ${buffer.length}\0`).update(buffer).digest("hex");
}

export function inspectPackReviews(packDir) {
  const { manifest, questions } = readManifestPack(packDir);
  const record = JSON.parse(readFileSync(join(packDir, "review.json"), "utf8"));
  const byName = new Map(questions.map((q) => [q.name, q]));
  const results = [];
  for (const [name, entry] of Object.entries(record.questions ?? {})) {
    const question = byName.get(name);
    if (!question) throw new Error(`Orphaned review: ${name}`);
    const sourceFile = posix.join("content", manifest.packId, name, "question.json");
    const bytes = readFileSync(join(packDir, name, "question.json"));
    const actual = gitBlobSha(bytes);
    const key = question.options.filter((option) => option.correct).map((option) => option.key);
    const valid = entry.verdict === "APPROVED"
      && entry.sourceFile === sourceFile
      && entry.sourceGitBlobSha === actual
      && JSON.stringify(entry.answerKey) === JSON.stringify(key)
      && entry.serverEditorialStatus === "NOT_SUBMITTED_OR_APPROVED_BY_THIS_RECORD";
    results.push({ name, valid, expectedSha: entry.sourceGitBlobSha, actualSha: actual });
  }
  return { total: questions.length, accepted: results.filter((v) => v.valid).length, results };
}

export function assertPackReviewsCurrent(packDir) {
  const state = inspectPackReviews(packDir);
  const stale = state.results.filter((entry) => !entry.valid);
  if (stale.length) throw new Error(`Stale editorial acceptance: ${stale.map((v) => v.name).join(", ")}`);
  return state;
}

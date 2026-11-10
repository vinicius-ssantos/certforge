import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertPackReviewsCurrent, inspectPackReviews } from "./review-integrity.mjs";

const pack = "content/infrastructure-devops-foundations";
test("all recorded human sign-offs match the current question blobs", () => {
  // 70 of the pack's 100 questions carry a human sign-off; the other 30 (15 from #169/#170,
  // 15 from #174) are unreviewed drafts with no review.json entry at all, which this check
  // does not require — it only refuses a sign-off whose recorded bytes no longer match the
  // question it names.
  const state = assertPackReviewsCurrent(pack);
  assert.equal(state.total, 100);
  assert.equal(state.accepted, 70);
});
test("editing a reviewed prompt revokes its recorded sign-off", () => {
  const dir = mkdtempSync(join(tmpdir(), "certforge-review-check-"));
  const target = join(dir, "pack");
  try {
    cpSync(pack, target, { recursive: true });
    const path = join(target, "t01-docker-build-cache", "question.json");
    const data = JSON.parse(readFileSync(path, "utf8"));
    data.prompt += " Changed after review.";
    writeFileSync(path, JSON.stringify(data));
    const state = inspectPackReviews(target);
    assert.equal(state.accepted, 69);
    assert.equal(state.results.find((r) => r.name === "t01-docker-build-cache").valid, false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

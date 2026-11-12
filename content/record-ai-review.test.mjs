import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readManifestPack, readReviewRecordV2, reviewStatusOfV2 } from "./manifest-pack.mjs";
import { recordAiReview, RefusedError } from "./record-ai-review.mjs";

const reviewedPack = "content/cncf-kcna-certification";
// Any manifest pack works here; its review.json (if any) is removed in the copy below, so these
// tests stay meaningful regardless of which packs this project has since reviewed.
const bareManifestPack = "content/cncf-ckad-certification";

/** A copy of a pack, because every test here writes to its review.json. */
function withCopy(pack, work) {
  const dir = mkdtempSync(join(tmpdir(), "certforge-record-ai-review-"));
  const target = join(dir, "pack");
  try {
    cpSync(pack, target, { recursive: true });
    work(target);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Like {@link withCopy}, but guarantees no review.json -- a "nobody has reviewed this yet" pack
 * -- regardless of whether the real content tree still has one unreviewed by the time this runs. */
function withBareCopy(pack, work) {
  withCopy(pack, (target) => {
    const file = join(target, "review.json");
    if (existsSync(file)) rmSync(file);
    work(target);
  });
}

function firstQuestion(target) {
  const { manifest, questions } = readManifestPack(target);
  return { manifest, question: questions[0] };
}

test("records a verdict with the V2 digest computed from the question and the pack's own manifest", () => {
  withBareCopy(bareManifestPack, (target) => {
    const { manifest, question } = firstQuestion(target);

    const result = recordAiReview(target, { question: question.name, verdict: "APPROVED", on: "2026-11-12" });

    assert.equal(result.outcome, "recorded");
    const record = readReviewRecordV2(target);
    assert.equal(record.questions[question.name].verdict, "APPROVED");
    assert.equal(record.questions[question.name].reviewedOn, "2026-11-12");
    assert.equal(reviewStatusOfV2(record, manifest, question).state, "reviewed");
  });
});

test("bootstraps review.json when a manifest pack has none yet, with no named human reviewer", () => {
  withBareCopy(bareManifestPack, (target) => {
    assert.equal(existsSync(join(target, "review.json")), false);
    const { question } = firstQuestion(target);

    recordAiReview(target, { question: question.name, verdict: "APPROVED", on: "2026-11-12" });

    const record = readReviewRecordV2(target);
    assert.equal(record.reviewer, null);
    assert.equal(record.questions[question.name].reviewer, "ai-reviewer");
  });
});

test("a question with no recorded review is unreviewed until this writes one", () => {
  withBareCopy(bareManifestPack, (target) => {
    const { manifest, question } = firstQuestion(target);
    assert.equal(reviewStatusOfV2(readReviewRecordV2(target), manifest, question).state, "unreviewed");

    recordAiReview(target, { question: question.name, verdict: "APPROVED", on: "2026-11-12" });

    assert.equal(reviewStatusOfV2(readReviewRecordV2(target), manifest, question).state, "reviewed");
  });
});

test("running the same command twice is not a second decision", () => {
  withCopy(reviewedPack, (target) => {
    const { question } = firstQuestion(target);
    const before = readFileSync(join(target, "review.json"), "utf8");

    const again = recordAiReview(target, { question: question.name, verdict: "APPROVED", on: "2026-11-13" });

    assert.equal(again.outcome, "unchanged");
    // Not even the date moves: nothing was reviewed again, so nothing is recorded again.
    assert.equal(readFileSync(join(target, "review.json"), "utf8"), before);
  });
});

test("a question edited since its AI review is recorded as renewed, against the new text", () => {
  withCopy(reviewedPack, (target) => {
    const { question } = firstQuestion(target);
    const path = join(target, question.name, "question.json");
    const data = JSON.parse(readFileSync(path, "utf8"));
    data.explanation += " One more sentence.";
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    const { manifest, questions } = readManifestPack(target);
    const changed = questions.find((candidate) => candidate.name === question.name);
    assert.equal(reviewStatusOfV2(readReviewRecordV2(target), manifest, changed).state, "changed");

    const result = recordAiReview(target, { question: question.name, verdict: "APPROVED", on: "2026-11-13" });

    assert.equal(result.outcome, "renewed");
    assert.equal(reviewStatusOfV2(readReviewRecordV2(target), manifest, changed).state, "reviewed");
  });
});

test("a question that no longer matches its certification snapshot digest is recorded as renewed", () => {
  withCopy(reviewedPack, (target) => {
    const { question } = firstQuestion(target);
    const manifestPath = join(target, "pack.json");
    const manifestData = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifestData.certification.snapshotDigest = `sha256:${"a".repeat(64)}`;
    writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2) + "\n");

    const result = recordAiReview(target, { question: question.name, verdict: "APPROVED", on: "2026-11-13" });

    assert.equal(result.outcome, "renewed");
  });
});

test("changing a verdict on unchanged text says that is what happened", () => {
  withCopy(reviewedPack, (target) => {
    const { question } = firstQuestion(target);

    const result = recordAiReview(target, { question: question.name, verdict: "CHANGES_REQUESTED", on: "2026-11-13" });

    assert.equal(result.outcome, "changed");
    assert.equal(result.was.verdict, "APPROVED");
    assert.equal(readReviewRecordV2(target).questions[question.name].verdict, "CHANGES_REQUESTED");
  });
});

test("refuses a verdict it does not know, rather than storing it", () => {
  withBareCopy(bareManifestPack, (target) => {
    const { question } = firstQuestion(target);

    assert.throws(
      () => recordAiReview(target, { question: question.name, verdict: "LOOKS_FINE" }),
      RefusedError,
    );
    assert.equal(existsSync(join(target, "review.json")), false);
  });
});

test("refuses a question the pack does not have", () => {
  withBareCopy(bareManifestPack, (target) => {
    assert.throws(() => recordAiReview(target, { question: "t99-not-a-question", verdict: "APPROVED" }), /no question named/);
  });
});

test("refuses a date that is not one", () => {
  withBareCopy(bareManifestPack, (target) => {
    const { question } = firstQuestion(target);
    assert.throws(() => recordAiReview(target, { question: question.name, verdict: "APPROVED", on: "yesterday" }), /not a date/);
  });
});

test("refuses a flat (non-manifest) pack, whose reviews are bound the other way", () => {
  assert.throws(
    () => recordAiReview("content/java-se-21", { question: "t01-integer-boxing-guarantee", verdict: "APPROVED" }),
    /not a manifest pack/,
  );
});

test("records a per-question checklist, deduplicated", () => {
  withBareCopy(bareManifestPack, (target) => {
    const { question } = firstQuestion(target);

    const result = recordAiReview(target, {
      question: question.name,
      verdict: "APPROVED",
      on: "2026-11-12",
      checklist: ["NO_AMBIGUITY", "REASONS_ACCURATE", "NO_AMBIGUITY"],
    });

    assert.equal(result.outcome, "recorded");
    const status = reviewStatusOfV2(readReviewRecordV2(target), readManifestPack(target).manifest, question);
    assert.deepEqual(status.checklist, ["NO_AMBIGUITY", "REASONS_ACCURATE"]);
  });
});

test("writes the file the way it found it", () => {
  withCopy(reviewedPack, (target) => {
    const before = readFileSync(join(target, "review.json"), "utf8");
    const { question } = firstQuestion(target);

    recordAiReview(target, { question: question.name, verdict: "CHANGES_REQUESTED", on: "2026-11-13" });

    const after = readFileSync(join(target, "review.json"), "utf8");
    assert.equal(after.includes("\r\n"), before.includes("\r\n"), "line endings");
    assert.ok(after.endsWith("\n"), "trailing newline");
    const names = (raw) => Object.keys(JSON.parse(raw).questions);
    assert.deepEqual(names(after), names(before));
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPack, readReviewRecord, reviewStatusOf } from "./pack.mjs";
import { recordReview, RefusedError } from "./record-review.mjs";

const pack = "content/java-se-21";

/** A copy of the pack, because every test here writes to the record. */
function withCopy(work) {
  const dir = mkdtempSync(join(tmpdir(), "certforge-record-review-"));
  const target = join(dir, "pack");
  try {
    cpSync(pack, target, { recursive: true });
    work(target);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** A question of the pack that nobody has reviewed yet, so the tests record a real first verdict. */
function unreviewed(target) {
  const record = readReviewRecord(target);
  const found = readPack(target).find((question) => !record.questions[question.name]);
  assert.ok(found, "the pack should still hold an unreviewed question");
  return found;
}

test("records a verdict with the digest computed from the question, not from the caller", () => {
  withCopy((target) => {
    const question = unreviewed(target);

    const result = recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-17" });

    assert.equal(result.outcome, "recorded");
    const written = readReviewRecord(target).questions[question.name];
    assert.equal(written.verdict, "APPROVED");
    assert.equal(written.reviewedOn, "2026-10-17");
    // The point of the tool: the digest describes the text as it stands, so the entry cannot
    // claim a verdict against something nobody read.
    assert.equal(reviewStatusOf(readReviewRecord(target), question).state, "reviewed");
  });
});

test("a question with no recorded review is unreviewed until this writes one", () => {
  withCopy((target) => {
    const question = unreviewed(target);
    assert.equal(reviewStatusOf(readReviewRecord(target), question).state, "unreviewed");

    recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-17" });

    assert.equal(reviewStatusOf(readReviewRecord(target), question).state, "reviewed");
  });
});

test("running the same command twice is not a second decision", () => {
  withCopy((target) => {
    const question = unreviewed(target);
    recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-17" });
    const before = readFileSync(join(target, "review.json"), "utf8");

    const again = recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-18" });

    assert.equal(again.outcome, "unchanged");
    // Not even the date moves: nothing was reviewed again, so nothing is recorded again.
    assert.equal(readFileSync(join(target, "review.json"), "utf8"), before);
  });
});

test("a question edited since its review is recorded as renewed, against the new text", () => {
  withCopy((target) => {
    const question = unreviewed(target);
    recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-17" });
    const path = join(target, question.name, "question.json");
    const data = JSON.parse(readFileSync(path, "utf8"));
    data.explanation += " One more sentence.";
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    const changed = readPack(target).find((candidate) => candidate.name === question.name);
    assert.equal(reviewStatusOf(readReviewRecord(target), changed).state, "changed");

    const result = recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-18" });

    assert.equal(result.outcome, "renewed");
    assert.equal(reviewStatusOf(readReviewRecord(target), changed).state, "reviewed");
  });
});

test("changing a verdict on unchanged text says that is what happened", () => {
  withCopy((target) => {
    const question = unreviewed(target);
    recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-17" });

    const result = recordReview(target, { question: question.name, verdict: "CHANGES_REQUESTED", on: "2026-10-18" });

    assert.equal(result.outcome, "changed");
    assert.equal(result.was.verdict, "APPROVED");
    assert.equal(readReviewRecord(target).questions[question.name].verdict, "CHANGES_REQUESTED");
  });
});

test("refuses a verdict it does not know, rather than storing it", () => {
  withCopy((target) => {
    const question = unreviewed(target);

    assert.throws(
      () => recordReview(target, { question: question.name, verdict: "LOOKS_FINE" }),
      RefusedError,
    );
    assert.equal(readReviewRecord(target).questions[question.name], undefined);
  });
});

test("refuses a question the pack does not have", () => {
  withCopy((target) => {
    assert.throws(() => recordReview(target, { question: "t99-not-a-question", verdict: "APPROVED" }), /no question named/);
  });
});

test("refuses a date that is not one", () => {
  withCopy((target) => {
    const question = unreviewed(target);
    assert.throws(() => recordReview(target, { question: question.name, verdict: "APPROVED", on: "yesterday" }), /not a date/);
  });
});

test("refuses a manifest pack, whose reviews are bound the other way", () => {
  // Writing a digest entry into a pack checked by git blob would add a line no checker reads.
  assert.throws(
    () => recordReview("content/infrastructure-devops-foundations", { question: "t01-docker-multistage", verdict: "APPROVED" }),
    /manifest pack/,
  );
});

test("refuses to record a different reviewer than the record names", () => {
  withCopy((target) => {
    const question = unreviewed(target);
    assert.throws(
      () => recordReview(target, { question: question.name, verdict: "APPROVED", reviewer: "someone-else" }),
      /second reviewer is a claim/,
    );
  });
});

test("writes the file the way it found it", () => {
  withCopy((target) => {
    const before = readFileSync(join(target, "review.json"), "utf8");
    const question = unreviewed(target);

    recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-17" });

    const after = readFileSync(join(target, "review.json"), "utf8");
    assert.equal(after.includes("\r\n"), before.includes("\r\n"), "line endings");
    assert.ok(after.endsWith("\n"), "trailing newline");
    // Entries keep the order they were in; a tool that re-sorted them would rewrite history to
    // record one line.
    const names = (raw) => Object.keys(JSON.parse(raw).questions);
    assert.deepEqual(names(after).slice(0, names(before).length), names(before));
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPack, readReviewRecord, reviewStatusOf, verifiedDigest } from "./pack.mjs";
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

/**
 * A question of the pack that nobody has reviewed yet, so the tests record a real first verdict.
 * Made unreviewed in this copy regardless of whether the real pack currently has one: whether any
 * question is still unreviewed is a fact about today's backlog (zero, since Topic 10 closed it
 * out), not something this test should depend on to stay meaningful tomorrow.
 */
function unreviewed(target) {
  const record = readReviewRecord(target);
  let found = readPack(target).find((question) => !record.questions[question.name]);
  if (!found) {
    found = readPack(target)[0];
    delete record.questions[found.name];
    const original = readFileSync(join(target, "review.json"), "utf8");
    let rewritten = JSON.stringify(record, null, 2) + "\n";
    if (original.includes("\r\n")) {
      rewritten = rewritten.replace(/\n/g, "\r\n");
    }
    writeFileSync(join(target, "review.json"), rewritten);
  }
  assert.ok(found, "the pack should still hold an unreviewed question");
  return found;
}

/**
 * A question of the given tier, made unreviewed in this copy regardless of whether the real pack
 * currently has one unreviewed: which tier is unreviewed right now (or even present at all) is a
 * fact about today's backlog, not something these tests should depend on to stay meaningful
 * tomorrow. The Asserted tier happens to be empty in the real pack as this is written -- every
 * question now carries a verified program -- so that case is synthesized: a copy of a real question
 * with its `expected.txt` removed, which is exactly what Asserted means and changes nothing
 * `reviewDigest` reads, so the review a person already gave the text still applies to it.
 */
function unreviewedOfTier(target, { verified }) {
  let found = readPack(target).find((question) => (verifiedDigest(question) !== null) === verified);
  if (!found && !verified) {
    const donor = readPack(target)[0];
    const expectedFile = join(target, donor.name, "expected.txt");
    if (existsSync(expectedFile)) {
      rmSync(expectedFile);
    }
    found = readPack(target).find((question) => question.name === donor.name);
  }
  assert.ok(found, `the pack should hold a ${verified ? "Verified" : "Asserted"}-tier question`);
  assert.equal((verifiedDigest(found) !== null), verified, "fixture must actually be of the asked tier");
  const record = readReviewRecord(target);
  delete record.questions[found.name];
  writeFileSync(join(target, "review.json"), JSON.stringify(record, null, 2) + "\n");
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

test("ADR 0023: records an AI review as a disclosed reviewer, distinct from the pack's human one", () => {
  withCopy((target) => {
    const question = unreviewedOfTier(target, { verified: false });
    const record = readReviewRecord(target);

    const result = recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-29", aiReviewed: true });

    assert.equal(result.outcome, "recorded");
    const status = reviewStatusOf(readReviewRecord(target), question);
    assert.equal(status.reviewer, "ai-reviewer");
    assert.notEqual(status.reviewer, record.reviewer);
    // Every other entry still reads as the pack's own human reviewer; this is the one disclosed
    // exception, not a change to what an ordinary entry means.
    const other = readPack(target).find((candidate) => record.questions[candidate.name] && candidate.name !== question.name);
    if (other) {
      assert.equal(reviewStatusOf(readReviewRecord(target), other).reviewer, record.reviewer);
    }
  });
});

test("ADR 0024: an AI review of a Verified-tier question records its own checklist", () => {
  withCopy((target) => {
    const question = unreviewedOfTier(target, { verified: true });

    const result = recordReview(target, {
      question: question.name,
      verdict: "APPROVED",
      on: "2026-10-29",
      aiReviewed: true,
      checklist: ["NO_AMBIGUITY", "REASONS_ACCURATE", "NO_AMBIGUITY"],
    });

    assert.equal(result.outcome, "recorded");
    const status = reviewStatusOf(readReviewRecord(target), question);
    assert.equal(status.reviewer, "ai-reviewer");
    assert.deepEqual(status.checklist, ["NO_AMBIGUITY", "REASONS_ACCURATE"]);
  });
});

test("ADR 0023: --checklist without --ai-reviewed is refused", () => {
  withCopy((target) => {
    const question = unreviewedOfTier(target, { verified: false });

    assert.throws(
      () => recordReview(target, { question: question.name, verdict: "APPROVED", checklist: ["NO_AMBIGUITY"] }),
      /only applies to an AI review/,
    );
  });
});

test("ADR 0023: --ai-reviewed and --reviewer do not mix", () => {
  withCopy((target) => {
    const question = unreviewedOfTier(target, { verified: false });

    assert.throws(
      () => recordReview(target, { question: question.name, verdict: "APPROVED", aiReviewed: true, reviewer: "someone" }),
      /do not mix/,
    );
  });
});

test("ADR 0023: a human re-recording an AI-reviewed question reverts the entry to the pack's own reviewer", () => {
  withCopy((target) => {
    const question = unreviewedOfTier(target, { verified: false });
    recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-29", aiReviewed: true });
    const record = readReviewRecord(target);

    const result = recordReview(target, { question: question.name, verdict: "APPROVED", on: "2026-10-30" });

    assert.equal(result.outcome, "changed");
    assert.equal(reviewStatusOf(readReviewRecord(target), question).reviewer, record.reviewer);
  });
});

test("writes the file the way it found it", () => {
  withCopy((target) => {
    // unreviewed() may itself rewrite the file to synthesize a fixture (see its own comment);
    // "found it" means as recordReview found it, so the snapshot is taken after that setup.
    const question = unreviewed(target);
    const before = readFileSync(join(target, "review.json"), "utf8");

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

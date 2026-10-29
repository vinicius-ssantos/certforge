#!/usr/bin/env node
// Writes one reviewer's verdict into a pack's review.json, with the digest computed from the
// question as it stands.
//
// Until now nothing in this repository wrote that file. Six tools read it; the entries were typed
// by hand from the generated packet, which means copying a sha256 by eye, once per question. That
// is not judgement, it is transcription, and it is the part a person gets wrong: a mistyped digest
// records a verdict against text nobody read.
//
// What this does not do is decide anything. The verdict is an argument: this tool cannot produce
// one, infer one, or default to APPROVED. It refuses a question it cannot find and a verdict it
// does not know, and it recomputes the digest from the file rather than trusting what it is told,
// so the entry always describes the question as it is now (ADR 0005, ADR 0011).
//
// Usage:
//   node content/record-review.mjs --question t03-sealed-permits --verdict APPROVED
//                                  [--pack content/java-se-21] [--on 2026-10-17] [--reviewer handle]
//                                  [--ai-reviewed]
//
// --ai-reviewed (ADR 0023) records the entry's reviewer as the fixed, disclosed "ai-reviewer"
// identity instead of leaving it to mean the pack's own named human reviewer. It is incompatible
// with --reviewer -- the identity it records is not a free-text claim -- and refuses a question
// that carries verification evidence, the same restriction the live ai-approve endpoint enforces
// (ADR 0022 decision 1): the AI reviewer may approve Asserted-tier content only.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readPack, readReviewRecord, reviewDigest, verifiedDigest } from "./pack.mjs";

/** The decisions a reviewer can record, matching the two the editorial API accepts. */
export const VERDICTS = new Set(["APPROVED", "CHANGES_REQUESTED"]);

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class RefusedError extends Error {}

function refuse(...lines) {
  throw new RefusedError(lines.join("\n"));
}

/**
 * Records the verdict and returns what happened: `recorded` for a new entry, `renewed` when the
 * question had been reviewed and has changed since, `changed` when the verdict itself is
 * different, and `unchanged` when the record already says exactly this — which makes running the
 * same command twice harmless rather than a second decision.
 */
export function recordReview(pack, { question: name, verdict, on, reviewer, aiReviewed = false }) {
  if (!VERDICTS.has(verdict)) {
    refuse(`${verdict} is not a verdict. Use one of: ${[...VERDICTS].join(", ")}.`);
  }
  if (on !== undefined && !DATE.test(on)) {
    refuse(`${on} is not a date. Use YYYY-MM-DD.`);
  }
  if (aiReviewed && reviewer) {
    refuse(
      "--ai-reviewed and --reviewer do not mix: the AI reviewer's identity is fixed and disclosed,",
      "not a name you pass in.",
    );
  }
  if (existsSync(join(pack, "pack.json"))) {
    refuse(
      `${pack} is a manifest pack: its reviews are bound to each question's git blob and checked by`,
      "content/review-integrity.mjs, not by the digest scheme this writes. Recording one here would",
      "write an entry no checker of that pack reads.",
    );
  }
  const record = readReviewRecord(pack);
  if (!record) {
    refuse(`${pack} has no review.json to record into.`);
  }
  const question = readPack(pack).find((candidate) => candidate.name === name);
  if (!question) {
    refuse(`${pack} has no question named ${name}.`);
  }

  const digest = reviewDigest(question);
  const verified = verifiedDigest(question);
  if (aiReviewed && verified !== null) {
    refuse(
      `${name} carries verification evidence (the Verified tier). The AI reviewer may only record`,
      "an Asserted-tier question (ADR 0022 decision 1, ADR 0023 decision 3) -- this one still needs",
      "a human.",
    );
  }
  const entries = record.questions ?? {};
  const previous = entries[name];
  const reviewedOn = on ?? new Date().toISOString().slice(0, 10);
  const nextReviewer = aiReviewed ? "ai-reviewer" : undefined;
  const outcome = !previous
    ? "recorded"
    : previous.digest !== digest
      ? "renewed"
      : previous.verdict !== verdict
        ? "changed"
        : (previous.reviewer ?? undefined) !== nextReviewer
          ? "changed"
          : "unchanged";
  if (outcome === "unchanged") {
    return { outcome, name, verdict, digest, reviewedOn: previous.reviewedOn ?? record.reviewedOn };
  }

  // The reviewer of a pack is recorded once, at the top. A different name here would be a second
  // reviewer, which is a claim about who read the question, so it has to be said out loud.
  if (reviewer && reviewer !== record.reviewer) {
    refuse(
      `This record's reviewer is ${record.reviewer}, and you passed ${reviewer}.`,
      "A second reviewer is a claim about who read the question; add them to review.json deliberately",
      "rather than through this tool.",
    );
  }

  entries[name] = {
    verdict,
    digest,
    verified,
    reviewedOn,
    ...(nextReviewer ? { reviewer: nextReviewer } : {}),
  };
  record.questions = entries;
  write(pack, record);
  return { outcome, name, verdict, digest, reviewedOn, was: previous };
}

/** Writes the record back the way it was written: same indent, same line endings, same order. */
function write(pack, record) {
  const file = join(pack, "review.json");
  const raw = readFileSync(file, "utf8");
  const body = JSON.stringify(record, null, 2) + "\n";
  writeFileSync(file, raw.includes("\r\n") ? body.split("\n").join("\r\n") : body);
}

function option(args, name, fallback) {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("\\").join("/").split("/").pop())) {
  const args = process.argv.slice(2);
  const pack = option(args, "pack", "content/java-se-21");
  try {
    const result = recordReview(pack, {
      question: option(args, "question"),
      verdict: option(args, "verdict", ""),
      on: option(args, "on"),
      reviewer: option(args, "reviewer"),
      aiReviewed: args.includes("--ai-reviewed"),
    });
    const said = {
      recorded: `recorded ${result.verdict} for ${result.name} on ${result.reviewedOn}`,
      renewed: `${result.name} had changed since its last review; recorded ${result.verdict} against the text as it stands`,
      changed: `${result.name} was ${result.was?.verdict}; recorded ${result.verdict}`,
      unchanged: `${result.name} already carries ${result.verdict} against this exact text; nothing written`,
    }[result.outcome];
    console.log(said);
    console.log(result.digest);
    if (result.outcome !== "unchanged") {
      console.log("\nRegenerate the packet so CI sees the same thing: node content/build-review-packet.mjs");
    }
  } catch (error) {
    if (error instanceof RefusedError) {
      console.error(error.message);
      process.exit(2);
    }
    throw error;
  }
}

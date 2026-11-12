#!/usr/bin/env node
// Writes the disclosed AI reviewer's verdict into a manifest pack's review.json (ADR 0022-0026),
// with the V2 digest (content/manifest-pack.mjs's reviewDigestV2) computed from the question and
// its pack's certification snapshot as they stand.
//
// record-review.mjs refuses a manifest pack outright: it reads and writes the legacy Java digest
// scheme, which a manifest pack's `trackVersion`/`certification.snapshotDigest` are not part of.
// This is the AI-reviewer-only counterpart for the packs record-review.mjs will not touch --
// `--reviewer` is not an option here, by design: review-integrity.mjs's git-blob-sha scheme is how
// a NAMED HUMAN'S sign-off is recorded for a manifest pack (today: infrastructure-devops-foundations
// alone), and this tool must never let that be confused with, or quietly upgraded into, an AI
// reviewer's own disclosed identity. Only "ai-reviewer" is ever written here.
//
// What this does not do is decide anything -- same promise record-review.mjs makes. The verdict is
// an argument this tool cannot produce, infer, or default to APPROVED; it refuses a question it
// cannot find and recomputes the digest from the file rather than trusting what it is told.
//
// Usage:
//   node content/record-ai-review.mjs --pack content/cncf-kcna-certification --question t01-pod-smallest-deployable-unit
//                                      --verdict APPROVED [--on 2026-11-12] [--checklist ITEM,ITEM]
//
// A pack with no review.json yet gets one, bootstrapped empty: a manifest pack may hold zero human
// reviewers (every question AI-reviewed, disclosed), so there is no named human to put at the top
// the way content/record-review.mjs's packs always have one.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readManifestPack, reviewDigestV2 } from "./manifest-pack.mjs";

export const VERDICTS = new Set(["APPROVED", "CHANGES_REQUESTED"]);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class RefusedError extends Error {}

function refuse(...lines) {
  throw new RefusedError(lines.join("\n"));
}

function emptyRecord() {
  return {
    reviewer: null,
    reviewerRole: "No named human reviewer recorded for this pack. Every entry below names its own "
      + "reviewer explicitly -- \"ai-reviewer\" is the disclosed AI identity (ADR 0022-0026) and is "
      + "never read as a person's.",
    method: "Each entry is the AI reviewer's own technical read of the question as it stands: "
      + "whether the recorded correct option is actually correct, whether distractors are plausible "
      + "and not accidentally defensible, whether the explanation is complete, and whether the "
      + "reference is the primary or official source for the claim. This is not a substitute for an "
      + "independent human reviewer deciding editorial judgement calls a machine cannot settle; it is "
      + "the same disclosed, final AI_APPROVED tier content/java-se-21 already uses, extended to this "
      + "pack under ADR 0026.",
    questions: {},
  };
}

/**
 * Records the AI reviewer's verdict and returns what happened, mirroring record-review.mjs's
 * outcomes: `recorded` for a new entry, `renewed` when the question changed since it was last
 * AI-reviewed, `changed` when only the verdict itself differs, and `unchanged` when the record
 * already says exactly this.
 */
export function recordAiReview(pack, { question: name, verdict, on, checklist }) {
  if (!VERDICTS.has(verdict)) {
    refuse(`${verdict} is not a verdict. Use one of: ${[...VERDICTS].join(", ")}.`);
  }
  if (on !== undefined && !DATE.test(on)) {
    refuse(`${on} is not a date. Use YYYY-MM-DD.`);
  }
  if (!existsSync(join(pack, "pack.json"))) {
    refuse(`${pack} is not a manifest pack (no pack.json). Use content/record-review.mjs for it.`);
  }
  const { manifest, questions } = readManifestPack(pack);
  const question = questions.find((candidate) => candidate.name === name);
  if (!question) {
    refuse(`${pack} has no question named ${name}.`);
  }

  const file = join(pack, "review.json");
  const record = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : emptyRecord();
  const digest = reviewDigestV2(manifest, question);
  const entries = record.questions ?? {};
  const previous = entries[name];
  const reviewedOn = on ?? new Date().toISOString().slice(0, 10);
  const nextChecklist = [...new Set(checklist ?? [])];
  const sorted = (list) => [...new Set(list ?? [])].sort();
  const sameChecklist = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
  const outcome = !previous
    ? "recorded"
    : previous.digest !== digest
      ? "renewed"
      : previous.verdict !== verdict
        ? "changed"
        : !sameChecklist(previous.checklist, nextChecklist)
          ? "changed"
          : "unchanged";
  if (outcome === "unchanged") {
    return { outcome, name, verdict, digest, reviewedOn: previous.reviewedOn };
  }

  entries[name] = {
    verdict,
    digest,
    reviewer: "ai-reviewer",
    reviewedOn,
    ...(nextChecklist.length > 0 ? { checklist: nextChecklist } : {}),
  };
  record.questions = entries;
  const body = JSON.stringify(record, null, 2) + "\n";
  const original = existsSync(file) ? readFileSync(file, "utf8") : null;
  writeFileSync(file, original?.includes("\r\n") ? body.split("\n").join("\r\n") : body);
  return { outcome, name, verdict, digest, reviewedOn, was: previous };
}

function option(args, name, fallback) {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("\\").join("/").split("/").pop())) {
  const args = process.argv.slice(2);
  const pack = option(args, "pack");
  if (!pack) {
    console.error("Usage: node content/record-ai-review.mjs --pack content/<pack> --question <name> --verdict APPROVED|CHANGES_REQUESTED");
    process.exit(2);
  }
  try {
    const checklistArg = option(args, "checklist");
    const result = recordAiReview(pack, {
      question: option(args, "question"),
      verdict: option(args, "verdict", ""),
      on: option(args, "on"),
      checklist: checklistArg ? checklistArg.split(",").filter(Boolean) : undefined,
    });
    const said = {
      recorded: `recorded ${result.verdict} for ${result.name} on ${result.reviewedOn} (ai-reviewer)`,
      renewed: `${result.name} had changed since its last AI review; recorded ${result.verdict} against the text as it stands`,
      changed: `${result.name} was ${result.was?.verdict}; recorded ${result.verdict}`,
      unchanged: `${result.name} already carries ${result.verdict} against this exact text; nothing written`,
    }[result.outcome];
    console.log(said);
    console.log(result.digest);
  } catch (error) {
    if (error instanceof RefusedError) {
      console.error(error.message);
      process.exit(2);
    }
    throw error;
  }
}

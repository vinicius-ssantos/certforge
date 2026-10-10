// Manifest-backed question reader for non-Java packs. It does not import, approve or publish.
// Keep this separate from pack.mjs until legacy Java 21 digest regression is proven.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { loadPackManifest } from "./pack-manifest.mjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHOICES = new Set(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]);
const DIFFICULTIES = new Set(["EASY", "MEDIUM", "HARD"]);

function fail(name, reason) {
  throw new Error(`Invalid question ${name}: ${reason}`);
}

function nonempty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateGeneralQuestion(question, manifest, name = "unknown") {
  if (!question || Array.isArray(question) || typeof question !== "object") fail(name, "expected object");
  if (!UUID.test(question.topicId ?? "")) fail(name, "topicId must be a UUID");
  if (!CHOICES.has(question.type)) fail(name, "unsupported type");
  if (!DIFFICULTIES.has(question.difficulty)) fail(name, "unsupported difficulty");
  for (const key of ["prompt", "explanation", "difficultyRationale"]) {
    if (!nonempty(question[key])) fail(name, `missing ${key}`);
  }
  if (question.javaRelease !== undefined) fail(name, "non-Java packs must not declare javaRelease");
  if (!Array.isArray(question.options) || question.options.length < 4 || question.options.length > 5) {
    fail(name, "expected 4 or 5 options");
  }
  const keys = new Set();
  let correct = 0;
  for (const option of question.options) {
    if (!nonempty(option?.key) || keys.has(option.key)) fail(name, "invalid or duplicate option key");
    keys.add(option.key);
    if (!nonempty(option.text) || !nonempty(option.explanation) || typeof option.correct !== "boolean") {
      fail(name, "each option needs text, explanation and explicit correctness");
    }
    correct += Number(option.correct);
  }
  if (correct === 0 || (question.type === "SINGLE_CHOICE" && correct !== 1)
      || (question.type === "MULTIPLE_CHOICE" && correct < 2)) {
    fail(name, "incorrect answer cardinality");
  }
  if (!Array.isArray(question.references) || question.references.length === 0
      || question.references.some((ref) => !nonempty(ref?.title)
        || !nonempty(ref?.url) || !/^https:\/\//.test(ref.url))) {
    fail(name, "references must have titles and HTTPS URLs");
  }
  if (manifest.sourcePolicy === "infrastructure-official-v1") {
    const officialHosts = new Set(["docs.docker.com", "kubernetes.io"]);
    for (const reference of question.references) {
      let parsed;
      try {
        parsed = new URL(reference.url);
      } catch {
        fail(name, "invalid reference URL");
      }
      if (parsed.protocol !== "https:" || !officialHosts.has(parsed.hostname)
          || parsed.username || parsed.password || parsed.port) {
        fail(name, "reference is outside the infrastructure official source policy");
      }
    }
  }
  if (manifest.trackKind === "CERTIFICATION") {
    if (!Array.isArray(question.objectiveKeys) || question.objectiveKeys.length === 0
        || question.objectiveKeys.some((key) => !nonempty(key))) {
      fail(name, "certification questions need objectiveKeys");
    }
  } else if (question.objectiveKeys !== undefined) {
    fail(name, "non-certification questions must not claim exam objectives");
  }
  if (question.evidence !== undefined) {
    const evidence = question.evidence;
    if (!evidence || typeof evidence !== "object" || !nonempty(evidence.type)) {
      fail(name, "invalid evidence descriptor");
    }
  }
  return question;
}

export function readManifestPack(directory) {
  const manifest = loadPackManifest(directory);
  const questions = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      const path = join(directory, name, "question.json");
      const question = JSON.parse(readFileSync(path, "utf8"));
      return { name, ...validateGeneralQuestion(question, manifest, name) };
    });
  if (questions.length === 0) throw new Error("A content pack must contain at least one question");
  return { manifest, questions };
}

// A versioned digest which binds a non-Java reviewer verdict to both question text and
// the pack/exam context. It is intentionally NOT pack.mjs reviewDigest (Java legacy).
export function reviewDigestV2(manifest, question) {
  const reviewed = [
    2, manifest.packId, manifest.trackSlug, manifest.trackVersion, manifest.trackKind,
    manifest.certification?.snapshotDigest ?? null, question.topicId,
    question.objectiveKeys ?? null, question.type, question.difficulty,
    question.difficultyRationale, question.prompt, question.explanation,
    question.options.map((option) => [option.key, option.text, option.correct, option.explanation]),
    question.references.map((reference) => [reference.title, reference.url]),
    question.evidence ?? null,
  ];
  return "sha256:" + createHash("sha256").update(JSON.stringify(reviewed)).digest("hex");
}

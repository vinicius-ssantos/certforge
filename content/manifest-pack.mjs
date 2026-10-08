// Manifest-backed question reader for non-legacy packs. It does not import, approve or publish.
// Keep this separate from pack.mjs until legacy Java 21 digest regression is proven.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { loadPackManifest } from "./pack-manifest.mjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHOICES = new Set(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]);
const TYPES = new Set([...CHOICES, "GUIDED_RESPONSE"]);
const DIFFICULTIES = new Set(["EASY", "MEDIUM", "HARD"]);
const SENIORITIES = new Set(["PLENO", "SENIOR"]);

function fail(name, reason) {
  throw new Error(`Invalid question ${name}: ${reason}`);
}

function nonempty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateReferences(question, name) {
  if (!Array.isArray(question.references) || question.references.length === 0
      || question.references.some((ref) => !nonempty(ref?.title)
        || !nonempty(ref?.url) || !/^https:\/\//.test(ref.url))) {
    fail(name, "references must have titles and HTTPS URLs");
  }
}

function validateChoiceQuestion(question, name) {
  if (!nonempty(question.explanation)) fail(name, "missing explanation");
  if (question.guidedResponse !== undefined && question.guidedResponse !== null) {
    fail(name, "choice questions must not define guidedResponse");
  }
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
}

function validateGuidedQuestion(question, manifest, name) {
  if (manifest.trackKind !== "INTERVIEW") {
    fail(name, "GUIDED_RESPONSE requires an INTERVIEW pack");
  }
  if (nonempty(question.explanation)) {
    fail(name, "guided responses must not define objective explanation");
  }
  if (question.options !== undefined && (!Array.isArray(question.options) || question.options.length !== 0)) {
    fail(name, "guided responses must not define answer options");
  }

  const guided = question.guidedResponse;
  if (!guided || Array.isArray(guided) || typeof guided !== "object") {
    fail(name, "guidedResponse criteria are required");
  }
  if (!nonempty(guided.referenceAnswer)) fail(name, "guidedResponse.referenceAnswer is required");
  if (!Array.isArray(guided.expectedConcepts) || guided.expectedConcepts.length === 0
      || guided.expectedConcepts.length > 20) {
    fail(name, "guidedResponse.expectedConcepts must contain 1 to 20 concepts");
  }
  let required = 0;
  for (const concept of guided.expectedConcepts) {
    if (!nonempty(concept?.text) || typeof concept.required !== "boolean") {
      fail(name, "each expected concept needs text and explicit required status");
    }
    if (concept.explanation !== undefined && concept.explanation !== null
        && !nonempty(concept.explanation)) {
      fail(name, "expected concept explanations must be nonempty when present");
    }
    required += Number(concept.required);
  }
  if (required === 0) fail(name, "guidedResponse needs at least one required concept");

  for (const [field, limit] of [["commonMistakes", 20], ["followUps", 20]]) {
    const values = guided[field] ?? [];
    if (!Array.isArray(values) || values.length > limit || values.some((value) => !nonempty(value))) {
      fail(name, `guidedResponse.${field} must contain only nonempty strings`);
    }
  }
}

export function validateManifestQuestion(question, manifest, name = "unknown") {
  if (!question || Array.isArray(question) || typeof question !== "object") fail(name, "expected object");
  if (!UUID.test(question.topicId ?? "")) fail(name, "topicId must be a UUID");
  if (!TYPES.has(question.type)) fail(name, "unsupported type");
  if (!DIFFICULTIES.has(question.difficulty)) fail(name, "unsupported difficulty");
  for (const key of ["prompt", "difficultyRationale"]) {
    if (!nonempty(question[key])) fail(name, `missing ${key}`);
  }

  // Manifest-backed packs are deliberately separate from the legacy Java SE 21 loader. Interview
  // content has no release by domain rule, and non-Java packs must not smuggle one in either.
  if (question.javaRelease !== undefined) fail(name, "manifest-backed packs must not declare javaRelease");

  if (manifest.trackKind === "INTERVIEW") {
    if (!SENIORITIES.has(question.seniority)) {
      fail(name, "interview questions require seniority PLENO or SENIOR");
    }
  } else if (question.seniority !== undefined) {
    fail(name, "seniority is only valid for INTERVIEW questions");
  }

  if (question.type === "GUIDED_RESPONSE") {
    validateGuidedQuestion(question, manifest, name);
  } else {
    validateChoiceQuestion(question, name);
  }

  validateReferences(question, name);

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
    if (!evidence || Array.isArray(evidence) || typeof evidence !== "object" || !nonempty(evidence.type)) {
      fail(name, "invalid evidence descriptor");
    }
  }
  return question;
}

// Compatibility export for the first #166 slice.
export const validateGeneralQuestion = validateManifestQuestion;

export function readManifestPack(directory) {
  const manifest = loadPackManifest(directory);
  const questions = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      const path = join(directory, name, "question.json");
      const question = JSON.parse(readFileSync(path, "utf8"));
      return { name, ...validateManifestQuestion(question, manifest, name) };
    });
  if (questions.length === 0) throw new Error("A content pack must contain at least one question");
  return { manifest, questions };
}

function guidedDigestMaterial(question) {
  if (question.type !== "GUIDED_RESPONSE") return null;
  const guided = question.guidedResponse;
  return [
    guided.referenceAnswer,
    guided.expectedConcepts.map((concept) => [
      concept.text,
      concept.required,
      concept.explanation ?? null,
    ]),
    guided.commonMistakes ?? [],
    guided.followUps ?? [],
  ];
}

// A versioned digest which binds a manifest-backed reviewer verdict to both question text and the
// pack context. No v2 review records existed before INTERVIEW support, so seniority, source policy,
// evidence profile and guided criteria are part of v2 from its first real content use.
export function reviewDigestV2(manifest, question) {
  const choiceMaterial = CHOICES.has(question.type)
    ? [
        question.explanation,
        question.options.map((option) => [option.key, option.text, option.correct, option.explanation]),
      ]
    : [null, null];
  const reviewed = [
    2,
    manifest.packId,
    manifest.trackSlug,
    manifest.trackVersion,
    manifest.trackKind,
    manifest.language,
    manifest.sourcePolicy,
    manifest.evidenceProfile,
    manifest.certification?.snapshotDigest ?? null,
    question.topicId,
    question.objectiveKeys ?? null,
    question.seniority ?? null,
    question.type,
    question.difficulty,
    question.difficultyRationale,
    question.prompt,
    ...choiceMaterial,
    guidedDigestMaterial(question),
    question.references.map((reference) => [reference.title, reference.url]),
    question.evidence ?? null,
  ];
  return "sha256:" + createHash("sha256").update(JSON.stringify(reviewed)).digest("hex");
}

// Manifest-backed question reader for non-Java packs. It does not import, approve or publish.
// Keep this separate from pack.mjs until legacy Java 21 digest regression is proven.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { EVIDENCE_PROFILES, EVIDENCE_TYPES, loadPackManifest } from "./pack-manifest.mjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHOICES = new Set(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]);
const DIFFICULTIES = new Set(["EASY", "MEDIUM", "HARD"]);
const SENIORITIES = new Set(["PLENO", "SENIOR"]);

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
    // #177: the allowlist grows one official host at a time, one per source a topic family
    // actually has. Docker/Kubernetes ship their own docs; Linux cites the canonical man-pages
    // mirror and kernel docs; networking has no vendor to defer to, so it cites the RFCs
    // themselves; CI/CD here means GitHub Actions, so it cites GitHub's own docs; #171's CNCF
    // certification profiles cite cncf.io for facts kubernetes.io does not own (project
    // governance, maturity levels, the cloud native ecosystem) alongside kubernetes.io itself;
    // #173's Terraform Associate profile cites developer.hashicorp.com, HashiCorp's own docs.
    // KCSA's "Controls and Frameworks", "Compliance Frameworks", "Threat Modeling Frameworks"
    // and "Supply Chain Compliance" objectives name no source at all -- the CNCF curriculum PDF
    // is a bare topic-title outline with zero citations for these four. The four hosts below are
    // an editorial judgment call, not a curriculum citation: each is the industry-canonical
    // primary source for exactly what its objective's title conventionally means (CIS Benchmarks
    // for controls/compliance, MITRE ATT&CK for threat modeling, SLSA for supply-chain
    // compliance), confirmed by a human decision under #171 rather than by anything the
    // curriculum itself points to. #172's AWS Cloud Practitioner profile cites docs.aws.amazon.com,
    // which serves both roles the Terraform profile needed two different hosts for elsewhere: it
    // hosts the exam guide PDF itself (coverage) and AWS's own service documentation (correctness).
    const officialHosts = new Set([
      "docs.docker.com", "kubernetes.io",
      "man7.org", "docs.kernel.org",
      "datatracker.ietf.org", "www.rfc-editor.org",
      "docs.github.com", "cncf.io",
      "developer.hashicorp.com",
      "www.cisecurity.org", "csrc.nist.gov",
      "attack.mitre.org", "slsa.dev",
      "docs.aws.amazon.com",
    ]);
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
  // An interview question has no exam objective to be true against, but it does have a level it
  // was written for (ADR 0016 decision 6): a certification or general question has no such level,
  // since a fact is not more or less true at a greater seniority.
  if (manifest.trackKind === "INTERVIEW") {
    if (!SENIORITIES.has(question.seniority)) fail(name, "interview questions need a seniority of PLENO or SENIOR");
  } else if (question.seniority !== undefined) {
    fail(name, "non-interview questions must not claim a seniority level");
  }
  // Every question says what its answer stands on. There is no silent absence: a question nothing
  // mechanical checks declares `reference-backed`, which is #166's "questões sem evidência
  // executável são explicitamente identificadas" — the state is named in the file rather than
  // inferred from a missing key, and content/evidence.mjs can therefore count it.
  const evidence = question.evidence;
  if (!evidence || Array.isArray(evidence) || typeof evidence !== "object"
      || !EVIDENCE_TYPES.has(evidence.type)) {
    fail(name, "unsupported evidence descriptor");
  }
  const permitted = EVIDENCE_PROFILES[manifest.evidenceProfile] ?? [];
  if (!permitted.includes(evidence.type)) {
    fail(name, `evidence ${evidence.type} is not permitted by the pack's ${manifest.evidenceProfile} profile`);
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
      // The directory name wins, deliberately: it is the identity the review record and the
      // quality ledgers key on. Spread first and it could be overridden by a `name` field inside
      // question.json, which would point every lookup at a directory that is not this one.
      return { ...validateGeneralQuestion(question, manifest, name), name };
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

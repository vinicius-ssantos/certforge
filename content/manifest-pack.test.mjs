import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readManifestPack, reviewDigestV2, validateGeneralQuestion } from "./manifest-pack.mjs";

const manifest = {
  schemaVersion: 1, packId: "infra", trackSlug: "infra", trackKind: "GENERAL",
  trackVersion: "2026.1", language: "pt-BR", sourcePolicy: "official-v1",
  evidenceProfile: "reference-v1", editorialStatus: "DRAFT",
};
const sample = () => ({
  topicId: "a3000000-0000-4000-8000-000000000301",
  type: "SINGLE_CHOICE", difficulty: "EASY", difficultyRationale: "One concept",
  prompt: "Which network layer?", explanation: "Reference-backed explanation",
  options: ["A", "B", "C", "D"].map((key, index) => ({
    key, text: `Choice ${key}`, correct: index === 0, explanation: `Why ${key}`,
  })),
  references: [{ title: "Documentation", url: "https://example.org/docs" }],
  evidence: { type: "reference-backed" },
});

test("accepts reference-backed general-knowledge questions", () => {
  assert.equal(validateGeneralQuestion(sample(), manifest).type, "SINGLE_CHOICE");
});
test("rejects malformed questions and accidental Java metadata", () => {
  assert.throws(() => validateGeneralQuestion({ ...sample(), javaRelease: 21 }, manifest), /javaRelease/);
  assert.throws(() => validateGeneralQuestion({ ...sample(), options: sample().options.slice(0, 3) }, manifest), /4 or 5/);
  assert.throws(() => validateGeneralQuestion({
    ...sample(), options: sample().options.map((value) => ({ ...value, correct: false })),
  }, manifest), /cardinality/);
  assert.throws(() => validateGeneralQuestion({
    ...sample(), references: [{ title: "Docs", url: "http://example.org" }],
  }, manifest), /HTTPS/);
});
test("infrastructure evidence only accepts official Docker and Kubernetes hosts", () => {
  const official = { ...manifest, sourcePolicy: "infrastructure-official-v1" };
  const withRef = (url) => ({
    ...sample(), references: [{ title: "Reference", url }],
  });
  assert.equal(
    validateGeneralQuestion(withRef("https://docs.docker.com/build/"), official).type,
    "SINGLE_CHOICE",
  );
  assert.equal(
    validateGeneralQuestion(withRef("https://kubernetes.io/docs/"), official).type,
    "SINGLE_CHOICE",
  );
  for (const url of [
    "https://docker.com.evil.example/docs",
    "https://example.com/docs",
    "https://docs.docker.com.evil.example/docs",
    "https://user@kubernetes.io/docs",
  ]) {
    assert.throws(() => validateGeneralQuestion(withRef(url), official), /official source policy/);
  }
});

test("evidence descriptors are explicit and unknown types fail closed", () => {
  for (const type of [
    "reference-backed", "shell-static-check", "yaml-static-check",
    "manifest-schema-check", "runnable-isolated-test",
  ]) {
    assert.equal(validateGeneralQuestion({ ...sample(), evidence: { type } }, manifest).evidence.type, type);
  }
  for (const evidence of [{ type: "unverified" }, { type: "code-executed" }, { type: "" }, []]) {
    assert.throws(() => validateGeneralQuestion({ ...sample(), evidence }, manifest), /evidence descriptor/);
  }
});

test("exam questions must bind to their objectives", () => {
  const certification = { ...manifest, trackKind: "CERTIFICATION" };
  assert.throws(() => validateGeneralQuestion(sample(), certification), /objectiveKeys/);
  assert.equal(validateGeneralQuestion({ ...sample(), objectiveKeys: ["1.1"] }, certification).objectiveKeys[0], "1.1");
});
test("digest changes on semantic edits and certification context changes", () => {
  const question = sample();
  const digest = reviewDigestV2(manifest, question);
  assert.equal(reviewDigestV2(manifest, { ...question }), digest);
  assert.notEqual(reviewDigestV2(manifest, { ...question, prompt: "Changed" }), digest);
  assert.notEqual(reviewDigestV2({ ...manifest, trackVersion: "2026.2" }, question), digest);
});
test("reads one manifest-backed pack and rejects an empty one", () => {
  const dir = mkdtempSync(join(tmpdir(), "certforge-pack-"));
  try {
    writeFileSync(join(dir, "pack.json"), JSON.stringify(manifest));
    assert.throws(() => readManifestPack(dir), /at least one question/);
    mkdirSync(join(dir, "t01-networking"));
    writeFileSync(join(dir, "t01-networking", "question.json"), JSON.stringify(sample()));
    const pack = readManifestPack(dir);
    assert.equal(pack.questions.length, 1);
    assert.equal(pack.manifest.trackKind, "GENERAL");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the seeded infrastructure pack is a valid unpublished draft", () => {
  const pack = readManifestPack("content/infrastructure-devops-foundations");
  assert.equal(pack.manifest.editorialStatus, "DRAFT");
  assert.equal(pack.manifest.trackKind, "GENERAL");
  assert.equal(pack.questions.length, 25);
  assert.equal(pack.questions.find((q) => q.name === "t01-image-vs-container").topicId, "a3000000-0000-4000-8000-000000000301");
});

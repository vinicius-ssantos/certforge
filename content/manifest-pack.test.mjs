import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readManifestPack, reviewDigestV2, validateGeneralQuestion } from "./manifest-pack.mjs";

const manifest = {
  schemaVersion: 1, packId: "infra", trackSlug: "infra", trackKind: "GENERAL",
  trackVersion: "2026.1", language: "pt-BR", sourcePolicy: "official-v1",
  evidenceProfile: "reference-backed-v1", editorialStatus: "DRAFT",
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
  // The vocabulary is fixed, and what a pack may claim from it is its evidenceProfile: this one
  // claims nothing mechanical, so every question in it stands on its references.
  assert.equal(validateGeneralQuestion({ ...sample(), evidence: { type: "reference-backed" } }, manifest).evidence.type, "reference-backed");
  for (const type of ["shell-static-check", "yaml-static-check", "manifest-schema-check", "runnable-isolated-test"]) {
    assert.throws(() => validateGeneralQuestion({ ...sample(), evidence: { type } }, manifest), /not permitted by the pack/);
  }
  const checked = { ...manifest, evidenceProfile: "static-check-v1" };
  for (const type of ["reference-backed", "shell-static-check", "yaml-static-check", "manifest-schema-check"]) {
    assert.equal(validateGeneralQuestion({ ...sample(), evidence: { type } }, checked).evidence.type, type);
  }
  for (const evidence of [{ type: "unverified" }, { type: "code-executed" }, { type: "" }, []]) {
    assert.throws(() => validateGeneralQuestion({ ...sample(), evidence }, checked), /evidence descriptor/);
  }
  // A question with no descriptor is not a question with no evidence; it is a question that has
  // not said. content/evidence.mjs counts the unchecked ones, and it can only count what is named.
  const { evidence, ...silent } = sample();
  assert.throws(() => validateGeneralQuestion(silent, manifest), /evidence descriptor/);
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
  assert.equal(pack.questions.length, 70);
  assert.equal(pack.questions.find((q) => q.name === "t01-image-vs-container").topicId, "a3000000-0000-4000-8000-000000000301");
});

test("the directory names a question, and a name inside the file does not take it over", () => {
  const dir = mkdtempSync(join(tmpdir(), "certforge-name-"));
  try {
    const pack = join(dir, "pack");
    mkdirSync(join(pack, "t01-real"), { recursive: true });
    writeFileSync(join(pack, "pack.json"), JSON.stringify(manifest));
    // A question.json carrying its own name: harmless until it disagrees with the directory, and
    // then every lookup keyed on the name — the review record, both quality ledgers — would read a
    // directory that is not this one.
    writeFileSync(
      join(pack, "t01-real", "question.json"),
      JSON.stringify({ ...sample(), name: "t99-somewhere-else" }),
    );

    assert.deepEqual(readManifestPack(pack).questions.map((question) => question.name), ["t01-real"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

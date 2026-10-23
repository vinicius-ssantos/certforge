import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stageEditorialPack, toEditorialRequest } from "./editorial-pack.mjs";
import { readManifestPack } from "./manifest-pack.mjs";

test("stages valid general questions for the legacy editorial importer without metadata leakage", () => {
  const pack = readManifestPack("content/infrastructure-devops-foundations");
  const dockerQuestion = pack.questions.find((question) => question.name === "t01-image-vs-container");
  assert.ok(dockerQuestion);
  const request = toEditorialRequest(dockerQuestion);
  assert.equal(request.javaRelease, null);
  assert.equal(request.topicId, "a3000000-0000-4000-8000-000000000301");
  assert.equal(request.options.filter((option) => option.correct).length, 1);
  // Evidence is still not carried, because the API does not store it and the adapter must not
  // pretend it does. Objective keys are carried now that it does store them (#165), and a pack
  // that claims none sends none.
  assert.equal(Object.hasOwn(request, "evidence"), false);
  assert.deepEqual(request.objectiveKeys, []);
  const temp = mkdtempSync(join(tmpdir(), "certforge-editorial-"));
  try {
    const destination = join(temp, "stage");
    const result = stageEditorialPack("content/infrastructure-devops-foundations", destination);
    assert.equal(result.count, 70);
    const output = JSON.parse(readFileSync(join(destination, "t01-image-vs-container", "question.json"), "utf8"));
    assert.deepEqual(output, request);
    assert.throws(() => stageEditorialPack("content/infrastructure-devops-foundations", destination));
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("a certification pack stages with the objectives its questions claim", () => {
  // This used to assert the opposite: staging refused certification packs outright, because the
  // editorial API dropped objectiveKeys and importing one meant losing the mapping the manifest
  // schema demands of every certification question — silently. The API stores them now (#165) and
  // publishing refuses a key the exam's verified objectives do not list, so the refusal has
  // nothing left to protect and the keys travel instead.
  const source = readManifestPack("content/infrastructure-devops-foundations");
  const temp = mkdtempSync(join(tmpdir(), "certforge-cert-block-"));
  try {
    const input = join(temp, "input");
    mkdirSync(input);
    mkdirSync(join(input, "question-01"));
    const manifest = {
      ...source.manifest,
      trackKind: "CERTIFICATION",
      certification: {
        provider: "Example", examCode: "EX-1", providerVersion: "2026.1",
        snapshotDigest: "sha256:" + "a".repeat(64), verifiedOn: "2026-10-08",
      },
    };
    const question = { ...source.questions[0], objectiveKeys: ["1.1"] };
    writeFileSync(join(input, "pack.json"), JSON.stringify(manifest));
    writeFileSync(join(input, "question-01", "question.json"), JSON.stringify(question));
    const output = join(temp, "output");
    const result = stageEditorialPack(input, output);
    assert.equal(result.count, 1);
    const staged = JSON.parse(readFileSync(join(output, "question-01", "question.json"), "utf8"));
    assert.deepEqual(staged.objectiveKeys, ["1.1"]);
    // The snapshot provenance stays in the pack: the API has no field for it, and the adapter does
    // not invent one. What the installation knows about that exam is recorded in its own catalog.
    assert.equal(Object.hasOwn(staged, "certification"), false);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("staging fails closed when a previously approved question changes", () => {
  const temp = mkdtempSync(join(tmpdir(), "certforge-stale-review-"));
  try {
    const source = join(temp, "input");
    cpSync("content/infrastructure-devops-foundations", source, { recursive: true });
    const path = join(source, "t01-docker-build-cache", "question.json");
    const question = JSON.parse(readFileSync(path, "utf8"));
    question.prompt += " Alterado após o aceite.";
    writeFileSync(path, JSON.stringify(question));
    const destination = join(temp, "staged");
    assert.throws(() => stageEditorialPack(source, destination), /Stale editorial acceptance/);
    assert.equal(existsSync(destination), false);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("staging says what the questions stand on, and refuses a claim nothing backs", () => {
  const temp = mkdtempSync(join(tmpdir(), "certforge-stage-evidence-"));
  try {
    const result = stageEditorialPack("content/infrastructure-devops-foundations", join(temp, "staged"));
    // Seventy questions of prose and quoted snippets, and the operator about to import them is
    // told so rather than left to assume the build checked something.
    assert.equal(result.evidenceProfile, "reference-backed-v1");
    assert.deepEqual(result.evidenceByType, { "reference-backed": 70 });
    assert.equal(result.withoutExecutableEvidence, 70);

    const source = join(temp, "claimed");
    cpSync("content/infrastructure-devops-foundations", source, { recursive: true });
    // Relabelling a question edits its file, which discards the sign-off recorded against that
    // file's bytes — the reason the real pack claims nothing mechanical even though the build does
    // lint some of its blocks. Dropping the record here leaves the evidence gate as the one on test.
    rmSync(join(source, "review.json"));
    const manifest = JSON.parse(readFileSync(join(source, "pack.json"), "utf8"));
    writeFileSync(join(source, "pack.json"), JSON.stringify({ ...manifest, evidenceProfile: "static-check-v1" }));
    const path = join(source, "t01-image-vs-container", "question.json");
    const question = JSON.parse(readFileSync(path, "utf8"));
    // It embeds no code block at all, so there is nothing for a static check to have looked at.
    writeFileSync(path, JSON.stringify({ ...question, evidence: { type: "yaml-static-check" } }));
    const destination = join(temp, "refused");
    assert.throws(() => stageEditorialPack(source, destination), /claims yaml-static-check/);
    assert.equal(existsSync(destination), false);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

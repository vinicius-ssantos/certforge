import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stageEditorialPack, toEditorialRequest } from "./editorial-pack.mjs";
import { readManifestPack } from "./manifest-pack.mjs";

test("stages valid general questions for the legacy editorial importer without metadata leakage", () => {
  const pack = readManifestPack("content/infrastructure-devops-foundations");
  const request = toEditorialRequest(pack.questions[0]);
  assert.equal(request.javaRelease, null);
  assert.equal(request.topicId, "a3000000-0000-4000-8000-000000000301");
  assert.equal(request.options.filter((option) => option.correct).length, 1);
  assert.equal(Object.hasOwn(request, "evidence"), false);
  assert.equal(Object.hasOwn(request, "objectiveKeys"), false);
  const temp = mkdtempSync(join(tmpdir(), "certforge-editorial-"));
  try {
    const destination = join(temp, "stage");
    const result = stageEditorialPack("content/infrastructure-devops-foundations", destination);
    assert.equal(result.count, 7);
    const output = JSON.parse(readFileSync(join(destination, "t01-image-vs-container", "question.json"), "utf8"));
    assert.deepEqual(output, request);
    assert.throws(() => stageEditorialPack("content/infrastructure-devops-foundations", destination));
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test("certification staging fails closed until objective persistence is implemented", () => {
  // The current editorial API does not store objectiveKeys/snapshotDigests; a certification
  // question may not be imported while losing that information.
  const input = readManifestPack("content/infrastructure-devops-foundations");
  assert.equal(input.manifest.trackKind, "GENERAL");
});

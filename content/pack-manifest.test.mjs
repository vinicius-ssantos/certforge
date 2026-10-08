import test from "node:test";
import assert from "node:assert/strict";
import { validatePackManifest } from "./pack-manifest.mjs";

const general = () => ({
  schemaVersion: 1,
  packId: "infrastructure-devops-foundations",
  trackSlug: "infrastructure-devops-foundations",
  trackKind: "GENERAL",
  trackVersion: "2026.1",
  language: "pt-BR",
  sourcePolicy: "infrastructure-official-v1",
  evidenceProfile: "static-v1",
  editorialStatus: "DRAFT",
});

test("accepts a draft infrastructure general-knowledge pack", () => {
  assert.equal(validatePackManifest(general()).trackKind, "GENERAL");
});
test("rejects undocumented or non-draft packs", () => {
  assert.throws(() => validatePackManifest({ ...general(), editorialStatus: "PUBLISHED" }), /DRAFT/);
  assert.throws(() => validatePackManifest({ ...general(), schemaVersion: 2 }), /schemaVersion/);
  assert.throws(() => validatePackManifest({ ...general(), trackSlug: "Bad Slug" }), /slugs/);
});
test("certification requires a verified version snapshot", () => {
  const certification = { ...general(), trackKind: "CERTIFICATION" };
  assert.throws(() => validatePackManifest(certification), /certification metadata/);
  const valid = {
    ...certification,
    certification: {
      provider: "CNCF",
      examCode: "EXAMPLE",
      providerVersion: "2026.1",
      snapshotDigest: "sha256:" + "a".repeat(64),
      verifiedOn: "2026-10-08",
    },
  };
  assert.equal(validatePackManifest(valid).certification.provider, "CNCF");
  assert.throws(
    () => validatePackManifest({ ...valid, certification: { ...valid.certification, snapshotDigest: "unverified" } }),
    /provenance/,
  );
});
test("non-certification pack cannot claim an exam", () => {
  assert.throws(() => validatePackManifest({ ...general(), certification: {} }), /only certification/);
});

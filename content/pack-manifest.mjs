// Manifest validation for non-legacy content packs. The Java 21 pack has no manifest and
// continues through the existing reader; this module does not change its review digests.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const REQUIRED = [
  "schemaVersion", "packId", "trackSlug", "trackKind", "trackVersion",
  "language", "sourcePolicy", "evidenceProfile", "editorialStatus",
];
const KINDS = new Set(["GENERAL", "INTERVIEW", "CERTIFICATION"]);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIGEST = /^sha256:[a-f0-9]{64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
/**
 * `platformVersions` is the floor at which the pack's own embedded snippets are valid, one entry
 * per platform it embeds — not a claim about what a learner should run. content/embedded-artifacts
 * derives that floor from the snippets and refuses a pack that records less than its files need, so
 * the number is checkable rather than aspirational. Only platforms this project can check offline
 * are accepted, because a version nothing verifies is a comment pretending to be a constraint.
 */
const PLATFORMS = new Set(["docker", "compose", "kubernetes"]);
const VERSION = /^\d+(?:\.\d+)*$/;

function requiredText(value, name) {
  if (typeof value !== "string" || value.trim() !== value || value.length === 0) {
    throw new Error(`Invalid pack manifest: ${name} must be a nonempty, trimmed string`);
  }
}

export function validatePackManifest(manifest) {
  if (manifest === null || Array.isArray(manifest) || typeof manifest !== "object") {
    throw new Error("Invalid pack manifest: expected an object");
  }
  for (const key of REQUIRED) {
    if (!(key in manifest)) {
      throw new Error(`Invalid pack manifest: missing ${key}`);
    }
  }
  if (manifest.schemaVersion !== 1) {
    throw new Error("Invalid pack manifest: unsupported schemaVersion");
  }
  for (const key of REQUIRED.filter((value) => value !== "schemaVersion")) {
    requiredText(manifest[key], key);
  }
  if (!SLUG.test(manifest.packId) || !SLUG.test(manifest.trackSlug)) {
    throw new Error("Invalid pack manifest: packId and trackSlug must be slugs");
  }
  if (!KINDS.has(manifest.trackKind)) {
    throw new Error("Invalid pack manifest: unsupported trackKind");
  }
  if (manifest.editorialStatus !== "DRAFT") {
    throw new Error("Invalid pack manifest: new packs must enter as DRAFT");
  }
  if (manifest.platformVersions !== undefined) {
    const versions = manifest.platformVersions;
    if (!versions || Array.isArray(versions) || typeof versions !== "object") {
      throw new Error("Invalid pack manifest: platformVersions must be an object");
    }
    for (const [platform, version] of Object.entries(versions)) {
      if (!PLATFORMS.has(platform)) {
        throw new Error(`Invalid pack manifest: platformVersions.${platform} is not a platform this project validates`);
      }
      if (typeof version !== "string" || !VERSION.test(version)) {
        throw new Error(`Invalid pack manifest: platformVersions.${platform} must be a dotted version`);
      }
    }
  }
  if (manifest.trackKind === "CERTIFICATION") {
    const certification = manifest.certification;
    if (!certification || Array.isArray(certification) || typeof certification !== "object") {
      throw new Error("Invalid pack manifest: certification metadata is required");
    }
    for (const key of ["provider", "examCode", "providerVersion", "snapshotDigest", "verifiedOn"]) {
      requiredText(certification[key], `certification.${key}`);
    }
    if (!DIGEST.test(certification.snapshotDigest) || !DATE.test(certification.verifiedOn)
      || Number.isNaN(Date.parse(`${certification.verifiedOn}T00:00:00Z`))) {
      throw new Error("Invalid pack manifest: certification snapshot provenance");
    }
  } else if (manifest.certification !== undefined) {
    throw new Error("Invalid pack manifest: only certification tracks may define an exam");
  }
  return manifest;
}

export function loadPackManifest(packDir) {
  const manifest = JSON.parse(readFileSync(join(packDir, "pack.json"), "utf8"));
  return validatePackManifest(manifest);
}

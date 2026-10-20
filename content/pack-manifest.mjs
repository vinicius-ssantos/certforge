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

/**
 * The kinds of evidence a question may stand on, from #166. `reference-backed` is the weakest and
 * the honest name for a question nothing mechanical checks: the only check is the reviewer reading
 * it against the pages it cites. The others each claim a machine looked, and content/evidence.mjs
 * refuses a claim no machine in this repository can make good on.
 */
export const EVIDENCE_TYPES = new Set([
  "reference-backed", "shell-static-check", "yaml-static-check", "manifest-schema-check",
  "runnable-isolated-test",
]);

/**
 * What a pack's `evidenceProfile` means. It was a free-text string for as long as nothing read it,
 * which let a pack claim any level of rigour while carrying nothing at all — the one thing the
 * editorial rules exist to prevent. A profile now names exactly which evidence types its questions
 * may claim, and a pack whose profile is not listed here fails rather than passing unread.
 *
 * `static-check-v1` admits the offline checks content/embedded-artifacts.mjs already performs. No
 * pack declares it yet: the infrastructure pack's questions could claim those checks, but their
 * text is signed off against its git blob, and rewriting a question to decorate it would discard a
 * person's review to gain a label.
 */
export const EVIDENCE_PROFILES = {
  "reference-backed-v1": ["reference-backed"],
  "static-check-v1": [
    "reference-backed", "shell-static-check", "yaml-static-check", "manifest-schema-check",
  ],
};

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
  if (!(manifest.evidenceProfile in EVIDENCE_PROFILES)) {
    throw new Error(
      `Invalid pack manifest: evidenceProfile ${JSON.stringify(manifest.evidenceProfile)} is not a profile`
      + ` this project implements (${Object.keys(EVIDENCE_PROFILES).join(", ")})`,
    );
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

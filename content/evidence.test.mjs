import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertEvidence, inspectEvidence } from "./evidence.mjs";
import { readManifestPack } from "./manifest-pack.mjs";
import { EVIDENCE_PROFILES } from "./pack-manifest.mjs";

const pack = "content/infrastructure-devops-foundations";

/** A copy to damage: every check here is about a pack as a whole. */
function withCopy(work) {
  const dir = mkdtempSync(join(tmpdir(), "certforge-evidence-"));
  const target = join(dir, "pack");
  try {
    cpSync(pack, target, { recursive: true });
    work(target);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function edit(path, change) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  change(data);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

const profile = (target, name) => edit(join(target, "pack.json"), (data) => { data.evidenceProfile = name; });
const claim = (target, question, type) =>
  edit(join(target, question, "question.json"), (data) => { data.evidence = { type }; });
const addBlock = (target, question, language, body) =>
  edit(join(target, question, "question.json"), (data) => {
    data.prompt = `${data.prompt}\n\n\`\`\`${language}\n${body}\n\`\`\``;
  });

test("the pack stands on its references, and says so for every question", () => {
  const live = assertEvidence(pack);
  assert.equal(live.total, 70);
  assert.equal(live.profile, "reference-backed-v1");
  assert.deepEqual(live.byType, { "reference-backed": 70 });
  // The #166 criterion: the questions nothing mechanical checks are named, not inferred from a
  // missing key. All seventy, which is what a pack of prose and quoted snippets honestly is.
  assert.equal(live.withoutExecutableEvidence.length, 70);
  assert.ok(live.withoutExecutableEvidence.includes("t01-image-vs-container"));
});

test("a question with no evidence descriptor at all is not a question with no evidence", () => {
  withCopy((target) => {
    edit(join(target, "t01-image-vs-container", "question.json"), (data) => { delete data.evidence; });
    assert.throws(() => readManifestPack(target), /unsupported evidence descriptor/);
  });
});

test("a claimed check nothing in the repository runs is refused", () => {
  // #166 names runnable-isolated-test and nothing here runs one, so no profile admits it. The
  // vocabulary keeps the name — a future runner needs one — and every profile refuses the claim.
  for (const permitted of Object.values(EVIDENCE_PROFILES)) {
    assert.ok(!permitted.includes("runnable-isolated-test"));
  }
  withCopy((target) => {
    profile(target, "static-check-v1");
    claim(target, "t01-docker-multistage", "runnable-isolated-test");
    assert.throws(
      () => assertEvidence(target),
      /evidence runnable-isolated-test is not permitted by the pack's static-check-v1 profile/,
    );
  });
});

test("a question claiming the yaml check without any yaml is refused, and with yaml accepted", () => {
  withCopy((target) => {
    profile(target, "static-check-v1");
    // This one embeds a Dockerfile and no YAML, which is the shape of a mislabelled claim.
    claim(target, "t01-docker-multistage", "yaml-static-check");
    assert.throws(
      () => assertEvidence(target),
      /t01-docker-multistage claims yaml-static-check, corroborated by a yaml block[^\n]*it embeds dockerfile/,
    );
  });
  withCopy((target) => {
    profile(target, "static-check-v1");
    claim(target, "t02-k8s-deployment-replicas", "yaml-static-check");
    const live = assertEvidence(target);
    assert.equal(live.byType["yaml-static-check"], 1);
    assert.ok(!live.withoutExecutableEvidence.includes("t02-k8s-deployment-replicas"));
  });
});

test("the shell check answers to a Dockerfile, which is the only shell this build lints", () => {
  withCopy((target) => {
    profile(target, "static-check-v1");
    claim(target, "t01-docker-multistage", "shell-static-check");
    assert.equal(assertEvidence(target).byType["shell-static-check"], 1);
  });
  withCopy((target) => {
    profile(target, "static-check-v1");
    // A shell transcript is not linted by anything here, so a question showing one stands on its
    // references like any other prose question.
    addBlock(target, "t01-image-vs-container", "bash", "docker run --rm alpine:3.20 true");
    claim(target, "t01-image-vs-container", "shell-static-check");
    assert.throws(() => assertEvidence(target), /t01-image-vs-container claims shell-static-check/);
  });
});

test("the manifest check answers to a manifest, not to any yaml", () => {
  withCopy((target) => {
    profile(target, "static-check-v1");
    // A fragment: `spec:` with a replicas under it, which declares no apiVersion and so gets no
    // API-removal check. Claiming the manifest check over it claims a check that did not happen.
    claim(target, "t02-k8s-deployment-replicas", "manifest-schema-check");
    assert.throws(() => assertEvidence(target), /claims manifest-schema-check, corroborated by a yaml block declaring apiVersion/);
  });
  withCopy((target) => {
    profile(target, "static-check-v1");
    addBlock(target, "t02-k8s-deployment-replicas", "yaml", "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web");
    claim(target, "t02-k8s-deployment-replicas", "manifest-schema-check");
    assert.equal(assertEvidence(target).byType["manifest-schema-check"], 1);
  });
});

test("a question may not claim a check the pack's own profile does not admit", () => {
  withCopy((target) => {
    // The profile stays reference-backed-v1, so the schema refuses the claim before any
    // corroboration is attempted: the pack and its questions have to agree.
    claim(target, "t02-k8s-deployment-replicas", "yaml-static-check");
    assert.throws(
      () => readManifestPack(target),
      /evidence yaml-static-check is not permitted by the pack's reference-backed-v1 profile/,
    );
  });
});

test("a profile no question uses overstates the pack", () => {
  withCopy((target) => {
    profile(target, "static-check-v1");
    assert.throws(() => assertEvidence(target), /declares the static-check-v1 profile and no question in it claims any of/);
  });
});

test("an evidence profile this project does not implement fails the manifest", () => {
  withCopy((target) => {
    profile(target, "runnable-verified-v1");
    assert.throws(() => inspectEvidence(target), /evidenceProfile "runnable-verified-v1" is not a profile this project implements/);
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assertArtifacts, fencedBlocks, inspectArtifacts, lintDockerfile, lintYaml, removedApiVersion, versionAtLeast,
} from "./embedded-artifacts.mjs";

const pack = "content/infrastructure-devops-foundations";

function withCopy(work) {
  const dir = mkdtempSync(join(tmpdir(), "certforge-artifacts-"));
  const target = join(dir, "pack");
  try {
    cpSync(pack, target, { recursive: true });
    work(target);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function putBlock(target, question, language, body) {
  const path = join(target, question, "question.json");
  const data = JSON.parse(readFileSync(path, "utf8"));
  data.prompt = `${data.prompt}\n\n\`\`\`${language}\n${body}\n\`\`\``;
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

function setVersions(target, platformVersions) {
  const path = join(target, "pack.json");
  writeFileSync(path, JSON.stringify({ ...JSON.parse(readFileSync(path, "utf8")), platformVersions }, null, 2) + "\n");
}

test("versions compare as numbers, not as text", () => {
  assert.equal(versionAtLeast("23.0", "17.05"), true);
  assert.equal(versionAtLeast("17.05", "23.0"), false);
  // The text comparison every such check gets wrong once: "1.9" > "1.22" as strings.
  assert.equal(versionAtLeast("1.9", "1.22"), false);
  assert.equal(versionAtLeast("1.30", "1.30"), true);
  assert.equal(versionAtLeast("2", "2.0"), true);
});

test("the pack's own artifacts pass, and the count is the one #168 still needs", () => {
  const counts = assertArtifacts(pack);
  assert.deepEqual(counts, {
    total: 11, dockerfile: 2, dockerfileFragment: 1, manifests: 0, compose: 1, yamlFragment: 6,
  });
  // #168 asks for at least eight YAML or troubleshooting scenarios with manifests validated
  // offline. Zero manifests is the gap, and this number is how it stops being an opinion.
  assert.equal(counts.manifests, 0);
});

test("a block is taken from every part of a question a learner reads", () => {
  const blocks = fencedBlocks({
    prompt: "before\n```yaml\nspec: {}\n```\nafter",
    explanation: "```dockerfile\nFROM x\n```",
    options: [{ key: "A", text: "```json\n{}\n```", explanation: "plain" }],
  });
  assert.deepEqual(blocks.map((block) => [block.where, block.language]), [
    ["prompt", "yaml"], ["explanation", "dockerfile"], ["option A", "json"],
  ]);
});

test("an inline triple backtick in prose is not a block", () => {
  assert.deepEqual(fencedBlocks({ prompt: "write ``` to open a block", explanation: "", options: [] }), []);
});

test("a fence with no language is refused, because nothing can check it", () => {
  withCopy((target) => {
    putBlock(target, "t01-image-vs-container", "", "spec:\n  replicas: 3");
    assert.throws(() => assertArtifacts(target), /declares no language/);
  });
});

test("a fence language this project cannot check is refused by name", () => {
  withCopy((target) => {
    putBlock(target, "t01-image-vs-container", "hcl", "resource \"aws_s3_bucket\" \"b\" {}");
    assert.throws(() => assertArtifacts(target), /unknown fence language "hcl"/);
  });
});

test("a Dockerfile instruction that does not exist is caught", () => {
  const { problems } = lintDockerfile("FROM alpine\nRUNN echo hi");
  assert.deepEqual(problems, ["line 2: RUNN is not a Dockerfile instruction"]);
});

test("COPY --from must name a stage the file declares, unless it names an index or an image", () => {
  assert.deepEqual(lintDockerfile("FROM a AS build\nFROM b\nCOPY --from=build /x /x").problems, []);
  assert.deepEqual(lintDockerfile("FROM b\nCOPY --from=0 /x /x").problems, []);
  assert.deepEqual(lintDockerfile("FROM b\nCOPY --from=nginx:alpine /x /x").problems, []);
  assert.deepEqual(lintDockerfile("FROM b\nCOPY --from=build /x /x").problems, [
    "line 2: COPY --from=build names a stage this file does not declare",
  ]);
});

test("a Dockerfile fragment is read as a fragment, not as a file missing its FROM", () => {
  // Exactly what t04-docker-entrypoint-cmd shows: the two instructions side by side.
  const fragment = lintDockerfile('ENTRYPOINT ["java", "-jar", "/app/app.jar"]\nCMD ["--server.port=8080"]');
  assert.equal(fragment.kind, "dockerfile-fragment");
  assert.deepEqual(fragment.problems, []);
  assert.equal(lintDockerfile("FROM a\nRUN echo hi").kind, "dockerfile");
  assert.deepEqual(lintDockerfile("RUN echo hi\nFROM a").problems, ["RUN comes before the first FROM"]);
});

test("a line continuation does not make the next line an instruction", () => {
  assert.deepEqual(lintDockerfile("FROM a\nRUN echo one \\\n  && echo two").problems, []);
});

test("a BuildKit feature raises the floor, and a pack recording less than its files need fails", () => {
  const linted = lintDockerfile("FROM a\nRUN --mount=type=cache,target=/root/.m2 mvn package");
  assert.equal(linted.minimumDocker, "18.09");
  withCopy((target) => {
    putBlock(target, "t01-image-vs-container", "dockerfile", "FROM a\nRUN --mount=type=secret,id=token cat /run/secrets/token");
    assert.throws(() => assertArtifacts(target), /records Docker 17\.05, below the 18\.09/);
    setVersions(target, { docker: "18.09", compose: "2.0" });
    assert.doesNotThrow(() => assertArtifacts(target));
  });
});

test("YAML indented with a tab, oddly, or with a key set twice is caught", () => {
  assert.match(lintYaml("spec:\n\treplicas: 3").problems[0], /tab/);
  assert.match(lintYaml("spec:\n   replicas: 3").problems[0], /not a multiple of two/);
  assert.match(lintYaml("spec:\n  replicas: 3\n  replicas: 4").problems[0], /replicas is set twice/);
});

test("a sequence of mappings repeats its keys without that being a duplicate", () => {
  // Two containers both have a name; the keys belong to the entries, not to the indent.
  assert.deepEqual(lintYaml("containers:\n  - name: api\n    image: a\n  - name: sidecar\n    image: b").problems, []);
});

test("a block scalar's content is not read as YAML lines", () => {
  const linted = lintYaml("data:\n  nginx.conf: |\n    server {\n      listen 80;\n    }");
  assert.deepEqual(linted.problems, []);
});

test("a fragment is a fragment and a manifest is a manifest", () => {
  assert.equal(lintYaml("spec:\n  replicas: 3").kind, "yaml-fragment");
  assert.equal(lintYaml("services:\n  api:\n    image: a").kind, "compose");
  const manifest = lintYaml("apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api");
  assert.equal(manifest.kind, "manifest");
  assert.equal(manifest.apiVersion, "apps/v1");
  assert.equal(manifest.resource, "Deployment");
  assert.match(lintYaml("apiVersion: apps/v1\nmetadata:\n  name: api").problems[0], /without kind/);
});

test("a manifest makes the pack declare which Kubernetes it was validated against", () => {
  withCopy((target) => {
    putBlock(target, "t01-image-vs-container", "yaml", "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api");
    assert.throws(() => assertArtifacts(target), /records no platformVersions.kubernetes/);
    setVersions(target, { docker: "17.05", compose: "2.0", kubernetes: "1.30" });
    const counts = assertArtifacts(target);
    assert.equal(counts.manifests, 1);
  });
});

test("an apiVersion the recorded Kubernetes has removed is refused", () => {
  assert.equal(removedApiVersion("extensions/v1beta1", "Ingress", "1.30").removedIn, "1.22");
  // The same manifest against a cluster that still served it is not this check's business.
  assert.equal(removedApiVersion("extensions/v1beta1", "Ingress", "1.21"), null);
  assert.equal(removedApiVersion("networking.k8s.io/v1", "Ingress", "1.30"), null);
  withCopy((target) => {
    putBlock(target, "t01-image-vs-container", "yaml", "apiVersion: extensions/v1beta1\nkind: Ingress\nmetadata:\n  name: api");
    setVersions(target, { docker: "17.05", compose: "2.0", kubernetes: "1.30" });
    assert.throws(() => assertArtifacts(target), /removed in Kubernetes 1\.22, and the pack records 1\.30/);
  });
});

test("a pack that embeds nothing is not made to declare a platform", () => {
  withCopy((target) => {
    setVersions(target, {});
    const stripped = inspectArtifacts(target).artifacts.length;
    assert.ok(stripped > 0, "the real pack does embed blocks, so this is the interesting case");
    // Strip the only Dockerfiles and the Compose file; the fragments left imply no floor.
    for (const question of ["t01-docker-build-cache", "t01-docker-multistage", "t05-compose-service-dns"]) {
      const path = join(target, question, "question.json");
      const data = JSON.parse(readFileSync(path, "utf8"));
      data.prompt = data.prompt.replace(/```[\s\S]*?```/g, "(snippet removed for this test)");
      writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    }
    assert.doesNotThrow(() => assertArtifacts(target));
  });
});

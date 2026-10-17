// The Dockerfiles, Compose files and Kubernetes YAML that live inside question text, and what can
// be checked about them without a network, a cluster or a daemon.
//
// #167 asks for applied scenarios carrying a Dockerfile or a Compose file and for the Docker and
// Compose versions a question depends on to be written down; #168 asks for YAML scenarios whose
// manifests are "validados offline contra versão do Kubernetes registrada". A question's code block
// is read by a learner as the thing being taught, so a snippet with a broken indent or an
// apiVersion the recorded Kubernetes no longer serves teaches that instead.
//
// Three deliberate limits, because a checker that implies more than it does is worse than none:
//
//  - **This is not a YAML parser.** It checks shape: tabs, indentation steps, line form, duplicate
//    sibling keys. A block that passes is well-formed as far as that goes and may still mean
//    something other than the author intended.
//  - **A fragment is checked as a fragment.** Most snippets in a pack are a few lines lifted out of
//    a manifest — `spec:` with a `replicas:` under it — and demanding `apiVersion` of those would
//    push authors to paste whole manifests to satisfy a tool. A block is only held to the manifest
//    rules once it declares itself one.
//  - **Nothing here says a snippet is pedagogically right**, which stays with the named human
//    reviewer by ADR 0005. It says the snippet is syntactically what it claims to be.
import { readManifestPack } from "./manifest-pack.mjs";

/**
 * Languages a fence may declare. A fence with no language at all is refused: the renderer gives it
 * no highlighting, and a checker cannot tell whether an unlabelled block is YAML that is broken or
 * prose that happens to contain a colon.
 */
const LANGUAGES = new Set(["dockerfile", "yaml", "bash", "shell", "sh", "json", "properties", "text", "java", "sql"]);

/** Instructions a Dockerfile may use. Anything else is a typo or a feature that does not exist. */
const INSTRUCTIONS = new Set([
  "ADD", "ARG", "CMD", "COPY", "ENTRYPOINT", "ENV", "EXPOSE", "FROM", "HEALTHCHECK", "LABEL",
  "MAINTAINER", "ONBUILD", "RUN", "SHELL", "STOPSIGNAL", "USER", "VOLUME", "WORKDIR",
]);

/**
 * Dockerfile features that need a minimum engine, so a pack that uses one has to say it depends on
 * it. Multi-stage arrived in 17.05; the BuildKit mounts and heredocs are later and are the ones an
 * author is most likely to use without noticing the floor they set.
 */
const DOCKER_FEATURES = [
  { pattern: /^\s*COPY\s+[^\n]*--from=/im, minimum: "17.05", because: "COPY --from, which is multi-stage" },
  { pattern: /^\s*FROM\s+\S+\s+AS\s+\S+/im, minimum: "17.05", because: "a named build stage" },
  { pattern: /--mount=type=(secret|ssh)/i, minimum: "18.09", because: "a BuildKit secret or ssh mount" },
  { pattern: /--mount=type=cache/i, minimum: "18.09", because: "a BuildKit cache mount" },
  { pattern: /^\s*(RUN|COPY)\s+[^\n]*<</im, minimum: "23.0", because: "a heredoc in an instruction" },
  { pattern: /^\s*COPY\s+[^\n]*--link/im, minimum: "23.0", because: "COPY --link" },
];

/**
 * API versions Kubernetes has removed, with the release that removed them. A manifest using one is
 * not a style question: applied to a cluster at or past that version it is rejected outright, so a
 * question teaching it teaches something that cannot be run. Only removals are listed, never
 * "exists since", because a wrong entry here fails a correct manifest, and the asymmetry matters:
 * a missed removal leaves a gap, an invented one blocks true content.
 */
const REMOVED_API_VERSIONS = [
  { apiVersion: "extensions/v1beta1", kinds: ["Ingress", "Deployment", "DaemonSet", "ReplicaSet", "NetworkPolicy", "PodSecurityPolicy"], removedIn: "1.22" },
  { apiVersion: "apps/v1beta1", kinds: ["Deployment", "StatefulSet"], removedIn: "1.16" },
  { apiVersion: "apps/v1beta2", kinds: ["Deployment", "DaemonSet", "ReplicaSet", "StatefulSet"], removedIn: "1.16" },
  { apiVersion: "batch/v1beta1", kinds: ["CronJob"], removedIn: "1.25" },
  { apiVersion: "policy/v1beta1", kinds: ["PodDisruptionBudget", "PodSecurityPolicy"], removedIn: "1.25" },
  { apiVersion: "autoscaling/v2beta1", kinds: ["HorizontalPodAutoscaler"], removedIn: "1.25" },
  { apiVersion: "autoscaling/v2beta2", kinds: ["HorizontalPodAutoscaler"], removedIn: "1.26" },
  { apiVersion: "rbac.authorization.k8s.io/v1beta1", kinds: ["Role", "RoleBinding", "ClusterRole", "ClusterRoleBinding"], removedIn: "1.22" },
  { apiVersion: "networking.k8s.io/v1beta1", kinds: ["Ingress", "IngressClass"], removedIn: "1.22" },
];

/** Compares versions as number sequences, so 1.9 is below 1.22 and 17.05 below 23.0. */
export function versionAtLeast(candidate, floor) {
  const parse = (value) => String(value).split(".").map((part) => Number.parseInt(part, 10));
  const left = parse(candidate);
  const right = parse(floor);
  if (left.some(Number.isNaN) || right.some(Number.isNaN)) {
    throw new Error(`Not a comparable version: ${candidate} against ${floor}`);
  }
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const a = left[index] ?? 0;
    const b = right[index] ?? 0;
    if (a !== b) return a > b;
  }
  return true;
}

/** Every fenced block in the parts of a question a learner reads, with where it came from. */
export function fencedBlocks(question) {
  const sources = [
    ["prompt", question.prompt],
    ["explanation", question.explanation],
    ...question.options.flatMap((option) => [
      [`option ${option.key}`, option.text],
      [`option ${option.key} explanation`, option.explanation],
    ]),
  ];
  const blocks = [];
  for (const [where, text] of sources) {
    // The opening fence must be followed by a newline, so an inline ``` in prose is not a block.
    for (const match of String(text ?? "").matchAll(/```([^\n`]*)\n([\s\S]*?)```/g)) {
      blocks.push({ where, language: match[1].trim(), body: match[2].replace(/\s+$/, "") });
    }
  }
  return blocks;
}

/**
 * A Dockerfile block, checked by instruction. A block with no `FROM` is a fragment — `ENTRYPOINT`
 * beside `CMD` to show how the two combine — and the rules about what must come first do not apply
 * to it; everything else does.
 */
export function lintDockerfile(body) {
  const problems = [];
  const lines = body.split("\n");
  const stages = new Set();
  const instructions = [];
  let continued = false;
  for (const [index, raw] of lines.entries()) {
    const at = `line ${index + 1}`;
    const line = raw.trim();
    const wasContinued = continued;
    continued = line.endsWith("\\");
    if (wasContinued || line === "" || line.startsWith("#")) continue;
    const word = line.split(/\s+/)[0];
    const instruction = word.toUpperCase();
    if (!INSTRUCTIONS.has(instruction)) {
      problems.push(`${at}: ${word} is not a Dockerfile instruction`);
      continue;
    }
    if (word !== instruction && word !== word.toLowerCase()) {
      problems.push(`${at}: ${word} mixes case`);
    }
    instructions.push(instruction);
    const stage = /^FROM\s+\S+(?:\s+AS\s+(\S+))?/i.exec(line);
    if (stage?.[1]) stages.add(stage[1]);
    const from = /^COPY\s+[^\n]*--from=([^\s]+)/i.exec(line);
    // A numeric --from is a stage index and a name with a slash or colon is an image; neither has
    // to be declared above. A bare name must be, or the build fails with "invalid from flag".
    if (from && !/^\d+$/.test(from[1]) && !/[/:]/.test(from[1]) && !stages.has(from[1])) {
      problems.push(`${at}: COPY --from=${from[1]} names a stage this file does not declare`);
    }
  }
  const complete = instructions.includes("FROM");
  if (complete) {
    const first = instructions.find((instruction) => instruction !== "ARG");
    if (first !== "FROM") {
      problems.push(`${first} comes before the first FROM`);
    }
  }
  const requires = DOCKER_FEATURES.filter((feature) => feature.pattern.test(body));
  const minimum = requires.reduce((floor, feature) => (versionAtLeast(feature.minimum, floor) ? feature.minimum : floor), "1.0");
  return { kind: complete ? "dockerfile" : "dockerfile-fragment", minimumDocker: requires.length === 0 ? null : minimum, requires, problems };
}

/**
 * A YAML block, checked for shape rather than parsed, and classified. Indentation in steps of two
 * is this pack's convention rather than YAML's law, enforced because a snippet read as the lesson
 * should not teach a layout a cluster would reject or a reader would mis-nest.
 */
export function lintYaml(body) {
  const problems = [];
  const lines = body.split("\n");
  const roots = new Map();
  const siblings = new Map();
  let blockScalarIndent = null;
  for (const [index, raw] of lines.entries()) {
    const at = `line ${index + 1}`;
    if (raw.trim() === "" ) continue;
    const indent = raw.length - raw.trimStart().length;
    if (blockScalarIndent !== null) {
      if (indent > blockScalarIndent) continue;
      blockScalarIndent = null;
    }
    if (/^\s*\t/.test(raw) || /^\t/.test(raw)) {
      problems.push(`${at}: indented with a tab, which YAML does not allow`);
      continue;
    }
    const line = raw.trim();
    if (line.startsWith("#") || line === "---" || line === "...") continue;
    if (indent % 2 !== 0) {
      problems.push(`${at}: indented ${indent} spaces, not a multiple of two`);
    }
    const sequence = /^-\s*(.*)$/.exec(line);
    const content = sequence ? sequence[1] : line;
    if (content === "") continue;
    const mapping = /^([A-Za-z0-9_.\-"'[\]/]+)\s*:(\s|$)/.exec(content);
    if (!mapping) {
      problems.push(`${at}: ${JSON.stringify(line.slice(0, 40))} is neither a key, a sequence entry nor a comment`);
      continue;
    }
    const key = mapping[1].replace(/^["']|["']$/g, "");
    const value = content.slice(mapping[0].length).trim();
    if (/^[|>][+-]?$/.test(value)) {
      blockScalarIndent = indent;
    }
    // Siblings are the keys of one mapping: same indent, forgotten as soon as a shallower line
    // closes the block. A sequence entry opens a mapping of its own, two columns in past the dash,
    // so `- name: api` twice in a list is not `name` set twice — the second entry's keys start
    // clean. Getting this wrong would reject every list of containers in the pack.
    const effective = sequence ? indent + 2 : indent;
    if (sequence) {
      for (const level of [...siblings.keys()].filter((candidate) => candidate >= effective)) {
        siblings.delete(level);
      }
    }
    const previous = siblings.get(effective);
    if (previous?.has(key)) {
      problems.push(`${at}: ${key} is set twice at the same level`);
    }
    const keys = previous ?? new Set();
    keys.add(key);
    siblings.set(effective, keys);
    for (const deeper of [...siblings.keys()].filter((level) => level > effective)) {
      siblings.delete(deeper);
    }
    if (indent === 0 && !sequence) roots.set(key, value);
  }
  const apiVersion = roots.get("apiVersion");
  const kind = roots.get("kind");
  if (apiVersion && !kind) {
    problems.push("declares apiVersion without kind, so it is neither a manifest nor a fragment");
  }
  const classified = apiVersion && kind ? "manifest" : roots.has("services") ? "compose" : "yaml-fragment";
  return { kind: classified, apiVersion: apiVersion ?? null, resource: kind ?? null, problems };
}

/** A manifest whose apiVersion the recorded Kubernetes no longer serves. */
export function removedApiVersion(apiVersion, resource, kubernetes) {
  const removal = REMOVED_API_VERSIONS.find((entry) => entry.apiVersion === apiVersion && entry.kinds.includes(resource));
  return removal && versionAtLeast(kubernetes, removal.removedIn) ? removal : null;
}

/** Every embedded artifact of a pack, classified, with the version floors they imply. */
export function inspectArtifacts(pack) {
  const { manifest, questions } = readManifestPack(pack);
  const artifacts = [];
  for (const question of questions) {
    for (const block of fencedBlocks(question)) {
      const entry = { question: question.name, ...block };
      if (block.language === "dockerfile") Object.assign(entry, lintDockerfile(block.body));
      else if (block.language === "yaml") Object.assign(entry, lintYaml(block.body));
      else entry.kind = block.language || "undeclared";
      artifacts.push(entry);
    }
  }
  const counted = (kind) => artifacts.filter((artifact) => artifact.kind === kind).length;
  return {
    manifest,
    artifacts,
    counts: {
      total: artifacts.length,
      dockerfile: counted("dockerfile"),
      dockerfileFragment: counted("dockerfile-fragment"),
      manifests: counted("manifest"),
      compose: counted("compose"),
      yamlFragment: counted("yaml-fragment"),
    },
  };
}

/**
 * Fails when an embedded artifact is not what it claims, when the pack uses a feature whose engine
 * floor it has not written down, or when a manifest names an API version the recorded Kubernetes
 * has removed. The version is only demanded for a platform the pack actually embeds, so a pack of
 * prose questions is not made to declare a Docker it never mentions.
 */
export function assertArtifacts(pack) {
  const { manifest, artifacts, counts } = inspectArtifacts(pack);
  const versions = manifest.platformVersions ?? {};
  const problems = [];

  for (const artifact of artifacts) {
    if (artifact.language === "") {
      problems.push(`${artifact.question} (${artifact.where}): a fenced block declares no language`);
      continue;
    }
    if (!LANGUAGES.has(artifact.language)) {
      problems.push(`${artifact.question} (${artifact.where}): unknown fence language ${JSON.stringify(artifact.language)}`);
      continue;
    }
    for (const problem of artifact.problems ?? []) {
      problems.push(`${artifact.question} (${artifact.where}): ${problem}`);
    }
  }

  const dockerFloor = artifacts
    .filter((artifact) => artifact.minimumDocker)
    .reduce((floor, artifact) => (floor === null || versionAtLeast(artifact.minimumDocker, floor) ? artifact.minimumDocker : floor), null);
  if (dockerFloor && !versions.docker) {
    problems.push(`the pack embeds Dockerfiles needing Docker ${dockerFloor} or later and pack.json records no platformVersions.docker`);
  } else if (dockerFloor && !versionAtLeast(versions.docker, dockerFloor)) {
    problems.push(`pack.json records Docker ${versions.docker}, below the ${dockerFloor} its own Dockerfiles need`);
  }

  if (counts.compose > 0 && !versions.compose) {
    problems.push("the pack embeds a Compose file and pack.json records no platformVersions.compose");
  }
  if (counts.manifests > 0 && !versions.kubernetes) {
    problems.push("the pack embeds Kubernetes manifests and pack.json records no platformVersions.kubernetes");
  }
  for (const artifact of artifacts.filter((entry) => entry.kind === "manifest")) {
    const removal = versions.kubernetes && removedApiVersion(artifact.apiVersion, artifact.resource, versions.kubernetes);
    if (removal) {
      problems.push(`${artifact.question} (${artifact.where}): ${artifact.apiVersion} ${artifact.resource} was removed in Kubernetes ${removal.removedIn}, and the pack records ${versions.kubernetes}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`${pack} embedded artifacts:\n- ${problems.join("\n- ")}`);
  }
  return counts;
}

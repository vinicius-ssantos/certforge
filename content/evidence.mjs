// What each question's answer stands on, and whether this repository can make that claim good.
//
// #166 asks for evidence types and for questions without executable evidence to be "explicitamente
// identificadas". The schema in content/manifest-pack.mjs now demands a descriptor on every
// question, so the weak case has a name — `reference-backed`, meaning nothing mechanical checked
// this and the reviewer's reading is the only check. This module does the other half: a question
// that claims a *machine* looked has to point at something a machine here actually reads.
//
// The asymmetry is the point. A missing check leaves a question honestly labelled as unchecked. A
// claimed check that nothing performs is worse than no label at all, because the reviewer reading
// the packet relaxes over it, and the pack's own evidenceProfile becomes a boast. So each type is
// bound to the check that corroborates it, and a type this project cannot corroborate is refused
// outright rather than accepted on trust.
import { fencedBlocks, lintYaml } from "./embedded-artifacts.mjs";
import { readManifestPack } from "./manifest-pack.mjs";
import { EVIDENCE_PROFILES } from "./pack-manifest.mjs";

/**
 * Where each evidence type is corroborated, named by the check that runs over it in `just
 * test-content`. `shell-static-check` is corroborated by a Dockerfile block and not by a `bash`
 * one: content/embedded-artifacts.mjs lints Dockerfile instructions and nothing in this repository
 * lints shell, so a question whose only block is a shell transcript stands on its references like
 * any other prose question.
 */
const CORROBORATION = {
  "reference-backed": {
    by: "the reference rules in content/manifest-pack.mjs",
    // Every question is already held to HTTPS references within the pack's source policy, so this
    // one needs nothing further from the question.
    satisfied: () => true,
  },
  "shell-static-check": {
    by: "a dockerfile block, linted by content/embedded-artifacts.mjs",
    satisfied: (blocks) => blocks.some((block) => block.language === "dockerfile"),
  },
  "yaml-static-check": {
    by: "a yaml block, checked for shape by content/embedded-artifacts.mjs",
    satisfied: (blocks) => blocks.some((block) => block.language === "yaml"),
  },
  "manifest-schema-check": {
    by: "a yaml block declaring apiVersion and kind, checked against the pack's recorded Kubernetes",
    satisfied: (blocks) => blocks.some((block) => block.language === "yaml" && lintYaml(block.body).kind === "manifest"),
  },
  // #166 names this type and nothing here implements it: the Java pack compiles and runs every
  // question's programme, but it is not a manifest pack and carries no descriptor, and no runner
  // exists for these. So no profile in content/pack-manifest.mjs admits it and the schema refuses
  // the claim first. The entry stays as the backstop for the day a profile is widened before a
  // runner exists, which is the order these things usually happen in.
  "runnable-isolated-test": { by: null, satisfied: () => false },
};

/** The check behind one evidence type, or no check at all for a type this project cannot perform. */
const corroborationFor = (type) => CORROBORATION[type] ?? { by: null, satisfied: () => false };

/** The evidence a pack carries, question by question, with no judgement applied yet. */
export function inspectEvidence(pack) {
  const { manifest, questions } = readManifestPack(pack);
  const entries = questions.map((question) => {
    const blocks = fencedBlocks(question);
    const type = question.evidence.type;
    const corroboration = corroborationFor(type);
    return {
      name: question.name,
      type,
      corroborated: corroboration.by !== null && corroboration.satisfied(blocks, question),
      corroboratedBy: corroboration.by,
      // Kept for the message: a Dockerfile a question does embed is the usual reason a claim of
      // `yaml-static-check` is a typo rather than an invention.
      languages: [...new Set(blocks.map((block) => block.language))].sort(),
    };
  });
  const byType = {};
  for (const entry of entries) {
    byType[entry.type] = (byType[entry.type] ?? 0) + 1;
  }
  return {
    manifest,
    profile: manifest.evidenceProfile,
    total: entries.length,
    entries,
    byType,
    // #166's "explicitly identified": the questions whose only check is a person reading them.
    withoutExecutableEvidence: entries.filter((entry) => entry.type === "reference-backed").map((entry) => entry.name),
  };
}

/**
 * Fails when a question claims a check nothing performs, or when a pack claims a profile its
 * questions never use. Both directions again: the first is a false statement about a question, the
 * second is a false statement about the pack.
 */
export function assertEvidence(pack) {
  const live = inspectEvidence(pack);
  const problems = [];

  for (const entry of live.entries) {
    if (entry.corroborated) continue;
    const embeds = entry.languages.length > 0 ? `it embeds ${entry.languages.join(", ")}` : "it embeds no code block";
    problems.push(
      entry.corroboratedBy === null
        ? `${entry.name} claims ${entry.type}, which nothing in this repository runs for a manifest pack`
        : `${entry.name} claims ${entry.type}, corroborated by ${entry.corroboratedBy} — ${embeds}`,
    );
  }

  const mechanical = (EVIDENCE_PROFILES[live.profile] ?? []).filter((type) => type !== "reference-backed");
  if (mechanical.length > 0 && !live.entries.some((entry) => mechanical.includes(entry.type))) {
    problems.push(
      `the pack declares the ${live.profile} profile and no question in it claims any of ${mechanical.join(", ")};`
      + " a profile nothing uses overstates the pack",
    );
  }

  if (problems.length > 0) {
    throw new Error(`${pack} evidence:\n- ${problems.join("\n- ")}`);
  }
  return live;
}

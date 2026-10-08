// Convert validated non-Java question packs into the existing editorial API payload format.
// Objective mapping and evidence are kept in source files; the current API does not persist
// them. This adapter must not pretend they have been stored or independently verified.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readManifestPack } from "./manifest-pack.mjs";

export function toEditorialRequest(question) {
  return {
    type: question.type,
    topicId: question.topicId,
    javaRelease: null,
    difficulty: question.difficulty,
    difficultyRationale: question.difficultyRationale,
    prompt: question.prompt,
    explanation: question.explanation,
    options: question.options.map((value) => ({
      key: value.key, text: value.text, correct: value.correct, explanation: value.explanation,
    })),
    references: question.references.map((value) => ({
      title: value.title, url: value.url,
    })),
  };
}

/**
 * A local staging directory consumed by ContentImporter.java --pack.
 * No POSTs happen in this function: it only checks the manifest and exports safe payloads.
 * Use a fresh/empty destination. The caller owns deletion of this staging directory.
 */
export function stageEditorialPack(sourceDir, destinationDir) {
  const { manifest, questions } = readManifestPack(sourceDir);
  if (manifest.trackKind === "CERTIFICATION") {
    throw new Error("Certification packs need verified objective-to-API persistence before import");
  }
  mkdirSync(destinationDir, { recursive: false });
  for (const question of questions) {
    const target = join(destinationDir, question.name);
    mkdirSync(target);
    writeFileSync(join(target, "question.json"), JSON.stringify(toEditorialRequest(question), null, 2) + "\n");
  }
  return { count: questions.length, trackSlug: manifest.trackSlug, destinationDir };
}

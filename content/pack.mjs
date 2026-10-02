// Reading a content pack, the catalog it binds to, and the review record that says which of its
// questions a person has checked. Shared by the review packet generator and anything else that has
// to know what was reviewed.
import { readdirSync, readFileSync as readRaw, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

/** Read as LF whatever the checkout used, so every machine and CI see the same bytes. */
export const readText = (path) => readRaw(path, "utf8").replace(/\r\n/g, "\n");

/** The ten seeded topics, with the exam objective each is mapped to. */
export function readTopics(
  seedFile = "src/main/resources/db/migration/V4__seed_java_certification_catalog.sql",
) {
  const seed = readText(seedFile);
  const topics = new Map();
  for (const match of seed.matchAll(/\('(a3000000-[0-9a-f-]+)', 'a1000000-[0-9a-f-]+', '[^']+', '([^']+)'\)/g)) {
    topics.set(match[1], { name: match[2] });
  }
  for (const match of seed.matchAll(/\('a2000000-[0-9a-f-]+', '(a3000000-[0-9a-f-]+)', '([^']+)', (\d+)\)/g)) {
    const topic = topics.get(match[1]);
    if (topic) {
      topic.objective = match[2];
      topic.position = Number(match[3]);
    }
  }
  return topics;
}

/**
 * Every question of a pack, in catalog order, with the snippet already placed into the prompt and
 * the verified output attached — that is, the form a reviewer and a learner actually read.
 */
export function readPack(pack, topics = readTopics()) {
  const questions = readdirSync(pack, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      const dir = join(pack, name);
      let raw = readText(join(dir, "question.json"));
      const main = join(dir, "Main.java");
      const code = existsSync(main) ? readText(main).trimEnd() : null;
      const expectedFile = join(dir, "expected.txt");
      const expected = existsSync(expectedFile) ? readText(expectedFile).trimEnd() : null;
      if (raw.includes("{{snippet}}")) {
        raw = raw.replace("{{snippet}}", () => JSON.stringify(code).slice(1, -1));
      }
      return { name, code, expected, ...JSON.parse(raw) };
    });

  questions.sort(
    (a, b) => (topics.get(a.topicId)?.position ?? 99) - (topics.get(b.topicId)?.position ?? 99) || a.name.localeCompare(b.name),
  );
  return questions;
}

/**
 * A digest of everything a reviewer judges: the prompt with its code inlined, the options, the
 * answer key, every explanation, the references, the difficulty rationale and the output the build
 * verified. Formatting of the JSON file is deliberately not part of it, so reindenting a question
 * does not invalidate its review, while changing a single word does.
 */
export function reviewDigest(question) {
  const reviewed = [
    question.type,
    question.topicId,
    question.javaRelease,
    question.difficulty,
    question.difficultyRationale,
    question.prompt,
    question.explanation,
    question.options.map((option) => [option.key, option.text, option.correct === true, option.explanation]),
    question.references.map((reference) => [reference.title, reference.url]),
    question.expected,
  ];
  return `sha256:${createHash("sha256").update(JSON.stringify(reviewed)).digest("hex")}`;
}

/** The recorded human review of a pack, or null when nobody has reviewed it. */
export function readReviewRecord(pack) {
  const file = join(pack, "review.json");
  return existsSync(file) ? JSON.parse(readText(file)) : null;
}

/**
 * What the record says about one question, as it stands now: `reviewed` when the recorded digest
 * still matches the question, `changed` when the question has been edited since, and `unreviewed`
 * when the record does not mention it. A review covers the text that was read, not the name of the
 * file that held it.
 */
export function reviewStatusOf(record, question) {
  const entry = record?.questions?.[question.name];
  const current = reviewDigest(question);
  if (!entry) {
    return { state: "unreviewed", currentDigest: current };
  }
  return {
    state: entry.digest === current ? "reviewed" : "changed",
    verdict: entry.verdict,
    reviewer: record.reviewer,
    reviewedOn: record.reviewedOn,
    recordedDigest: entry.digest,
    currentDigest: current,
  };
}

/** Names in the record that no longer exist in the pack: a record that has gone stale. */
export function orphansIn(record, questions) {
  const present = new Set(questions.map((question) => question.name));
  return Object.keys(record?.questions ?? {})
    .filter((name) => !present.has(name))
    .sort();
}

// Reading a content pack, the catalog it binds to, and the review record that says which of its
// questions a person has checked. Shared by the review packet generator and anything else that has
// to know what was reviewed.
import { readdirSync, readFileSync as readRaw, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

/** Every Java source in a question, at any depth, so a module graph is included. */
function javaFilesUnder(dir) {
  return readdirSync(dir, { recursive: true })
    .map(String)
    .filter((entry) => entry.endsWith(".java"))
    .sort()
    .map((entry) => ({ path: entry.split("\\").join("/"), body: readText(join(dir, entry)).trimEnd() }));
}

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
      // `program` is every source the build compiles, which for a modular question is the whole
      // graph and not just the file the learner sees.
      return { name, code, expected, program: javaFilesUnder(dir), ...JSON.parse(raw) };
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
  ];
  return sha256(JSON.stringify(reviewed));
}

/**
 * The output the build verified, digested, or null for a question that carries no program. It is
 * kept apart from {@link reviewDigest} on purpose, because the two kinds of change are not the
 * same: an output that *changes* means the question now does something else and the review no
 * longer covers it, while an output that *appears* where there was none only adds evidence for a
 * claim the reviewer already read. Folding it into the one digest would mark a question unreviewed
 * for being verified, which is the opposite of the incentive ADR 0011 wants.
 */
export function verifiedDigest(question) {
  return question.expected === null || question.expected === undefined ? null : sha256(question.expected);
}

function sha256(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

/** The recorded human review of a pack, or null when nobody has reviewed it. */
export function readReviewRecord(pack) {
  const file = join(pack, "review.json");
  return existsSync(file) ? JSON.parse(readText(file)) : null;
}

/**
 * What the record says about one question as it stands now: `reviewed` when the review still
 * covers it, `changed` when it has been edited since, and `unreviewed` when the record does not
 * mention it. A review covers the text that was read, not the name of the file that held it.
 *
 * <p>Verification is weighed separately. Gaining a verified output keeps the review, because
 * nothing the reviewer read changed and the claim is now backed by a program; losing one, or having
 * it print something else, does not, because the question no longer does what was reviewed.
 */
export function reviewStatusOf(record, question) {
  const entry = record?.questions?.[question.name];
  const current = reviewDigest(question);
  const verified = verifiedDigest(question);
  if (!entry) {
    return { state: "unreviewed", currentDigest: current, currentVerified: verified };
  }
  const recorded = entry.verified ?? null;
  const textHolds = entry.digest === current;
  // null -> a digest is evidence appearing. Anything else differing is the question changing.
  const verificationHolds = recorded === verified || (recorded === null && verified !== null);
  return {
    state: textHolds && verificationHolds ? "reviewed" : "changed",
    verificationAdded: textHolds && recorded === null && verified !== null,
    whatChanged: textHolds ? (verificationHolds ? null : "the verified output") : "the text",
    verdict: entry.verdict,
    reviewer: record.reviewer,
    reviewedOn: record.reviewedOn,
    recordedDigest: entry.digest,
    currentDigest: current,
    recordedVerified: recorded,
    currentVerified: verified,
  };
}

/** Names in the record that no longer exist in the pack: a record that has gone stale. */
export function orphansIn(record, questions) {
  const present = new Set(questions.map((question) => question.name));
  return Object.keys(record?.questions ?? {})
    .filter((name) => !present.has(name))
    .sort();
}

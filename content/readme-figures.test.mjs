import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readPack, readReviewRecord, reviewStatusOf } from "./pack.mjs";

const PACK = "content/java-se-21";
const readme = () => readFileSync("content/README.md", "utf8");

/**
 * content/README.md states how much of the Java pack a person has reviewed and how much of it the
 * build proves. Those are facts about review.json and the pack, kept in prose by hand, and they had
 * drifted: the file said thirty-three reviewed and sixty-nine runnable while the record held 46 and
 * every one of the 150 carried a programme. Nobody noticed, because nothing read it.
 *
 * So the sentences carrying the numbers are read here and compared with the record. If one of them
 * is reworded the match fails and says so, which is the point: the figure and the sentence move
 * together or the build stops.
 */
test("the README's review figures are the ones in the record", () => {
  const questions = readPack(PACK);
  const record = readReviewRecord(PACK);
  const reviewed = questions.filter((question) => reviewStatusOf(record, question).state === "reviewed");

  const stated = readme().match(/(\d+) of them carry recorded human reviews; (\d+) remain deliberately unreviewed/);
  assert.ok(stated, "the sentence stating the review figures was reworded; move this pattern with it");
  assert.equal(Number(stated[1]), reviewed.length);
  assert.equal(Number(stated[2]), questions.length - reviewed.length);
});

test("the README's claim that every question carries a programme is the pack's", () => {
  const questions = readPack(PACK);
  const withoutProgram = questions.filter((question) => !question.code && !question.expected);

  const stated = readme().match(/Every one of the (\d+), reviewed or not, now carries a programme/);
  assert.ok(stated, "the sentence stating the verified figure was reworded; move this pattern with it");
  assert.equal(Number(stated[1]), questions.length);
  // The claim is about all of them, so one question without a programme makes the sentence false.
  assert.deepEqual(withoutProgram.map((question) => question.name), []);
});

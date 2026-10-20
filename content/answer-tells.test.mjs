import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertAnswerTells, correctKeyDistribution, inspectAnswerTells, longestOptionIsCorrect,
  neverCorrectKeys, readAnswerTellsLedger,
} from "./answer-tells.mjs";
import { readPack } from "./pack.mjs";
import { readManifestPack } from "./manifest-pack.mjs";

const JAVA = "content/java-se-21";
const INFRA = "content/infrastructure-devops-foundations";

const four = (correct) => ["A", "B", "C", "D"].map((key) => ({
  key, text: `Choice ${key}`, correct: correct.includes(key), explanation: `Why ${key}`,
}));
const question = (correct, lengths = {}) => ({
  options: four(correct).map((option) => ({
    ...option, text: option.text.padEnd(lengths[option.key] ?? 10, "."),
  })),
});

test("the longest option being the correct one is counted, and a tie is not", () => {
  assert.deepEqual(
    longestOptionIsCorrect([question(["A"], { A: 40 })]),
    { measured: 1, leaking: 1 },
  );
  // Two options of the same longest length point at neither, so neither is a giveaway.
  assert.deepEqual(
    longestOptionIsCorrect([question(["A"], { A: 40, B: 40 })]),
    { measured: 1, leaking: 0 },
  );
  // With two right answers "the longest" is not a single guess, so it is not measured at all.
  assert.deepEqual(
    longestOptionIsCorrect([question(["A", "B"], { A: 40 })]),
    { measured: 0, leaking: 0 },
  );
});

test("keys are only compared between questions offering the same number of options", () => {
  const five = { options: ["A", "B", "C", "D", "E"].map((key) => ({ key, text: key, correct: key === "E", explanation: key })) };
  const distribution = correctKeyDistribution([question(["A"]), five]);
  assert.equal(distribution[4].keys.E, undefined);
  assert.equal(distribution[5].keys.E, 1);
  // E is not "never correct" among the four-option questions: it is not offered there.
  assert.deepEqual(neverCorrectKeys([question(["A"]), five]), [
    { options: 4, key: "B", questions: 1 },
    { options: 4, key: "C", questions: 1 },
    { options: 4, key: "D", questions: 1 },
    { options: 5, key: "A", questions: 1 },
    { options: 5, key: "B", questions: 1 },
    { options: 5, key: "C", questions: 1 },
    { options: 5, key: "D", questions: 1 },
  ]);
});

test("the Java pack never puts an answer on D, and the ledger says so", () => {
  const questions = readPack(JAVA);
  const live = assertAnswerTells(questions, readAnswerTellsLedger(JAVA), JAVA);
  assert.equal(live.total, 150);
  // 147 of the 150 offer four options, and not one of them has a correct D. A learner who notices
  // eliminates an option for free in every exam built from this pack.
  assert.deepEqual(live.neverCorrect, [{ options: 4, key: "D", questions: 147 }]);
  assert.equal(live.correctKeys[4].keys.D, 0);
  // Its option lengths say nothing: at or below the one-in-four a guess would get.
  assert.ok(live.longestIsCorrect.leaking * 4 <= live.longestIsCorrect.measured);
});

test("the infrastructure pack spreads its keys and gives itself away by length", () => {
  const { questions } = readManifestPack(INFRA);
  const live = assertAnswerTells(questions, readAnswerTellsLedger(INFRA), INFRA);
  assert.deepEqual(live.neverCorrect, []);
  assert.equal(live.longestIsCorrect.leaking, 54);
  // Pick the longest option every time and score 77% on a pack of seventy, knowing nothing.
  assert.ok(live.longestIsCorrect.leaking * 4 > live.longestIsCorrect.measured * 2);
});

test("a leak the ledger does not record fails, and so does one it records and the pack has closed", () => {
  const ledger = { total: 2, longestIsCorrect: 0, neverCorrect: [] };
  const leaking = [question(["A"], { A: 40 }), question(["B"], { B: 40 })];
  assert.throws(() => assertAnswerTells(leaking, ledger, "test"), /the correct answer is the longest option in 2 of 2/);
  assert.throws(
    () => assertAnswerTells([question(["A"]), question(["B"])], { ...ledger, longestIsCorrect: 2 }, "test"),
    /down from the 2 recorded/,
  );
  assert.throws(
    () => assertAnswerTells([question(["A"]), question(["B"])], { ...ledger, neverCorrect: [{ options: 4, key: "A", questions: 2 }] }, "test"),
    /option A now carries an answer/,
  );
  assert.throws(
    () => assertAnswerTells([question(["A"])], ledger, "test"),
    /has 1 questions and the ledger records 2/,
  );
});

test("every ledger says when it was recorded and what it is for", () => {
  for (const pack of [JAVA, INFRA]) {
    const ledger = JSON.parse(readFileSync(join(pack, "answer-tells.json"), "utf8"));
    assert.match(ledger.recordedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(ledger.note.length > 0);
  }
});

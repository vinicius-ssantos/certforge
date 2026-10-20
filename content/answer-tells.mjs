// Whether a pack's answer key can be guessed without reading the question.
//
// A pack can be entirely correct and still be a bad examination. If the right answer is almost
// always the longest option, or never the last one, then a learner who notices scores far above
// chance on surface features alone — and the score, the topic breakdown and the weakness report
// built on it all overstate what they know. That is #166's "ambiguidade mecânica detectável": not a
// wrong answer, a detectable one.
//
// Both packs in this repository leak, in opposite ways, and neither author would have caught their
// own from reading their own questions:
//
//   - `java-se-21`: the correct answer never includes D in any of its 147 four-option questions,
//     and a single answer is A or B in 104 of 118. Its option lengths are at chance.
//   - `infrastructure-devops-foundations`: its keys are spread evenly across A–D, and the longest
//     option is the correct one in 54 of 70, against a chance of roughly one in four.
//
// So this measures both tells over whatever questions it is given — the Java pack is read by
// content/pack.mjs and the manifest packs by content/manifest-pack.mjs, and this takes neither.
// What it cannot do is fix them: rebalancing a key means editing questions, and the reviewed ones
// carry a human verdict bound to the text as it stands. It records what each pack leaks so that it
// cannot quietly get worse, and the presentation order a learner is served is where the Java pack's
// tell stops reaching them.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** How often the correct answer is also the longest option, which is the classic giveaway. */
export function longestOptionIsCorrect(questions) {
  let leaking = 0;
  let measured = 0;
  for (const question of questions) {
    const correct = question.options.filter((option) => option.correct);
    // With more than one right answer "the longest" is not a single guess, so it is not measured.
    if (correct.length !== 1) continue;
    measured += 1;
    const longest = Math.max(...question.options.map((option) => option.text.length));
    // A tie is not a tell: two options of the same length point at neither.
    const longestOptions = question.options.filter((option) => option.text.length === longest);
    if (longestOptions.length === 1 && longestOptions[0].correct) leaking += 1;
  }
  return { measured, leaking };
}

/**
 * How often each option key carries a correct answer, per option count. Keys are only comparable
 * between questions offering the same number of options: E cannot be the answer to a question that
 * stops at D, and counting them together would read a four-option pack as avoiding E.
 */
export function correctKeyDistribution(questions) {
  const byCount = new Map();
  for (const question of questions) {
    const count = question.options.length;
    const distribution = byCount.get(count) ?? { questions: 0, keys: {} };
    distribution.questions += 1;
    for (const option of question.options) {
      distribution.keys[option.key] = (distribution.keys[option.key] ?? 0) + Number(option.correct);
    }
    byCount.set(count, distribution);
  }
  return Object.fromEntries([...byCount.entries()].sort(([left], [right]) => left - right));
}

/** The keys that carry no correct answer at all, which is the strongest form of the tell. */
export function neverCorrectKeys(questions) {
  const never = [];
  for (const [count, distribution] of Object.entries(correctKeyDistribution(questions))) {
    for (const [key, correct] of Object.entries(distribution.keys)) {
      if (correct === 0) never.push({ options: Number(count), key, questions: distribution.questions });
    }
  }
  return never;
}

export function inspectAnswerTells(questions) {
  return {
    total: questions.length,
    longestIsCorrect: longestOptionIsCorrect(questions),
    correctKeys: correctKeyDistribution(questions),
    neverCorrect: neverCorrectKeys(questions),
  };
}

/**
 * Fails when a pack leaks more than the ledger recorded for it, in either direction — a new leak is
 * a regression, and a leak that has been closed and left on the ledger is a lie about the pack that
 * would let the next one in behind it. Same shape as content/pack-quality.mjs, for the same reason:
 * a gate that cannot be switched on over the content that exists never gets switched on.
 */
export function assertAnswerTells(questions, ledger, where) {
  const live = inspectAnswerTells(questions);
  const problems = [];

  // A pack with no ledger of its own records no count either, and is simply held to leaking
  // nothing. A count that is recorded has to match: a ledger left behind when questions were added
  // is measuring a pack that no longer exists.
  if (ledger.total !== undefined && live.total !== ledger.total) {
    problems.push(`the pack has ${live.total} questions and the ledger records ${ledger.total}`);
  }
  const allowed = ledger.longestIsCorrect ?? 0;
  if (live.longestIsCorrect.leaking > allowed) {
    problems.push(
      `the correct answer is the longest option in ${live.longestIsCorrect.leaking} of`
      + ` ${live.longestIsCorrect.measured} single-answer questions, past the ${allowed} recorded`,
    );
  }
  if (live.longestIsCorrect.leaking < allowed) {
    problems.push(
      `the longest option is now correct in ${live.longestIsCorrect.leaking} of`
      + ` ${live.longestIsCorrect.measured}, down from the ${allowed} recorded — update the ledger`,
    );
  }

  const recorded = new Set((ledger.neverCorrect ?? []).map((entry) => `${entry.options}:${entry.key}`));
  for (const entry of live.neverCorrect) {
    const name = `${entry.options}:${entry.key}`;
    if (!recorded.has(name)) {
      problems.push(`option ${entry.key} is never correct in any of the ${entry.questions} questions offering ${entry.options} options, and the ledger does not say so`);
    }
    recorded.delete(name);
  }
  for (const name of recorded) {
    const [options, key] = name.split(":");
    problems.push(`option ${key} now carries an answer among the ${options}-option questions — strike it off the ledger`);
  }

  if (problems.length > 0) {
    throw new Error(`${where} answer tells:\n- ${problems.join("\n- ")}`);
  }
  return live;
}

/** The ledger recorded beside a pack's questions. A pack without one has to leak nothing. */
export function readAnswerTellsLedger(pack) {
  const file = join(pack, "answer-tells.json");
  return existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8").replace(/\r\n/g, "\n"))
    : { longestIsCorrect: 0, neverCorrect: [] };
}

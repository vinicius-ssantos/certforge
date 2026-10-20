// Pack-level quality checks: the things a single question cannot be judged on alone.
//
// manifest-pack.mjs validates one question against the schema — it has four or five options, every
// option carries an explanation, the references are official. All of that can be true while the
// pack is still not what #167 and #168 ask for, because those criteria are comparative: an
// explanation has to explain *this* option, which only shows up when you put the options of a
// question side by side, and a reference has to name the page it points at, which only shows up
// when the same title appears forty times.
//
// Nothing here judges whether a question is technically correct. That is a named human's, by
// ADR 0005, and no count in this file changes it. These are mechanical properties of the text: a
// sentence repeated under three different options is not three explanations, whatever it says.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readManifestPack } from "./manifest-pack.mjs";

/**
 * A title that names no page. "Documentação oficial" is true of every page on docs.docker.com, so
 * it tells a reviewer who wants to check the claim nothing about where to look; the URL carries
 * that, and a screen reader announcing forty identical links carries it least of all. The shape is
 * matched rather than listed so a new flavour of the same placeholder is caught too.
 */
const PLACEHOLDER_TITLE = /^(documenta[çc][ãa]o oficial|official docs?|official documentation)\b/i;

/** A short, stable handle for a repeated sentence, so the ledger can name one without quoting it. */
export function explanationId(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 12);
}

/**
 * Two options a learner cannot tell apart.
 *
 * #166 asks CI to fail on "ambiguidade mecânica detectável". The rest of this file catches
 * explanations that are templates; this catches the question that cannot be answered as asked: two
 * options saying the same thing, one of them marked correct. A learner who reads both carefully
 * still has to guess, and no amount of knowing the subject helps.
 *
 * "The same thing" means *renders the same*: the comparison forgives only what a renderer forgives
 * — Unicode composition, and runs of whitespace, which HTML collapses anyway. Nothing else. Two
 * options that differ in case are different on the screen, and in this content the case is often the
 * whole question: `t01-boolean-parseboolean` offers `"TRUE"` and `"TrUe"` because
 * `Boolean.parseBoolean` ignores case, and three Topic 10 questions turn on `PT-br` against
 * `pt-BR`. A checker that lowercased would have refused all four as ambiguous, which is how a
 * checker that implies more than it does ends up worse than none.
 *
 * Nothing in either pack trips it, over all 220 questions. It is here so the next pack cannot
 * introduce it quietly, which is why it fails outright instead of recording a debt.
 */
export function indistinguishableOptions(question) {
  const seen = new Map();
  const clashes = [];
  for (const option of question.options) {
    const normalised = option.text.normalize("NFC").replace(/\s+/g, " ").trim();
    const earlier = seen.get(normalised);
    if (earlier === undefined) {
      seen.set(normalised, option.key);
    } else {
      clashes.push({ keys: [earlier, option.key], text: option.text });
    }
  }
  return clashes;
}

/**
 * The options of one question whose explanation is word-for-word another option's. Returned as the
 * keys that share each text, because that is what an author has to open the file and fix.
 */
export function repeatedExplanationsWithin(question) {
  const byText = new Map();
  for (const option of question.options) {
    const keys = byText.get(option.explanation) ?? [];
    keys.push(option.key);
    byText.set(option.explanation, keys);
  }
  return [...byText.entries()]
    .filter(([, keys]) => keys.length > 1)
    .map(([text, keys]) => ({ id: explanationId(text), keys: keys.sort() }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Explanations used by more than one question. A sentence that fits twenty-four different wrong
 * answers is a sentence about none of them: it is the template that was filled in, surviving into
 * the pack. Counted across the whole pack because that is the only place the pattern is visible.
 */
export function explanationsReusedAcrossQuestions(questions) {
  const uses = new Map();
  for (const question of questions) {
    for (const option of question.options) {
      const entry = uses.get(option.explanation) ?? { id: explanationId(option.explanation), questions: new Set() };
      entry.questions.add(question.name);
      uses.set(option.explanation, entry);
    }
  }
  return [...uses.values()]
    .filter((entry) => entry.questions.size > 1)
    .map((entry) => ({ id: entry.id, questions: entry.questions.size }))
    .sort((a, b) => b.questions - a.questions || a.id.localeCompare(b.id));
}

/** Reference titles that describe the whole site instead of the page, by question. */
export function placeholderReferenceTitles(questions) {
  return questions
    .map((question) => ({
      name: question.name,
      titles: question.references.filter((reference) => PLACEHOLDER_TITLE.test(reference.title.trim())).map((reference) => reference.title),
    }))
    .filter((entry) => entry.titles.length > 0);
}

/**
 * Which difficulties the pack actually offers. Both #167 and #168 ask for a basic-to-advanced
 * matrix, and a pack that is 83% MEDIUM has the column filled in rather than the coverage.
 */
export function difficultySpread(questions) {
  const spread = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const question of questions) {
    spread[question.difficulty] += 1;
  }
  return spread;
}

/** Every mechanical quality property of a pack, in one pass. */
export function inspectPackQuality(pack) {
  const { questions } = readManifestPack(pack);
  const templated = questions
    .map((question) => ({ name: question.name, repeated: repeatedExplanationsWithin(question) }))
    .filter((entry) => entry.repeated.length > 0);
  return {
    total: questions.length,
    templatedOptionExplanations: templated.map((entry) => entry.name),
    repeatedWithin: templated,
    reusedAcrossQuestions: explanationsReusedAcrossQuestions(questions),
    placeholderReferenceTitles: placeholderReferenceTitles(questions),
    indistinguishable: questions
      .map((question) => ({ name: question.name, clashes: indistinguishableOptions(question) }))
      .filter((entry) => entry.clashes.length > 0),
    difficulty: difficultySpread(questions),
  };
}

/**
 * The ledger of what a pack is known to owe, or null for a pack that owes nothing. It exists so
 * this gate can be switched on over a pack that does not pass it yet: the debt is recorded by name,
 * CI refuses anything the ledger does not already list, and fixing a question means deleting its
 * line. A pack with no ledger has to be clean.
 */
export function readQualityDebt(pack) {
  const file = join(pack, "quality-debt.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8").replace(/\r\n/g, "\n")) : null;
}

/**
 * Fails when a pack's mechanical quality differs from what is recorded for it — in either
 * direction. A new violation is a regression; a violation that has been fixed and not struck off
 * the ledger is a lie about the pack's state that would let the next one slip in behind it. So both
 * fail, and the message says which.
 */
export function assertPackQuality(pack) {
  const live = inspectPackQuality(pack);
  const debt = readQualityDebt(pack) ?? { templatedOptionExplanations: [], reusedExplanations: [], placeholderReferenceTitles: [] };
  const problems = [];

  const owed = new Set(debt.templatedOptionExplanations ?? []);
  const newlyTemplated = live.templatedOptionExplanations.filter((name) => !owed.has(name));
  const fixedTemplated = [...owed].filter((name) => !live.templatedOptionExplanations.includes(name));
  if (newlyTemplated.length > 0) {
    problems.push(`these questions repeat one explanation under more than one option and are not in quality-debt.json: ${newlyTemplated.join(", ")}`);
  }
  if (fixedTemplated.length > 0) {
    problems.push(`these questions no longer repeat an explanation — strike them off quality-debt.json: ${fixedTemplated.join(", ")}`);
  }

  const recordedReuse = new Map((debt.reusedExplanations ?? []).map((entry) => [entry.id, entry.questions]));
  for (const entry of live.reusedAcrossQuestions) {
    const recorded = recordedReuse.get(entry.id);
    if (recorded === undefined) {
      problems.push(`explanation ${entry.id} is used by ${entry.questions} questions and is not in quality-debt.json`);
    } else if (entry.questions > recorded) {
      problems.push(`explanation ${entry.id} has spread from ${recorded} questions to ${entry.questions}`);
    } else if (entry.questions < recorded) {
      problems.push(`explanation ${entry.id} is down to ${entry.questions} questions from ${recorded} — update quality-debt.json`);
    }
    recordedReuse.delete(entry.id);
  }
  for (const [id, count] of recordedReuse) {
    problems.push(`explanation ${id} is no longer shared by ${count} questions — strike it off quality-debt.json`);
  }

  // No ledger entry for this one: nothing in either pack trips it, so there is no debt to record
  // and a new question that asks a learner to choose between two identical options is simply
  // refused. A question cannot be answered as asked when two of its options say the same thing.
  for (const entry of live.indistinguishable) {
    for (const clash of entry.clashes) {
      problems.push(`${entry.name} offers options ${clash.keys.join(" and ")} with text a learner cannot tell apart: ${JSON.stringify(clash.text.slice(0, 60))}`);
    }
  }

  const owedTitles = new Set(debt.placeholderReferenceTitles ?? []);
  const newlyPlaceholder = live.placeholderReferenceTitles.filter((entry) => !owedTitles.has(entry.name));
  const fixedTitles = [...owedTitles].filter((name) => !live.placeholderReferenceTitles.some((entry) => entry.name === name));
  if (newlyPlaceholder.length > 0) {
    problems.push(`these questions cite a page by a title that names the whole site: ${newlyPlaceholder.map((entry) => entry.name).join(", ")}`);
  }
  if (fixedTitles.length > 0) {
    problems.push(`these questions now name the page they cite — strike them off quality-debt.json: ${fixedTitles.join(", ")}`);
  }

  if (problems.length > 0) {
    throw new Error(`${pack} quality gate:\n- ${problems.join("\n- ")}`);
  }
  return live;
}

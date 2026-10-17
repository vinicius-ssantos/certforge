import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertPackQuality, difficultySpread, inspectPackQuality, repeatedExplanationsWithin } from "./pack-quality.mjs";

const pack = "content/infrastructure-devops-foundations";

/** A copy of the pack to damage, since every check here is about a pack as a whole. */
function withCopy(work) {
  const dir = mkdtempSync(join(tmpdir(), "certforge-pack-quality-"));
  const target = join(dir, "pack");
  try {
    cpSync(pack, target, { recursive: true });
    work(target);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function edit(target, question, change) {
  const path = join(target, question, "question.json");
  const data = JSON.parse(readFileSync(path, "utf8"));
  change(data);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

test("the pack matches the debt recorded for it, and nothing more", () => {
  const live = assertPackQuality(pack);
  assert.equal(live.total, 70);
  const debt = JSON.parse(readFileSync(join(pack, "quality-debt.json"), "utf8"));
  assert.equal(debt.templatedOptionExplanations.length, 51);
  assert.equal(debt.placeholderReferenceTitles.length, 69);
});

test("a question that starts repeating an explanation fails even though the schema accepts it", () => {
  withCopy((target) => {
    // Not on the ledger, and its options each explain themselves today.
    edit(target, "t05-dockerignore", (data) => {
      const wrong = data.options.filter((option) => !option.correct);
      wrong[1].explanation = wrong[0].explanation;
    });
    assert.throws(() => assertPackQuality(target), /t05-dockerignore/);
  });
});

test("a question whose explanations were fixed fails until the ledger says so", () => {
  withCopy((target) => {
    edit(target, "t01-docker-build-cache", (data) => {
      data.options
        .filter((option) => !option.correct)
        .forEach((option, index) => {
          option.explanation = `Reason ${index} why this particular option is wrong, written out.`;
        });
    });
    assert.throws(() => assertPackQuality(target), /strike them off/);
  });
});

test("a templated explanation spreading to one more question fails", () => {
  withCopy((target) => {
    const borrowed = JSON.parse(readFileSync(join(target, "t01-docker-build-cache", "question.json"), "utf8"))
      .options.find((option) => !option.correct).explanation;
    // A question that shares no sentence with any other takes one that six questions already
    // share. Its own options stay distinct from each other, so the per-question list does not
    // move and only the count across the pack does — which is the reuse this catches.
    edit(target, "t04-docker-volumes", (data) => {
      data.options.find((option) => !option.correct).explanation = borrowed;
    });
    assert.throws(() => assertPackQuality(target), /has spread from 6 questions to 7/);
  });
});

test("a reference whose title names the site rather than the page fails", () => {
  withCopy((target) => {
    edit(target, "t01-image-vs-container", (data) => {
      data.references[0].title = "Documentação oficial";
    });
    assert.throws(() => assertPackQuality(target), /t01-image-vs-container/);
  });
});

test("a pack with no ledger has to be clean", () => {
  withCopy((target) => {
    rmSync(join(target, "quality-debt.json"));
    assert.throws(() => assertPackQuality(target), /quality-debt\.json/);
  });
});

test("repeated explanations are reported by the option keys that share them", () => {
  const repeated = repeatedExplanationsWithin({
    options: [
      { key: "A", correct: false, explanation: "same" },
      { key: "B", correct: false, explanation: "same" },
      { key: "C", correct: true, explanation: "right" },
      { key: "D", correct: false, explanation: "own" },
    ],
  });
  assert.deepEqual(repeated.map((entry) => entry.keys), [["A", "B"]]);
});

test("the difficulty matrix is reported as counts, including the ones that are missing", () => {
  assert.deepEqual(difficultySpread([{ difficulty: "HARD" }, { difficulty: "HARD" }]), { EASY: 0, MEDIUM: 0, HARD: 2 });
  // The real pack offers all three, which is the matrix #167 and #168 ask for — thinly at the ends.
  const live = inspectPackQuality(pack);
  assert.deepEqual(live.difficulty, { EASY: 4, MEDIUM: 58, HARD: 8 });
});

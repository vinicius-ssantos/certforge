import type { Revision } from "../api/types";
import type { Catalog } from "../i18n/en";
import { difficultyLabels, typeLabels } from "./labels";

export interface Piece {
  kind: "same" | "added" | "removed";
  text: string;
}

/**
 * A word-level difference between two texts, keeping the whitespace so the result reads as the
 * original does. Longest common subsequence over words; texts here are a few thousand characters
 * at most, so the straightforward table is plenty.
 */
export function wordDiff(before: string, after: string): Piece[] {
  const a = before.split(/(\s+)/).filter((token) => token !== "");
  const b = after.split(/(\s+)/).filter((token) => token !== "");
  const table: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i]![j] = a[i] === b[j] ? table[i + 1]![j + 1]! + 1 : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
    }
  }
  const pieces: Piece[] = [];
  const push = (kind: Piece["kind"], text: string) => {
    const last = pieces[pieces.length - 1];
    if (last && last.kind === kind) {
      last.text += text;
    } else {
      pieces.push({ kind, text });
    }
  };
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      push("same", a[i]!);
      i += 1;
      j += 1;
    } else if (table[i + 1]![j]! >= table[i]![j + 1]!) {
      push("removed", a[i]!);
      i += 1;
    } else {
      push("added", b[j]!);
      j += 1;
    }
  }
  while (i < a.length) push("removed", a[i++]!);
  while (j < b.length) push("added", b[j++]!);
  return pieces;
}

export interface Change {
  /** What changed, in the editor's words. */
  label: string;
  /** The change as running text with additions and removals marked. */
  pieces: Piece[];
}

function text(label: string, before: string | null | undefined, after: string | null | undefined): Change | null {
  const b = before ?? "";
  const a = after ?? "";
  return b === a ? null : { label, pieces: wordDiff(b, a) };
}

function name(map: Record<string, string>, value: string | null | undefined): string {
  return value ? (map[value] ?? value) : "";
}

/**
 * What an editor changed between two revisions of a question, field by field, so a reviewer can
 * judge a correction without reading both revisions in full. Nothing here is a verdict; it only
 * shows the difference.
 */
export function diffRevisions(
  previous: Revision,
  next: Revision,
  topicName: (id: string) => string | undefined,
  t: Catalog,
): Change[] {
  const d = t.editorial.diff;
  const types = typeLabels(t);
  const difficulties = difficultyLabels(t);
  const changes: (Change | null)[] = [
    text(d.question, previous.prompt, next.prompt),
    text(d.type, name(types, previous.type), name(types, next.type)),
    text(
      d.topic,
      previous.topicId ? (topicName(previous.topicId) ?? d.anotherTopic) : "",
      next.topicId ? (topicName(next.topicId) ?? d.anotherTopic) : "",
    ),
    text(d.difficulty, name(difficulties, previous.difficulty), name(difficulties, next.difficulty)),
    text(d.javaRelease, previous.javaRelease ? String(previous.javaRelease) : "", next.javaRelease ? String(next.javaRelease) : ""),
    text(d.whyThisDifficulty, previous.difficultyRationale, next.difficultyRationale),
  ];

  const keys = [...new Set([...previous.options.map((o) => o.key), ...next.options.map((o) => o.key)])].sort();
  for (const key of keys) {
    const before = previous.options.find((option) => option.key === key);
    const after = next.options.find((option) => option.key === key);
    if (!before) {
      changes.push({ label: d.optionAdded(key), pieces: [{ kind: "added", text: after!.text }] });
      continue;
    }
    if (!after) {
      changes.push({ label: d.optionRemoved(key), pieces: [{ kind: "removed", text: before.text }] });
      continue;
    }
    changes.push(text(d.option(key), before.text, after.text));
    if (before.correct !== after.correct) {
      changes.push({
        label: d.optionCorrectness(key),
        pieces: [
          { kind: "removed", text: before.correct ? d.correct : d.incorrect },
          { kind: "same", text: " " },
          { kind: "added", text: after.correct ? d.correct : d.incorrect },
        ],
      });
    }
    changes.push(text(d.reasonFor(key), before.explanation, after.explanation));
  }

  changes.push(text(d.explanation, previous.explanation, next.explanation));

  const refs = (revision: Revision) => revision.references.map((reference) => `${reference.title} (${reference.url})`);
  const oldRefs = refs(previous);
  const newRefs = refs(next);
  for (const reference of oldRefs.filter((item) => !newRefs.includes(item))) {
    changes.push({ label: d.referenceRemoved, pieces: [{ kind: "removed", text: reference }] });
  }
  for (const reference of newRefs.filter((item) => !oldRefs.includes(item))) {
    changes.push({ label: d.referenceAdded, pieces: [{ kind: "added", text: reference }] });
  }

  return changes.filter((change): change is Change => change !== null);
}

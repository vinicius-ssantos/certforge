import type { Revision } from "../api/types";
import { DIFFICULTY_LABEL, TYPE_LABEL } from "./labels";

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
): Change[] {
  const changes: (Change | null)[] = [
    text("Question", previous.prompt, next.prompt),
    text("Type", name(TYPE_LABEL, previous.type), name(TYPE_LABEL, next.type)),
    text(
      "Topic",
      previous.topicId ? (topicName(previous.topicId) ?? "Another topic") : "",
      next.topicId ? (topicName(next.topicId) ?? "Another topic") : "",
    ),
    text("Difficulty", name(DIFFICULTY_LABEL, previous.difficulty), name(DIFFICULTY_LABEL, next.difficulty)),
    text("Java release", previous.javaRelease ? String(previous.javaRelease) : "", next.javaRelease ? String(next.javaRelease) : ""),
    text("Why this difficulty", previous.difficultyRationale, next.difficultyRationale),
  ];

  const keys = [...new Set([...previous.options.map((o) => o.key), ...next.options.map((o) => o.key)])].sort();
  for (const key of keys) {
    const before = previous.options.find((option) => option.key === key);
    const after = next.options.find((option) => option.key === key);
    if (!before) {
      changes.push({ label: `Option ${key} added`, pieces: [{ kind: "added", text: after!.text }] });
      continue;
    }
    if (!after) {
      changes.push({ label: `Option ${key} removed`, pieces: [{ kind: "removed", text: before.text }] });
      continue;
    }
    changes.push(text(`Option ${key}`, before.text, after.text));
    if (before.correct !== after.correct) {
      changes.push({
        label: `Option ${key} correctness`,
        pieces: [
          { kind: "removed", text: before.correct ? "correct" : "incorrect" },
          { kind: "same", text: " " },
          { kind: "added", text: after.correct ? "correct" : "incorrect" },
        ],
      });
    }
    changes.push(text(`Reason for ${key}`, before.explanation, after.explanation));
  }

  changes.push(text("Explanation", previous.explanation, next.explanation));

  const refs = (revision: Revision) => revision.references.map((reference) => `${reference.title} (${reference.url})`);
  const oldRefs = refs(previous);
  const newRefs = refs(next);
  for (const reference of oldRefs.filter((item) => !newRefs.includes(item))) {
    changes.push({ label: "Reference removed", pieces: [{ kind: "removed", text: reference }] });
  }
  for (const reference of newRefs.filter((item) => !oldRefs.includes(item))) {
    changes.push({ label: "Reference added", pieces: [{ kind: "added", text: reference }] });
  }

  return changes.filter((change): change is Change => change !== null);
}

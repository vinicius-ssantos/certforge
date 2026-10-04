import type { ReactNode } from "react";
import { useText } from "../i18n/useText";

interface Segment {
  kind: "text" | "code";
  value: string;
}

const FENCE = /```[^\n]*\n([\s\S]*?)```/g;

/** Splits authored text into prose and fenced code blocks (```), the only markup questions use. */
export function splitFences(text: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(FENCE)) {
    const start = match.index ?? 0;
    if (start > last) {
      segments.push({ kind: "text", value: text.slice(last, start) });
    }
    segments.push({ kind: "code", value: (match[1] ?? "").replace(/\n$/, "") });
    last = start + match[0].length;
  }
  if (last < text.length) {
    segments.push({ kind: "text", value: text.slice(last) });
  }
  return segments.filter((segment) => segment.value.trim() !== "");
}

/**
 * Question text as the learner reads it: prose in the reading face, code in a monospaced block.
 * Nothing else is interpreted, and the text is never inserted as HTML.
 */
export function Prompt({ text }: { text: string }): ReactNode {
  const t = useText();
  return (
    <div className="prompt">
      {splitFences(text).map((segment, index) =>
        segment.kind === "code" ? (
          // A code block can be wider than the screen. Making it focusable lets keyboard users
          // scroll it, which is why a non-interactive element takes a tab stop here.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <pre key={index} className="code" tabIndex={0} aria-label={t.prompt.codeExample}>
            <code>{segment.value}</code>
          </pre>
        ) : (
          // A blank line starts a new paragraph; a single line break inside one is kept.
          segment.value
            .trim()
            .split(/\n{2,}/)
            .map((paragraph, at) => <p key={`${index}-${at}`}>{paragraph}</p>)
        ),
      )}
    </div>
  );
}

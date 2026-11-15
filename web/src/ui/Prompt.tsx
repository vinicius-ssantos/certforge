import type { ReactNode } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import dockerfile from "react-syntax-highlighter/dist/esm/languages/prism/docker";
import hcl from "react-syntax-highlighter/dist/esm/languages/prism/hcl";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import { useText } from "../i18n/useText";

// Registered under the content tag content authors actually write (`dockerfile`), not Prism's
// own module name (`docker`) for that grammar.
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("dockerfile", dockerfile);
SyntaxHighlighter.registerLanguage("hcl", hcl);

const HIGHLIGHTED_LANGUAGES = new Set(["java", "yaml", "dockerfile", "hcl"]);

interface Segment {
  kind: "text" | "code";
  value: string;
  language: string;
}

const FENCE = /```(\w*)\n([\s\S]*?)```/g;

/** Splits authored text into prose and fenced code blocks (```lang), the only markup questions use. */
export function splitFences(text: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(FENCE)) {
    const start = match.index ?? 0;
    if (start > last) {
      segments.push({ kind: "text", value: text.slice(last, start), language: "" });
    }
    segments.push({
      kind: "code",
      value: (match[2] ?? "").replace(/\n$/, ""),
      language: match[1] ?? "",
    });
    last = start + match[0].length;
  }
  if (last < text.length) {
    segments.push({ kind: "text", value: text.slice(last), language: "" });
  }
  return segments.filter((segment) => segment.value.trim() !== "");
}

/**
 * Question text as the learner reads it: prose in the reading face, code in a monospaced block.
 * Nothing else is interpreted, and the text is never inserted as HTML — the highlighter tokenizes
 * into React elements styled by CSS classes (`useInlineStyles={false}`), never raw markup.
 */
export function Prompt({ text }: { text: string }): ReactNode {
  const t = useText();

  // A code block can be wider than the screen. Making it focusable lets keyboard users scroll it,
  // which is why a non-interactive element takes a tab stop here.
  const CodePre = ({ children }: { children?: ReactNode }) => (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <pre className="code" tabIndex={0} aria-label={t.prompt.codeExample}>
      {children}
    </pre>
  );

  return (
    // lang="en": question text stays English in every locale, and a screen reader needs to be told
    // so, or it reads English words with the phonetics of the interface language (ADR 0012).
    <div className="prompt" lang="en">
      {splitFences(text).map((segment, index) =>
        segment.kind === "code" ? (
          HIGHLIGHTED_LANGUAGES.has(segment.language) ? (
            <SyntaxHighlighter
              key={index}
              language={segment.language}
              useInlineStyles={false}
              PreTag={CodePre}
            >
              {segment.value}
            </SyntaxHighlighter>
          ) : (
            <CodePre key={index}>
              <code>{segment.value}</code>
            </CodePre>
          )
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

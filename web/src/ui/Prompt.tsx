import { useState, type ReactNode } from "react";
import { refractor } from "refractor/core";
import dockerfile from "refractor/docker";
import hcl from "refractor/hcl";
import java from "refractor/java";
import yaml from "refractor/yaml";
import { useLocale, useText } from "../i18n/useText";

// Docker's Prism grammar declares `dockerfile` as an alias; all four grammars are registered
// explicitly, so no other Prism languages are shipped.
refractor.register(java);
refractor.register(yaml);
refractor.register(dockerfile);
refractor.register(hcl);

const HIGHLIGHTED_LANGUAGES = new Set(["java", "yaml", "dockerfile", "hcl"]);

interface Segment {
  kind: "text" | "code";
  value: string;
  language: string;
}

const FENCE = /```(\w*)\n([\s\S]*?)```/g;

/** Splits authored text into prose and fenced code blocks (```lang), the only markup questions use. */
export function splitFences(text: string): Segment[] {
  text = text.replace(/\r\n/g, "\n");
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

// Code can be wider than the view. A tab stop lets the keyboard scroll it.
function CodePre({ children }: { children?: ReactNode }) {
  const t = useText();
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <pre className="code" tabIndex={0} aria-label={t.prompt.codeExample}>
      {children}
    </pre>
  );
}

type Token = ReturnType<typeof refractor.highlight>["children"][number];

function renderToken(token: Token, key: number): ReactNode {
  if (token.type === "text") return token.value;
  if (token.type !== "element") return null;
  const classes = token.properties.className;
  return (
    <span key={key} className={Array.isArray(classes) ? classes.join(" ") : undefined}>
      {token.children.map(renderToken)}
    </span>
  );
}

/** Render Prism's AST as escaped React text and spans, without any HTML injection. */
function HighlightedCode({ value, language }: { value: string; language: string }) {
  return (
    <CodePre>
      <code className={`language-${language}`}>
        {refractor.highlight(value, language).children.map(renderToken)}
      </code>
    </CodePre>
  );
}

/**
 * Question text as the learner reads it: prose in the reading face, code in a monospaced block.
 * Nothing else is interpreted, and the text is never inserted as HTML — the highlighter tokenizes
 * into React elements styled by CSS classes (`useInlineStyles={false}`), never raw markup.
 */
export function Prompt({ text }: { text: string }): ReactNode {
  const t = useText();
  const { locale } = useLocale();
  const [wrapped, setWrapped] = useState(false);
  const segments = splitFences(text);
  return (
    // lang="en": question text stays English in every locale, and a screen reader needs to be told
    // so, or it reads English words with the phonetics of the interface language (ADR 0012).
    <div className={wrapped ? "prompt code-wrap" : "prompt"} lang="en">
      {segments.some((segment) => segment.kind === "code") ? (
        <label className="code-wrap-control" lang={locale}>
          <input type="checkbox" checked={wrapped} onChange={(event) => setWrapped(event.target.checked)} />
          {t.prompt.wrapCode}
        </label>
      ) : null}
      {segments.map((segment, index) =>
        segment.kind === "code" ? (
          HIGHLIGHTED_LANGUAGES.has(segment.language) ? (
            <HighlightedCode key={index} value={segment.value} language={segment.language} />
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


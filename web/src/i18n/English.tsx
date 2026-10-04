import type { ReactNode } from "react";

/**
 * Content that stays in English in every locale: question prompts, option text, explanations and
 * reference titles (ADR 0012 decision 2).
 *
 * Marking it `lang="en"` is not decoration. A screen reader picks its phonetics from `lang`, so on
 * a Portuguese page English words inside an unmarked element are read with Portuguese phonetics —
 * "throws" and "boolean" come out as noise. This was implicitly correct while the whole document
 * was `lang="en"`; the moment the interface has another language, every English island has to say
 * so. ADR 0012 named this as the accessibility regression hiding inside a translation task.
 */
export function English({
  children,
  as: Tag = "span",
  className,
}: {
  children: ReactNode;
  /** The element to render. A block of question text is a `div`; text in a sentence is a `span`. */
  as?: "span" | "div" | "p" | "strong";
  className?: string;
}) {
  return (
    <Tag lang="en" {...(className ? { className } : {})}>
      {children}
    </Tag>
  );
}

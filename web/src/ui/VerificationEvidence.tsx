import { useText } from "../i18n/useText";

/** One source the build compiles for a question. */
export type VerificationSource = { path: string; body: string };

/**
 * The evidence behind an answer: the programme the build compiles and runs for this question, and
 * what it printed.
 *
 * Every question in the pack carries one, and the build checks the answer key against it — but
 * until now nobody studying ever saw it. The claim and the thing that settles it belong on the
 * same screen.
 *
 * It is a recording, not an execution. The output shown here is a fact the build established when
 * the pack was imported; nothing runs when this renders, and the component says so, because a
 * learner looking at code and output could reasonably assume otherwise.
 *
 * Every source the build sees is shown, not only the one the question quoted: seven questions in
 * the Java pack are a module graph, and for those the entry point alone explains the least. Each
 * file is named, so a reader can tell `module-info.java` from the class it exports.
 */
export function VerificationEvidence({
  verification,
}: {
  verification: { files: VerificationSource[]; output: string } | null | undefined;
}) {
  const t = useText();
  if (!verification) {
    return null;
  }
  const { files, output } = verification;
  if (files.length === 0 && !output) {
    return null;
  }

  return (
    <section className="verified" aria-labelledby="verified-heading">
      <h3 id="verified-heading">{t.feedback.verifiedHeading}</h3>
      <p className="hint">{t.feedback.verifiedNote}</p>
      {files.map((file) => (
        <div key={file.path}>
          {/* Named even when there is only one: the name is how a reader tells the entry point
              from a module descriptor, and a single file is still a file with a name. */}
          <p className="verified-path">
            <code>{file.path}</code>
          </p>
          {/* A code block scrolls sideways on a narrow screen, and someone using a keyboard has
              to be able to scroll it, which is why a non-interactive element takes a tab stop
              here. The same reasoning as the question's own code block. */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <pre className="code" lang="en" tabIndex={0} aria-label={file.path}>
            {file.body}
          </pre>
        </div>
      ))}
      {output ? (
        <>
          <p className="verified-path">{t.feedback.verifiedOutput}</p>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <pre className="code" lang="en" tabIndex={0} aria-label={t.feedback.verifiedOutput}>
            {output}
          </pre>
        </>
      ) : null}
    </section>
  );
}

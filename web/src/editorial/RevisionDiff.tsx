import type { Revision } from "../api/types";
import { diffRevisions } from "./diff";

/**
 * What changed since the previous revision. Additions are underlined and removals struck through,
 * and each is also announced in words, so the difference does not depend on colour or on seeing
 * the styling at all.
 */
export function RevisionDiff({
  previous,
  revision,
  topicName,
}: {
  previous: Revision;
  revision: Revision;
  topicName: (id: string) => string | undefined;
}) {
  const changes = diffRevisions(previous, revision, topicName);
  return (
    <section className="diff" aria-labelledby="diff-heading">
      <h2 id="diff-heading">What changed since revision {previous.number}</h2>
      {changes.length === 0 ? (
        <p className="muted">Nothing differs from revision {previous.number}.</p>
      ) : (
        <dl>
          {changes.map((change) => (
            <div key={change.label}>
              <dt>{change.label}</dt>
              <dd>
                {change.pieces.map((piece, index) =>
                  piece.kind === "same" ? (
                    <span key={index}>{piece.text}</span>
                  ) : piece.kind === "added" ? (
                    <ins key={index}>
                      <span className="visually-hidden">[added: </span>
                      {piece.text}
                      <span className="visually-hidden">]</span>
                    </ins>
                  ) : (
                    <del key={index}>
                      <span className="visually-hidden">[removed: </span>
                      {piece.text}
                      <span className="visually-hidden">]</span>
                    </del>
                  ),
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

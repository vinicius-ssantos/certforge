import type { ReactNode } from "react";
import type { Revision } from "../api/types";
import { formatDateTime } from "../history/format";
import { Prompt } from "../ui/Prompt";
import { DIFFICULTY_LABEL, TYPE_LABEL } from "./labels";
import { RevisionDiff } from "./RevisionDiff";

const DECISION: Record<string, string> = {
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Asked for changes",
};

/**
 * A revision as a reviewer reads it. First the question exactly as the learner will see it, with no
 * answers; then the answer key and the reasons; then the notes left by reviewers. `aside` carries
 * the decision controls when the viewer may decide.
 */
export function RevisionView({
  revision,
  topicName,
  aside,
  previous,
  topicNameOf,
}: {
  revision: Revision;
  topicName: string | undefined;
  aside?: ReactNode;
  /** The revision before this one, when there is one, to show what a correction changed. */
  previous?: Revision | undefined;
  topicNameOf?: (id: string) => string | undefined;
}) {
  const meta = [
    TYPE_LABEL[revision.type] ?? revision.type,
    revision.difficulty ? DIFFICULTY_LABEL[revision.difficulty] : null,
    revision.javaRelease ? `Java ${revision.javaRelease}` : null,
    topicName ?? null,
  ].filter(Boolean);

  return (
    <div className={aside ? "with-aside" : undefined}>
      <div>
        <p className="muted">{meta.join(" · ")}</p>
        {previous ? <RevisionDiff previous={previous} revision={revision} topicName={topicNameOf ?? (() => undefined)} /> : null}
        <section className="stage" aria-labelledby="learner-view">
          <h2 id="learner-view">As the learner will see it</h2>
          <p className="muted">No answers are shown here, exactly as in a study session.</p>
          <Prompt text={revision.prompt ?? ""} />
          <ol className="learner-options">
            {revision.options.map((option) => (
              <li key={option.key}>
                <strong aria-hidden="true">{option.key}</strong>
                <span>
                  <span className="visually-hidden">Option {option.key}: </span>
                  {option.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="answer-key">
          <h2 id="answer-key">Answer key and reasons</h2>
          <ul className="key">
            {revision.options.map((option) => (
              <li key={option.key}>
                <strong className={option.correct ? "yes" : "no"}>
                  {option.key} is {option.correct ? "correct" : "incorrect"}
                </strong>
                <p>{option.explanation}</p>
              </li>
            ))}
          </ul>
          <h2>Explanation</h2>
          <Prompt text={revision.explanation ?? ""} />
          {revision.difficultyRationale ? (
            <>
              <h2>Why this difficulty</h2>
              <p>{revision.difficultyRationale}</p>
            </>
          ) : null}
          <h2>References</h2>
          <ul>
            {revision.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer">
                  {reference.title} (opens in a new tab)
                </a>
              </li>
            ))}
          </ul>
        </section>

        {revision.reviews.length > 0 ? (
          <section aria-labelledby="notes">
            <h2 id="notes">Review notes</h2>
            <ul className="notes">
              {revision.reviews.map((review) => (
                <li key={`${review.reviewerId}-${review.decidedAt}`}>
                  <strong>{DECISION[review.decision] ?? review.decision}</strong>{" "}
                  <time dateTime={review.decidedAt}>{formatDateTime(review.decidedAt)}</time>
                  {review.comment ? <p>{review.comment}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      {aside ? <aside aria-label="Review decision">{aside}</aside> : null}
    </div>
  );
}

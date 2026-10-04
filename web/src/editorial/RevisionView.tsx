import type { ReactNode } from "react";
import type { Revision } from "../api/types";
import { formatDateTime } from "../history/format";
import type { Catalog } from "../i18n/en";
import { useText } from "../i18n/useText";
import { Prompt } from "../ui/Prompt";
import { checklist, difficultyLabels, typeLabels } from "./labels";
import { RevisionDiff } from "./RevisionDiff";

/** How a recorded decision reads. An unknown decision is shown as its code, as before. */
function decisionLabel(decision: string, t: Catalog): string {
  const known: Record<string, string> = {
    APPROVED: t.editorial.revisionView.decisionApproved,
    CHANGES_REQUESTED: t.editorial.revisionView.decisionChangesRequested,
  };
  return known[decision] ?? decision;
}

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
  const t = useText();
  const view = t.editorial.revisionView;
  const types = typeLabels(t);
  const difficulties = difficultyLabels(t);
  const checks = checklist(t);
  const meta = [
    types[revision.type] ?? revision.type,
    revision.difficulty ? difficulties[revision.difficulty] : null,
    revision.javaRelease ? view.javaRelease(revision.javaRelease) : null,
    topicName ?? null,
  ].filter(Boolean);

  return (
    <div className={aside ? "with-aside" : undefined}>
      <div>
        <p className="muted">{meta.join(" · ")}</p>
        <p className="muted">
          {revision.authorName ? view.writtenBy(revision.authorName) : view.authorUnknown}
          {revision.publishedByName ? view.publishedBy(revision.publishedByName) : ""}
        </p>
        {previous ? <RevisionDiff previous={previous} revision={revision} topicName={topicNameOf ?? (() => undefined)} /> : null}
        <section className="stage" aria-labelledby="learner-view">
          <h2 id="learner-view">{view.learnerViewHeading}</h2>
          <p className="muted">{view.learnerViewNote}</p>
          <Prompt text={revision.prompt ?? ""} />
          <ol className="learner-options">
            {revision.options.map((option) => (
              <li key={option.key}>
                <strong aria-hidden="true">{option.key}</strong>
                <span>
                  <span className="visually-hidden">{t.question.optionPrefix(option.key)}</span>
                  {option.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="answer-key">
          <h2 id="answer-key">{view.answerKeyHeading}</h2>
          <ul className="key">
            {revision.options.map((option) => (
              <li key={option.key}>
                <strong className={option.correct ? "yes" : "no"}>
                  {view.optionVerdict(option.key, option.correct)}
                </strong>
                <p>{option.explanation}</p>
              </li>
            ))}
          </ul>
          <h2>{view.explanation}</h2>
          <Prompt text={revision.explanation ?? ""} />
          {revision.difficultyRationale ? (
            <>
              <h2>{view.whyThisDifficulty}</h2>
              <p>{revision.difficultyRationale}</p>
            </>
          ) : null}
          <h2>{view.references}</h2>
          <ul>
            {revision.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer">
                  {t.feedback.referenceLink(reference.title)}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {revision.reviews.length > 0 ? (
          <section aria-labelledby="notes">
            <h2 id="notes">{view.notesHeading}</h2>
            <ul className="notes">
              {revision.reviews.map((review) => (
                <li key={`${review.reviewerId}-${review.decidedAt}`}>
                  <strong>{decisionLabel(review.decision, t)}</strong>
                  {review.reviewerName ? view.decidedBy(review.reviewerName) : ""}{" "}
                  <time dateTime={review.decidedAt}>{formatDateTime(review.decidedAt)}</time>
                  {review.comment ? <p>{review.comment}</p> : null}
                  {review.checklist.length > 0 ? (
                    <p className="muted">
                      {view.checked}
                      {review.checklist
                        .map((code) => checks.find((item) => item.code === code)?.label ?? code)
                        .join("; ")}
                      .
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      {aside ? <aside aria-label={view.decisionLabel}>{aside}</aside> : null}
    </div>
  );
}

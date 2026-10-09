import type { ReactNode } from "react";
import type { Revision } from "../api/types";
import { formatDateTime } from "../history/format";
import { English } from "../i18n/English";
import type { Catalog } from "../i18n/en";
import { useLocale, useText } from "../i18n/useText";
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
  const { locale } = useLocale();
  const view = t.editorial.revisionView;
  const types = typeLabels(t);
  const difficulties = difficultyLabels(t);
  const checks = checklist(t);
  const guided = revision.type === "GUIDED_RESPONSE";
  const criteria = guided ? revision.guidedResponse : null;
  const meta = [
    types[revision.type] ?? revision.type,
    revision.difficulty ? difficulties[revision.difficulty] : null,
    revision.javaRelease ? view.javaRelease(revision.javaRelease) : null,
    revision.seniority ?? null,
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
          {!guided ? (
            <ol className="learner-options">
              {revision.options.map((option) => (
                <li key={option.key}>
                  <strong aria-hidden="true">{option.key}</strong>
                  <span>
                    <span className="visually-hidden">{t.question.optionPrefix(option.key)}</span>
                    <English>{option.text}</English>
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
        </section>

        {guided && criteria ? (
          <section aria-labelledby="guided-criteria">
            <h2 id="guided-criteria" className="section-label">
              {view.guidedCriteriaHeading}
            </h2>
            <p className="muted">{view.guidedCriteriaNote}</p>
            <h3>{view.referenceAnswer}</h3>
            <Prompt text={criteria.referenceAnswer} />
            <h3>{view.expectedConcepts}</h3>
            <ul className="key">
              {criteria.expectedConcepts.map((concept, index) => (
                <li key={`${index}-${concept.text}`}>
                  <strong>{concept.required ? view.requiredConcept : view.optionalConcept}</strong>
                  <English as="p">{concept.text}</English>
                  {concept.explanation ? <English as="p">{concept.explanation}</English> : null}
                </li>
              ))}
            </ul>
            {criteria.commonMistakes.length > 0 ? (
              <>
                <h3>{view.commonMistakes}</h3>
                <ul>
                  {criteria.commonMistakes.map((mistake, index) => (
                    <li key={`${index}-${mistake}`}>
                      <English>{mistake}</English>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {criteria.followUps.length > 0 ? (
              <>
                <h3>{view.followUps}</h3>
                <ul>
                  {criteria.followUps.map((followUp, index) => (
                    <li key={`${index}-${followUp}`}>
                      <English>{followUp}</English>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {revision.difficultyRationale ? (
              <>
                <h3>{view.whyThisDifficulty}</h3>
                <p>{revision.difficultyRationale}</p>
              </>
            ) : null}
            <h3>{view.references}</h3>
            <ul>
              {revision.references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noopener noreferrer">
                    <English>{t.feedback.referenceLink(reference.title)}</English>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section aria-labelledby="answer-key">
            <h2 id="answer-key" className="section-label">
              {view.answerKeyHeading}
            </h2>
            <ul className="answers">
              {revision.options.map((option) => (
                <li key={option.key} className={option.correct ? "answer-correct" : undefined}>
                  <span className="key" aria-hidden="true">
                    {option.key}
                  </span>
                  <div>
                    <p className={option.correct ? "verdict verdict-ok" : "verdict"}>
                      <span aria-hidden="true">{option.correct ? "✓" : "✗"}</span>{" "}
                      {view.optionVerdict(option.key, option.correct)}
                    </p>
                    <English as="p" className="why">
                      {option.explanation}
                    </English>
                  </div>
                </li>
              ))}
            </ul>
            <h2 className="section-label">{view.explanation}</h2>
            <Prompt text={revision.explanation ?? ""} />
            {revision.difficultyRationale ? (
              <>
                <h2 className="section-label">{view.whyThisDifficulty}</h2>
                <p>{revision.difficultyRationale}</p>
              </>
            ) : null}
            <h2 className="section-label">{view.references}</h2>
            <ul>
              {revision.references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noopener noreferrer">
                    <English>{t.feedback.referenceLink(reference.title)}</English>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {revision.reviews.length > 0 ? (
          <section aria-labelledby="notes">
            <h2 id="notes" className="section-label">
              {view.notesHeading}
            </h2>
            <ul className="notes">
              {revision.reviews.map((review) => (
                <li key={`${review.reviewerId}-${review.decidedAt}`}>
                  <strong>{decisionLabel(review.decision, t)}</strong>
                  {review.reviewerName ? view.decidedBy(review.reviewerName) : ""}{" "}
                  <time dateTime={review.decidedAt}>{formatDateTime(review.decidedAt, locale)}</time>
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

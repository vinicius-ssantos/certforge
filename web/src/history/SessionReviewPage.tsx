import { Prompt } from "../ui/Prompt";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { formatDateTime } from "./format";

/** Every answer given in one session, with what was correct and why. Reads only; nothing changes. */
export function SessionReviewPage() {
  const t = useText();
  const { sessionId = "" } = useParams();
  const api = useApi();
  useDocumentTitle(t.sessionReview.title);
  const attempts = useQuery({
    queryKey: ["history", "attempts", sessionId],
    queryFn: () =>
      unwrap(
        api.GET("/api/study/history/attempts", { params: { query: { sessionId, size: 50 } } }),
      ),
  });

  const items = [...(attempts.data?.items ?? [])].sort((a, b) => a.position - b.position);

  return (
    <>
      <h1>{t.sessionReview.title}</h1>
      <p>
        <Link to="/history">{t.sessionReview.backToHistory}</Link>
      </p>
      {attempts.isPending ? <Loading label={t.sessionReview.loading} /> : null}
      {attempts.isError ? (
        <ErrorState error={attempts.error} onRetry={() => void attempts.refetch()} />
      ) : null}
      {attempts.data && items.length === 0 ? (
        <EmptyState title={t.sessionReview.emptyTitle}>
          <p>{t.sessionReview.emptyBody}</p>
        </EmptyState>
      ) : null}
      {items.length > 0 ? (
        <ol className="review">
          {items.map((attempt) => (
            <li key={attempt.id}>
              <h2>{t.sessionReview.questionHeading(attempt.position + 1, attempt.correct)}</h2>
              <Prompt text={attempt.question.prompt} />
              <p>
                {t.sessionReview.yourAnswerLine(
                  attempt.selectedOptions.join(", "),
                  t.sessionReview.confidenceName(attempt.confidence),
                )}
                <time dateTime={attempt.submittedAt}>{formatDateTime(attempt.submittedAt)}</time>.
              </p>
              <details>
                <summary>{t.sessionReview.showAnswer}</summary>
                <ul className="answers">
                  {attempt.question.options.map((option) => (
                    <li key={option.key} className={option.correct ? "answer-correct" : undefined}>
                      <p>
                        <strong>
                          {option.key}. {option.text}
                        </strong>
                      </p>
                      <p className="muted">
                        {attempt.selectedOptions.includes(option.key) ? t.feedback.yourAnswer : ""}
                        {option.correct ? t.feedback.correctAnswer : t.feedback.incorrectAnswer}
                      </p>
                      {option.explanation ? <p>{option.explanation}</p> : null}
                    </li>
                  ))}
                </ul>
                <Prompt text={attempt.question.explanation} />
                {attempt.question.references.length > 0 ? (
                  <ul>
                    {attempt.question.references.map((reference) => (
                      <li key={reference.url}>
                        <a href={reference.url} target="_blank" rel="noopener noreferrer">
                          {t.feedback.referenceLink(reference.title)}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </details>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}

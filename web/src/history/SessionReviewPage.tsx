import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { formatDateTime } from "./format";

/** Every answer given in one session, with what was correct and why. Reads only; nothing changes. */
export function SessionReviewPage() {
  const { sessionId = "" } = useParams();
  const api = useApi();
  useDocumentTitle("Session review");
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
      <h1>Session review</h1>
      <p>
        <Link to="/history">Back to history</Link>
      </p>
      {attempts.isPending ? <Loading label="Loading your answers" /> : null}
      {attempts.isError ? (
        <ErrorState error={attempts.error} onRetry={() => void attempts.refetch()} />
      ) : null}
      {attempts.data && items.length === 0 ? (
        <EmptyState title="No answers in this session">
          <p>Nothing was answered before the session closed.</p>
        </EmptyState>
      ) : null}
      {items.length > 0 ? (
        <ol className="review">
          {items.map((attempt) => (
            <li key={attempt.id}>
              <h2>
                Question {attempt.position + 1}: {attempt.correct ? "correct" : "incorrect"}
              </h2>
              <div className="prompt">{attempt.question.prompt}</div>
              <p>
                Your answer: {attempt.selectedOptions.join(", ")}. Confidence:{" "}
                {attempt.confidence.toLowerCase()}. Answered{" "}
                <time dateTime={attempt.submittedAt}>{formatDateTime(attempt.submittedAt)}</time>.
              </p>
              <details>
                <summary>Show the correct answer and explanation</summary>
                <ul className="answers">
                  {attempt.question.options.map((option) => (
                    <li key={option.key} className={option.correct ? "answer-correct" : undefined}>
                      <p>
                        <strong>
                          {option.key}. {option.text}
                        </strong>
                      </p>
                      <p className="muted">
                        {attempt.selectedOptions.includes(option.key) ? "Your answer. " : ""}
                        {option.correct ? "Correct answer." : "Incorrect answer."}
                      </p>
                      {option.explanation ? <p>{option.explanation}</p> : null}
                    </li>
                  ))}
                </ul>
                <div className="prompt">{attempt.question.explanation}</div>
                {attempt.question.references.length > 0 ? (
                  <ul>
                    {attempt.question.references.map((reference) => (
                      <li key={reference.url}>
                        <a href={reference.url} target="_blank" rel="noopener noreferrer">
                          {reference.title} (opens in a new tab)
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

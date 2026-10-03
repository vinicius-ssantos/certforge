import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { Misconception } from "../api/types";
import { formatDateTime } from "../history/format";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

function percent(accuracy: number | null): string {
  return accuracy === null ? "–" : `${Math.round(accuracy * 100)}%`;
}

/**
 * Progress per topic, derived from the answers given. It is evidence of what was attempted and how
 * it went, not a grade, so the page says "attempted", "correct" and "incorrect" and nothing more.
 */
/**
 * Where the learner has been wrong while saying they were confident. Attempts and distinct
 * questions are both shown because they mean different things: three wrong answers to one question
 * is one idea stuck, and three to three questions is a weak area.
 */
function Misconceptions({ rows }: { rows: Misconception[] }) {
  if (rows.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="misconceptions">
      <h2 id="misconceptions">Where you were sure and wrong</h2>
      <p>
        These are answers you got wrong while saying you were confident. That is worth more than a
        wrong answer you knew was a guess, because nothing told you to look again. It is evidence of
        where to look, <strong>not</strong> a prediction about an exam.
      </p>
      <table>
        <caption className="visually-hidden">
          Confidently wrong answers by topic, with how many questions they span
        </caption>
        <thead>
          <tr>
            <th scope="col">Topic</th>
            <th scope="col">Wrong while sure</th>
            <th scope="col">Across questions</th>
            <th scope="col">Most recent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.topicId}>
              <th scope="row">{row.topicName ?? "Topic"}</th>
              <td>{row.attempts}</td>
              <td>{row.questions}</td>
              <td>
                <time dateTime={row.lastAt}>{formatDateTime(row.lastAt)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Link to="/review">Review these questions</Link>
      </p>
    </section>
  );
}

export function ProgressPage() {
  useDocumentTitle("Progress");
  const api = useApi();
  const progress = useQuery({
    queryKey: ["progress", "topics"],
    queryFn: () => unwrap(api.GET("/api/progress/topics")),
  });
  const misconceptions = useQuery({
    queryKey: ["review", "misconceptions"],
    queryFn: () => unwrap(api.GET("/api/review/misconceptions")),
  });

  return (
    <>
      <h1>Progress</h1>
      {progress.isPending ? <Loading label="Loading your progress" /> : null}
      {progress.isError ? (
        <ErrorState error={progress.error} onRetry={() => void progress.refetch()} />
      ) : null}
      {progress.data && progress.data.length === 0 ? (
        <EmptyState title="No progress yet">
          <p>
            Answer some questions and your progress by topic appears here. Start from the{" "}
            <Link to="/">tracks page</Link>.
          </p>
        </EmptyState>
      ) : null}
      {progress.data && progress.data.length > 0 ? (
        <table>
          <caption className="visually-hidden">Your progress by topic</caption>
          <thead>
            <tr>
              <th scope="col">Topic</th>
              <th scope="col">Attempted</th>
              <th scope="col">Correct</th>
              <th scope="col">Incorrect</th>
              <th scope="col">Accuracy</th>
              <th scope="col">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {progress.data.map((topic) => (
              <tr key={topic.topicId}>
                <th scope="row">
                  {topic.trackSlug ? (
                    <Link to={`/tracks/${topic.trackSlug}`}>{topic.topicName ?? "Topic"}</Link>
                  ) : (
                    (topic.topicName ?? "Topic")
                  )}
                </th>
                <td>{topic.attempted}</td>
                <td>{topic.correct}</td>
                <td>{topic.incorrect}</td>
                <td>{percent(topic.accuracy)}</td>
                <td>
                  {topic.lastActivityAt ? (
                    <time dateTime={topic.lastActivityAt}>{formatDateTime(topic.lastActivityAt)}</time>
                  ) : (
                    "–"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {misconceptions.data ? <Misconceptions rows={misconceptions.data} /> : null}
    </>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
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
export function ProgressPage() {
  useDocumentTitle("Progress");
  const api = useApi();
  const progress = useQuery({
    queryKey: ["progress", "topics"],
    queryFn: () => unwrap(api.GET("/api/progress/topics")),
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
    </>
  );
}

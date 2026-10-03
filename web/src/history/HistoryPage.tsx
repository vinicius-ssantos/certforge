import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { formatDateTime, STATUS_LABEL } from "./format";
import { useTopicNames, useTrackNames } from "./useTopicNames";

export function HistoryPage() {
  useDocumentTitle("History");
  const api = useApi();
  const topicNames = useTopicNames();
  const trackNames = useTrackNames();

  const sessions = useInfiniteQuery({
    queryKey: ["history", "sessions"],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      unwrap(
        api.GET("/api/study/history/sessions", {
          params: { query: { size: 20, ...(pageParam ? { cursor: pageParam } : {}) } },
        }),
      ),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  const mocks = useInfiniteQuery({
    queryKey: ["history", "mock-exams"],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      unwrap(
        api.GET("/api/study/history/mock-exams", {
          params: { query: { size: 20, ...(pageParam ? { cursor: pageParam } : {}) } },
        }),
      ),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  const sessionItems = sessions.data?.pages.flatMap((page) => page.items) ?? [];
  const mockItems = mocks.data?.pages.flatMap((page) => page.items) ?? [];
  const empty =
    sessions.data !== undefined
    && mocks.data !== undefined
    && sessionItems.length === 0
    && mockItems.length === 0;

  return (
    <>
      <h1>History</h1>

      {empty ? (
        <EmptyState title="No study history yet">
          <p>
            Start a topic practice session or a mock exam from the <Link to="/">tracks page</Link>.
          </p>
        </EmptyState>
      ) : null}

      <section aria-labelledby="mock-history-heading">
        <h2 id="mock-history-heading">Mock exams</h2>
        {mocks.isPending ? <Loading label="Loading your mock exams" /> : null}
        {mocks.isError ? <ErrorState error={mocks.error} onRetry={() => void mocks.refetch()} /> : null}
        {mocks.data && mockItems.length === 0 && !empty ? <p className="muted">No mock exams yet.</p> : null}
        {mockItems.length > 0 ? (
          <table>
            <caption className="visually-hidden">Your mock exams, newest first</caption>
            <thead>
              <tr>
                <th scope="col">Track</th>
                <th scope="col">Started</th>
                <th scope="col">Status</th>
                <th scope="col">Answered</th>
                <th scope="col">Score</th>
                <th scope="col">Topics to review</th>
              </tr>
            </thead>
            <tbody>
              {mockItems.map((mock) => {
                const open = mock.status === "IN_PROGRESS";
                const weak = mock.topics.filter((topic) => topic.needsReview);
                return (
                  <tr key={mock.id}>
                    <th scope="row">
                      <Link to={open ? `/mock-exams/${mock.id}` : `/mock-exams/${mock.id}/result`}>
                        {trackNames.get(mock.trackId) ?? "Certification track"}
                        <span className="visually-hidden">
                          {open ? " (continue mock)" : " (view mock result)"}
                        </span>
                      </Link>
                    </th>
                    <td>
                      <time dateTime={mock.createdAt}>{formatDateTime(mock.createdAt)}</time>
                    </td>
                    <td>{STATUS_LABEL[mock.status] ?? mock.status}</td>
                    <td>
                      {mock.answeredCount} of {mock.questionCount}
                    </td>
                    <td>
                      {mock.percentage === null || mock.correctCount === null
                        ? "–"
                        : `${mock.correctCount} of ${mock.questionCount} (${mock.percentage}%)`}
                    </td>
                    <td>
                      {open
                        ? "–"
                        : weak.length === 0
                          ? "None"
                          : weak.map((topic) => topicNames.get(topic.topicId) ?? "Topic").join(", ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
        {mocks.hasNextPage ? (
          <p>
            <button
              type="button"
              onClick={() => void mocks.fetchNextPage()}
              disabled={mocks.isFetchingNextPage}
            >
              {mocks.isFetchingNextPage ? "Loading…" : "Load more mock exams"}
            </button>
          </p>
        ) : null}
        {mocks.isFetchNextPageError ? <ErrorState error={mocks.error} /> : null}
      </section>

      <section aria-labelledby="practice-history-heading">
        <h2 id="practice-history-heading">Topic practice</h2>
        {sessions.isPending ? <Loading label="Loading your sessions" /> : null}
        {sessions.isError ? (
          <ErrorState error={sessions.error} onRetry={() => void sessions.refetch()} />
        ) : null}
        {sessions.data && sessionItems.length === 0 && !empty ? (
          <p className="muted">No topic practice sessions yet.</p>
        ) : null}
        {sessionItems.length > 0 ? (
          <table>
            <caption className="visually-hidden">Your practice sessions, newest first</caption>
            <thead>
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">Started</th>
                <th scope="col">Status</th>
                <th scope="col">Answered</th>
                <th scope="col">Correct</th>
              </tr>
            </thead>
            <tbody>
              {sessionItems.map((session) => {
                const name = topicNames.get(session.topicId) ?? "Topic";
                const open = session.status === "IN_PROGRESS";
                return (
                  <tr key={session.id}>
                    <th scope="row">
                      <Link to={open ? `/sessions/${session.id}` : `/history/sessions/${session.id}`}>
                        {name}
                        <span className="visually-hidden">
                          {open ? " (continue)" : " (review answers)"}
                        </span>
                      </Link>
                    </th>
                    <td>
                      <time dateTime={session.createdAt}>{formatDateTime(session.createdAt)}</time>
                    </td>
                    <td>{STATUS_LABEL[session.status] ?? session.status}</td>
                    <td>
                      {session.answeredCount} of {session.requestedCount}
                    </td>
                    <td>{session.correctCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
        {sessions.hasNextPage ? (
          <p>
            <button
              type="button"
              onClick={() => void sessions.fetchNextPage()}
              disabled={sessions.isFetchingNextPage}
            >
              {sessions.isFetchingNextPage ? "Loading…" : "Load more sessions"}
            </button>
          </p>
        ) : null}
        {sessions.isFetchNextPageError ? <ErrorState error={sessions.error} /> : null}
      </section>
    </>
  );
}

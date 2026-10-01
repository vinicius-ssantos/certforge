import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { formatDateTime, STATUS_LABEL } from "./format";
import { useTopicNames } from "./useTopicNames";

export function HistoryPage() {
  useDocumentTitle("History");
  const api = useApi();
  const topicNames = useTopicNames();
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

  const items = sessions.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <h1>History</h1>
      {sessions.isPending ? <Loading label="Loading your sessions" /> : null}
      {sessions.isError ? (
        <ErrorState error={sessions.error} onRetry={() => void sessions.refetch()} />
      ) : null}
      {sessions.data && items.length === 0 ? (
        <EmptyState title="No practice sessions yet">
          <p>
            Start one from a topic on the <Link to="/">tracks page</Link>.
          </p>
        </EmptyState>
      ) : null}
      {items.length > 0 ? (
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
            {items.map((session) => {
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
    </>
  );
}

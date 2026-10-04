import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { formatDateTime, statusLabel } from "./format";
import { useTopicNames } from "./useTopicNames";

export function HistoryPage() {
  const t = useText();
  useDocumentTitle(t.history.title);
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
      <h1>{t.history.title}</h1>
      {sessions.isPending ? <Loading label={t.history.loading} /> : null}
      {sessions.isError ? (
        <ErrorState error={sessions.error} onRetry={() => void sessions.refetch()} />
      ) : null}
      {sessions.data && items.length === 0 ? (
        <EmptyState title={t.history.emptyTitle}>
          <p>
            {t.history.emptyBodyStart}
            <Link to="/">{t.history.tracksPageLink}</Link>.
          </p>
        </EmptyState>
      ) : null}
      {items.length > 0 ? (
        <table>
          <caption className="visually-hidden">{t.history.tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.history.topic}</th>
              <th scope="col">{t.history.started}</th>
              <th scope="col">{t.history.status}</th>
              <th scope="col">{t.history.answered}</th>
              <th scope="col">{t.history.correct}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((session) => {
              const name = topicNames.get(session.topicId) ?? t.history.fallbackTopic;
              const open = session.status === "IN_PROGRESS";
              return (
                <tr key={session.id}>
                  <th scope="row">
                    <Link to={open ? `/sessions/${session.id}` : `/history/sessions/${session.id}`}>
                      {name}
                      <span className="visually-hidden">
                        {open ? t.history.continueHint : t.history.reviewHint}
                      </span>
                    </Link>
                  </th>
                  <td>
                    <time dateTime={session.createdAt}>{formatDateTime(session.createdAt)}</time>
                  </td>
                  <td>{statusLabel(session.status, t)}</td>
                  <td>{t.history.answeredOf(session.answeredCount, session.requestedCount)}</td>
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
            {sessions.isFetchingNextPage ? t.history.loadingMore : t.history.loadMore}
          </button>
        </p>
      ) : null}
      {sessions.isFetchNextPageError ? <ErrorState error={sessions.error} /> : null}
    </>
  );
}

import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useLocale, useText } from "../i18n/useText";
import { ScrollableTable } from "../ui/ScrollableTable";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { formatDateTime, statusLabel, statusTone } from "./format";
import { useTopicNames, useTrackNames } from "./useTopicNames";

export function HistoryPage() {
  const t = useText();
  const { locale } = useLocale();
  useDocumentTitle(t.history.title);
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
    sessions.data !== undefined &&
    mocks.data !== undefined &&
    sessionItems.length === 0 &&
    mockItems.length === 0;

  return (
    <>
      <h1>{t.history.title}</h1>

      {empty ? (
        <EmptyState title={t.history.emptyTitle}>
          <p>
            {t.history.emptyBodyStart}
            <Link to="/">{t.history.tracksPageLink}</Link>.
          </p>
        </EmptyState>
      ) : null}

      <section aria-labelledby="mock-history-heading">
        <h2 id="mock-history-heading">{t.history.mockHeading}</h2>
        {mocks.isPending ? <Loading label={t.history.mockLoading} /> : null}
        {mocks.isError ? (
          <ErrorState error={mocks.error} onRetry={() => void mocks.refetch()} />
        ) : null}
        {mocks.data && mockItems.length === 0 && !empty ? (
          <p className="muted">{t.history.noMocks}</p>
        ) : null}
        {mockItems.length > 0 ? (
          <ScrollableTable label={t.history.mockTableCaption}>
            <caption className="visually-hidden">{t.history.mockTableCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{t.history.track}</th>
                <th scope="col">{t.history.started}</th>
                <th scope="col">{t.history.status}</th>
                <th scope="col">{t.history.answered}</th>
                <th scope="col">{t.history.score}</th>
                <th scope="col">{t.history.topicsToReview}</th>
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
                        {trackNames.get(mock.trackId) ?? t.history.fallbackTrack}
                        <span className="visually-hidden">
                          {open ? t.history.continueMockHint : t.history.mockResultHint}
                        </span>
                      </Link>
                    </th>
                    <td>
                      <time dateTime={mock.createdAt}>{formatDateTime(mock.createdAt, locale)}</time>
                    </td>
                    <td>
                      <span className={`pill ${statusTone(mock.status)}`}>{statusLabel(mock.status, t)}</span>
                    </td>
                    <td>{t.history.answeredOf(mock.answeredCount, mock.questionCount)}</td>
                    <td>
                      {mock.percentage === null || mock.correctCount === null
                        ? t.history.noValue
                        : t.history.mockScore(
                            mock.correctCount,
                            mock.questionCount,
                            mock.percentage,
                          )}
                    </td>
                    <td>
                      {open
                        ? t.history.noValue
                        : weak.length === 0
                          ? t.history.none
                          : weak
                              .map((topic) => topicNames.get(topic.topicId) ?? t.history.fallbackTopic)
                              .join(", ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </ScrollableTable>
        ) : null}
        {mocks.hasNextPage ? (
          <p>
            <button
              type="button"
              onClick={() => void mocks.fetchNextPage()}
              disabled={mocks.isFetchingNextPage}
            >
              {mocks.isFetchingNextPage ? t.history.loadingMore : t.history.loadMoreMocks}
            </button>
          </p>
        ) : null}
        {mocks.isFetchNextPageError ? <ErrorState error={mocks.error} /> : null}
      </section>

      <section aria-labelledby="practice-history-heading">
        <h2 id="practice-history-heading">{t.history.practiceHeading}</h2>
        {sessions.isPending ? <Loading label={t.history.loading} /> : null}
        {sessions.isError ? (
          <ErrorState error={sessions.error} onRetry={() => void sessions.refetch()} />
        ) : null}
        {sessions.data && sessionItems.length === 0 && !empty ? (
          <p className="muted">{t.history.noPractice}</p>
        ) : null}
        {sessionItems.length > 0 ? (
          <ScrollableTable label={t.history.tableCaption}>
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
              {sessionItems.map((session) => {
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
                      <time dateTime={session.createdAt}>{formatDateTime(session.createdAt, locale)}</time>
                    </td>
                    <td>
                      <span className={`pill ${statusTone(session.status)}`}>{statusLabel(session.status, t)}</span>
                    </td>
                    <td>{t.history.answeredOf(session.answeredCount, session.requestedCount)}</td>
                    <td>{session.correctCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </ScrollableTable>
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
      </section>
    </>
  );
}

import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { ReviewQueueItem } from "../api/types";
import { formatDateTime } from "../history/format";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { reasonExplanation, reasonLabel } from "./reasons";

function isActiveSession(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "active_session_exists";
}

/** The first line of a prompt, which is enough to recognise a question already answered. */
function summarise(prompt: string): string {
  const firstLine = prompt.split("\n").find((line) => line.trim().length > 0) ?? prompt;
  return firstLine.length > 140 ? `${firstLine.slice(0, 140)}…` : firstLine;
}

/**
 * What is worth reviewing, and why. The order comes from the server and is not re-sorted here: the
 * reason is the answer, and there is deliberately no score to sort by.
 *
 * <p>A session is tied to one topic, so practising happens a topic at a time rather than across the
 * whole queue.
 */
export function ReviewPage() {
  const t = useText();
  useDocumentTitle(t.review.title);
  const api = useApi();
  const navigate = useNavigate();
  const queue = useQuery({
    queryKey: ["review", "queue"],
    queryFn: () => unwrap(api.GET("/api/review/queue")),
  });

  const practise = useMutation({
    mutationFn: ({ topicId, revisionIds }: { topicId: string; revisionIds: string[] }) =>
      unwrap(api.POST("/api/study/sessions", { body: { topicId, revisionIds } })),
    onSuccess: (session) => navigate(`/sessions/${session.id}`),
    onError: (error) => {
      const existing = isActiveSession(error) ? error.details["sessionId"] : undefined;
      if (typeof existing === "string") {
        navigate(`/sessions/${existing}`, { state: { resumed: true } });
      }
    },
  });

  const data = queue.data;
  const byTopic = new Map<string, { name: string; items: ReviewQueueItem[] }>();
  for (const item of data?.items ?? []) {
    const group = byTopic.get(item.topicId) ?? {
      name: item.topicName ?? t.review.fallbackTopic,
      items: [],
    };
    group.items.push(item);
    byTopic.set(item.topicId, group);
  }

  return (
    <>
      <h1>{t.review.title}</h1>
      {queue.isPending ? <Loading label={t.review.loading} /> : null}
      {queue.isError ? (
        <ErrorState error={queue.error} onRetry={() => void queue.refetch()} />
      ) : null}

      {data && data.items.length === 0 ? (
        <EmptyState
          title={
            data.waiting > 0
              ? t.review.nothingDueTitle
              : data.neverAttempted > 0
                ? t.review.nothingToReviewTitle
                : t.review.nothingHereTitle
          }
        >
          {data.waiting > 0 ? <p>{t.review.resting(data.waiting)}</p> : null}
          {data.neverAttempted > 0 ? (
            <p>
              {t.review.neverAttempted(data.neverAttempted)}
              <Link to="/">{t.review.tracksPageLink}</Link>.
            </p>
          ) : (
            <p>
              {t.review.startFromTracks}
              <Link to="/">{t.review.tracksPageLink}</Link>.
            </p>
          )}
        </EmptyState>
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <p>
            {t.review.dueNow(data.dueNow)}
            {data.items.length < data.dueNow ? t.review.showingFirst(data.items.length) : ""}.
            {data.waiting > 0 ? t.review.restingMore(data.waiting) : ""}
          </p>
          {[...byTopic].map(([topicId, group]) => (
            <section key={topicId} aria-labelledby={`topic-${topicId}`}>
              <h2 id={`topic-${topicId}`}>{group.name}</h2>
              <button
                type="button"
                disabled={practise.isPending}
                onClick={() =>
                  practise.mutate({
                    topicId,
                    revisionIds: group.items.map((item) => item.revisionId),
                  })
                }
              >
                {t.review.practise(group.items.length, group.name)}
              </button>
              <ol className="review-queue">
                {group.items.map((item) => (
                  <li key={item.questionId}>
                    <strong>{reasonLabel(item.reason, t)}</strong>
                    <p>{summarise(item.prompt)}</p>
                    <p className="muted">{reasonExplanation(item.reason, t)}</p>
                    <p className="muted">
                      {t.review.attemptSummary(item.timesAttempted, item.timesWrong)}
                      <time dateTime={item.lastAttemptedAt}>
                        {formatDateTime(item.lastAttemptedAt)}
                      </time>
                      .
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </>
      ) : null}

      {practise.isError && !isActiveSession(practise.error) ? (
        <ErrorState error={practise.error} />
      ) : null}
    </>
  );
}

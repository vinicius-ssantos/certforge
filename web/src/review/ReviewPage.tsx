import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { ReviewQueueItem } from "../api/types";
import { formatDateTime } from "../history/format";
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
  useDocumentTitle("Review");
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
    const group = byTopic.get(item.topicId) ?? { name: item.topicName ?? "Topic", items: [] };
    group.items.push(item);
    byTopic.set(item.topicId, group);
  }

  return (
    <>
      <h1>Review</h1>
      {queue.isPending ? <Loading label="Loading your review queue" /> : null}
      {queue.isError ? (
        <ErrorState error={queue.error} onRetry={() => void queue.refetch()} />
      ) : null}

      {data && data.items.length === 0 ? (
        <EmptyState
          title={
            data.waiting > 0
              ? "Nothing is due yet"
              : data.neverAttempted > 0
                ? "Nothing to review yet"
                : "Nothing here yet"
          }
        >
          {data.waiting > 0 ? (
            <p>
              You have answered {data.waiting}{" "}
              {data.waiting === 1 ? "question" : "questions"} correctly and confidently, and they
              are resting. Each comes back after a gap that grows every time you get it right.
            </p>
          ) : null}
          {data.neverAttempted > 0 ? (
            <p>
              {data.neverAttempted} {data.neverAttempted === 1 ? "question" : "questions"} in the
              topics you have studied have never been attempted. Review is for revisiting, so start
              from the <Link to="/">tracks page</Link>.
            </p>
          ) : (
            <p>
              Answer some questions and the ones worth revisiting appear here, with the reason. Start
              from the <Link to="/">tracks page</Link>.
            </p>
          )}
        </EmptyState>
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <p>
            {data.dueNow} {data.dueNow === 1 ? "question is" : "questions are"} worth revisiting
            {data.items.length < data.dueNow ? `, showing the first ${data.items.length}` : ""}.
            {data.waiting > 0
              ? ` ${data.waiting} more ${data.waiting === 1 ? "is" : "are"} resting until their next recall.`
              : ""}
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
                Practise {group.items.length}{" "}
                {group.items.length === 1 ? "question" : "questions"} in {group.name}
              </button>
              <ol className="review-queue">
                {group.items.map((item) => (
                  <li key={item.questionId}>
                    <strong>{reasonLabel(item.reason)}</strong>
                    <p>{summarise(item.prompt)}</p>
                    <p className="muted">{reasonExplanation(item.reason)}</p>
                    <p className="muted">
                      Answered {item.timesAttempted}{" "}
                      {item.timesAttempted === 1 ? "time" : "times"}, {item.timesWrong} wrong. Last
                      answered{" "}
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

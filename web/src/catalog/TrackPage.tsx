import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Topic } from "../api/types";
import { useText } from "../i18n/useText";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

function TopicList({
  topics,
  onStart,
  busy,
}: {
  topics: Topic[];
  onStart: (topic: Topic) => void;
  busy: boolean;
}) {
  const t = useText();
  return (
    <ol className="topics">
      {topics.map((topic) => (
        <li key={topic.id}>
          <strong>{topic.name}</strong>
          <span className="muted"> {topic.objectiveRef}</span>{" "}
          <button
            type="button"
            className="small"
            aria-label={t.track.practiceTopic(topic.name)}
            disabled={busy}
            onClick={() => onStart(topic)}
          >
            {t.track.practice}
          </button>
          {topic.subtopics.length > 0 ? (
            <TopicList topics={topic.subtopics} onStart={onStart} busy={busy} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function isActiveSession(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "active_session_exists";
}

function isActiveMock(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "active_mock_exam_exists";
}

export function TrackPage() {
  const t = useText();
  const { slug = "" } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const track = useQuery({
    queryKey: ["track", slug],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks/{slug}", { params: { path: { slug } } })),
  });
  const mockAvailability = useQuery({
    queryKey: ["mock-exam-availability", slug],
    queryFn: () =>
      unwrap(
        api.GET("/api/study/mock-exams/availability", {
          params: { query: { trackSlug: slug } },
        }),
      ),
    enabled: track.data?.kind === "CERTIFICATION",
  });
  useDocumentTitle(track.data?.name ?? t.track.fallbackName);

  // Starting a session for a topic that already has one in progress is not a failure for the
  // learner: the server says which session it is and the learner simply continues it.
  const start = useMutation({
    mutationFn: (topic: Topic) =>
      unwrap(api.POST("/api/study/sessions", { body: { topicId: topic.id } })),
    onSuccess: (session) => navigate(`/sessions/${session.id}`),
    onError: (error) => {
      const existing = isActiveSession(error) ? error.details["sessionId"] : undefined;
      if (typeof existing === "string") {
        navigate(`/sessions/${existing}`, { state: { resumed: true } });
      }
    },
  });

  const startMock = useMutation({
    mutationFn: () =>
      unwrap(api.POST("/api/study/mock-exams", { body: { trackSlug: slug } })),
    onSuccess: (mock) => navigate(`/mock-exams/${mock.id}`),
    onError: (error) => {
      const existing = isActiveMock(error) ? error.details["sessionId"] : undefined;
      if (typeof existing === "string") {
        navigate(`/mock-exams/${existing}`, { state: { resumed: true } });
      }
    },
  });

  const unavailableTopics =
    mockAvailability.data?.topics.filter((topic) => topic.missing > 0).length ?? 0;

  // The heading is always the first element and is never replaced as the data arrives, so focus
  // moved to it by the route change stays put instead of being lost on a re-render.
  return (
    <>
      <h1>{track.data?.name ?? t.track.fallbackName}</h1>
      {track.isPending ? <Loading label={t.track.loading} /> : null}
      {track.isError ? (
        <>
          <ErrorState error={track.error} onRetry={() => void track.refetch()} />
          <p>
            <Link to="/">{t.track.backToAll}</Link>
          </p>
        </>
      ) : null}
      {track.data ? (
        <>
          <p>{track.data.certificationName}</p>
          <p className="muted">
            {track.data.provider} · {track.data.examVersion.label} ({track.data.examVersion.examCode}) ·{" "}
            {t.track.javaRelease(track.data.examVersion.javaRelease)}
          </p>
          <p>
            <a href={track.data.examVersion.objectivesUrl} target="_blank" rel="noopener noreferrer">
              {t.track.objectives}
            </a>
          </p>
          {track.data.kind === "CERTIFICATION" ? (
            <section className="mock-entry" aria-labelledby="mock-entry-heading">
              <h2 id="mock-entry-heading">{t.track.mockHeading}</h2>
              <p>{t.track.mockBody}</p>
              <p className="muted">{t.track.mockCaveat}</p>
              {mockAvailability.isPending ? (
                <Loading label={t.track.mockAvailabilityLoading} />
              ) : null}
              {mockAvailability.isError ? (
                <ErrorState error={mockAvailability.error} onRetry={() => void mockAvailability.refetch()} />
              ) : null}
              {startMock.isError && !isActiveMock(startMock.error) ? (
                <ErrorState error={startMock.error} />
              ) : null}
              {mockAvailability.data?.activeSessionId ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/mock-exams/${mockAvailability.data.activeSessionId}`, {
                      state: { resumed: true },
                    })
                  }
                >
                  {t.track.continueMock}
                </button>
              ) : mockAvailability.data?.contentReady ? (
                <button type="button" onClick={() => startMock.mutate()} disabled={startMock.isPending}>
                  {startMock.isPending
                    ? t.track.startingMock
                    : t.track.startMock(track.data.examVersion.examCode)}
                </button>
              ) : mockAvailability.data ? (
                <p role="status">
                  {t.track.mockUnavailable(
                    mockAvailability.data.missingQuestionCount,
                    unavailableTopics,
                    mockAvailability.data.questionsPerTopic,
                  )}
                </p>
              ) : null}
            </section>
          ) : null}
          <h2>{t.track.topics}</h2>
          {start.isError && !isActiveSession(start.error) ? <ErrorState error={start.error} /> : null}
          <TopicList
            topics={track.data.topics}
            onStart={(topic) => start.mutate(topic)}
            busy={start.isPending}
          />
          <p>
            <Link to="/">{t.track.allTracks}</Link>
          </p>
        </>
      ) : null}
    </>
  );
}

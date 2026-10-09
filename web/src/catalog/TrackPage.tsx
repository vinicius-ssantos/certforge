import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Topic } from "../api/types";
import { useText } from "../i18n/useText";
import { ScrollableTable } from "../ui/ScrollableTable";
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
          <div className="topic-row">
            <div className="topic-copy">
              <strong>{topic.name}</strong>
              {topic.objectiveRef ? <span className="muted">{topic.objectiveRef}</span> : null}
            </div>
            {/* Outlined, not filled. Ten topics means ten of these, and ten filled buttons down
                one edge read as ten primary actions competing with each other and with the mock
                above them. The row's subject is the topic; starting it is the offer. */}
            <button
              type="button"
              className="small secondary"
              aria-label={t.track.practiceTopic(topic.name)}
              disabled={busy}
              onClick={() => onStart(topic)}
            >
              {t.track.practice}
            </button>
          </div>
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

  /*
   * The availability endpoint names topics by id; the track carries their names. Flattened
   * because a topic may have subtopics and either level can be short.
   */
  const topicNames = new Map<string, string>();
  const collectNames = (topics: Topic[]): void => {
    for (const topic of topics) {
      topicNames.set(topic.id, topic.name);
      collectNames(topic.subtopics);
    }
  };
  collectNames(track.data?.topics ?? []);

  // The heading is always the first element and is never replaced as the data arrives, so focus
  // moved to it by the route change stays put instead of being lost on a re-render.
  return (
    <>
      <h1>{track.data?.name ?? t.track.fallbackName}</h1>
      {track.isPending ? <Loading label={t.track.loading} /> : null}
      {track.isError ? (
        <>
          <ErrorState error={track.error} onRetry={() => void track.refetch()} />
          <p className="back">
            <Link to="/">{t.track.backToAll}</Link>
          </p>
        </>
      ) : null}
      {track.data ? (
        <>
          <p>{track.data.certificationName}</p>
          {/* The version's label already carries the exam code — "Java SE 21 (1Z0-830)" — so
              appending it again printed it twice. */}
          <p className="muted">
            {track.data.provider} · {track.data.examVersion.label} ·{" "}
            {t.track.javaRelease(track.data.examVersion.javaRelease)}
          </p>
          <p>
            <a href={track.data.examVersion.objectivesUrl} target="_blank" rel="noopener noreferrer">
              {t.track.objectives}
            </a>
          </p>
          {track.data.kind === "CERTIFICATION" ? (
            <section
              className={
                mockAvailability.data && !mockAvailability.data.contentReady
                  ? "mock-entry mock-entry-waiting"
                  : "mock-entry"
              }
              aria-labelledby="mock-entry-heading"
            >
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
                <>
                  <p role="status">
                    {t.track.mockUnavailable(
                      mockAvailability.data.missingQuestionCount,
                      unavailableTopics,
                      mockAvailability.data.questionsPerTopic,
                    )}
                  </p>
                  {/*
                   * The sentence says how much is missing in total; this says where. It is the
                   * work list for whoever reviews content, and without it the shortfall is a
                   * number nobody can act on. See #138.
                   */}
                  <ScrollableTable label={t.track.mockMissingCaption}>
                    <caption className="visually-hidden">{t.track.mockMissingCaption}</caption>
                    <thead>
                      <tr>
                        <th scope="col">{t.progress.topic}</th>
                        <th scope="col">{t.track.mockPublished}</th>
                        <th scope="col">{t.track.mockShortfall}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAvailability.data.topics
                        .filter((topic) => topic.missing > 0)
                        .map((topic) => (
                          <tr key={topic.topicId}>
                            <th scope="row">{topicNames.get(topic.topicId) ?? t.progress.fallbackTopic}</th>
                            <td>
                              <span className="bar-cell">
                                <span className="mini" aria-hidden="true">
                                  <i
                                    className="low"
                                    style={{ width: `${(topic.available / topic.required) * 100}%` }}
                                  />
                                </span>
                                {`${topic.available} / ${topic.required}`}
                              </span>
                            </td>
                            <td className="numeric">{topic.missing}</td>
                          </tr>
                        ))}
                    </tbody>
                  </ScrollableTable>
                </>
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
          <p className="back">
            <Link to="/">{t.track.allTracks}</Link>
          </p>
        </>
      ) : null}
    </>
  );
}

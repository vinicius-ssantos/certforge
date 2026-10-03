import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Topic } from "../api/types";
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
  return (
    <ol className="topics">
      {topics.map((topic) => (
        <li key={topic.id}>
          <strong>{topic.name}</strong>
          <span className="muted"> {topic.objectiveRef}</span>{" "}
          <button
            type="button"
            className="small"
            aria-label={`Practice ${topic.name}`}
            disabled={busy}
            onClick={() => onStart(topic)}
          >
            Practice
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
  const { slug = "" } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const track = useQuery({
    queryKey: ["track", slug],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks/{slug}", { params: { path: { slug } } })),
  });
  useDocumentTitle(track.data?.name ?? "Track");

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

  // The heading is always the first element and is never replaced as the data arrives, so focus
  // moved to it by the route change stays put instead of being lost on a re-render.
  return (
    <>
      <h1>{track.data?.name ?? "Track"}</h1>
      {track.isPending ? <Loading label="Loading track" /> : null}
      {track.isError ? (
        <>
          <ErrorState error={track.error} onRetry={() => void track.refetch()} />
          <p>
            <Link to="/">Back to all tracks</Link>
          </p>
        </>
      ) : null}
      {track.data ? (
        <>
          <p>{track.data.certificationName}</p>
          <p className="muted">
            {track.data.provider} · {track.data.examVersion.label} ({track.data.examVersion.examCode}) ·
            Java {track.data.examVersion.javaRelease}
          </p>
          <p>
            <a href={track.data.examVersion.objectivesUrl} target="_blank" rel="noopener noreferrer">
              Official exam objectives (opens in a new tab)
            </a>
          </p>
          {track.data.kind === "CERTIFICATION" ? (
            <section className="mock-entry" aria-labelledby="mock-entry-heading">
              <h2 id="mock-entry-heading">Full mock exam</h2>
              <p>
                Run a timed full mock with a server-enforced deadline, delayed feedback and a final
                topic breakdown. The current CertForge blueprint controls the question count,
                duration and practice target.
              </p>
              <p className="muted">
                The practice target is for study guidance and is not an Oracle score prediction.
              </p>
              {startMock.isError && !isActiveMock(startMock.error) ? (
                <ErrorState error={startMock.error} />
              ) : null}
              <button type="button" onClick={() => startMock.mutate()} disabled={startMock.isPending}>
                {startMock.isPending ? "Starting…" : `Start ${track.data.examVersion.examCode} mock`}
              </button>
            </section>
          ) : null}
          <h2>Topics</h2>
          {start.isError && !isActiveSession(start.error) ? <ErrorState error={start.error} /> : null}
          <TopicList
            topics={track.data.topics}
            onStart={(topic) => start.mutate(topic)}
            busy={start.isPending}
          />
          <p>
            <Link to="/">All tracks</Link>
          </p>
        </>
      ) : null}
    </>
  );
}

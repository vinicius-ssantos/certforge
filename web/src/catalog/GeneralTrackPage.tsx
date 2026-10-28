import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Topic } from "../api/types";
import { useText } from "../i18n/useText";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

function isActiveSession(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "active_session_exists";
}

/**
 * A general track's topics, and the same practice button a certification track offers.
 *
 * A trimmed copy of `TrackPage`'s topic list, not a shared one: `Topic.objectiveRef` exists for
 * an exam objective, and a general taxonomy cites none (#176), so there is nothing to show beside
 * the topic name here. Kept separate rather than made to tolerate a field it will never have.
 */
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
            </div>
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

/**
 * A general-knowledge track: browse its topics and start a session on one, by the same endpoint
 * a certification track uses. The session, attempt and progress machinery underneath does not
 * know or care which kind of track a topic belongs to -- #176's "switch tracks without losing
 * history" is true because there is only ever one history, keyed by topic, never by track kind.
 */
export function GeneralTrackPage() {
  const t = useText();
  const { slug = "" } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const track = useQuery({
    queryKey: ["general-track", slug],
    queryFn: () =>
      unwrap(api.GET("/api/catalog/general-tracks/{slug}", { params: { path: { slug } } })),
  });
  useDocumentTitle(track.data?.name ?? t.track.fallbackName);

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
          {/* The label already reads naturally on its own -- "Taxonomy 2026.1" -- the same way a
              certification's exam version label does, so it is shown as given rather than
              wrapped in another word that would double up on real data. */}
          <p className="muted">{track.data.versionLabel}</p>
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

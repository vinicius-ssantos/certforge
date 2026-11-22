import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Topic } from "../api/types";
import { useText } from "../i18n/useText";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { TopicList } from "./TopicList";

function isActiveSession(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "active_session_exists";
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
  const queryClient = useQueryClient();
  const track = useQuery({
    queryKey: ["general-track", slug],
    queryFn: () =>
      unwrap(api.GET("/api/catalog/general-tracks/{slug}", { params: { path: { slug } } })),
  });
  const availability = useQuery({
    queryKey: ["general-topic-availability", slug],
    queryFn: () => unwrap(api.GET("/api/study/sessions/topic-availability", { params: { query: { trackSlug: slug } } })),
    enabled: Boolean(track.data),
  });
  const availableByTopic = availability.data
    ? new Map(availability.data.map((topic) => [topic.topicId, topic.available]))
    : undefined;
  const noQuestionsInTrack = Boolean(availability.data?.length && availability.data.every((topic) => topic.available === 0));
  useDocumentTitle(track.data?.name ?? t.track.fallbackName);

  const start = useMutation({
    mutationFn: (topic: Topic) =>
      unwrap(api.POST("/api/study/sessions", { body: { topicId: topic.id } })),
    onSuccess: (session) => {
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      navigate(`/sessions/${session.id}`);
    },
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
          <h2 id="practice-topics" tabIndex={-1}>{t.track.topics}</h2>
          {availability.isError ? <ErrorState error={availability.error} onRetry={() => void availability.refetch()} /> : null}
          {noQuestionsInTrack ? <p className="content-empty-note" role="status">{t.track.noPublishedTrack}</p> : null}
          {start.isError && !isActiveSession(start.error) ? <ErrorState error={start.error} /> : null}
          <TopicList
            topics={track.data.topics}
            onStart={(topic) => start.mutate(topic)}
            busy={start.isPending || availability.isPending}
            availableByTopic={availableByTopic}
          />
          <p className="back">
            <Link to="/">{t.track.allTracks}</Link>
          </p>
        </>
      ) : null}
    </>
  );
}

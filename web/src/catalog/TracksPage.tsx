import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { TopicProgress } from "../api/types";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

/** Attempts and accuracy for one track, summed from the learner's per-topic progress. */
type TrackStanding = { attempted: number; correct: number; accuracy: number };

/**
 * Where the learner stands on each track, by slug.
 *
 * Summed in the browser from the progress rows rather than asked of a new endpoint: the rows are
 * already the learner's own, already carry the track they belong to, and the catalogue has no
 * reason to learn about progress. A track the learner has not touched is absent, which is what
 * lets the card say nothing rather than say zero.
 */
function standings(rows: TopicProgress[]): Map<string, TrackStanding> {
  const bySlug = new Map<string, TrackStanding>();
  for (const row of rows) {
    if (!row.trackSlug || row.attempted === 0) continue;
    const running = bySlug.get(row.trackSlug) ?? { attempted: 0, correct: 0, accuracy: 0 };
    running.attempted += row.attempted;
    running.correct += row.correct;
    bySlug.set(row.trackSlug, running);
  }
  for (const standing of bySlug.values()) {
    standing.accuracy = standing.correct / standing.attempted;
  }
  return bySlug;
}

export function TracksPage() {
  const t = useText();
  useDocumentTitle(t.tracks.title);
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });
  /*
   * The cards render without this. A learner who has answered nothing, and a failure to read
   * progress, both leave the cards saying what each track is — which is what they said before.
   */
  const progress = useQuery({
    queryKey: ["progress", "topics"],
    queryFn: () => unwrap(api.GET("/api/progress/topics")),
  });
  const standing = standings(progress.data ?? []);

  return (
    <>
      <h1>{t.tracks.title}</h1>
      {tracks.isPending ? <Loading label={t.tracks.loading} /> : null}
      {tracks.isError ? <ErrorState error={tracks.error} onRetry={() => void tracks.refetch()} /> : null}
      {tracks.data && tracks.data.length === 0 ? (
        <EmptyState title={t.tracks.emptyTitle}>
          <p>{t.tracks.emptyBody}</p>
        </EmptyState>
      ) : null}
      {tracks.data && tracks.data.length > 0 ? (
        <ul className="cards">
          {tracks.data.map((track) => (
            <li key={track.id} className="card">
              <h2>
                <Link to={`/tracks/${track.slug}`}>{track.name}</Link>
              </h2>
              <p>{track.certificationName}</p>
              <p className="muted">
                {track.provider} · {track.examVersion.label} ·{" "}
                {t.tracks.javaRelease(track.examVersion.javaRelease)}
              </p>
              <p className="muted">{t.tracks.topicCount(track.topics.length)}</p>
              {/* Where the learner is on this track, not only what the track is. Absent until
                  they have answered something on it: two zeroes say less than nothing. */}
              {standing.has(track.slug) ? (
                <dl className="stat">
                  <div>
                    <dt>{t.progress.attempted}</dt>
                    <dd>{standing.get(track.slug)!.attempted}</dd>
                  </div>
                  <div>
                    <dt>{t.progress.accuracy}</dt>
                    <dd>{`${Math.round(standing.get(track.slug)!.accuracy * 100)}%`}</dd>
                  </div>
                </dl>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

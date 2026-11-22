import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { TopicProgress } from "../api/types";
import { useActiveStudy } from "../history/useActiveStudy";
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
  const [search, setSearch] = useState("");
  const matches = (name: string, provider = "") => `${name} ${provider}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });
  // General-knowledge tracks (#176): a learner studies both from one list, one history, one
  // progress -- the switch between a certification and a general taxonomy is just which card
  // they click, because the session, attempt and progress machinery underneath is kind-agnostic
  // already. A fetch failure here is shown beside the certification one rather than hiding it;
  // the learner can still see and study what loaded.
  const generalTracks = useQuery({
    queryKey: ["general-tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/general-tracks")),
  });
  /*
   * The cards render without this. A learner who has answered nothing, and a failure to read
   * progress, both leave the cards saying what each track is — which is what they said before.
   */
  const progress = useQuery({
    queryKey: ["progress", "topics"],
    queryFn: () => unwrap(api.GET("/api/progress/topics")),
  });
  const active = useActiveStudy();
  const nextActivity = active.activities[0];
  const review = useQuery({
    queryKey: ["review", "queue", "summary"],
    queryFn: () => unwrap(api.GET("/api/review/queue", { params: { query: { limit: 1 } } })),
    select: ({ dueNow, waiting }) => ({ dueNow, waiting }),
  });
  const standing = standings(progress.data ?? []);
  const hasReview = (review.data?.dueNow ?? 0) > 0;
  const resolvingNextStep = !nextActivity && (active.loading || review.isPending);

  const nothingToShow =
    tracks.data && generalTracks.data && tracks.data.length === 0 && generalTracks.data.length === 0;

  return (
    <>
      <h1>{t.tracks.title}</h1>
      {nothingToShow ? <EmptyState title={t.tracks.emptyTitle}><p>{t.tracks.emptyBody}</p></EmptyState> : null}
      {!nothingToShow || nextActivity || hasReview ? <div className="study-overview">
        <section className="study-next" aria-labelledby="study-next-title">
          <p className="study-next-label">{t.tracks.nextStep}</p>
          <h2 id="study-next-title">
            {nextActivity ? t.tracks.resumeStudy : resolvingNextStep ? t.tracks.nextStep
              : hasReview ? t.tracks.reviewFirst : nothingToShow ? t.tracks.emptyTitle : t.tracks.chooseTopic}
          </h2>
          <p>{nextActivity ? `${nextActivity.kind} · ${nextActivity.name} · ${nextActivity.answered}`
            : resolvingNextStep ? t.tracks.checkingNextStep : hasReview ? t.tracks.reviewFirstBody : nothingToShow ? t.tracks.emptyBody : t.tracks.chooseTopicBody}</p>
          {nextActivity ? (
            <Link className="button" to={nextActivity.href}>{t.tracks.resumeStudy}</Link>
          ) : resolvingNextStep ? null : hasReview ? (
            <Link className="button" to="/review">
              {t.tracks.openReview} <span aria-hidden="true">→</span>
            </Link>
          ) : nothingToShow ? null : (
            <a className="button" href="#track-catalog">
              {t.tracks.browseTracks} <span aria-hidden="true">↓</span>
            </a>
          )}
        </section>
        <section className="study-queue" aria-labelledby="study-queue-title">
          <h2 id="study-queue-title">{t.tracks.reviewQueue}</h2>
          {review.data ? (
            <dl className="stat">
              <div>
                <dt>{t.tracks.readyNow}</dt>
                <dd>{review.data.dueNow}</dd>
              </div>
              <div>
                <dt>{t.tracks.waitingForRecall}</dt>
                <dd>{review.data.waiting}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">{review.isError ? t.tracks.reviewUnavailable : t.review.loading}</p>
          )}
          <div className="study-queue-links">
            <Link to="/review">{t.tracks.viewQueue}</Link>
            <Link to="/progress">{t.tracks.viewProgress}</Link>
          </div>
        </section>
      </div> : null}

      <section className="study-catalog" aria-labelledby="track-catalog">
        <h2 id="track-catalog" tabIndex={-1}>{t.tracks.catalogTitle}</h2>
        <p className="content-language-note muted">{t.tracks.languageNote}</p>
        {tracks.isPending ? <Loading label={t.tracks.loading} /> : null}
        {tracks.isError ? <ErrorState error={tracks.error} onRetry={() => void tracks.refetch()} /> : null}
        {!nothingToShow && ((tracks.data?.length ?? 0) + (generalTracks.data?.length ?? 0) > 0) ? <details className="catalog-search"><summary>{t.ux.search}<span className="catalog-search-chevron" aria-hidden="true">⌄</span></summary><label htmlFor="track-search">{t.ux.search}</label><input id="track-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} />{search ? <button type="button" className="secondary" onClick={() => setSearch("")}>{t.ux.clear}</button> : null}</details> : null}
        {search && !(tracks.data ?? []).some((track) => matches(track.name, track.provider)) && !(generalTracks.data ?? []).some((track) => matches(track.name)) ? <p role="status">{t.ux.noMatches}</p> : null}
        {tracks.data && tracks.data.length > 0 ? (
          <section className="study-track-group" aria-labelledby="certification-tracks">
            <h3 className="section-label" id="certification-tracks">{t.tracks.certificationTracks}</h3>
            <ul className="cards">
              {tracks.data.filter((track) => matches(track.name, track.provider)).map((track) => (
                <li key={track.id} className="card">
                  <h4>
                    <Link to={`/tracks/${track.slug}`}>{track.name}</Link>
                  </h4>
                  <p>{track.certificationName}</p>
                  {/* A release is a Java fact; an exam that is not about one carries none (ADR
                      0017), and the row reads without it rather than with an empty slot. */}
                  <p className="muted">
                    {track.provider} · {track.examVersion.label}
                    {track.examVersion.javaRelease === null
                      ? null
                      : ` · ${t.tracks.javaRelease(track.examVersion.javaRelease)}`}
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
          </section>
        ) : null}

        {generalTracks.isError ? (
          <ErrorState error={generalTracks.error} onRetry={() => void generalTracks.refetch()} />
        ) : null}
        {generalTracks.data && generalTracks.data.length > 0 ? (
          <section className="study-track-group" aria-labelledby="general-tracks">
            <h3 className="section-label" id="general-tracks">{t.tracks.generalTracks}</h3>
            <ul className="cards">
              {generalTracks.data.filter((track) => matches(track.name)).map((track) => (
                <li key={track.id} className="card">
                  <h4>
                    <Link to={`/general-tracks/${track.slug}`}>{track.name}</Link>
                  </h4>
                  <p className="muted">
                    {track.versionLabel} · {t.tracks.topicCount(track.topics.length)}
                  </p>
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
          </section>
        ) : null}
      </section>
    </>
  );
}

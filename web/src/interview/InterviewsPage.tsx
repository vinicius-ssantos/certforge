import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { InterviewTrack, Topic } from "../api/types";
import { English } from "../i18n/English";
import { useLocale, useText } from "../i18n/useText";
import { formatDateTime } from "../history/format";
import { ErrorSummary } from "../ui/Form";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

/** A topic and how deep in the taxonomy it sits, so the tree reads as a list the keyboard can walk. */
interface Flat {
  topic: Topic;
  depth: number;
}

function flatten(topics: Topic[], depth = 0, into: Flat[] = []): Flat[] {
  for (const topic of topics) {
    into.push({ topic, depth });
    flatten(topic.subtopics, depth + 1, into);
  }
  return into;
}

/** Starting a second session conflicts with the one already open, which names it in its details. */
function openSessionIn(error: unknown): string | undefined {
  if (error instanceof ApiError && error.code === "active_interview_session_exists") {
    const named = error.details["sessionId"];
    return typeof named === "string" ? named : undefined;
  }
  return undefined;
}

export function InterviewsPage() {
  const t = useText();
  const api = useApi();
  useDocumentTitle(t.interview.title);

  const tracks = useQuery({
    queryKey: ["interview-tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/interview-tracks")),
  });
  const open = useQuery({
    queryKey: ["interview-sessions", "IN_PROGRESS"],
    queryFn: () =>
      unwrap(api.GET("/api/study/interviews", { params: { query: { status: "IN_PROGRESS" } } })),
  });
  const done = useQuery({
    queryKey: ["interview-sessions", "COMPLETED"],
    queryFn: () =>
      unwrap(api.GET("/api/study/interviews", { params: { query: { status: "COMPLETED" } } })),
  });

  return (
    <>
      <h1>{t.interview.title}</h1>

      <p className="button-row">
        <Link className="button secondary" to="/interviews/blueprints">
          {t.interview.blueprintsLink}
        </Link>
        <Link className="button secondary" to="/interviews/evidence">
          {t.interview.evidenceLink}
        </Link>
      </p>

      {/* The open session first: a learner who left one running came back to continue it, and
          starting another is refused anyway — one interview session per track at a time. */}
      {open.data && open.data.length > 0 ? (
        <section aria-labelledby="resume-heading" className="panel">
          <h2 id="resume-heading">{t.interview.resumeHeading}</h2>
          <ul className="interview-list">
            {open.data.map((session) => (
              <li key={session.id}>
                <Link to={`/interviews/${session.id}`}>{t.interview.resume}</Link>{" "}
                <OpenedAt at={session.createdAt} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tracks.isPending ? <Loading label={t.interview.loading} /> : null}
      {tracks.isError ? (
        <ErrorState error={tracks.error} onRetry={() => void tracks.refetch()} />
      ) : null}
      {tracks.data && tracks.data.length === 0 ? (
        <EmptyState title={t.interview.emptyTitle}>
          <p>{t.interview.emptyBody}</p>
        </EmptyState>
      ) : null}

      {(tracks.data ?? []).map((track) => (
        <TrackSection key={track.id} track={track} />
      ))}

      {done.data && done.data.length > 0 ? (
        <section aria-labelledby="past-heading">
          <h2 id="past-heading">{t.interview.pastHeading}</h2>
          <ul className="interview-list">
            {done.data.map((session) => (
              <li key={session.id}>
                <PastSession
                  count={session.itemCount}
                  closedAt={session.closedAt ?? session.createdAt}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function OpenedAt({ at }: { at: string }) {
  const t = useText();
  const { locale } = useLocale();
  return <span className="muted">{t.interview.openedAt(formatDateTime(at, locale))}</span>;
}

function PastSession({ count, closedAt }: { count: number; closedAt: string }) {
  const t = useText();
  const { locale } = useLocale();
  return <span>{t.interview.pastItem(count, formatDateTime(closedAt, locale))}</span>;
}

/** One taxonomy: what it contains, and the form that starts a session on part of it. */
function TrackSection({ track }: { track: InterviewTrack }) {
  const t = useText();
  const api = useApi();
  const navigate = useNavigate();
  const flat = flatten(track.topics);
  const [chosen, setChosen] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [problems, setProblems] = useState<{ fieldId?: string; message: string }[]>([]);

  const start = useMutation({
    mutationFn: () =>
      unwrap(
        api.POST("/api/study/interviews", {
          body: {
            trackSlug: track.slug,
            topicIds: chosen.length > 0 ? chosen : undefined,
            questionCount: count,
          },
        }),
      ),
    onSuccess: (session) => navigate(`/interviews/${session.id}`),
    onError: (error) => {
      // Someone opened one in another tab; join that session rather than report a conflict the
      // learner cannot act on.
      const existing = openSessionIn(error);
      if (existing) {
        navigate(`/interviews/${existing}`);
      }
    },
  });

  function toggle(id: string) {
    setChosen((current) =>
      current.includes(id) ? current.filter((candidate) => candidate !== id) : [...current, id],
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (count < 1 || count > 30) {
      setProblems([{ fieldId: `count-${track.id}`, message: t.interview.countRange(1, 30) }]);
      return;
    }
    setProblems([]);
    start.mutate();
  }

  const conflict = openSessionIn(start.error);

  return (
    <section aria-labelledby={`track-${track.id}`} className="panel">
      <h2 id={`track-${track.id}`}>{track.name}</h2>
      <p className="muted">
        {/* The label already reads naturally on its own -- "Taxonomy 1" -- the same way a
            certification's exam version label does, so it is shown as given rather than
            wrapped in another word that would double up on real seed data. */}
        {track.versionLabel} · {t.interview.topicCount(flat.length)}
      </p>

      <h3>{t.interview.browseHeading}</h3>
      <form onSubmit={submit} noValidate>
        <ErrorSummary problems={problems} />
        <fieldset>
          <legend>{t.interview.chooseTopics}</legend>
          {flat.map(({ topic, depth }) => (
            <div key={topic.id} className="choice" style={{ marginInlineStart: `${depth * 1.5}rem` }}>
              <input
                id={`topic-${topic.id}`}
                type="checkbox"
                checked={chosen.includes(topic.id)}
                onChange={() => toggle(topic.id)}
              />
              <label htmlFor={`topic-${topic.id}`}>
                {/* Topic wording is reviewed content and stays in English in every locale
                    (ADR 0012 decision 2). */}
                <English>{topic.name}</English>
              </label>
            </div>
          ))}
        </fieldset>

        <div className="field">
          <label htmlFor={`count-${track.id}`}>{t.interview.questionCount}</label>
          <input
            id={`count-${track.id}`}
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
        </div>

        {/* Nothing but the conflict it has already acted on: a 500, or a taxonomy whose topics
            have no published questions, must say so rather than silently re-enable the button. */}
        {start.isError && !conflict ? <ErrorState error={start.error} /> : null}

        <div className="button-row">
          <button type="submit" disabled={start.isPending}>
            {start.isPending ? t.interview.starting : t.interview.start}
          </button>
          <Link className="button secondary" to="/interviews/blueprints/new">
            {t.interview.startFromBlueprint}
          </Link>
        </div>
      </form>
    </section>
  );
}

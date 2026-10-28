import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { InterviewTrack, Topic, TopicEvidence } from "../api/types";
import { English } from "../i18n/English";
import type { Catalog } from "../i18n/en";
import { useLocale, useText } from "../i18n/useText";
import { formatDateTime } from "../history/format";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

function collect(topics: Topic[], into: Map<string, string>) {
  for (const topic of topics) {
    into.set(topic.id, topic.name);
    collect(topic.subtopics, into);
  }
}

/** Interview topic names by id. The certification catalog has none of these (ADR 0016). */
function interviewTopicNames(tracks: InterviewTrack[]): Map<string, string> {
  const names = new Map<string, string>();
  for (const track of tracks) {
    collect(track.topics, names);
  }
  return names;
}

/**
 * One signal in the reader's own language.
 *
 * The server sends a kind and the counts behind it, never a sentence: the interface is translated
 * (ADR 0012) and prose composed on the server could only ever be English. A kind this build does
 * not know is dropped rather than shown raw — a code on the screen tells a learner nothing.
 */
function signalText(
  t: Catalog,
  signal: { kind: string; count: number; concept?: string | null },
): string | null {
  switch (signal.kind) {
    case "SURE_AND_WRONG":
      return t.interview.evidence.signalSureAndWrong(signal.count);
    case "UNSURE_AND_RIGHT":
      return t.interview.evidence.signalUnsureAndRight(signal.count);
    case "CONCEPT_MARKED_MISSED":
      return signal.concept
        ? t.interview.evidence.signalConceptMarkedMissed(signal.count, signal.concept)
        : null;
    case "GUIDED_PRACTISED_WITH_NO_MISSES":
      return t.interview.evidence.signalGuidedPractisedWithNoMisses(signal.count);
    case "PRACTISED_NOTHING_TO_SINGLE_OUT":
      return t.interview.evidence.signalPractisedNothingToSingleOut(signal.count);
    default:
      return null;
  }
}

export function EvidencePage() {
  const t = useText();
  const api = useApi();
  useDocumentTitle(t.interview.evidence.title);

  const tracks = useQuery({
    queryKey: ["interview-tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/interview-tracks")),
  });
  const trackSlug = tracks.data?.[0]?.slug;

  const evidence = useQuery({
    queryKey: ["interview-evidence", trackSlug],
    enabled: Boolean(trackSlug),
    queryFn: () =>
      unwrap(
        api.GET("/api/study/interviews/evidence", {
          params: { query: { trackSlug: trackSlug! } },
        }),
      ),
  });

  const names = interviewTopicNames(tracks.data ?? []);

  return (
    <>
      <h1>{t.interview.evidence.title}</h1>
      <p>{t.interview.evidence.intro}</p>
      {/* The two kinds are never added together: one is graded and the other is not, so a total
          would be a number with two meanings (ADR 0019). */}
      <p className="notice">{t.interview.evidence.notAVerdict}</p>

      <p className="button-row">
        <Link className="button secondary" to="/interviews">
          {t.interview.session.backToInterviews}
        </Link>
      </p>

      {tracks.isPending || evidence.isPending ? (
        <Loading label={t.interview.evidence.loading} />
      ) : null}
      {evidence.isError ? (
        <ErrorState error={evidence.error} onRetry={() => void evidence.refetch()} />
      ) : null}
      {evidence.data && evidence.data.topics.length === 0 ? (
        <EmptyState title={t.interview.evidence.emptyTitle}>
          <p>{t.interview.evidence.emptyBody}</p>
        </EmptyState>
      ) : null}

      {(evidence.data?.topics ?? []).map((topic) => (
        <TopicEvidenceSection
          key={topic.topicId}
          topic={topic}
          name={names.get(topic.topicId)}
        />
      ))}
    </>
  );
}

function TopicEvidenceSection({
  topic,
  name,
}: {
  topic: TopicEvidence;
  name: string | undefined;
}) {
  const t = useText();
  const { locale } = useLocale();
  const said = topic.signals
    .map((signal) => signalText(t, signal))
    .filter((text): text is string => text !== null);

  return (
    <section aria-labelledby={`evidence-${topic.topicId}`} className="panel">
      <h2 id={`evidence-${topic.topicId}`}>
        {/* Topic wording is reviewed content, English in every locale (ADR 0012 decision 2). */}
        {name ? <English>{name}</English> : t.history.fallbackTopic}
      </h2>

      <h3>{t.interview.evidence.objectiveHeading}</h3>
      <dl className="stat">
        <div>
          <dt>{t.interview.evidence.answered}</dt>
          <dd>{topic.objective.answered}</dd>
        </div>
        <div>
          <dt>{t.interview.evidence.correct}</dt>
          <dd>{topic.objective.correct}</dd>
        </div>
      </dl>
      {topic.objective.lastAnsweredAt ? (
        <p className="muted">
          {t.interview.evidence.lastAt(formatDateTime(topic.objective.lastAnsweredAt, locale))}
        </p>
      ) : null}

      <h3>{t.interview.evidence.guidedHeading}</h3>
      <dl className="stat">
        <div>
          <dt>{t.interview.evidence.practised}</dt>
          <dd>{topic.guided.practised}</dd>
        </div>
      </dl>
      {topic.guided.lastPractisedAt ? (
        <p className="muted">
          {t.interview.evidence.lastAt(formatDateTime(topic.guided.lastPractisedAt, locale))}
        </p>
      ) : null}

      {said.length > 0 ? (
        <ul className="interview-list">
          {said.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

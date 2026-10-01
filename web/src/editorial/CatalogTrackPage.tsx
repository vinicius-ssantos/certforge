import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { AdminExamVersion, AdminTopic, AdminTrack } from "../api/types";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { catalogStatusOf } from "./catalogLabels";

function Status({ status }: { status: string }) {
  const { label, symbol, tone } = catalogStatusOf(status);
  return (
    <span className={`status status-${tone}`}>
      <span aria-hidden="true">{symbol}</span>
      {label}
    </span>
  );
}

function ExamVersion({ version, topics }: { version: AdminExamVersion; topics: AdminTopic[] }) {
  const byId = new Map(topics.map((topic) => [topic.id, topic]));
  const mapped = [...version.topics].sort((a, b) => a.position - b.position);
  return (
    <section aria-labelledby={`version-${version.id}`}>
      <h3 id={`version-${version.id}`}>
        {version.label} <Status status={version.status} />
      </h3>
      <p className="muted">
        {version.examName} ({version.examCode}) · Java {version.javaRelease}
      </p>
      <p>
        <a href={version.objectivesUrl} target="_blank" rel="noopener noreferrer">
          Official exam objectives (opens in a new tab)
        </a>
      </p>
      {mapped.length === 0 ? (
        <p>No topic is mapped to this exam version.</p>
      ) : (
        <table>
          <caption className="visually-hidden">Topics mapped to {version.label}, in order</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Topic</th>
              <th scope="col">Objective wording for this exam</th>
            </tr>
          </thead>
          <tbody>
            {mapped.map((mapping) => (
              <tr key={mapping.topicId}>
                <td>{mapping.position + 1}</td>
                <th scope="row">{byId.get(mapping.topicId)?.name ?? "Topic outside this track"}</th>
                <td>{mapping.objectiveRef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

/**
 * One track as an administrator sees it. The point of the page is to answer a question the
 * editorial desk raises: why can a question not be published on this topic? Publishing binds a
 * revision to the topic's active exam version, so a topic that no active version maps, or a
 * revision written for another Java release, is refused. Both are shown here.
 */
export function CatalogTrackPage() {
  const { trackId = "" } = useParams();
  const api = useApi();
  const track = useQuery({
    queryKey: ["catalog", "admin", "track", trackId],
    staleTime: 0,
    queryFn: () =>
      unwrap(api.GET("/api/admin/catalog/tracks/{trackId}", { params: { path: { trackId } } })),
  });
  useDocumentTitle(track.data?.name ?? "Track");

  return (
    <>
      <p>
        <Link to="/editorial/catalog">Back to the catalog</Link>
      </p>
      <h1>{track.data?.name ?? "Track"}</h1>
      {track.isPending ? <Loading label="Loading the track" /> : null}
      {track.isError ? <ErrorState error={track.error} onRetry={() => void track.refetch()} /> : null}
      {track.data ? <TrackDetail track={track.data} /> : null}
    </>
  );
}

function TrackDetail({ track }: { track: AdminTrack }) {
  const active = track.examVersions.find((version) => version.status === "ACTIVE");
  const publishable = new Set(active?.topics.map((mapping) => mapping.topicId) ?? []);
  const unmapped = track.topics.filter((topic) => !publishable.has(topic.id));

  return (
    <>
      <p className="muted">
        <Status status={track.status} /> · {track.provider} · {track.certificationName} · {track.kind}
      </p>

      <section aria-labelledby="publishing">
        <h2 id="publishing">Where content can be published</h2>
        {track.status !== "ACTIVE" ? (
          <p>
            This track is {catalogStatusOf(track.status).label.toLowerCase()}, so no learner is given
            its questions.
          </p>
        ) : null}
        {active ? (
          <p>
            Questions can be published on the {publishable.size} topics mapped to{" "}
            <strong>{active.label}</strong>, and they must be written for <strong>Java {active.javaRelease}</strong>.
            A revision for another release is refused when it is published.
          </p>
        ) : (
          <p>
            No exam version is active, so nothing can be published on this track at all: publishing
            binds a revision to the topic's active exam version.
          </p>
        )}
        {unmapped.length > 0 ? (
          <>
            <p>
              {unmapped.length} {unmapped.length === 1 ? "topic is" : "topics are"} not mapped to the
              active exam version. A question on {unmapped.length === 1 ? "it" : "them"} can be
              written and approved, but publishing it is refused.
            </p>
            <ul>
              {unmapped.map((topic) => (
                <li key={topic.id}>
                  {topic.name} <span className="muted">({topic.slug})</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section aria-labelledby="versions">
        <h2 id="versions">Exam versions</h2>
        {track.examVersions.length === 0 ? (
          <p>This track has no exam version.</p>
        ) : (
          track.examVersions.map((version) => (
            <ExamVersion key={version.id} version={version} topics={track.topics} />
          ))
        )}
      </section>
    </>
  );
}

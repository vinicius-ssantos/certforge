import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { AdminExamVersion, AdminTopic, AdminTrack } from "../api/types";
import { useText } from "../i18n/useText";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { catalogStatusOf } from "./catalogLabels";

function Status({ status }: { status: string }) {
  const t = useText();
  const { label, symbol, tone } = catalogStatusOf(status, t);
  return (
    <span className={`status status-${tone}`}>
      <span aria-hidden="true">{symbol}</span>
      {label}
    </span>
  );
}

function ExamVersion({ version, topics }: { version: AdminExamVersion; topics: AdminTopic[] }) {
  const t = useText();
  const byId = new Map(topics.map((topic) => [topic.id, topic]));
  const mapped = [...version.topics].sort((a, b) => a.position - b.position);
  return (
    <section aria-labelledby={`version-${version.id}`}>
      <h3 id={`version-${version.id}`}>
        {version.label} <Status status={version.status} />
      </h3>
      {/*
       * An interview track's version is a taxonomy revision with no exam behind it, so there is no
       * code, name, release or objectives page to show. Saying that is better than four blanks.
       */}
      {version.examCode === null || version.examName === null || version.javaRelease === null ? (
        <p className="muted">{t.editorial.catalogTrack.noExam}</p>
      ) : (
        <>
          <p className="muted">
            {t.editorial.catalogTrack.examNameAndCode(version.examName, version.examCode)} ·{" "}
            {t.editorial.catalogTrack.javaRelease(version.javaRelease)}
          </p>
          {version.objectivesUrl === null ? null : (
            <p>
              <a href={version.objectivesUrl} target="_blank" rel="noopener noreferrer">
                {t.editorial.catalogTrack.objectives}
              </a>
            </p>
          )}
        </>
      )}
      {mapped.length === 0 ? (
        <p>{t.editorial.catalogTrack.noTopicMapped}</p>
      ) : (
        <table>
          <caption className="visually-hidden">
            {t.editorial.catalogTrack.mappedCaption(version.label)}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t.editorial.catalogTrack.number}</th>
              <th scope="col">{t.editorial.catalogTrack.topic}</th>
              <th scope="col">{t.editorial.catalogTrack.objectiveWording}</th>
            </tr>
          </thead>
          <tbody>
            {mapped.map((mapping) => (
              <tr key={mapping.topicId}>
                <td>{mapping.position + 1}</td>
                <th scope="row">
                  {byId.get(mapping.topicId)?.name ?? t.editorial.catalogTrack.topicOutsideTrack}
                </th>
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
  const t = useText();
  const { trackId = "" } = useParams();
  const api = useApi();
  const track = useQuery({
    queryKey: ["catalog", "admin", "track", trackId],
    staleTime: 0,
    queryFn: () =>
      unwrap(api.GET("/api/admin/catalog/tracks/{trackId}", { params: { path: { trackId } } })),
  });
  useDocumentTitle(track.data?.name ?? t.editorial.catalogTrack.fallbackName);

  return (
    <>
      <p>
        <Link to="/editorial/catalog">{t.editorial.catalogTrack.backToCatalog}</Link>
      </p>
      <h1>{track.data?.name ?? t.editorial.catalogTrack.fallbackName}</h1>
      {track.isPending ? <Loading label={t.editorial.catalogTrack.loading} /> : null}
      {track.isError ? <ErrorState error={track.error} onRetry={() => void track.refetch()} /> : null}
      {track.data ? <TrackDetail track={track.data} /> : null}
    </>
  );
}

function TrackDetail({ track }: { track: AdminTrack }) {
  const t = useText();
  const active = track.examVersions.find((version) => version.status === "ACTIVE");
  const publishable = new Set(active?.topics.map((mapping) => mapping.topicId) ?? []);
  const unmapped = track.topics.filter((topic) => !publishable.has(topic.id));

  return (
    <>
      <p className="muted">
        <Status status={track.status} /> · {track.provider} · {track.certificationName} · {track.kind}
      </p>

      <section aria-labelledby="publishing">
        <h2 id="publishing">{t.editorial.catalogTrack.publishingHeading}</h2>
        {track.status !== "ACTIVE" ? (
          <p>
            {t.editorial.catalogTrack.notActive(
              catalogStatusOf(track.status, t).label.toLowerCase(),
            )}
          </p>
        ) : null}
        {active ? (
          <p>
            {t.editorial.catalogTrack.publishableStart(publishable.size)}
            <strong>{active.label}</strong>
            {active.javaRelease === null ? (
              t.editorial.catalogTrack.publishableNoRelease
            ) : (
              <>
                {t.editorial.catalogTrack.publishableRelease}
                <strong>{t.editorial.catalogTrack.javaRelease(active.javaRelease)}</strong>
                {t.editorial.catalogTrack.publishableEnd}
              </>
            )}
          </p>
        ) : (
          <p>{t.editorial.catalogTrack.noActiveVersion}</p>
        )}
        {unmapped.length > 0 ? (
          <>
            <p>{t.editorial.catalogTrack.unmapped(unmapped.length)}</p>
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
        <h2 id="versions">{t.editorial.catalogTrack.versionsHeading}</h2>
        {track.examVersions.length === 0 ? (
          <p>{t.editorial.catalogTrack.noVersions}</p>
        ) : (
          track.examVersions.map((version) => (
            <ExamVersion key={version.id} version={version} topics={track.topics} />
          ))
        )}
      </section>
    </>
  );
}

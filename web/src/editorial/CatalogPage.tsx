import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { catalogStatusOf } from "./catalogLabels";

/** The editorial catalogue is read-only. The server owns the track and version states. */
export function CatalogPage() {
  const t = useText();
  useDocumentTitle(t.editorial.catalogTitle);
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["catalog", "admin", "tracks"],
    staleTime: 0,
    queryFn: () => unwrap(api.GET("/api/admin/catalog/tracks")),
  });

  return (
    <>
      <p><Link to="/editorial">{t.editorial.backToQuestions}</Link></p>
      <h1>{t.editorial.catalogTitle}</h1>
      <p className="muted">{t.editorial.catalogPage.note}</p>
      {tracks.isPending ? <Loading label={t.editorial.catalogPage.loading} /> : null}
      {tracks.isError ? <ErrorState error={tracks.error} onRetry={() => void tracks.refetch()} /> : null}
      {tracks.data && tracks.data.length === 0 ? (
        <EmptyState title={t.editorial.catalogPage.emptyTitle}>
          <p>{t.editorial.catalogPage.emptyBody}</p>
        </EmptyState>
      ) : null}
      {tracks.data && tracks.data.length > 0 ? (
        <ul className="cards editorial-catalog" aria-label={t.editorial.catalogPage.tableCaption}>
          {tracks.data.map((track) => {
            const status = catalogStatusOf(track.status, t);
            const kind = track.kind === "CERTIFICATION"
              ? t.editorial.catalogPage.certificationKind
              : t.editorial.catalogPage.interviewKind;
            return (
              <li key={track.id} className="card">
                <p className="section-label">{kind}</p>
                <h2><Link to={`/editorial/catalog/${track.id}`}>{track.name}</Link></h2>
                <p className="muted">{track.provider}</p>
                <p>
                  <span className={`status status-${status.tone} pill`}>
                    <span aria-hidden="true">{status.symbol}</span>
                    {status.label}
                  </span>
                </p>
                <p className="muted">{t.editorial.catalogPage.topicCount(track.topics.length)}</p>
                <div className="editorial-catalog-versions">
                  <p className="section-label">{t.editorial.catalogPage.examVersions}</p>
                  {track.examVersions.length === 0 ? (
                    <p className="muted">{t.editorial.catalogTrack.noVersions}</p>
                  ) : (
                    <ul>
                      {track.examVersions.map((version) => {
                        const state = catalogStatusOf(version.status, t);
                        return (
                          <li key={version.id}>
                            <span>{version.label}</span>
                            <span className={`status status-${state.tone} pill`}>
                              <span aria-hidden="true">{state.symbol}</span>
                              {state.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}

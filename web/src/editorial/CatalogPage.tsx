import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useText } from "../i18n/useText";
import { ScrollableTable } from "../ui/ScrollableTable";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { catalogStatusOf } from "./catalogLabels";

/** The catalog as an administrator sees it: drafts and inactive entries included. */
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
      <p>
        <Link to="/editorial">{t.editorial.backToQuestions}</Link>
      </p>
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
        <ScrollableTable label={t.editorial.catalogPage.tableCaption}>
          <caption className="visually-hidden">{t.editorial.catalogPage.tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.editorial.catalogPage.track}</th>
              <th scope="col">{t.editorial.catalogPage.status}</th>
              <th scope="col">{t.editorial.catalogPage.provider}</th>
              <th scope="col">{t.editorial.catalogPage.examVersions}</th>
              <th scope="col">{t.editorial.catalogPage.topics}</th>
            </tr>
          </thead>
          <tbody>
            {tracks.data.map((track) => {
              const status = catalogStatusOf(track.status, t);
              const active = track.examVersions.filter((version) => version.status === "ACTIVE").length;
              return (
                <tr key={track.id}>
                  <th scope="row">
                    <Link to={`/editorial/catalog/${track.id}`}>{track.name}</Link>
                  </th>
                  <td>
                    <span className={`status status-${status.tone}`}>
                      <span aria-hidden="true">{status.symbol}</span>
                      {status.label}
                    </span>
                  </td>
                  <td>{track.provider}</td>
                  <td>{t.editorial.catalogPage.versionCount(track.examVersions.length, active)}</td>
                  <td>{track.topics.length}</td>
                </tr>
              );
            })}
          </tbody>
        </ScrollableTable>
      ) : null}
    </>
  );
}

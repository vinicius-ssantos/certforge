import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { catalogStatusOf } from "./catalogLabels";

/** The catalog as an administrator sees it: drafts and inactive entries included. */
export function CatalogPage() {
  useDocumentTitle("Catalog");
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["catalog", "admin", "tracks"],
    staleTime: 0,
    queryFn: () => unwrap(api.GET("/api/admin/catalog/tracks")),
  });

  return (
    <>
      <p>
        <Link to="/editorial">Back to questions</Link>
      </p>
      <h1>Catalog</h1>
      <p className="muted">
        What learners can be given, and what content can be published against. This is a read-only
        view: in this release the catalog is created by database migration.
      </p>
      {tracks.isPending ? <Loading label="Loading the catalog" /> : null}
      {tracks.isError ? <ErrorState error={tracks.error} onRetry={() => void tracks.refetch()} /> : null}
      {tracks.data && tracks.data.length === 0 ? (
        <EmptyState title="There are no tracks">
          <p>A track is seeded by migration. An empty catalog means none has been applied.</p>
        </EmptyState>
      ) : null}
      {tracks.data && tracks.data.length > 0 ? (
        <table>
          <caption className="visually-hidden">Preparation tracks</caption>
          <thead>
            <tr>
              <th scope="col">Track</th>
              <th scope="col">Status</th>
              <th scope="col">Provider</th>
              <th scope="col">Exam versions</th>
              <th scope="col">Topics</th>
            </tr>
          </thead>
          <tbody>
            {tracks.data.map((track) => {
              const status = catalogStatusOf(track.status);
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
                  <td>
                    {track.examVersions.length} ({active} active)
                  </td>
                  <td>{track.topics.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </>
  );
}

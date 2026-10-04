import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

export function TracksPage() {
  const t = useText();
  useDocumentTitle(t.tracks.title);
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });

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
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

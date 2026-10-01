import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { Topic } from "../api/types";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

function TopicList({ topics }: { topics: Topic[] }) {
  return (
    <ol className="topics">
      {topics.map((topic) => (
        <li key={topic.id}>
          <strong>{topic.name}</strong>
          <span className="muted"> {topic.objectiveRef}</span>
          {topic.subtopics.length > 0 ? <TopicList topics={topic.subtopics} /> : null}
        </li>
      ))}
    </ol>
  );
}

export function TrackPage() {
  const { slug = "" } = useParams();
  const api = useApi();
  const track = useQuery({
    queryKey: ["track", slug],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks/{slug}", { params: { path: { slug } } })),
  });
  useDocumentTitle(track.data?.name ?? "Track");

  // The heading is always the first element and is never replaced as the data arrives, so focus
  // moved to it by the route change stays put instead of being lost on a re-render.
  return (
    <>
      <h1>{track.data?.name ?? "Track"}</h1>
      {track.isPending ? <Loading label="Loading track" /> : null}
      {track.isError ? (
        <>
          <ErrorState error={track.error} onRetry={() => void track.refetch()} />
          <p>
            <Link to="/">Back to all tracks</Link>
          </p>
        </>
      ) : null}
      {track.data ? (
        <>
          <p>{track.data.certificationName}</p>
          <p className="muted">
            {track.data.provider} · {track.data.examVersion.label} ({track.data.examVersion.examCode}) ·
            Java {track.data.examVersion.javaRelease}
          </p>
          <p>
            <a href={track.data.examVersion.objectivesUrl} target="_blank" rel="noopener noreferrer">
              Official exam objectives (opens in a new tab)
            </a>
          </p>
          <h2>Topics</h2>
          <TopicList topics={track.data.topics} />
          <p>
            <Link to="/">All tracks</Link>
          </p>
        </>
      ) : null}
    </>
  );
}

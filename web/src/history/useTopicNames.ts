import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { Topic } from "../api/types";

function collect(topics: Topic[], into: Map<string, string>) {
  for (const topic of topics) {
    into.set(topic.id, topic.name);
    collect(topic.subtopics, into);
  }
}

/** Topic names by id, from the catalog the learner already browses (shared query cache). */
export function useTopicNames(): Map<string, string> {
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });
  const names = new Map<string, string>();
  for (const track of tracks.data ?? []) {
    collect(track.topics, names);
  }
  return names;
}


/** Track names by id, from the same cached catalog request used for topic labels. */
export function useTrackNames(): Map<string, string> {
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });
  return new Map((tracks.data ?? []).map((track) => [track.id, track.name]));
}

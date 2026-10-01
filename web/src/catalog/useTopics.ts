import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { Topic } from "../api/types";

export interface FlatTopic {
  id: string;
  name: string;
  /** How deep the topic sits below its track, for indenting in a list. */
  depth: number;
}

function flatten(topics: Topic[], depth: number, into: FlatTopic[]) {
  for (const topic of topics) {
    into.push({ id: topic.id, name: topic.name, depth });
    flatten(topic.subtopics, depth + 1, into);
  }
}

/** Every topic of every track, in catalog order, from the catalog the app already loads. */
export function useTopics(): { topics: FlatTopic[]; isPending: boolean } {
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });
  const topics: FlatTopic[] = [];
  for (const track of tracks.data ?? []) {
    flatten(track.topics, 0, topics);
  }
  return { topics, isPending: tracks.isPending };
}

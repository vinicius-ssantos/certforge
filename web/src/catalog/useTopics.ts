import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";

export interface FlatTopic {
  id: string;
  name: string;
  /** How deep the topic sits below its track, for indenting in a list. */
  depth: number;
}

export interface TopicGroup {
  trackId: string;
  trackName: string;
  kind: "CERTIFICATION" | "INTERVIEW";
  topics: FlatTopic[];
}

/**
 * Every topic a question may be written for, grouped by the track that owns it.
 *
 * <p>Read from the editorial endpoint, not from `/api/catalog/tracks`. That one serves what a
 * learner may study: an active track with an active version. It worked while there was exactly one
 * permanently active track, and stopped the moment a draft track existed — its topics were
 * invisible to the only people who could write content for it. An editor is not a learner.
 *
 * <p>Grouped rather than flat because the same subject exists on a certification track and an
 * interview track as two separate topics on purpose (ADR 0014), and an author choosing between
 * them needs to see which is which.
 */
export function useTopics(): { groups: TopicGroup[]; isPending: boolean } {
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["editorial", "topics"],
    queryFn: () => unwrap(api.GET("/api/editorial/catalog/topics")),
  });

  const groups: TopicGroup[] = (tracks.data ?? []).map((track) => ({
    trackId: track.id,
    trackName: track.name,
    kind: track.kind === "INTERVIEW" ? "INTERVIEW" : "CERTIFICATION",
    topics: track.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      depth: topic.depth,
    })),
  }));

  return { groups, isPending: tracks.isPending };
}

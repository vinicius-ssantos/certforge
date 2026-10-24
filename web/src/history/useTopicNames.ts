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

/**
 * Topic names by id, from every catalog a learner may have studied from (shared query cache).
 *
 * Merges certification and general tracks (#176): history and progress are keyed by topic id
 * alone, with no idea which kind of track it came from, so a past session on a general-knowledge
 * topic needs this to resolve a real name instead of falling back to "Unknown topic" the way an
 * id this map has never heard of still does.
 */
export function useTopicNames(): Map<string, string> {
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });
  const generalTracks = useQuery({
    queryKey: ["general-tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/general-tracks")),
  });
  const names = new Map<string, string>();
  for (const track of tracks.data ?? []) {
    collect(track.topics, names);
  }
  for (const track of generalTracks.data ?? []) {
    collect(track.topics, names);
  }
  return names;
}

/** Track names by id, from the same cached catalog requests used for topic labels. */
export function useTrackNames(): Map<string, string> {
  const api = useApi();
  const tracks = useQuery({
    queryKey: ["tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/tracks")),
  });
  const generalTracks = useQuery({
    queryKey: ["general-tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/general-tracks")),
  });
  return new Map([
    ...(tracks.data ?? []).map((track): [string, string] => [track.id, track.name]),
    ...(generalTracks.data ?? []).map((track): [string, string] => [track.id, track.name]),
  ]);
}

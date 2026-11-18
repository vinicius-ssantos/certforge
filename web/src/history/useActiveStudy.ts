import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useTopicNames, useTrackNames } from "./useTopicNames";
import { useText } from "../i18n/useText";

export function useActiveStudy() {
  const api = useApi();
  const t = useText();
  const topicNames = useTopicNames();
  const trackNames = useTrackNames();
  const query = { status: "IN_PROGRESS", size: 20 };
  const sessions = useQuery({
    queryKey: ["history", "active", "sessions"],
    queryFn: () => unwrap(api.GET("/api/study/history/sessions", { params: { query } })),
  });
  const mocks = useQuery({
    queryKey: ["history", "active", "mock-exams"],
    queryFn: () => unwrap(api.GET("/api/study/history/mock-exams", { params: { query } })),
  });
  const activities = [
    ...(mocks.data?.items ?? []).filter((item) => item.status === "IN_PROGRESS").map((item) => ({
      id: item.id,
      href: `/mock-exams/${item.id}`,
      name: trackNames.get(item.trackId) ?? t.history.fallbackTrack,
      kind: t.history.mockHeading,
      answered: t.history.answeredOf(item.answeredCount, item.questionCount),
    })),
    ...(sessions.data?.items ?? []).filter((item) => item.status === "IN_PROGRESS").map((item) => ({
      id: item.id,
      href: `/sessions/${item.id}`,
      name: topicNames.get(item.topicId) ?? t.history.fallbackTopic,
      kind: t.history.practiceHeading,
      answered: t.history.answeredOf(item.answeredCount, item.requestedCount),
    })),
  ];
  return { activities, loading: sessions.isPending || mocks.isPending };
}

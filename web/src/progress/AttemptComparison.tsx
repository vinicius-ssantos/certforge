import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { formatDateTime } from "../history/format";
import { useLocale, useText } from "../i18n/useText";
import { ErrorState, Loading } from "../ui/States";
import { ScrollableTable } from "../ui/ScrollableTable";

export function AttemptComparison({ topicIds }: { topicIds: Set<string> | null }) {
  const t = useText();
  const { locale } = useLocale();
  const api = useApi();
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");
  const attempts = useInfiniteQuery({
    queryKey: ["history", "attempt-comparison"],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => unwrap(api.GET("/api/study/history/attempts", {
      params: { query: { size: 20, ...(pageParam ? { cursor: pageParam } : {}) } },
    })),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
  const day = new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit" });
  const filtered = (attempts.data?.pages.flatMap((page) => page.items) ?? []).filter((row) => {
    if (topicIds && !topicIds.has(row.topicId)) return false;
    const date = day.format(new Date(row.submittedAt));
    return (!from || date >= from) && (!until || date <= until);
  });
  const byRevision = new Map<string, typeof filtered>();
  for (const row of filtered) {
    const id = row.question.revisionId;
    const matches = byRevision.get(id);
    if (matches) matches.push(row);
    else byRevision.set(id, [row]);
  }
  const comparisons = [...byRevision.values()].filter((rows) => rows.length > 1);
  const correct = filtered.filter((row) => row.correct).length;

  return (
    <>
      <p className="hint">{t.progress.comparisonScope}</p>
      <div className="study-filters">
        <label>{t.progress.fromDate}<input type="date" value={from} max={until || undefined}
          onChange={(event) => setFrom(event.target.value)} /></label>
        <label>{t.progress.untilDate}<input type="date" value={until} min={from || undefined}
          onChange={(event) => setUntil(event.target.value)} /></label>
      </div>
      {attempts.isPending ? <Loading /> : null}
      {attempts.isError ? <ErrorState error={attempts.error} onRetry={() => void attempts.refetch()} /> : null}
      {attempts.data ? <p>{t.progress.loadedAccuracy(correct, filtered.length)}</p> : null}
      {attempts.data && comparisons.length === 0 ? <p>{t.progress.noComparison}</p> : null}
      {comparisons.length > 0 ? <ul className="stacked-cards">
        {comparisons.map((rows) => {
          const [latest, previous] = rows;
          if (!latest || !previous) return null;
          return (
            <li key={latest.question.revisionId} className="panel">
              <p lang="en">{latest.question.prompt.split("\n").find((line) => line.trim())?.slice(0, 160)}</p>
              <ScrollableTable label={t.progress.compareAttempts}>
                <thead><tr><th scope="col">{t.history.started}</th><th scope="col">{t.progress.answer}</th>
                  <th scope="col">{t.progress.confidence}</th><th scope="col">{t.progress.situation}</th></tr></thead>
                <tbody>{[previous, latest].map((row) => <tr key={row.id}>
                  <th scope="row"><time dateTime={row.submittedAt}>{formatDateTime(row.submittedAt, locale)}</time></th>
                  <td>{row.selectedOptions.join(", ")}</td>
                  <td>{t.sessionReview.confidenceName(row.confidence)}</td>
                  <td>{row.correct ? t.progress.correct : t.progress.incorrect}</td>
                </tr>)}</tbody>
              </ScrollableTable>
            </li>
          );
        })}
      </ul> : null}
      {attempts.hasNextPage ? <button type="button" className="secondary" disabled={attempts.isFetchingNextPage}
        onClick={() => void attempts.fetchNextPage()}>
        {attempts.isFetchingNextPage ? t.history.loadingMore : t.progress.loadAttempts}
      </button> : null}
    </>
  );
}

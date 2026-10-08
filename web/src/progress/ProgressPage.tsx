import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { Misconception } from "../api/types";
import { formatDateTime } from "../history/format";
import { useLocale, useText } from "../i18n/useText";
import { ScrollableTable } from "../ui/ScrollableTable";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

function percent(accuracy: number | null, noValue: string): string {
  return accuracy === null ? noValue : `${Math.round(accuracy * 100)}%`;
}

/**
 * Progress per topic, derived from the answers given. It is evidence of what was attempted and how
 * it went, not a grade, so the page says "attempted", "correct" and "incorrect" and nothing more.
 */
/**
 * Where the learner has been wrong while saying they were confident. Attempts and distinct
 * questions are both shown because they mean different things: three wrong answers to one question
 * is one idea stuck, and three to three questions is a weak area.
 */
function Misconceptions({ rows }: { rows: Misconception[] }) {
  const t = useText();
  const { locale } = useLocale();
  if (rows.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="misconceptions">
      <h2 id="misconceptions">{t.progress.misconceptionsHeading}</h2>
      <p>
        {t.progress.misconceptionsBodyStart}
        <strong>{t.progress.misconceptionsBodyNot}</strong>
        {t.progress.misconceptionsBodyEnd}
      </p>
      <ScrollableTable label={t.progress.misconceptionsCaption}>
        <caption className="visually-hidden">{t.progress.misconceptionsCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.progress.topic}</th>
            <th scope="col">{t.progress.wrongWhileSure}</th>
            <th scope="col">{t.progress.acrossQuestions}</th>
            <th scope="col">{t.progress.mostRecent}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.topicId}>
              <th scope="row">{row.topicName ?? t.progress.fallbackTopic}</th>
              <td className="numeric">{row.attempts}</td>
              <td className="numeric">{row.questions}</td>
              <td>
                <time dateTime={row.lastAt}>{formatDateTime(row.lastAt, locale)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
      <p>
        <Link to="/review">{t.progress.reviewThese}</Link>
      </p>
    </section>
  );
}

export function ProgressPage() {
  const t = useText();
  const { locale } = useLocale();
  useDocumentTitle(t.progress.title);
  const api = useApi();
  const progress = useQuery({
    queryKey: ["progress", "topics"],
    queryFn: () => unwrap(api.GET("/api/progress/topics")),
  });
  const misconceptions = useQuery({
    queryKey: ["review", "misconceptions"],
    queryFn: () => unwrap(api.GET("/api/review/misconceptions")),
  });

  return (
    <>
      <h1>{t.progress.title}</h1>
      {progress.isPending ? <Loading label={t.progress.loading} /> : null}
      {progress.isError ? (
        <ErrorState error={progress.error} onRetry={() => void progress.refetch()} />
      ) : null}
      {progress.data && progress.data.length === 0 ? (
        <EmptyState title={t.progress.emptyTitle}>
          <p>
            {t.progress.emptyBody}
            <Link to="/">{t.progress.tracksPageLink}</Link>.
          </p>
        </EmptyState>
      ) : null}
      {progress.data && progress.data.length > 0 ? (
        <ScrollableTable label={t.progress.tableCaption}>
          <caption className="visually-hidden">{t.progress.tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.progress.topic}</th>
              <th scope="col">{t.progress.attempted}</th>
              <th scope="col">{t.progress.correct}</th>
              <th scope="col">{t.progress.incorrect}</th>
              <th scope="col">{t.progress.accuracy}</th>
              <th scope="col">{t.progress.lastActivity}</th>
            </tr>
          </thead>
          <tbody>
            {progress.data.map((topic) => (
              <tr key={topic.topicId}>
                <th scope="row">
                  {topic.trackSlug ? (
                    <Link to={`/tracks/${topic.trackSlug}`}>
                      {topic.topicName ?? t.progress.fallbackTopic}
                    </Link>
                  ) : (
                    (topic.topicName ?? t.progress.fallbackTopic)
                  )}
                </th>
                <td className="numeric">{topic.attempted}</td>
                <td className="numeric">{topic.correct}</td>
                <td className="numeric">{topic.incorrect}</td>
                <td className="numeric">{percent(topic.accuracy, t.progress.noValue)}</td>
                <td>
                  {topic.lastActivityAt ? (
                    <time dateTime={topic.lastActivityAt}>
                      {formatDateTime(topic.lastActivityAt, locale)}
                    </time>
                  ) : (
                    t.progress.noValue
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      ) : null}
      {misconceptions.data ? <Misconceptions rows={misconceptions.data} /> : null}
    </>
  );
}

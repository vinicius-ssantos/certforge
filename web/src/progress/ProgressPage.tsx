import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { CertificationProgress, Misconception } from "../api/types";
import { formatDateTime } from "../history/format";
import { useLocale, useText } from "../i18n/useText";
import { ScrollableTable } from "../ui/ScrollableTable";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { PRACTICE_TARGET_PERCENT, meetsTarget } from "./target";

function percent(accuracy: number | null, noValue: string): string {
  return accuracy === null ? noValue : `${Math.round(accuracy * 100)}%`;
}

/**
 * One row per active certification track, aggregated from the same topic counts as the table
 * below. It is coverage of what has been practised and how accurate it was, not a prediction of
 * exam readiness -- the page's own contract against a readiness field applies here too (#176).
 */
function Certifications({ rows }: { rows: CertificationProgress[] }) {
  const t = useText();
  if (rows.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="certifications-heading">
      <h2 id="certifications-heading">{t.progress.certificationsHeading}</h2>
      <ScrollableTable label={t.progress.certificationsCaption}>
        <caption className="visually-hidden">{t.progress.certificationsCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.progress.certificationName}</th>
            <th scope="col">{t.progress.topic}</th>
            <th scope="col">{t.progress.accuracy}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.trackSlug}>
              <th scope="row">
                <Link to={`/tracks/${row.trackSlug}`}>
                  {row.trackName ?? t.progress.fallbackCertificationName}
                </Link>
              </th>
              <td>
                <span className="bar-cell">
                  <span className="mini" aria-hidden="true">
                    <i style={{ width: `${(row.topicsAttempted / row.topicsTotal) * 100}%` }} />
                  </span>
                  {t.progress.topicsPracticed(row.topicsAttempted, row.topicsTotal)}
                </span>
              </td>
              <td>
                {row.accuracy === null ? (
                  <span className="pill pill-new">{t.progress.notStarted}</span>
                ) : (
                  <span className="bar-cell">
                    <span className="mini" aria-hidden="true">
                      <i
                        className={meetsTarget(row.accuracy) ? undefined : "low"}
                        style={{ width: `${Math.round(row.accuracy * 100)}%` }}
                      />
                    </span>
                    {percent(row.accuracy, t.progress.noValue)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
      <p className="hint">{t.progress.certificationsNote}</p>
    </section>
  );
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
  const certifications = useQuery({
    queryKey: ["progress", "certifications"],
    queryFn: () => unwrap(api.GET("/api/progress/certifications")),
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
              <th scope="col">{t.progress.situation}</th>
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
                <td>
                  {topic.accuracy === null ? (
                    <span className="pill pill-new">{t.progress.notStarted}</span>
                  ) : (
                    <span className="bar-cell">
                      {/* The bar restates the number it sits beside; comparing nine rows of
                          percentages is work a shape does better than digits. */}
                      <span className="mini" aria-hidden="true">
                        <i
                          className={meetsTarget(topic.accuracy) ? undefined : "low"}
                          style={{ width: `${Math.round(topic.accuracy * 100)}%` }}
                        />
                      </span>
                      {percent(topic.accuracy, t.progress.noValue)}
                    </span>
                  )}
                </td>
                <td>
                  {topic.accuracy === null ? (
                    t.progress.noValue
                  ) : meetsTarget(topic.accuracy) ? (
                    <span className="pill pill-ok">{t.progress.solid}</span>
                  ) : (
                    <span className="pill pill-hold">{t.progress.needsReview}</span>
                  )}
                </td>
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
      {progress.data && progress.data.length > 0 ? (
        <p className="hint">{t.progress.targetNote(PRACTICE_TARGET_PERCENT)}</p>
      ) : null}
      {/* Same "secondary request says so rather than vanishing" contract as misconceptions below. */}
      {certifications.isPending ? <Loading /> : null}
      {certifications.isError ? (
        <ErrorState error={certifications.error} onRetry={() => void certifications.refetch()} />
      ) : null}
      {certifications.data ? <Certifications rows={certifications.data} /> : null}
      {/*
       * A section that renders nothing when there is nothing to show cannot also render
       * nothing when it failed to load: a learner with real confidently-wrong answers would
       * read a clean progress page as "nothing to worry about", and the way to practise them
       * would simply be absent. The request is secondary, so it says so where it sits rather
       * than taking over the page.
       */}
      {misconceptions.isPending ? <Loading /> : null}
      {misconceptions.isError ? (
        <ErrorState error={misconceptions.error} onRetry={() => void misconceptions.refetch()} />
      ) : null}
      {misconceptions.data ? <Misconceptions rows={misconceptions.data} /> : null}
    </>
  );
}

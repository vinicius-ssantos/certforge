import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { MockExamQuestionResult } from "../api/types";
import type { Catalog } from "../i18n/en";
import { useText } from "../i18n/useText";
import { AnswerList } from "../ui/AnswerList";
import { Prompt } from "../ui/Prompt";
import { ScrollableTable } from "../ui/ScrollableTable";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useTopicNames } from "../history/useTopicNames";

function formatElapsed(totalSeconds: number, t: Catalog): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? t.mockResult.elapsedWithHours(hours, minutes, seconds)
    : t.mockResult.elapsedShort(minutes, seconds);
}

export function MockExamResultPage() {
  const t = useText();
  const { sessionId = "" } = useParams();
  const api = useApi();
  const topicNames = useTopicNames();
  useDocumentTitle(t.mockResult.title);
  const result = useQuery({
    queryKey: ["mock-exam-result", sessionId],
    queryFn: () =>
      unwrap(api.GET("/api/study/mock-exams/{sessionId}/result", { params: { path: { sessionId } } })),
  });

  // Written once and used in each branch. This page was already correct -- an h1 that is the first
  // child of the returned fragment in every branch is reconciled to the same DOM node, which
  // `heading-focus.test.tsx` proves -- so this is a guard, not a fix. It is here because the way
  // MockExamPage broke was by someone wrapping the loaded branch in a div, and the invariant is
  // easy to lose by accident when it is only implied by three separate copies of the same element.
  const heading = <h1>{t.mockResult.title}</h1>;

  if (result.isPending) return <>{heading}<Loading label={t.mockResult.loading} /></>;
  if (result.isError) return <>{heading}<ErrorState error={result.error} onRetry={() => void result.refetch()} /></>;

  const data = result.data;
  return (
    <>
      {heading}
      <section className="mock-score" aria-labelledby="score-heading">
        <h2 id="score-heading">{data.passed ? t.mockResult.reached : t.mockResult.notReached}</h2>
        <p className="mock-score-value">{t.mockResult.percentage(data.percentage)}</p>
        <p>{t.mockResult.correctOf(data.correct, data.total, data.answered)}</p>
        <p>{t.mockResult.target(data.passingPercentage, data.passingCorrectCount)}</p>
        <p>{t.mockResult.elapsed(formatElapsed(data.elapsedSeconds, t))}</p>
        <p className="muted">{t.mockResult.caveat}</p>
      </section>

      <h2>{t.mockResult.breakdown}</h2>
      <ScrollableTable label={t.mockResult.breakdown}>
        <thead>
          <tr>
            <th>{t.mockResult.topic}</th>
            <th>{t.mockResult.correct}</th>
            <th>{t.mockResult.answered}</th>
            <th>{t.mockResult.score}</th>
          </tr>
        </thead>
        <tbody>
          {data.topics.map((topic) => (
            <tr key={topic.topicId}>
              <th scope="row">{topicNames.get(topic.topicId) ?? t.mockResult.fallbackTopic}</th>
              <td>{t.mockResult.outOf(topic.correct, topic.total)}</td>
              <td>{t.mockResult.outOf(topic.answered, topic.total)}</td>
              <td>{t.mockResult.percentage(topic.percentage)}</td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <h2>{t.mockResult.questionReview}</h2>
      <ol className="review">
        {[...data.questions].sort((a, b) => a.position - b.position).map((question) => (
          <li key={question.position}>
            <QuestionReview item={question} />
          </li>
        ))}
      </ol>
      <p><Link to="/">{t.mockResult.backToTracks}</Link></p>
    </>
  );
}

function QuestionReview({ item }: { item: MockExamQuestionResult }) {
  const t = useText();
  const selected = new Set(item.selectedOptions);
  return (
    <details>
      <summary>
        {t.mockResult.questionSummary(item.position + 1, item.correct, item.answered)}
      </summary>
      <Prompt text={item.question.prompt} />
      <AnswerList options={item.answer.options} chosen={selected} />
      <h3>{t.feedback.explanation}</h3>
      <Prompt text={item.answer.explanation} />
      {item.answer.references.length > 0 ? (
        <>
          <h3>{t.feedback.readMore}</h3>
          <ul>
            {item.answer.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer" lang="en">{reference.title}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </details>
  );
}

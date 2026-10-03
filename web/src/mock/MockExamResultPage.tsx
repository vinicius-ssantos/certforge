import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { MockExamQuestionResult } from "../api/types";
import { Prompt } from "../ui/Prompt";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useTopicNames } from "../history/useTopicNames";

export function MockExamResultPage() {
  const { sessionId = "" } = useParams();
  const api = useApi();
  const topicNames = useTopicNames();
  useDocumentTitle("Mock exam result");
  const result = useQuery({
    queryKey: ["mock-exam-result", sessionId],
    queryFn: () =>
      unwrap(api.GET("/api/study/mock-exams/{sessionId}/result", { params: { path: { sessionId } } })),
  });

  if (result.isPending) return <><h1>Mock exam result</h1><Loading label="Loading result" /></>;
  if (result.isError) return <><h1>Mock exam result</h1><ErrorState error={result.error} onRetry={() => void result.refetch()} /></>;

  const data = result.data;
  return (
    <>
      <h1>Mock exam result</h1>
      <section className="mock-score" aria-labelledby="score-heading">
        <h2 id="score-heading">{data.passed ? "Practice target reached" : "Practice target not reached"}</h2>
        <p className="mock-score-value">{data.percentage}%</p>
        <p>{data.correct} correct of {data.total} questions; {data.answered} answered.</p>
        <p>Practice target: {data.passingPercentage}% ({data.passingCorrectCount} correct).</p>
        <p className="muted">This score describes this CertForge practice run; it is not a forecast of the real exam.</p>
      </section>

      <h2>Topic breakdown</h2>
      <table>
        <thead><tr><th>Topic</th><th>Correct</th><th>Answered</th><th>Score</th></tr></thead>
        <tbody>
          {data.topics.map((topic) => (
            <tr key={topic.topicId}>
              <th scope="row">{topicNames.get(topic.topicId) ?? "Topic"}</th>
              <td>{topic.correct} / {topic.total}</td>
              <td>{topic.answered} / {topic.total}</td>
              <td>{topic.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Question review</h2>
      <ol className="review">
        {[...data.questions].sort((a, b) => a.position - b.position).map((question) => (
          <li key={question.position}>
            <QuestionReview item={question} />
          </li>
        ))}
      </ol>
      <p><Link to="/">Back to tracks</Link></p>
    </>
  );
}

function QuestionReview({ item }: { item: MockExamQuestionResult }) {
  const selected = new Set(item.selectedOptions);
  const correct = new Set(item.answer.correctOptions);
  return (
    <details>
      <summary>
        Question {item.position + 1}: {item.correct ? "Correct" : item.answered ? "Incorrect" : "Unanswered"}
      </summary>
      <Prompt text={item.question.prompt} />
      <ul className="answers">
        {item.answer.options.map((option) => (
          <li key={option.key} className={option.correct ? "answer-correct" : undefined}>
            <p><strong>{option.key}. {option.text}</strong></p>
            <p className="muted">
              {selected.has(option.key) ? "Your answer. " : ""}
              {correct.has(option.key) ? "Correct answer." : "Incorrect answer."}
            </p>
            {option.explanation ? <p>{option.explanation}</p> : null}
          </li>
        ))}
      </ul>
      <h3>Explanation</h3>
      <Prompt text={item.answer.explanation} />
      {item.answer.references.length > 0 ? (
        <>
          <h3>Read more</h3>
          <ul>
            {item.answer.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </details>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { MockExamQuestionResult } from "../api/types";
import type { Catalog } from "../i18n/en";
import { useText } from "../i18n/useText";
import { meetsTarget } from "../progress/target";
import { AnswerList } from "../ui/AnswerList";
import { VerificationEvidence } from "../ui/VerificationEvidence";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const practice = useMutation({
    mutationFn: (topicId: string) => unwrap(api.POST("/api/study/sessions", { body: { topicId } })),
    onSuccess: (session) => {
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      navigate(`/sessions/${session.id}`);
    },
    onError: (error) => {
      const existing = error instanceof ApiError && error.code === "active_session_exists"
        ? error.details["sessionId"] : undefined;
      if (typeof existing === "string") navigate(`/sessions/${existing}`, { state: { resumed: true } });
    },
  });
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
  const ordered = [...data.questions].sort((a, b) => a.position - b.position);
  const incorrect = ordered.filter((question) => question.answered && !question.correct);
  const unanswered = ordered.filter((question) => !question.answered);
  const questions = filter === "incorrect" ? incorrect : filter === "unanswered" ? unanswered : ordered;
  return (
    <>
      {heading}
      <section className="mock-score" aria-labelledby="score-heading">
        <div className="score-summary">
          <div>
            <p className="section-label">{t.mockResult.scoreLabel}</p>
            <p className="mock-score-value">{t.mockResult.percentage(data.percentage)}</p>
            <p className="muted">{t.mockResult.correctOf(data.correct, data.total, data.answered)}</p>
            <p className="muted">{t.mockResult.elapsed(formatElapsed(data.elapsedSeconds, t))}</p>
          </div>
          {/*
           * The verdict is the heading, not a label beside one: it is what a screen reader should
           * announce for this region, and it is the sentence the learner came for. It wears the
           * pill rather than being repeated by one, so the fact is stated once.
           */}
          <h2 id="score-heading" className={`pill ${data.passed ? "pill-ok" : "pill-hold"}`}>
            {data.passed ? t.mockResult.reached : t.mockResult.notReached}
          </h2>
        </div>
        <p className="muted">{t.mockResult.target(data.passingPercentage, data.passingCorrectCount)}</p>
        <p className="muted">{t.mockResult.caveat}</p>
        <a className="button secondary" href="#result-topics">{t.mockResult.breakdown}</a>
      </section>

      <h2 id="result-topics" tabIndex={-1}>{t.mockResult.breakdown}</h2>
      {practice.isError ? <ErrorState error={practice.error} /> : null}
      <ScrollableTable className="decision-table" role="table" label={t.mockResult.breakdown}>
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col">{t.mockResult.topic}</th>
            <th role="columnheader" scope="col">{t.mockResult.correct}</th>
            <th role="columnheader" scope="col">{t.mockResult.answered}</th>
            <th role="columnheader" scope="col">{t.mockResult.score}</th>
            <th role="columnheader" scope="col">{t.progress.situation}</th>
            <th role="columnheader" scope="col">{t.track.practice}</th>
          </tr>
        </thead>
        <tbody>
          {data.topics.map((topic) => (
            <tr role="row" key={topic.topicId}>
              <th role="rowheader" scope="row">{topicNames.get(topic.topicId) ?? t.mockResult.fallbackTopic}</th>
              <td data-label={t.mockResult.correct}>{t.mockResult.outOf(topic.correct, topic.total)}</td>
              <td data-label={t.mockResult.answered}>{t.mockResult.outOf(topic.answered, topic.total)}</td>
              <td data-label={t.mockResult.score}>
                <span className="bar-cell">
                  <span className="mini" aria-hidden="true">
                    <i
                      className={meetsTarget(topic.percentage / 100) ? undefined : "low"}
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </span>
                  {t.mockResult.percentage(topic.percentage)}
                </span>
              </td>
              <td data-label={t.progress.situation}>
                {meetsTarget(topic.percentage / 100) ? (
                  <span className="pill pill-ok">{t.progress.solid}</span>
                ) : (
                  <span className="pill pill-hold">{t.progress.needsReview}</span>
                )}
              </td>
              <td data-label={t.track.practice}><button type="button" className="secondary" disabled={practice.isPending}
                aria-label={t.track.practiceTopic(topicNames.get(topic.topicId) ?? t.mockResult.fallbackTopic)}
                onClick={() => practice.mutate(topic.topicId)}>{t.track.practice}</button></td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <h2>{t.mockResult.questionReview}</h2>
      <label className="compact-filter">
        {t.mockResult.filterLabel}
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">{t.mockResult.filterAll(ordered.length)}</option>
          <option value="incorrect">{t.mockResult.filterIncorrect(incorrect.length)}</option>
          <option value="unanswered">{t.mockResult.filterUnanswered(unanswered.length)}</option>
        </select>
      </label>
      {questions.length === 0 ? <p role="status">{t.mockResult.filterEmpty}</p> : null}
      <ol className="review">
        {questions.map((question) => (
          <li key={question.position}>
            <QuestionReview item={question} />
          </li>
        ))}
      </ol>
      {data.total > data.answered ? (
        <p className="hint">{t.mockResult.unanswered(data.total - data.answered)}</p>
      ) : null}
      <p className="back"><Link to="/">{t.mockResult.backToTracks}</Link></p>
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
      <VerificationEvidence verification={item.answer.verification} />
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

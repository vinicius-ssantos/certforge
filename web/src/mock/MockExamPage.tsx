import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { MockExam, Question } from "../api/types";
import { useText } from "../i18n/useText";
import { Confirm } from "../ui/Confirm";
import { ErrorSummary } from "../ui/Form";
import { Prompt } from "../ui/Prompt";
import { ErrorState, Loading } from "../ui/States";
import { errorMessage } from "../ui/messages";
import { useDocumentTitle } from "../ui/useDocumentTitle";

const CHANGED = new Set(["mock_exam_expired", "mock_exam_not_in_progress", "already_answered"]);

function examKey(sessionId: string) {
  return ["mock-exam", sessionId] as const;
}

function formatRemaining(expiresAt: string, now: number) {
  const seconds = Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function flagKey(sessionId: string) {
  return `certforge.mock.flags.${sessionId}`;
}

function loadFlags(sessionId: string): number[] {
  try {
    const value = JSON.parse(localStorage.getItem(flagKey(sessionId)) ?? "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is number => Number.isInteger(item)) : [];
  } catch {
    return [];
  }
}

export function MockExamPage() {
  const t = useText();
  const { sessionId = "" } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resumed = (useLocation().state as { resumed?: boolean } | null)?.resumed === true;
  useDocumentTitle(t.mock.title);

  const exam = useQuery({
    queryKey: examKey(sessionId),
    queryFn: () =>
      unwrap(api.GET("/api/study/mock-exams/{sessionId}", { params: { path: { sessionId } } })),
  });
  const [position, setPosition] = useState(0);
  const [flags, setFlags] = useState<number[]>(() => loadFlags(sessionId));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(flagKey(sessionId), JSON.stringify(flags));
  }, [flags, sessionId]);

  useEffect(() => {
    if (
      exam.data?.status === "IN_PROGRESS"
      && Date.parse(exam.data.expiresAt) <= now
      && !exam.isFetching
    ) {
      void exam.refetch();
    }
  }, [exam.data?.expiresAt, exam.data?.status, exam.isFetching, exam.refetch, now]);

  useEffect(() => {
    if (exam.data && exam.data.status !== "IN_PROGRESS") {
      localStorage.removeItem(flagKey(sessionId));
    }
  }, [exam.data, sessionId]);

  const respond = useMutation({
    mutationFn: ({ at, selected, key }: { at: number; selected: string[]; key: string }) =>
      unwrap(
        api.POST("/api/study/mock-exams/{sessionId}/questions/{position}/response", {
          params: { path: { sessionId, position: at }, header: { "Idempotency-Key": key } },
          body: { selectedOptions: selected },
        }),
      ),
    onSuccess: (_receipt, variables) => {
      const current = queryClient.getQueryData<MockExam>(examKey(sessionId));
      if (!current) return;
      const updated = {
        ...current,
        answeredCount: current.questions.some((q) => q.position === variables.at && q.answered)
          ? current.answeredCount
          : current.answeredCount + 1,
        questions: current.questions.map((q) =>
          q.position === variables.at ? { ...q, answered: true } : q,
        ),
      };
      queryClient.setQueryData(examKey(sessionId), updated);
      const next = updated.questions.find((q) => !q.answered && q.position > variables.at)
        ?? updated.questions.find((q) => !q.answered);
      if (next) setPosition(next.position);
    },
    onError: (error) => {
      if (error instanceof ApiError && CHANGED.has(error.code)) {
        void queryClient.invalidateQueries({ queryKey: examKey(sessionId) });
      }
    },
  });

  const finish = useMutation({
    mutationFn: () =>
      unwrap(api.POST("/api/study/mock-exams/{sessionId}/finish", { params: { path: { sessionId } } })),
    onSuccess: () => {
      localStorage.removeItem(flagKey(sessionId));
      navigate(`/mock-exams/${sessionId}/result`);
    },
    onError: (error) => {
      if (error instanceof ApiError && CHANGED.has(error.code)) {
        void queryClient.invalidateQueries({ queryKey: examKey(sessionId) });
      }
    },
  });

  if (exam.isPending) {
    return <><h1>{t.mock.title}</h1><Loading label={t.mock.loading} /></>;
  }
  if (exam.isError) {
    return <><h1>{t.mock.title}</h1><ErrorState error={exam.error} onRetry={() => void exam.refetch()} /></>;
  }
  if (exam.data.status !== "IN_PROGRESS") {
    return (
      <>
        <h1>{t.mock.title}</h1>
        <p>{t.mock.closed}</p>
        <p><Link to={`/mock-exams/${sessionId}/result`}>{t.mock.viewResult}</Link></p>
      </>
    );
  }

  const ordered = [...exam.data.questions].sort((a, b) => a.position - b.position);
  const current = ordered.find((entry) => entry.position === position) ?? ordered[0];
  if (!current) return <><h1>{t.mock.title}</h1><p>{t.mock.noQuestions}</p></>;

  const remaining = formatRemaining(exam.data.expiresAt, now);
  const flagged = flags.includes(current.position);
  return (
    <>
      <div className="mock-head">
        <div>
          <h1>{t.mock.title}</h1>
          {resumed ? (
            <p role="status">{t.mock.resumed}</p>
          ) : null}
          <p className="muted">
            {t.mock.answeredAndTarget(
              exam.data.answeredCount,
              exam.data.questionCount,
              exam.data.passingPercentage,
            )}
          </p>
        </div>
        <div className="mock-timer" role="timer" aria-label={t.mock.timeRemainingLabel(remaining)}>
          <span className="muted">{t.mock.timeRemaining}</span>
          <strong>{remaining}</strong>
        </div>
      </div>

      {respond.isError ? <ErrorState error={respond.error} /> : null}
      {finish.isError ? <ErrorState error={finish.error} /> : null}

      <div className="mock-layout">
        <aside aria-label={t.mock.navigationLabel}>
          <h2>{t.mock.questions}</h2>
          <ol className="mock-nav">
            {ordered.map((entry) => (
              <li key={entry.position}>
                <button
                  type="button"
                  className={[
                    "mock-nav-button",
                    entry.position === current.position ? "current" : "",
                    entry.answered ? "answered" : "",
                    flags.includes(entry.position) ? "flagged" : "",
                  ].filter(Boolean).join(" ")}
                  aria-current={entry.position === current.position ? "step" : undefined}
                  aria-label={t.mock.questionButtonLabel(
                    entry.position + 1,
                    entry.answered,
                    flags.includes(entry.position),
                  )}
                  onClick={() => setPosition(entry.position)}
                >
                  {entry.position + 1}
                </button>
              </li>
            ))}
          </ol>
          <p className="mock-legend muted">{t.mock.legend}</p>
        </aside>

        <section className="mock-question" aria-labelledby="mock-question-heading">
          <h2 id="mock-question-heading">{t.mock.questionHeading(current.position + 1, ordered.length)}</h2>
          <button
            type="button"
            className="secondary"
            onClick={() => setFlags((items) =>
              items.includes(current.position)
                ? items.filter((item) => item !== current.position)
                : [...items, current.position],
            )}
          >
            {flagged ? t.mock.removeFlag : t.mock.addFlag}
          </button>
          <MockQuestion
            key={current.position}
            question={current.question}
            answered={current.answered}
            submitting={respond.isPending}
            failure={respond.isError ? errorMessage(respond.error, t) : null}
            onSubmit={(selected, key) => respond.mutate({ at: current.position, selected, key })}
          />
          <div className="mock-question-actions">
            <button type="button" className="secondary" disabled={current.position === 0}
              onClick={() => setPosition(Math.max(0, current.position - 1))}>{t.mock.previous}</button>
            <button type="button" className="secondary" disabled={current.position === ordered.length - 1}
              onClick={() => setPosition(Math.min(ordered.length - 1, current.position + 1))}>{t.mock.next}</button>
          </div>
        </section>
      </div>

      <div className="session-actions">
        <Confirm
          title={t.mock.submitTitle}
          explain={t.mock.submitExplain(exam.data.questionCount - exam.data.answeredCount)}
          confirmLabel={t.mock.submitConfirm}
          cancelLabel={t.mock.submitCancel}
          busy={finish.isPending}
          onConfirm={() => finish.mutate()}
        >
          {t.mock.submitTrigger}
        </Confirm>
      </div>
    </>
  );
}

function MockQuestion({
  question,
  answered,
  submitting,
  failure,
  onSubmit,
}: {
  question: Question;
  answered: boolean;
  submitting: boolean;
  failure: string | null;
  onSubmit: (selected: string[], key: string) => void;
}) {
  const t = useText();
  const [selected, setSelected] = useState<string[]>([]);
  const [key] = useState(() => crypto.randomUUID());
  const [problem, setProblem] = useState<string | null>(null);
  const multiple = question.type === "MULTIPLE_CHOICE";
  const shownProblems = useMemo(
    () => [problem, failure].filter((value): value is string => Boolean(value)).map((message) => ({ message })),
    [problem, failure],
  );

  function toggle(option: string) {
    setSelected((current) =>
      multiple
        ? current.includes(option) ? current.filter((value) => value !== option) : [...current, option]
        : [option],
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (selected.length === 0) {
      setProblem(multiple ? t.question.chooseAtLeastOne : t.question.chooseOne);
      return;
    }
    setProblem(null);
    onSubmit(selected, key);
  }

  return (
    <>
      <ErrorSummary problems={shownProblems} />
      <Prompt text={question.prompt} />
      {answered ? (
        <p role="status" className="notice">{t.mock.answerSubmitted}</p>
      ) : (
        <form onSubmit={submit} noValidate>
          <fieldset>
            <legend>{multiple ? t.mock.chooseAllThatApply : t.mock.chooseOneAnswer}</legend>
            {question.options.map((option) => (
              <div key={option.key} className="choice">
                <input
                  id={`mock-${question.revisionId}-${option.key}`}
                  type={multiple ? "checkbox" : "radio"}
                  name="mock-answer"
                  checked={selected.includes(option.key)}
                  onChange={() => toggle(option.key)}
                />
                <label htmlFor={`mock-${question.revisionId}-${option.key}`}>
                  <span className="visually-hidden">{t.question.optionPrefix(option.key)}</span>{option.text}
                </label>
              </div>
            ))}
          </fieldset>
          <button type="submit" disabled={submitting}>{submitting ? t.mock.saving : t.mock.saveAnswer}</button>
        </form>
      )}
    </>
  );
}

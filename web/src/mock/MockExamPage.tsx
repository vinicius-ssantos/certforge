import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { MockExam, Question } from "../api/types";
import { English } from "../i18n/English";
import { useText } from "../i18n/useText";
import { optionLabel } from "../ui/optionLabel";
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

type Draft = { selected: string[]; key: string; revisionId: string };
type Drafts = Record<number, Draft>;

function draftKey(sessionId: string) {
  return `certforge.mock.drafts.${sessionId}`;
}

function loadDrafts(sessionId: string): Drafts {
  try {
    const raw = sessionStorage.getItem(draftKey(sessionId));
    const value: unknown = raw ? JSON.parse(raw) : {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([position, draft]) =>
      /^\d+$/.test(position) && draft && Array.isArray(draft.selected) &&
      draft.selected.every((option: unknown) => typeof option === "string") &&
      typeof draft.key === "string" && typeof draft.revisionId === "string"
    ));
  } catch {
    return {};
  }
}

export function MockExamPage() {
  const { sessionId = "" } = useParams();
  return <MockExamSession key={sessionId} sessionId={sessionId} />;
}

function MockExamSession({ sessionId }: { sessionId: string }) {
  const t = useText();
  const api = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resumed = (useLocation().state as { resumed?: boolean } | null)?.resumed === true;
  const [showResumeNotice, setShowResumeNotice] = useState(resumed);
  useEffect(() => {
    if (!showResumeNotice) return;
    const timer = window.setTimeout(() => setShowResumeNotice(false), 5000);
    return () => window.clearTimeout(timer);
  }, [showResumeNotice]);
  useDocumentTitle(t.mock.title);

  const exam = useQuery({
    queryKey: examKey(sessionId),
    queryFn: () =>
      unwrap(api.GET("/api/study/mock-exams/{sessionId}", { params: { path: { sessionId } } })),
  });
  const { data: examData, isFetching, isRefetchError, refetch } = exam;
  const [position, setPosition] = useState(0);
  const [flags, setFlags] = useState<number[]>(() => loadFlags(sessionId));
  const [now, setNow] = useState(() => Date.now());
  const [drafts, setDrafts] = useState(() => loadDrafts(sessionId));
  const [filter, setFilter] = useState("all");
  const [mapOpen, setMapOpen] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const canFocusQuestion = useRef(false);

  function goToQuestion(next: number) {
    setMapOpen(false);
    if (next === position) {
      questionHeading.current?.focus();
      return;
    }
    canFocusQuestion.current = true;
    setPosition(next);
  }

  useEffect(() => {
    if (canFocusQuestion.current) questionHeading.current?.focus();
  }, [position]);

  function discardDraft(at: number) {
    setDrafts((current) => {
      const remaining = { ...current };
      delete remaining[at];
      return remaining;
    });
  }

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!examData) return;
    try {
      if (examData.status === "IN_PROGRESS") {
        sessionStorage.setItem(draftKey(sessionId), JSON.stringify(drafts));
      } else {
        sessionStorage.removeItem(draftKey(sessionId));
      }
    } catch {
      // A blocked session store still leaves this visit's in-memory drafts usable.
    }
  }, [drafts, examData, sessionId]);

  useEffect(() => {
    if (!examData) return;
    try {
      if (examData.status === "IN_PROGRESS") {
        localStorage.setItem(flagKey(sessionId), JSON.stringify(flags));
      } else {
        localStorage.removeItem(flagKey(sessionId));
      }
    } catch {
      // Flags are optional when storage is unavailable.
    }
  }, [examData, flags, sessionId]);

  useEffect(() => {
    if (
      examData?.status === "IN_PROGRESS"
      && Date.parse(examData.expiresAt) <= now
      && !isFetching
      && !isRefetchError
    ) {
      void refetch();
    }
  }, [examData, isFetching, isRefetchError, refetch, now]);

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
      discardDraft(variables.at);
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      const next = updated.questions.find((q) => !q.answered && q.position > variables.at)
        ?? updated.questions.find((q) => !q.answered);
      if (next) goToQuestion(next.position);
      else questionHeading.current?.focus();
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
      try {
        sessionStorage.removeItem(draftKey(sessionId));
      } catch {
        // Storage is optional.
      }
      try {
        localStorage.removeItem(flagKey(sessionId));
      } catch {
        // Storage is optional.
      }
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      void queryClient.invalidateQueries({ queryKey: ["mock-exam-availability"] });
      void queryClient.invalidateQueries({ queryKey: examKey(sessionId) });
      navigate(`/mock-exams/${sessionId}/result`);
    },
    onError: (error) => {
      if (error instanceof ApiError && CHANGED.has(error.code)) {
        void queryClient.invalidateQueries({ queryKey: examKey(sessionId) });
      }
    },
  });

  // One return, so the heading is rendered once and stays the same DOM node through every state.
  // Layout moves focus to this h1 after a navigation, and a heading that is unmounted and remade
  // when the query settles takes that focus out of the document with it (#118). What varies is the
  // body below, and whether the head carries the live counters and the timer.
  const live = !exam.isPending && !exam.isError && exam.data.status === "IN_PROGRESS" ? exam.data : null;
  const ordered = live ? [...live.questions].sort((a, b) => a.position - b.position) : [];
  const current = ordered.find((entry) => entry.position === position) ?? ordered[0];
  const remaining = live ? formatRemaining(live.expiresAt, now) : null;
  const flagged = current ? flags.includes(current.position) : false;
  const currentIndex = current ? ordered.indexOf(current) : -1;
  const previous = ordered[currentIndex - 1];
  const following = ordered[currentIndex + 1];
  const savedDraft = current ? drafts[current.position] : undefined;
  const draft = savedDraft?.revisionId === current?.question.revisionId ? savedDraft : undefined;
  const pendingDrafts = ordered.filter((entry) => !entry.answered && drafts[entry.position]?.revisionId === entry.question.revisionId && (drafts[entry.position]?.selected.length ?? 0) > 0);
  const visible = ordered.filter((entry) => filter === "all" ||
    (filter === "pending" && !entry.answered) ||
    (filter === "marked" && flags.includes(entry.position)));

  let body;
  if (exam.isPending) {
    body = <Loading label={t.mock.loading} />;
  } else if (exam.isError) {
    body = <ErrorState error={exam.error} onRetry={() => void exam.refetch()} />;
  } else if (!live) {
    body = (
      <>
        <p>{t.mock.closed}</p>
        <p><Link to={`/mock-exams/${sessionId}/result`}>{t.mock.viewResult}</Link></p>
      </>
    );
  } else if (!current) {
    body = <p>{t.mock.noQuestions}</p>;
  } else {
    body = (
      <>
        {finish.isError ? <ErrorState error={finish.error} /> : null}

        <button type="button" className="secondary mock-map-toggle" aria-expanded={mapOpen} aria-controls="mock-map" onClick={() => setMapOpen((open) => !open)}>{t.ux.map} · {t.mock.questionHeading(current.position + 1, ordered.length)}</button>
        <div className="mock-layout">
          <aside id="mock-map" className={mapOpen ? "map-open" : "map-closed"} aria-label={t.mock.navigationLabel}>
            <h2>{t.mock.questions}</h2>
            <label className="mock-nav-filter">
              {t.mock.filterLabel}
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">{t.mock.filterAll}</option>
                <option value="pending">{t.mock.filterPending}</option>
                <option value="marked">{t.mock.filterMarked}</option>
              </select>
            </label>
            {visible.length === 0 ? <p role="status">{t.mock.noFilteredQuestions}</p> : null}
            <ol className="mock-nav">
              {visible.map((entry) => (
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
                    disabled={respond.isPending}
                    onClick={() => goToQuestion(entry.position)}
                  >
                    {entry.position + 1}
                  </button>
                </li>
              ))}
            </ol>
            <div className="mock-legend" aria-label={t.mock.legend}>
              <span className="mock-legend-item">
                <span className="mock-legend-marker answered" aria-hidden="true" />
                {t.mock.legendAnswered}
              </span>
              <span className="mock-legend-item">
                <span className="mock-legend-marker flagged" aria-hidden="true" />
                {t.mock.legendFlagged}
              </span>
              <span className="mock-legend-item">
                <span className="mock-legend-marker current" aria-hidden="true" />
                {t.mock.legendCurrent}
              </span>
            </div>
          </aside>

          <section className="mock-question" aria-labelledby="mock-question-heading">
            <h2 id="mock-question-heading" tabIndex={-1} ref={questionHeading}>{t.mock.questionHeading(current.position + 1, ordered.length)}</h2>
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
              submitting={respond.isPending || finish.isPending}
              selected={draft?.selected ?? []}
              onSelect={(selected) => {
                respond.reset();
                setDrafts((drafts) => ({
                  ...drafts,
                  [current.position]: { selected, key: crypto.randomUUID(), revisionId: current.question.revisionId },
                }));
              }}
              failure={respond.isError && respond.variables?.at === current.position
                ? errorMessage(respond.error, t) : null}
              onSubmit={() => {
                if (draft) respond.mutate({ at: current.position, selected: draft.selected, key: draft.key });
              }}
            />
            <div className="mock-question-actions">
              <button type="button" className="secondary" disabled={respond.isPending || !previous}
                onClick={() => previous && goToQuestion(previous.position)}>{t.mock.previous}</button>
              <button type="button" className="secondary" disabled={respond.isPending || !following}
                onClick={() => following && goToQuestion(following.position)}>{t.mock.next}</button>
            </div>
          </section>
        </div>

        <div className="session-actions">
          <Confirm
            title={t.mock.submitTitle}
            explain={`${t.mock.submitExplain(live.questionCount - live.answeredCount)} ${t.ux.pendingDrafts}: ${pendingDrafts.length}.`}
            recovery={pendingDrafts[0] ? { label: t.ux.returnDrafts, onClick: () => goToQuestion(pendingDrafts[0]!.position) } : undefined}
            confirmLabel={t.mock.submitConfirm}
            cancelLabel={t.mock.submitCancel}
            busy={finish.isPending || respond.isPending}
            onConfirm={() => finish.mutate()}
          >
            {t.mock.submitTrigger}
          </Confirm>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mock-head">
        <div>
          <h1>{t.mock.title}</h1>
          {showResumeNotice && live ? <p role="status">{t.mock.resumed}</p> : null}
          {live ? (
            <p className="muted">
              {t.mock.answeredAndTarget(
                live.answeredCount,
                live.questionCount,
                live.passingPercentage,
              )}
            </p>
          ) : null}
        </div>
        {live && remaining ? (
          <div className="mock-timer" role="timer" aria-label={t.mock.timeRemainingLabel(remaining)}>
            <span className="muted">{t.mock.timeRemaining}</span>
            <strong>{remaining}</strong>
          </div>
        ) : null}
      </div>
      {body}
    </>
  );
}

function MockQuestion({
  question,
  answered,
  submitting,
  failure,
  selected,
  onSelect,
  onSubmit,
}: {
  question: Question;
  answered: boolean;
  submitting: boolean;
  failure: string | null;
  selected: string[];
  onSelect: (selected: string[]) => void;
  onSubmit: () => void;
}) {
  const t = useText();
  const [problem, setProblem] = useState<string | null>(null);
  const multiple = question.type === "MULTIPLE_CHOICE";
  const shownProblems = [problem, failure]
    .filter((value): value is string => Boolean(value))
    .map((message) => ({ message }));

  function toggle(option: string) {
    setProblem(null);
    onSelect(multiple
      ? selected.includes(option) ? selected.filter((value) => value !== option) : [...selected, option]
      : [option]);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (selected.length === 0) {
      setProblem(multiple ? t.question.chooseAtLeastOne : t.question.chooseOne);
      return;
    }
    setProblem(null);
    onSubmit();
  }

  return (
    <>
      <ErrorSummary problems={shownProblems} />
      {question.aiReviewed ? <p className="hint ai-reviewed-notice">{t.question.aiReviewedNotice}</p> : null}
      <Prompt text={question.prompt} />
      {answered ? (
        <p role="status" className="notice">{t.mock.answerSubmitted}</p>
      ) : (
        <form onSubmit={submit} noValidate>
          <fieldset disabled={submitting}>
            <legend>{multiple ? t.mock.chooseAllThatApply : t.mock.chooseOneAnswer}</legend>
            {question.options.map((option, index) => (
              <div key={option.key} className="choice">
                <input
                  id={`mock-${question.revisionId}-${option.key}`}
                  type={multiple ? "checkbox" : "radio"}
                  name="mock-answer"
                  checked={selected.includes(option.key)}
                  onChange={() => toggle(option.key)}
                />
                <label htmlFor={`mock-${question.revisionId}-${option.key}`}>
                  <span className="visually-hidden">{t.question.optionPrefix(optionLabel(index))}</span><English>{option.text}</English>
                </label>
              </div>
            ))}
          </fieldset>
          {selected.length > 0 && !submitting ? <p className="hint">{t.mock.unsavedDraft}</p> : null}
          <button type="submit" disabled={submitting}>{submitting ? t.mock.saving : t.mock.saveAnswer}</button>
        </form>
      )}
    </>
  );
}

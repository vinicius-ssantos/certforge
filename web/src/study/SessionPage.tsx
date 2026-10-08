import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { AttemptRequest, AttemptResult, Question, Session } from "../api/types";
import type { Catalog } from "../i18n/en";
import { useText } from "../i18n/useText";
import { Confirm } from "../ui/Confirm";
import { ErrorState, Loading } from "../ui/States";
import { errorMessage } from "../ui/messages";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useFocusOnMount } from "../ui/useFocusOnMount";
import { AnswerFeedback } from "./AnswerFeedback";
import { QuestionForm } from "./QuestionForm";

/** Failures that mean the session changed under the learner: the page reloads its state. */
const SESSION_CHANGED = new Set(["session_expired", "session_not_in_progress", "already_answered"]);

/** Starting a second session conflicts with the one already open, which names it in its details. */
function isActiveSession(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "active_session_exists";
}

interface Feedback {
  position: number;
  question: Question;
  result: AttemptResult;
}

function sessionKey(sessionId: string) {
  return ["session", sessionId] as const;
}

export function SessionPage() {
  const t = useText();
  const { sessionId = "" } = useParams();
  const api = useApi();
  const queryClient = useQueryClient();
  const resumed = (useLocation().state as { resumed?: boolean } | null)?.resumed === true;
  useDocumentTitle(t.session.title);

  const session = useQuery({
    queryKey: sessionKey(sessionId),
    queryFn: () => unwrap(api.GET("/api/study/sessions/{sessionId}", { params: { path: { sessionId } } })),
  });

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  function store(updated: Session) {
    queryClient.setQueryData(sessionKey(sessionId), updated);
  }

  const submit = useMutation({
    mutationFn: ({
      position,
      body,
      key,
    }: {
      position: number;
      body: AttemptRequest;
      key: string;
      question: Question;
    }) =>
      unwrap(
        api.POST("/api/study/sessions/{sessionId}/questions/{position}/attempt", {
          params: { path: { sessionId, position }, header: { "Idempotency-Key": key } },
          body,
        }),
      ),
    onSuccess: (result, { position, question }) => {
      setFailure(null);
      setFeedback({ position, question, result });
      // An attempt is the evidence the review queue, the misconception counts, progress and
      // history are all derived from, so answering has just changed every one of them. Without
      // this a learner who practises a queued question and goes back to the queue is shown the
      // state from before they answered, for as long as the cache stays fresh.
      void queryClient.invalidateQueries({ queryKey: ["review"] });
      void queryClient.invalidateQueries({ queryKey: ["progress"] });
      void queryClient.invalidateQueries({ queryKey: ["history"] });
      const current = queryClient.getQueryData<Session>(sessionKey(sessionId));
      if (current) {
        store({
          ...current,
          questions: current.questions.map((entry) =>
            entry.position === position ? { ...entry, answered: true } : entry,
          ),
        });
      }
    },
    onError: (error) => {
      setFailure(errorMessage(error, t));
      if (error instanceof ApiError && SESSION_CHANGED.has(error.code)) {
        void queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
      }
    },
  });

  const finish = useMutation({
    mutationFn: (action: "complete" | "abandon") =>
      unwrap(
        api.POST(
          action === "complete"
            ? "/api/study/sessions/{sessionId}/complete"
            : "/api/study/sessions/{sessionId}/abandon",
          { params: { path: { sessionId } } },
        ),
      ),
    onSuccess: (closed) => {
      setFeedback(null);
      store(closed);
    },
    onError: (error) => {
      if (error instanceof ApiError && SESSION_CHANGED.has(error.code)) {
        void queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
      }
    },
  });

  if (session.isPending) {
    return (
      <>
        <h1>{t.session.title}</h1>
        <Loading label={t.session.loading} />
      </>
    );
  }
  if (session.isError) {
    return (
      <>
        <h1>{t.session.title}</h1>
        <ErrorState error={session.error} onRetry={() => void session.refetch()} />
        <p>
          <Link to="/">{t.session.backToAll}</Link>
        </p>
      </>
    );
  }

  const data = session.data;
  if (data.status !== "IN_PROGRESS") {
    return <SessionEnded session={data} />;
  }

  const ordered = [...data.questions].sort((a, b) => a.position - b.position);
  const next = ordered.find((entry) => !entry.answered);
  const answered = ordered.filter((entry) => entry.answered).length;
  const closing = finish.isPending;

  let body;
  if (feedback) {
    const isLast = !next;
    body = (
      <AnswerFeedback
        key={feedback.position}
        question={feedback.question}
        result={feedback.result}
        action={{
          label: isLast ? t.session.finish : t.session.next,
          busy: closing,
          onClick: () => (isLast ? finish.mutate("complete") : setFeedback(null)),
        }}
      />
    );
  } else if (next) {
    body = (
      <QuestionForm
        key={next.position}
        question={next.question}
        number={next.position + 1}
        total={ordered.length}
        failure={failure}
        submitting={submit.isPending}
        onSubmit={(request, key) =>
          submit.mutate({ position: next.position, body: request, key, question: next.question })
        }
      />
    );
  } else {
    body = <AllAnswered busy={closing} onFinish={() => finish.mutate("complete")} />;
  }

  return (
    <>
      {resumed ? <p role="status">{t.session.resumed}</p> : null}
      {/* The page's name and how far through it the learner is share one line: both are furniture
          for the question below, and stacking them pushed the question off the first screen. */}
      <div className="session-progress">
        <div className="session-progress-head">
          <h1 className="eyebrow">{t.session.title}</h1>
          <strong>{t.session.answeredCount(answered, ordered.length)}</strong>
        </div>
        <span className="session-progress-track" aria-hidden="true">
          <span
            className="session-progress-fill"
            style={{ width: `${ordered.length === 0 ? 0 : (answered / ordered.length) * 100}%` }}
          />
        </span>
      </div>
      {finish.isError ? <ErrorState error={finish.error} /> : null}
      {body}
      <div className="session-actions">
        <Confirm
          triggerClassName="link-button"
          title={t.session.endTitle}
          explain={t.session.endExplain}
          confirmLabel={t.session.endConfirm}
          cancelLabel={t.session.endCancel}
          busy={closing}
          onConfirm={() => finish.mutate("abandon")}
        >
          {t.session.endTrigger}
        </Confirm>
      </div>
    </>
  );
}

function AllAnswered({ busy, onFinish }: { busy: boolean; onFinish: () => void }) {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  return (
    <section aria-labelledby="all-answered">
      <h2 id="all-answered" ref={heading} tabIndex={-1}>
        {t.session.allAnswered}
      </h2>
      <p>{t.session.allAnsweredBody}</p>
      <button type="button" onClick={onFinish} disabled={busy}>
        {t.session.finish}
      </button>
    </section>
  );
}

/** How each terminal status is announced. Unknown statuses read as a completed one, as before. */
function endedWording(t: Catalog): Record<string, { title: string; text: string }> {
  return {
    COMPLETED: { title: t.session.completedTitle, text: t.session.completedText },
    ABANDONED: { title: t.session.abandonedTitle, text: t.session.abandonedText },
    EXPIRED: { title: t.session.expiredTitle, text: t.session.expiredText },
  };
}

function SessionEnded({ session }: { session: Session }) {
  const t = useText();
  const api = useApi();
  const navigate = useNavigate();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const wording = endedWording(t);
  const ended = wording[session.status] ?? wording.COMPLETED!;
  const answered = session.questions.filter((entry) => entry.answered).length;

  const attempts = useQuery({
    queryKey: ["session-attempts", session.id],
    queryFn: () =>
      unwrap(
        api.GET("/api/study/history/attempts", {
          params: { query: { sessionId: session.id, size: 50 } },
        }),
      ),
  });

  const again = useMutation({
    mutationFn: () =>
      unwrap(api.POST("/api/study/sessions", { body: { topicId: session.topicId } })),
    onSuccess: (next) => navigate(`/sessions/${next.id}`),
    onError: (error) => {
      // Someone opened another session in the meantime; join that one rather than fail.
      const existing = isActiveSession(error) ? error.details["sessionId"] : undefined;
      if (typeof existing === "string") {
        navigate(`/sessions/${existing}`, { state: { resumed: true } });
      }
    },
  });

  return (
    <>
      <h1 className="eyebrow">{t.session.title}</h1>
      <section aria-labelledby="ended-heading" className="asking">
        <div className="panel">
          <h2 id="ended-heading" ref={heading} tabIndex={-1}>
            {ended.title}
          </h2>
          <p>{ended.text}</p>
          {/*
           * The figures, not the sentences. This is the moment the learner wants to know how it
           * went, and three numbers answer that faster than three clauses. The sentences stay
           * available to assistive technology through the same catalogue strings as before.
           */}
          {/*
           * Figures for the eye, sentences for everyone else, each said once. Three labelled
           * numbers are read faster than three clauses, but "Correct 1" loses the denominator
           * that "1 of 2 answers were correct" carries — so the list is the illustration and the
           * sentences below are the information.
           */}
          <dl className="stat" aria-hidden="true">
            <div>
              <dt>{t.session.statAnswered}</dt>
              <dd>{answered}</dd>
            </div>
            {attempts.data ? (
              <div>
                <dt>{t.session.statCorrect}</dt>
                <dd>{attempts.data.items.filter((attempt) => attempt.correct).length}</dd>
              </div>
            ) : null}
            <div>
              <dt>{t.session.statNotSeen}</dt>
              <dd>{session.questions.length - answered}</dd>
            </div>
          </dl>
          <p className="visually-hidden">{t.session.answeredOf(answered, session.questions.length)}</p>
          {attempts.data ? (
            <p className="visually-hidden">
              {t.session.correctOf(
                attempts.data.items.filter((attempt) => attempt.correct).length,
                answered,
              )}
            </p>
          ) : null}
          <p className="visually-hidden">
            {t.session.notSeenOf(session.questions.length - answered)}
          </p>
          {attempts.isPending ? <Loading label={t.session.countingCorrect} /> : null}
          {attempts.isError ? <ErrorState error={attempts.error} onRetry={() => void attempts.refetch()} /> : null}
          <div className="button-row">
            <button type="button" disabled={again.isPending} onClick={() => again.mutate()}>
              {t.session.practiseAgain}
            </button>
            <Link className="button secondary" to={`/history/sessions/${session.id}`}>
              {t.session.seeReview}
            </Link>
          </div>
          <p>
            <Link to="/">{t.session.backToAll}</Link>
          </p>
        </div>
      </section>
    </>
  );
}

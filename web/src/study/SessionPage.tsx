import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { AttemptRequest, AttemptResult, Question, Session } from "../api/types";
import { ErrorState, Loading } from "../ui/States";
import { errorMessage } from "../ui/messages";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useFocusOnMount } from "../ui/useFocusOnMount";
import { AnswerFeedback } from "./AnswerFeedback";
import { QuestionForm } from "./QuestionForm";

/** Failures that mean the session changed under the learner: the page reloads its state. */
const SESSION_CHANGED = new Set(["session_expired", "session_not_in_progress", "already_answered"]);

interface Feedback {
  position: number;
  question: Question;
  result: AttemptResult;
}

function sessionKey(sessionId: string) {
  return ["session", sessionId] as const;
}

export function SessionPage() {
  const { sessionId = "" } = useParams();
  const api = useApi();
  const queryClient = useQueryClient();
  const resumed = (useLocation().state as { resumed?: boolean } | null)?.resumed === true;
  useDocumentTitle("Practice session");

  const session = useQuery({
    queryKey: sessionKey(sessionId),
    queryFn: () => unwrap(api.GET("/api/study/sessions/{sessionId}", { params: { path: { sessionId } } })),
  });

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [confirmingAbandon, setConfirmingAbandon] = useState(false);

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
      setFailure(errorMessage(error));
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
      setConfirmingAbandon(false);
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
        <h1>Practice session</h1>
        <Loading label="Loading session" />
      </>
    );
  }
  if (session.isError) {
    return (
      <>
        <h1>Practice session</h1>
        <ErrorState error={session.error} onRetry={() => void session.refetch()} />
        <p>
          <Link to="/">Back to all tracks</Link>
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
          label: isLast ? "Finish session" : "Next question",
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
        position={next.position}
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
      <h1>Practice session</h1>
      {resumed ? (
        <p role="status">You already had a session in progress for this topic, so you are continuing it.</p>
      ) : null}
      <p className="muted">
        {answered} of {ordered.length} questions answered
      </p>
      {finish.isError ? <ErrorState error={finish.error} /> : null}
      {body}
      <div className="session-actions">
        {confirmingAbandon ? (
          <div role="group" aria-label="Confirm ending the session" className="confirm">
            <p>End this session now? The answers you already gave are kept.</p>
            <button type="button" onClick={() => finish.mutate("abandon")} disabled={closing}>
              Yes, end the session
            </button>{" "}
            <button type="button" className="secondary" onClick={() => setConfirmingAbandon(false)}>
              Keep practising
            </button>
          </div>
        ) : (
          <button type="button" className="link-button" onClick={() => setConfirmingAbandon(true)}>
            End session without finishing
          </button>
        )}
      </div>
    </>
  );
}

function AllAnswered({ busy, onFinish }: { busy: boolean; onFinish: () => void }) {
  const heading = useFocusOnMount<HTMLHeadingElement>();
  return (
    <section aria-labelledby="all-answered">
      <h2 id="all-answered" ref={heading} tabIndex={-1}>
        All questions answered
      </h2>
      <p>Finish the session to see how it went.</p>
      <button type="button" onClick={onFinish} disabled={busy}>
        Finish session
      </button>
    </section>
  );
}

const ENDED: Record<string, { title: string; text: string }> = {
  COMPLETED: { title: "Session finished", text: "Well done. Here is how it went." },
  ABANDONED: { title: "Session ended", text: "You ended this session early. Your answers were kept." },
  EXPIRED: {
    title: "This session expired",
    text: "Sessions close after a period without activity. Answers you already gave were kept; start a new session to continue practising.",
  },
};

function SessionEnded({ session }: { session: Session }) {
  const api = useApi();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const ended = ENDED[session.status] ?? ENDED.COMPLETED!;
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

  return (
    <>
      <h1>Practice session</h1>
      <section aria-labelledby="ended-heading">
        <h2 id="ended-heading" ref={heading} tabIndex={-1}>
          {ended.title}
        </h2>
        <p>{ended.text}</p>
        <p>
          You answered {answered} of {session.questions.length} questions.
        </p>
        {attempts.isPending ? <Loading label="Counting your correct answers" /> : null}
        {attempts.isError ? <ErrorState error={attempts.error} onRetry={() => void attempts.refetch()} /> : null}
        {attempts.data ? (
          <p>
            {attempts.data.items.filter((attempt) => attempt.correct).length} of {answered} answers were correct.
          </p>
        ) : null}
        <p>
          <Link to="/">Back to all tracks</Link>
        </p>
      </section>
    </>
  );
}

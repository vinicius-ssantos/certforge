import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type {
  Confidence,
  InterviewAnswer,
  InterviewSession,
  Question,
} from "../api/types";
import { English } from "../i18n/English";
import { useText } from "../i18n/useText";
import { QuestionForm } from "../study/QuestionForm";
import { Confirm } from "../ui/Confirm";
import { ErrorState, Loading } from "../ui/States";
import { errorMessage } from "../ui/messages";
import { optionLabel } from "../ui/optionLabel";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useFocusOnMount } from "../ui/useFocusOnMount";
import { GuidedItem, GuidedOutcomePanel } from "./GuidedItem";

/** Failures that mean the session changed under the learner: the page reloads its state. */
const SESSION_CHANGED = new Set([
  "session_expired",
  "session_not_in_progress",
  "question_already_answered",
]);

function sessionKey(sessionId: string) {
  return ["interview-session", sessionId] as const;
}

/** Which kind of item this is, taken from the contract rather than guessed from empty options. */
function isGuided(question: Question): boolean {
  return question.type === "GUIDED_RESPONSE";
}

interface Answered {
  position: number;
  question: Question;
  answer: InterviewAnswer;
}

export function InterviewSessionPage() {
  const t = useText();
  const { sessionId = "" } = useParams();
  const api = useApi();
  const queryClient = useQueryClient();
  useDocumentTitle(t.interview.session.title);

  const session = useQuery({
    queryKey: sessionKey(sessionId),
    queryFn: () =>
      unwrap(
        api.GET("/api/study/interviews/{sessionId}", { params: { path: { sessionId } } }),
      ),
  });

  const [answered, setAnswered] = useState<Answered | null>(null);
  const [marks, setMarks] = useState<Record<number, boolean>>({});
  const [failure, setFailure] = useState<string | null>(null);

  function store(updated: InterviewSession) {
    queryClient.setQueryData(sessionKey(sessionId), updated);
  }

  const submit = useMutation({
    mutationFn: ({
      position,
      body,
      key,
    }: {
      position: number;
      body: { confidence: Confidence; elapsedMillis: number; selectedOptions: string[] };
      key: string;
      question: Question;
    }) =>
      unwrap(
        api.POST("/api/study/interviews/{sessionId}/items/{position}/answer", {
          params: { path: { sessionId, position }, header: { "Idempotency-Key": key } },
          body,
        }),
      ),
    onSuccess: (answer, { position, question }) => {
      setFailure(null);
      setMarks({});
      setAnswered({ position, question, answer });
      // Answering is what the interview evidence is derived from, so it has just changed.
      void queryClient.invalidateQueries({ queryKey: ["interview-evidence"] });
      const current = queryClient.getQueryData<InterviewSession>(sessionKey(sessionId));
      if (current) {
        store({
          ...current,
          items: current.items.map((item) =>
            item.position === position ? { ...item, answered: true } : item,
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

  /**
   * The learner's own marks, sent as their own step. They are only askable once the reviewed
   * concepts are on the screen, which is after the answer — and they are recorded once, so this
   * runs when the learner moves on rather than on every checkbox.
   */
  const mark = useMutation({
    mutationFn: ({ position, covered }: { position: number; covered: Record<number, boolean> }) =>
      unwrap(
        api.POST("/api/study/interviews/{sessionId}/items/{position}/concepts", {
          params: { path: { sessionId, position } },
          body: { coveredConcepts: covered },
        }),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["interview-evidence"] });
    },
  });

  const finish = useMutation({
    mutationFn: (action: "complete" | "abandon") =>
      unwrap(
        api.POST(
          action === "complete"
            ? "/api/study/interviews/{sessionId}/complete"
            : "/api/study/interviews/{sessionId}/abandon",
          { params: { path: { sessionId } } },
        ),
      ),
    onSuccess: (closed) => {
      setAnswered(null);
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
        <h1>{t.interview.session.title}</h1>
        <Loading label={t.interview.session.loading} />
      </>
    );
  }
  if (session.isError) {
    return (
      <>
        <h1>{t.interview.session.title}</h1>
        <ErrorState error={session.error} onRetry={() => void session.refetch()} />
        <p>
          <Link to="/interviews">{t.interview.session.backToInterviews}</Link>
        </p>
      </>
    );
  }

  const data = session.data;
  if (data.status !== "IN_PROGRESS") {
    return <SessionEnded />;
  }

  const ordered = [...data.items].sort((a, b) => a.position - b.position);
  const next = ordered.find((item) => !item.answered);
  const done = ordered.filter((item) => item.answered).length;
  const closing = finish.isPending;

  /**
   * Moving on: the marks are said once, and said *before* the next item opens or the session
   * closes — never alongside it. Firing both at once would race a mark against a session closing
   * underneath it, and a mark the server refused because the session had just ended would be a
   * statement the learner made that silently went nowhere.
   */
  async function advance() {
    if (answered && Object.keys(marks).length > 0) {
      try {
        await mark.mutateAsync({ position: answered.position, covered: marks });
      } catch (error) {
        // A retry after a lost response can land on marks that were in fact recorded the first
        // time: the server says so with this code, and it is not a reason to block the learner
        // on the item a second time, the same way closing an already-closed session succeeds.
        if (!(error instanceof ApiError && error.code === "concepts_already_marked")) {
          // Any other failure is shown by mark.isError below; stay on this item rather than move
          // on from a mark that was not recorded.
          return;
        }
      }
    }
    if (next) {
      setAnswered(null);
      setMarks({});
    } else {
      finish.mutate("complete");
    }
  }

  let body;
  if (answered) {
    const label = next ? t.interview.session.next : t.interview.session.finish;
    body =
      answered.answer.guided === null ? (
        <ObjectivePanel
          key={answered.position}
          answered={answered}
          action={{ label, busy: closing || mark.isPending, onClick: advance }}
        />
      ) : (
        <GuidedOutcomePanel
          key={answered.position}
          outcome={answered.answer.guided}
          marks={marks}
          onMark={(position, covered) =>
            setMarks((current) => ({ ...current, [position]: covered }))
          }
          action={{ label, busy: closing || mark.isPending, onClick: advance }}
        />
      );
  } else if (next && isGuided(next.question)) {
    body = (
      <GuidedItem
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
  } else if (next) {
    body = (
      /* An objective interview item is answered exactly as a practice question is, by the same
         form: the kind of session does not change what a right answer means. */
      <QuestionForm
        key={next.position}
        question={next.question}
        number={next.position + 1}
        total={ordered.length}
        failure={failure}
        submitting={submit.isPending}
        onSubmit={(request, key) =>
          submit.mutate({
            position: next.position,
            body: {
              selectedOptions: request.selectedOptions ?? [],
              confidence: request.confidence,
              elapsedMillis: request.elapsedMillis,
            },
            key,
            question: next.question,
          })
        }
      />
    );
  } else {
    body = <AllAnswered busy={closing} onFinish={() => finish.mutate("complete")} />;
  }

  return (
    <>
      <div className="session-progress">
        <div className="session-progress-head">
          <h1 className="eyebrow">{t.interview.session.title}</h1>
          <strong>{t.interview.session.answeredCount(done, ordered.length)}</strong>
        </div>
        <span className="session-progress-track" aria-hidden="true">
          <span
            className="session-progress-fill"
            style={{ width: `${ordered.length === 0 ? 0 : (done / ordered.length) * 100}%` }}
          />
        </span>
      </div>
      {finish.isError ? <ErrorState error={finish.error} /> : null}
      {/* A failed mark must not be silent: the learner said something about their own answer and
          has a right to know it was not recorded. The session itself is unaffected. */}
      {mark.isError ? <ErrorState error={mark.error} /> : null}
      {body}
      <div className="session-actions">
        <Confirm
          triggerClassName="link-button"
          title={t.interview.session.endTitle}
          explain={t.interview.session.endExplain}
          confirmLabel={t.interview.session.endConfirm}
          cancelLabel={t.interview.session.endCancel}
          busy={closing}
          onConfirm={() => finish.mutate("abandon")}
        >
          {t.interview.session.endTrigger}
        </Confirm>
      </div>
    </>
  );
}

/** What an objective item shows once answered: the same material practice shows, said once. */
function ObjectivePanel({
  answered,
  action,
}: {
  answered: Answered;
  action: { label: string; busy: boolean; onClick: () => void };
}) {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const outcome = answered.answer.objective;
  if (!outcome) {
    return null;
  }
  const keys = answered.question.options.map((option) => option.key);

  return (
    <section aria-labelledby="objective-outcome" className="asking">
      <h2 id="objective-outcome" ref={heading} tabIndex={-1}>
        {outcome.correct ? t.interview.session.correct : t.interview.session.incorrect}
      </h2>
      <p className="item-kind item-kind-objective">{t.interview.session.objectiveKind}</p>
      <dl className="interview-answer">
        <dt>{t.interview.session.yourChoice}</dt>
        <dd>
          {outcome.selectedOptions
            .map((key) => optionLabel(Math.max(0, keys.indexOf(key))))
            .join(", ")}
        </dd>
        <dt>{t.interview.session.answerKey}</dt>
        <dd>
          {outcome.correctOptions
            .map((key) => optionLabel(Math.max(0, keys.indexOf(key))))
            .join(", ")}
        </dd>
      </dl>
      <p>
        <English>{outcome.explanation}</English>
      </p>
      <button type="button" onClick={action.onClick} disabled={action.busy}>
        {action.label}
      </button>
    </section>
  );
}

function AllAnswered({ busy, onFinish }: { busy: boolean; onFinish: () => void }) {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  return (
    <section aria-labelledby="interview-all-answered">
      <h2 id="interview-all-answered" ref={heading} tabIndex={-1}>
        {t.interview.session.allAnswered}
      </h2>
      <p>{t.interview.session.allAnsweredBody}</p>
      <button type="button" onClick={onFinish} disabled={busy}>
        {t.interview.session.finish}
      </button>
    </section>
  );
}

function SessionEnded() {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  return (
    <>
      <h1 className="eyebrow">{t.interview.session.title}</h1>
      <section aria-labelledby="interview-ended" className="asking">
        <div className="panel">
          <h2 id="interview-ended" ref={heading} tabIndex={-1}>
            {t.interview.session.ended}
          </h2>
          <p>{t.interview.session.endedBody}</p>
          <div className="button-row">
            <Link className="button" to="/interviews/evidence">
              {t.interview.evidenceLink}
            </Link>
            <Link className="button secondary" to="/interviews">
              {t.interview.session.backToInterviews}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

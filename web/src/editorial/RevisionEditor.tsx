import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Revision } from "../api/types";
import { useTopics } from "../catalog/useTopics";
import { ErrorSummary } from "../ui/Form";
import { errorMessage } from "../ui/messages";
import {
  draftFrom,
  emptyDraft,
  emptyOption,
  KEYS,
  MAX_OPTIONS,
  toRequest,
  type Draft,
  type Problem,
} from "./draft";
import { VIOLATION } from "./labels";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint ? (
        <p id={`${id}-hint`} className="hint">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function questionKey(id: string) {
  return ["editorial", "question", id] as const;
}

/**
 * The form for a draft revision, new or existing. Saving keeps what is written even when it is
 * unfinished. Sending for review asks the server whether the revision is complete and lists
 * whatever is missing beside the form, each item leading to its field; the server decides what
 * complete means, this only words it.
 */
export function RevisionEditor({ revision }: { revision?: Revision }) {
  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { topics } = useTopics();

  const [draft, setDraft] = useState<Draft>(() => (revision ? draftFrom(revision) : emptyDraft()));
  const [problems, setProblems] = useState<Problem[]>([]);
  const [failure, setFailure] = useState<string | null>(null);
  const [violations, setViolations] = useState<string[] | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const change = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));
  const multiple = draft.type === "MULTIPLE_CHOICE";

  const save = useMutation({
    mutationFn: async (send: boolean) => {
      const { request, problems: found } = toRequest(draft);
      setProblems(found);
      setFailure(null);
      if (found.length > 0) {
        return null;
      }
      const saved = revision
        ? await unwrap(
            api.PUT("/api/admin/question-revisions/{revisionId}", {
              params: { path: { revisionId: revision.id } },
              body: request,
            }),
          )
        : await unwrap(api.POST("/api/admin/questions", { body: request }));
      queryClient.setQueryData(questionKey(saved.id), saved);
      void queryClient.invalidateQueries({ queryKey: ["editorial", "questions"] });
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      if (!send) {
        return { view: saved, sent: false };
      }
      const revisionId = revision?.id ?? saved.revisions[0]?.id;
      if (!revisionId) {
        return { view: saved, sent: false };
      }
      const sent = await unwrap(
        api.POST("/api/admin/question-revisions/{revisionId}/submit", {
          params: { path: { revisionId } },
        }),
      );
      queryClient.setQueryData(questionKey(sent.id), sent);
      return { view: sent, sent: true };
    },
    onSuccess: (result) => {
      if (!result) {
        return;
      }
      setViolations(null);
      if (result.sent) {
        navigate(`/editorial/questions/${result.view.id}`, { state: { notice: "sent" } });
      } else if (!revision) {
        navigate(`/editorial/questions/${result.view.id}`, { replace: true, state: { notice: "saved" } });
      }
    },
    onError: (error) => {
      const list = error instanceof ApiError ? error.details["violations"] : undefined;
      if (error instanceof ApiError && error.code === "revision_incomplete" && Array.isArray(list)) {
        setViolations(list.filter((item): item is string => typeof item === "string"));
        setFailure(null);
      } else {
        setFailure(errorMessage(error));
      }
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate(false);
  }

  function setOption(index: number, patch: Partial<Draft["options"][number]>) {
    change({
      options: draft.options.map((option, at) => (at === index ? { ...option, ...patch } : option)),
    });
  }

  function markCorrect(index: number, checked: boolean) {
    change({
      options: draft.options.map((option, at) =>
        multiple ? (at === index ? { ...option, correct: checked } : option) : { ...option, correct: at === index },
      ),
    });
  }

  function chooseType(type: Draft["type"]) {
    if (type === "SINGLE_CHOICE") {
      const first = draft.options.findIndex((option) => option.correct);
      change({
        type,
        options: draft.options.map((option, at) => ({ ...option, correct: at === first })),
      });
    } else {
      change({ type });
    }
  }

  const summary = useMemo(
    () => (failure ? [...problems, { fieldId: "", message: failure }] : problems),
    [problems, failure],
  );
  const changesRequested = useMemo(() => {
    const last = revision?.reviews.filter((review) => review.decision === "CHANGES_REQUESTED").at(-1);
    return revision?.status === "DRAFT" ? last : undefined;
  }, [revision]);

  return (
    <div className="with-aside">
      <form onSubmit={submit} noValidate>
        <ErrorSummary
          problems={summary.map((problem) => ({
            ...(problem.fieldId ? { fieldId: problem.fieldId } : {}),
            message: problem.message,
          }))}
        />
        {changesRequested ? (
          <section className="changes" aria-labelledby="changes-heading">
            <h2 id="changes-heading">A reviewer asked for changes</h2>
            <p>{changesRequested.comment}</p>
          </section>
        ) : null}

        <div className="row">
          <fieldset className="field">
            <legend>Type</legend>
            <label className="check">
              <input type="radio" name="type" checked={!multiple} onChange={() => chooseType("SINGLE_CHOICE")} />
              Single choice
            </label>
            <label className="check">
              <input type="radio" name="type" checked={multiple} onChange={() => chooseType("MULTIPLE_CHOICE")} />
              Multiple choice
            </label>
          </fieldset>
          <Field id="field-topic" label="Topic">
            <select id="field-topic" value={draft.topicId} onChange={(event) => change({ topicId: event.target.value })}>
              <option value="">Choose a topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {`${"– ".repeat(topic.depth)}${topic.name}`}
                </option>
              ))}
            </select>
          </Field>
          <Field id="field-difficulty" label="Difficulty">
            <select
              id="field-difficulty"
              value={draft.difficulty}
              onChange={(event) => change({ difficulty: event.target.value as Draft["difficulty"] })}
            >
              <option value="">Choose a difficulty</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </Field>
        </div>

        <div className="narrow-field">
          <Field id="field-release" label="Java release">
            <input
              id="field-release"
              type="text"
              inputMode="numeric"
              value={draft.javaRelease}
              onChange={(event) => change({ javaRelease: event.target.value })}
            />
          </Field>
        </div>

        <Field id="field-rationale" label="Why this difficulty" hint="What makes a candidate likely to get it wrong?">
          <textarea
            id="field-rationale"
            aria-describedby="field-rationale-hint"
            rows={3}
            value={draft.rationale}
            onChange={(event) => change({ rationale: event.target.value })}
          />
        </Field>

        <Field
          id="field-prompt"
          label="Question"
          hint="Put code in a fenced block (three backticks). The learner sees it exactly as written."
        >
          <textarea
            id="field-prompt"
            className="read"
            aria-describedby="field-prompt-hint"
            rows={9}
            value={draft.prompt}
            onChange={(event) => change({ prompt: event.target.value })}
          />
        </Field>

        <fieldset id="options" className="field" tabIndex={-1}>
          <legend>Answer options</legend>
          <p className="hint">
            {multiple ? "Mark every correct option." : "Mark the one correct option."} Each option needs a
            reason, shown to the learner after they answer, wrong options included.
          </p>
          {draft.options.map((option, index) => (
            <div key={index} className="option">
              <div className="letter" aria-hidden="true">
                {KEYS[index]}
              </div>
              <div>
                <Field id={`option-text-${index}`} label={`Option ${KEYS[index]}`}>
                  <input
                    id={`option-text-${index}`}
                    type="text"
                    value={option.text}
                    onChange={(event) => setOption(index, { text: event.target.value })}
                  />
                </Field>
                <label className="check">
                  <input
                    type={multiple ? "checkbox" : "radio"}
                    name="correct"
                    checked={option.correct}
                    onChange={(event) => markCorrect(index, event.target.checked)}
                  />
                  Option {KEYS[index]} is correct
                </label>
                <Field id={`option-reason-${index}`} label={`Reason for ${KEYS[index]}`}>
                  <textarea
                    id={`option-reason-${index}`}
                    rows={2}
                    value={option.explanation}
                    onChange={(event) => setOption(index, { explanation: event.target.value })}
                  />
                </Field>
                {draft.options.length > 2 ? (
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => change({ options: draft.options.filter((_, at) => at !== index) })}
                  >
                    Remove option {KEYS[index]}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {draft.options.length < MAX_OPTIONS ? (
            <button
              type="button"
              className="secondary"
              onClick={() => change({ options: [...draft.options, emptyOption()] })}
            >
              Add another option
            </button>
          ) : null}
        </fieldset>

        <Field id="field-explanation" label="Explanation" hint="Shown after the learner answers.">
          <textarea
            id="field-explanation"
            className="read"
            aria-describedby="field-explanation-hint"
            rows={5}
            value={draft.explanation}
            onChange={(event) => change({ explanation: event.target.value })}
          />
        </Field>

        <fieldset id="references" className="field" tabIndex={-1}>
          <legend>References</legend>
          <p className="hint">Official documentation only. Links must start with https://</p>
          {draft.references.map((reference, index) => (
            <div key={index} className="reference">
              <Field id={`reference-title-${index}`} label={`Title of reference ${index + 1}`}>
                <input
                  id={`reference-title-${index}`}
                  type="text"
                  value={reference.title}
                  onChange={(event) =>
                    change({
                      references: draft.references.map((ref, at) =>
                        at === index ? { ...ref, title: event.target.value } : ref,
                      ),
                    })
                  }
                />
              </Field>
              <Field id={`reference-url-${index}`} label={`Link of reference ${index + 1}`}>
                <input
                  id={`reference-url-${index}`}
                  type="text"
                  value={reference.url}
                  onChange={(event) =>
                    change({
                      references: draft.references.map((ref, at) =>
                        at === index ? { ...ref, url: event.target.value } : ref,
                      ),
                    })
                  }
                />
              </Field>
              {draft.references.length > 1 ? (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => change({ references: draft.references.filter((_, at) => at !== index) })}
                >
                  Remove reference {index + 1}
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            className="secondary"
            onClick={() => change({ references: [...draft.references, { title: "", url: "" }] })}
          >
            Add another reference
          </button>
        </fieldset>

        <div className="actions">
          <button type="submit" className="secondary" disabled={save.isPending}>
            Save draft
          </button>
          <button type="button" disabled={save.isPending} onClick={() => save.mutate(true)}>
            Send for review
          </button>
          <span role="status" className="muted">
            {save.isPending ? "Saving…" : savedAt ? `Saved at ${savedAt}` : ""}
          </span>
        </div>
      </form>

      <aside aria-labelledby="send-checks">
        <h2 id="send-checks">Before you can send this</h2>
        {violations === null ? (
          <p className="hint">
            Sending checks the whole revision. Anything missing is listed here, and each item takes you to its
            field.
          </p>
        ) : violations.length === 0 ? (
          <p>Nothing is missing.</p>
        ) : (
          <div role="alert">
            <ul className="todo">
              {violations.map((code) => {
                const known = VIOLATION[code];
                return (
                  <li key={code}>
                    <span aria-hidden="true">✗</span>
                    {known ? <a href={`#${known.fieldId}`}>{known.message}</a> : <span>{code}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <p className="hint">A reviewer other than you has to approve it before it can be published.</p>
      </aside>
    </div>
  );
}

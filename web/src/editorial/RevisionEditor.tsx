import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useBlocker, useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Revision } from "../api/types";
import { useTopics } from "../catalog/useTopics";
import { useText } from "../i18n/useText";
import { ErrorSummary } from "../ui/Form";
import { errorMessage } from "../ui/messages";
import {
  draftFrom,
  emptyConcept,
  emptyDraft,
  emptyOption,
  KEYS,
  MAX_OPTIONS,
  toRequest,
  type Draft,
  type Problem,
} from "./draft";
import { difficultyLabels, typeLabels, violations as violationWording } from "./labels";

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
  const t = useText();
  const ed = t.editorial.editor;
  const types = typeLabels(t);
  const difficulties = difficultyLabels(t);
  const wording = violationWording(t);
  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { groups } = useTopics();
  const [draft, setDraft] = useState<Draft>(() => (revision ? draftFrom(revision) : emptyDraft()));
  // Which taxonomy the chosen topic belongs to decides which of the two fields below applies.
  // Unknown (nothing chosen yet) is treated as certification, which is what the rules do.
  const interview =
    groups.find((group) => group.topics.some((topic) => topic.id === draft.topicId))?.kind ===
    "INTERVIEW";
  // What was last saved (or loaded), to tell whether leaving would lose anything.
  const [baseline, setBaseline] = useState(() => JSON.stringify(revision ? draftFrom(revision) : emptyDraft()));
  const dirty = JSON.stringify(draft) !== baseline;
  const dirtyRef = useRef(dirty);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [failure, setFailure] = useState<string | null>(null);
  const [violations, setViolations] = useState<string[] | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Leaving the page, by a link, the back button or closing the tab, must not silently lose work.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirtyRef.current &&
      (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search),
  );
  useEffect(() => {
    if (!dirty) {
      return;
    }
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const keepEditing = useRef<HTMLButtonElement>(null);
  const saveButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (blocker.state === "blocked") {
      keepEditing.current?.focus();
    }
  }, [blocker.state]);

  const change = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));
  const guided = draft.type === "GUIDED_RESPONSE";
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
      // What is on screen is now saved, so moving on from here loses nothing.
      dirtyRef.current = false;
      setBaseline(JSON.stringify(draft));
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
        setFailure(errorMessage(error, t));
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
    if (type === "GUIDED_RESPONSE") {
      change({ type });
      return;
    }
    const options = draft.options.length >= 2 ? draft.options : [emptyOption(), emptyOption()];
    if (type === "SINGLE_CHOICE") {
      const first = options.findIndex((option) => option.correct);
      change({
        type,
        options: options.map((option, at) => ({ ...option, correct: first >= 0 && at === first })),
      });
    } else {
      change({ type, options });
    }
  }

  function setConcept(index: number, patch: Partial<Draft["guidedResponse"]["expectedConcepts"][number]>) {
    change({
      guidedResponse: {
        ...draft.guidedResponse,
        expectedConcepts: draft.guidedResponse.expectedConcepts.map((concept, at) =>
          at === index ? { ...concept, ...patch } : concept,
        ),
      },
    });
  }

  function setGuidedList(key: "commonMistakes" | "followUps", index: number, value: string) {
    change({
      guidedResponse: {
        ...draft.guidedResponse,
        [key]: draft.guidedResponse[key].map((item, at) => (at === index ? value : item)),
      },
    });
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
      <form className="stage" onSubmit={submit} noValidate>
        {blocker.state === "blocked" ? (
          <div role="group" aria-label={ed.unsavedLabel} className="confirm">
            <p>{ed.unsavedWarning}</p>
            <button
              ref={keepEditing}
              type="button"
              onClick={() => {
                blocker.reset();
                saveButton.current?.focus();
              }}
            >
              {ed.keepEditing}
            </button>{" "}
            <button type="button" className="secondary" onClick={() => blocker.proceed()}>
              {ed.leaveWithoutSaving}
            </button>
          </div>
        ) : null}
        <ErrorSummary
          problems={summary.map((problem) => ({
            ...(problem.fieldId ? { fieldId: problem.fieldId } : {}),
            message: problem.message,
          }))}
        />
        {changesRequested ? (
          <section className="changes" aria-labelledby="changes-heading">
            <h2 id="changes-heading">
              {changesRequested.reviewerName
                ? ed.reviewerAskedForChanges(changesRequested.reviewerName)
                : ed.someoneAskedForChanges}
            </h2>
            <p>{changesRequested.comment}</p>
          </section>
        ) : null}

        <div className="row">
          <fieldset className="field">
            <legend>{ed.typeLegend}</legend>
            <label className="check">
              <input
                type="radio"
                name="type"
                checked={draft.type === "SINGLE_CHOICE"}
                onChange={() => chooseType("SINGLE_CHOICE")}
              />
              {types.SINGLE_CHOICE}
            </label>
            <label className="check">
              <input type="radio" name="type" checked={multiple} onChange={() => chooseType("MULTIPLE_CHOICE")} />
              {types.MULTIPLE_CHOICE}
            </label>
            <label className="check">
              <input type="radio" name="type" checked={guided} onChange={() => chooseType("GUIDED_RESPONSE")} />
              {types.GUIDED_RESPONSE}
            </label>
          </fieldset>
          <Field id="field-topic" label={ed.topic}>
            <select id="field-topic" value={draft.topicId} onChange={(event) => change({ topicId: event.target.value })}>
              <option value="">{ed.chooseTopic}</option>
              {/*
               * Grouped by track, because the same subject exists on a certification track and an
               * interview track as two separate topics on purpose (ADR 0014). optgroup rather than
               * a rendered heading: a screen reader announces the group with the option, so the
               * choice is unambiguous without the author having to remember the order.
               */}
              {groups.map((group) => (
                <optgroup
                  key={group.trackId}
                  label={ed.trackGroup(
                    group.trackName,
                    group.kind === "INTERVIEW" ? ed.kindInterview : ed.kindCertification,
                  )}
                >
                  {group.topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {`${"– ".repeat(topic.depth)}${topic.name}`}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field id="field-difficulty" label={ed.difficulty}>
            <select
              id="field-difficulty"
              value={draft.difficulty}
              onChange={(event) => change({ difficulty: event.target.value as Draft["difficulty"] })}
            >
              <option value="">{ed.chooseDifficulty}</option>
              <option value="EASY">{difficulties.EASY}</option>
              <option value="MEDIUM">{difficulties.MEDIUM}</option>
              <option value="HARD">{difficulties.HARD}</option>
            </select>
          </Field>
        </div>

        <div className="narrow-field">
          {interview ? (
            <Field id="field-seniority" label={ed.seniority} hint={ed.seniorityHint}>
              <select
                id="field-seniority"
                aria-describedby="field-seniority-hint"
                value={draft.seniority}
                onChange={(event) =>
                  change({ seniority: event.target.value as Draft["seniority"] })
                }
              >
                <option value="">{ed.chooseSeniority}</option>
                <option value="PLENO">{ed.seniorityPleno}</option>
                <option value="SENIOR">{ed.senioritySenior}</option>
              </select>
            </Field>
          ) : (
            <Field id="field-release" label={ed.javaRelease}>
              <input
                id="field-release"
                type="text"
                inputMode="numeric"
                value={draft.javaRelease}
                onChange={(event) => change({ javaRelease: event.target.value })}
              />
            </Field>
          )}
        </div>

        <Field id="field-rationale" label={ed.whyThisDifficulty} hint={ed.whyThisDifficultyHint}>
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
          label={ed.question}
          hint={ed.questionHint}
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

        {guided ? (
          <section id="guided-response" className="field" aria-labelledby="guided-response-heading">
            <h2 id="guided-response-heading">{ed.guidedLegend}</h2>
            <p className="hint">{ed.guidedHint}</p>
            <Field id="guided-reference-answer" label={ed.referenceAnswer} hint={ed.referenceAnswerHint}>
              <textarea
                id="guided-reference-answer"
                className="read"
                aria-describedby="guided-reference-answer-hint"
                rows={6}
                value={draft.guidedResponse.referenceAnswer}
                onChange={(event) =>
                  change({
                    guidedResponse: { ...draft.guidedResponse, referenceAnswer: event.target.value },
                  })
                }
              />
            </Field>

            <div id="guided-concepts" className="field" tabIndex={-1}>
              <h3>{ed.expectedConcepts}</h3>
              <p className="hint">{ed.expectedConceptsHint}</p>
              {draft.guidedResponse.expectedConcepts.map((concept, index) => (
                <div key={index} className="option">
                  <div className="letter" aria-hidden="true">
                    {index + 1}
                  </div>
                  <div>
                    <Field id={`guided-concept-text-${index}`} label={ed.expectedConcept(index + 1)}>
                      <input
                        id={`guided-concept-text-${index}`}
                        type="text"
                        value={concept.text}
                        onChange={(event) => setConcept(index, { text: event.target.value })}
                      />
                    </Field>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={concept.required}
                        onChange={(event) => setConcept(index, { required: event.target.checked })}
                      />
                      {ed.conceptRequired}
                    </label>
                    <Field id={`guided-concept-explanation-${index}`} label={ed.conceptExplanation(index + 1)}>
                      <textarea
                        id={`guided-concept-explanation-${index}`}
                        rows={2}
                        value={concept.explanation}
                        onChange={(event) => setConcept(index, { explanation: event.target.value })}
                      />
                    </Field>
                    {draft.guidedResponse.expectedConcepts.length > 1 ? (
                      <button
                        type="button"
                        className="link-button"
                        onClick={() =>
                          change({
                            guidedResponse: {
                              ...draft.guidedResponse,
                              expectedConcepts: draft.guidedResponse.expectedConcepts.filter((_, at) => at !== index),
                            },
                          })
                        }
                      >
                        {ed.removeConcept(index + 1)}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  change({
                    guidedResponse: {
                      ...draft.guidedResponse,
                      expectedConcepts: [...draft.guidedResponse.expectedConcepts, emptyConcept()],
                    },
                  })
                }
              >
                {ed.addConcept}
              </button>
            </div>

            <div id="guided-common-mistakes" className="field" tabIndex={-1}>
              <h3>{ed.commonMistakes}</h3>
              {draft.guidedResponse.commonMistakes.map((mistake, index) => (
                <div key={index} className="reference">
                  <Field id={`guided-mistake-${index}`} label={ed.commonMistake(index + 1)}>
                    <input
                      id={`guided-mistake-${index}`}
                      type="text"
                      value={mistake}
                      onChange={(event) => setGuidedList("commonMistakes", index, event.target.value)}
                    />
                  </Field>
                  {draft.guidedResponse.commonMistakes.length > 1 ? (
                    <button
                      type="button"
                      className="link-button"
                      onClick={() =>
                        change({
                          guidedResponse: {
                            ...draft.guidedResponse,
                            commonMistakes: draft.guidedResponse.commonMistakes.filter((_, at) => at !== index),
                          },
                        })
                      }
                    >
                      {ed.removeCommonMistake(index + 1)}
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  change({
                    guidedResponse: {
                      ...draft.guidedResponse,
                      commonMistakes: [...draft.guidedResponse.commonMistakes, ""],
                    },
                  })
                }
              >
                {ed.addCommonMistake}
              </button>
            </div>

            <div id="guided-follow-ups" className="field" tabIndex={-1}>
              <h3>{ed.followUps}</h3>
              {draft.guidedResponse.followUps.map((followUp, index) => (
                <div key={index} className="reference">
                  <Field id={`guided-follow-up-${index}`} label={ed.followUp(index + 1)}>
                    <input
                      id={`guided-follow-up-${index}`}
                      type="text"
                      value={followUp}
                      onChange={(event) => setGuidedList("followUps", index, event.target.value)}
                    />
                  </Field>
                  {draft.guidedResponse.followUps.length > 1 ? (
                    <button
                      type="button"
                      className="link-button"
                      onClick={() =>
                        change({
                          guidedResponse: {
                            ...draft.guidedResponse,
                            followUps: draft.guidedResponse.followUps.filter((_, at) => at !== index),
                          },
                        })
                      }
                    >
                      {ed.removeFollowUp(index + 1)}
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  change({
                    guidedResponse: {
                      ...draft.guidedResponse,
                      followUps: [...draft.guidedResponse.followUps, ""],
                    },
                  })
                }
              >
                {ed.addFollowUp}
              </button>
            </div>
          </section>
        ) : (
          <>
            <fieldset id="options" className="field" tabIndex={-1}>
              <legend>{ed.optionsLegend}</legend>
              <p className="hint">{ed.optionsHint(multiple)}</p>
              {draft.options.map((option, index) => (
                <div key={index} className="option">
                  <div className="letter" aria-hidden="true">
                    {KEYS[index]}
                  </div>
                  <div>
                    <Field id={`option-text-${index}`} label={ed.optionLabel(KEYS[index]!)}>
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
                      {ed.optionIsCorrect(KEYS[index]!)}
                    </label>
                    <Field id={`option-reason-${index}`} label={ed.reasonFor(KEYS[index]!)}>
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
                        {ed.removeOption(KEYS[index]!)}
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
                  {ed.addOption}
                </button>
              ) : null}
            </fieldset>

            <Field id="field-explanation" label={ed.explanation} hint={ed.explanationHint}>
              <textarea
                id="field-explanation"
                className="read"
                aria-describedby="field-explanation-hint"
                rows={5}
                value={draft.explanation}
                onChange={(event) => change({ explanation: event.target.value })}
              />
            </Field>
          </>
        )}

        <fieldset id="references" className="field" tabIndex={-1}>
          <legend>{ed.referencesLegend}</legend>
          <p className="hint">{ed.referencesHint}</p>
          {draft.references.map((reference, index) => (
            <div key={index} className="reference">
              <Field id={`reference-title-${index}`} label={ed.referenceTitle(index + 1)}>
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
              <Field id={`reference-url-${index}`} label={ed.referenceUrl(index + 1)}>
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
                  {ed.removeReference(index + 1)}
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            className="secondary"
            onClick={() => change({ references: [...draft.references, { title: "", url: "" }] })}
          >
            {ed.addReference}
          </button>
        </fieldset>

        <div className="actions">
          <button ref={saveButton} type="submit" className="secondary" disabled={save.isPending}>
            {ed.saveDraft}
          </button>
          <button type="button" disabled={save.isPending} onClick={() => save.mutate(true)}>
            {ed.sendForReview}
          </button>
          <span role="status" className="muted">
            {save.isPending ? ed.saving : savedAt ? ed.savedAt(savedAt) : ""}
          </span>
        </div>
      </form>

      <aside className="stage" aria-labelledby="send-checks">
        <h2 id="send-checks">{ed.checksHeading}</h2>
        {violations === null ? (
          <p className="hint">{ed.checksHint}</p>
        ) : violations.length === 0 ? (
          <p>{ed.nothingMissing}</p>
        ) : (
          <div role="alert">
            <ul className="todo">
              {violations.map((code) => {
                const known = wording[code];
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
        <p className="hint">{ed.needsAnotherReviewer}</p>
      </aside>
    </div>
  );
}

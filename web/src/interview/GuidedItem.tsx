import { useMemo, useState, type FormEvent } from "react";
import type { Confidence, GuidedOutcome, Question } from "../api/types";
import { English } from "../i18n/English";
import type { Catalog } from "../i18n/en";
import { useText } from "../i18n/useText";
import { ErrorSummary } from "../ui/Form";
import { Prompt } from "../ui/Prompt";
import { useFocusOnMount } from "../ui/useFocusOnMount";

// Reuses the practice wording rather than its own: an objective item and a guided item in the
// same session ask the identical question, "how sure are you?", and a learner who sees two
// different phrasings for one idea would reasonably wonder whether something else changed too.
function confidenceLevels(t: Catalog): { value: Confidence; label: string }[] {
  return [
    { value: "LOW", label: t.question.confidenceLow },
    { value: "MEDIUM", label: t.question.confidenceMedium },
    { value: "HIGH", label: t.question.confidenceHigh },
  ];
}

/**
 * A guided item: the learner answers in their own words and nothing grades it (ADR 0019).
 *
 * The text area is deliberately a dead end. What is typed stays in this component's state, is
 * never put in the request, and is gone when the page is left — the field exists because writing
 * an answer out is how a candidate rehearses one, not because the product wants the answer. The
 * request carries only that the item was answered, how sure they were, and how long it took.
 */
export function GuidedItem({
  question,
  number,
  total,
  failure,
  submitting,
  onSubmit,
}: {
  question: Question;
  number: number;
  total: number;
  failure: string | null;
  submitting: boolean;
  onSubmit: (
    request: { confidence: Confidence; elapsedMillis: number; selectedOptions: string[] },
    idempotencyKey: string,
  ) => void;
}) {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const [shownAt] = useState(() => performance.now());
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [draft, setDraft] = useState("");
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [problems, setProblems] = useState<{ fieldId?: string; message: string }[]>([]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!confidence) {
      setProblems([{ fieldId: "guided-confidence-LOW", message: t.question.sayConfidence }]);
      return;
    }
    setProblems([]);
    onSubmit(
      {
        // Empty on purpose, and the server refuses a guided item that carries options at all:
        // selecting between alternatives is not what this kind of item asks for.
        selectedOptions: [],
        confidence,
        elapsedMillis: Math.max(0, Math.round(performance.now() - shownAt)),
      },
      idempotencyKey,
    );
  }

  const shown = useMemo(
    () => (failure ? [...problems, { message: failure }] : problems),
    [problems, failure],
  );

  return (
    <section aria-labelledby="guided-heading" className="asking">
      <h2 id="guided-heading" ref={heading} tabIndex={-1} className="eyebrow">
        {t.interview.session.itemHeading(number, total)}
      </h2>
      {/* Which kind of item this is, said rather than implied by styling: the two are evaluated
          differently and a learner has to know which one they are looking at. */}
      <p className="item-kind item-kind-guided">{t.interview.session.guidedKind}</p>
      <p>{t.interview.session.guidedKindExplain}</p>
      <ErrorSummary problems={shown} />
      <form onSubmit={submit} noValidate>
        <Prompt text={question.prompt} />

        <div className="field">
          <label htmlFor="guided-draft">{t.interview.session.yourAnswer}</label>
          <p id="guided-draft-hint" className="muted">
            {t.interview.session.yourAnswerHint}
          </p>
          <textarea
            id="guided-draft"
            aria-describedby="guided-draft-hint"
            rows={8}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>

        <fieldset className="segmented">
          <legend>{t.question.confidenceLegend}</legend>
          {confidenceLevels(t).map((level) => (
            <div key={level.value} className="choice">
              <input
                id={`guided-confidence-${level.value}`}
                type="radio"
                name="guided-confidence"
                checked={confidence === level.value}
                onChange={() => setConfidence(level.value)}
              />
              <label htmlFor={`guided-confidence-${level.value}`}>{level.label}</label>
            </div>
          ))}
        </fieldset>

        <button type="submit" disabled={submitting}>
          {submitting ? t.interview.session.revealing : t.interview.session.reveal}
        </button>
      </form>
    </section>
  );
}

/**
 * What a reviewer expected, after the learner has committed their own answer.
 *
 * The concept checkboxes are the learner's own statement about their own answer — the product never
 * saw the answer and cannot check them. They are sent as marks and read back as marks, which is why
 * the wording says "you said" everywhere rather than "covered".
 */
export function GuidedOutcomePanel({
  outcome,
  marks,
  onMark,
  action,
}: {
  outcome: GuidedOutcome;
  marks: Record<number, boolean>;
  onMark: (position: number, covered: boolean) => void;
  action: { label: string; busy: boolean; onClick: () => void };
}) {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();

  return (
    <section aria-labelledby="guided-outcome" className="asking">
      <h2 id="guided-outcome" ref={heading} tabIndex={-1}>
        {t.interview.session.referenceAnswer}
      </h2>
      {/* Reviewed content, so it stays in English in every locale (ADR 0012 decision 2). */}
      <p>
        <English>{outcome.referenceAnswer}</English>
      </p>

      {outcome.expectedConcepts.length > 0 ? (
        <fieldset>
          <legend>{t.interview.session.expectedConcepts}</legend>
          <p className="muted">{t.interview.session.marksExplain}</p>
          {outcome.expectedConcepts.map((concept, position) => (
            <div key={position} className="choice">
              <input
                id={`concept-${position}`}
                type="checkbox"
                checked={marks[position] === true}
                onChange={(event) => onMark(position, event.target.checked)}
              />
              <label htmlFor={`concept-${position}`}>
                <English>{concept.text}</English>{" "}
                <span className="muted">
                  (
                  {concept.required
                    ? t.interview.session.conceptRequired
                    : t.interview.session.conceptOptional}
                  )
                </span>
              </label>
              {concept.explanation ? (
                <p className="field-below">
                  <English>{concept.explanation}</English>
                </p>
              ) : null}
            </div>
          ))}
        </fieldset>
      ) : null}

      {outcome.commonMistakes.length > 0 ? (
        <>
          <h3>{t.interview.session.commonMistakes}</h3>
          <ul className="interview-list">
            {outcome.commonMistakes.map((mistake) => (
              <li key={mistake}>
                <English>{mistake}</English>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {outcome.followUps.length > 0 ? (
        <>
          <h3>{t.interview.session.followUps}</h3>
          <ul className="interview-list">
            {outcome.followUps.map((followUp) => (
              <li key={followUp}>
                <English>{followUp}</English>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <button type="button" onClick={action.onClick} disabled={action.busy}>
        {action.label}
      </button>
    </section>
  );
}

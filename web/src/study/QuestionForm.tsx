import { Prompt } from "../ui/Prompt";
import { useMemo, useState, type FormEvent } from "react";
import type { AttemptRequest, Confidence, Question } from "../api/types";
import { useText } from "../i18n/useText";
import type { Catalog } from "../i18n/en";
import { ErrorSummary } from "../ui/Form";
import { useFocusOnMount } from "../ui/useFocusOnMount";

/** The levels in the order they are offered, with the wording read from the active catalog. */
function confidenceLevels(t: Catalog): { value: Confidence; label: string }[] {
  return [
    { value: "LOW", label: t.question.confidenceLow },
    { value: "MEDIUM", label: t.question.confidenceMedium },
    { value: "HIGH", label: t.question.confidenceHigh },
  ];
}

/**
 * One question. The learner picks one answer (single choice) or any number (multiple choice), says
 * how confident they are, and submits. The question carries no expected-answer data: that arrives
 * only in the response to an accepted submission.
 *
 * The idempotency key is created once per question and reused if the learner submits again after a
 * failure, so a retry after a dropped connection cannot record the answer twice.
 */
export function QuestionForm({
  question,
  number,
  total,
  failure,
  submitting,
  onSubmit,
}: {
  question: Question;
  /** The question's number as the learner reads it, starting at 1. */
  number: number;
  total: number;
  failure: string | null;
  submitting: boolean;
  onSubmit: (request: AttemptRequest, idempotencyKey: string) => void;
}) {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const [shownAt] = useState(() => performance.now());
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [selected, setSelected] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [problems, setProblems] = useState<{ fieldId?: string; message: string }[]>([]);

  const multiple = question.type === "MULTIPLE_CHOICE";
  const firstOption = `option-${question.options[0]?.key ?? "0"}`;

  function toggle(key: string) {
    setSelected((current) =>
      multiple
        ? current.includes(key)
          ? current.filter((candidate) => candidate !== key)
          : [...current, key]
        : [key],
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const found: { fieldId?: string; message: string }[] = [];
    if (selected.length === 0) {
      found.push({
        fieldId: firstOption,
        message: multiple ? t.question.chooseAtLeastOne : t.question.chooseOne,
      });
    }
    if (!confidence) {
      found.push({ fieldId: "confidence-LOW", message: t.question.sayConfidence });
    }
    setProblems(found);
    if (found.length > 0 || !confidence) {
      return;
    }
    onSubmit(
      {
        selectedOptions: selected,
        confidence,
        elapsedMillis: Math.max(0, Math.round(performance.now() - shownAt)),
      },
      idempotencyKey,
    );
  }

  // Stable between renders: the summary takes focus when this array changes, and re-rendering for a
  // keystroke or a click must not pull focus back to it.
  const shown = useMemo(
    () => (failure ? [...problems, { message: failure }] : problems),
    [problems, failure],
  );

  return (
    <section aria-labelledby="question-heading">
      <h2 id="question-heading" ref={heading} tabIndex={-1}>
        {t.question.heading(number, total)}
      </h2>
      <ErrorSummary problems={shown} />
      <form onSubmit={submit} noValidate>
        <Prompt text={question.prompt} />

        <fieldset>
          <legend>{multiple ? t.question.chooseAllCorrect : t.question.chooseOneAnswer}</legend>
          {question.options.map((option) => (
            <div key={option.key} className="choice">
              <input
                id={`option-${option.key}`}
                type={multiple ? "checkbox" : "radio"}
                name="answer"
                checked={selected.includes(option.key)}
                onChange={() => toggle(option.key)}
              />
              <label htmlFor={`option-${option.key}`}>
                <span className="visually-hidden">{t.question.optionPrefix(option.key)}</span>
                {option.text}
              </label>
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>{t.question.confidenceLegend}</legend>
          {confidenceLevels(t).map((level) => (
            <div key={level.value} className="choice">
              <input
                id={`confidence-${level.value}`}
                type="radio"
                name="confidence"
                checked={confidence === level.value}
                onChange={() => setConfidence(level.value)}
              />
              <label htmlFor={`confidence-${level.value}`}>{level.label}</label>
            </div>
          ))}
        </fieldset>

        <button type="submit" disabled={submitting}>
          {submitting ? t.question.submitting : t.question.submit}
        </button>
      </form>
    </section>
  );
}

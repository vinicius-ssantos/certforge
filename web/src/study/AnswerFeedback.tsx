import { Prompt } from "../ui/Prompt";
import type { AttemptResult, Question } from "../api/types";
import { English } from "../i18n/English";
import { useText } from "../i18n/useText";
import { AnswerList } from "../ui/AnswerList";
import { VerificationEvidence } from "../ui/VerificationEvidence";
import { useFocusOnMount } from "../ui/useFocusOnMount";

/**
 * The outcome of an accepted submission: whether it was right, which options were correct and why,
 * and where to read more. Correctness is stated in words and markers, never by colour alone.
 */
export function AnswerFeedback({
  question,
  result,
  action,
}: {
  question: Question;
  result: AttemptResult;
  action: { label: string; onClick: () => void; busy: boolean };
}) {
  const t = useText();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const chosen = new Set(result.selectedOptions);

  return (
    <section aria-labelledby="result-heading" className="asking">
      <h2 id="result-heading" ref={heading} tabIndex={-1}>
        {result.correct ? t.feedback.correct : t.feedback.notQuite}
      </h2>
      <Prompt text={question.prompt} />

      <AnswerList options={result.answer.options} chosen={chosen} chosenFirst />

      <VerificationEvidence verification={result.answer.verification} />

      <h3>{t.feedback.explanation}</h3>
      <Prompt text={result.answer.explanation} />

      {result.answer.references.length > 0 ? (
        <>
          <h3>{t.feedback.readMore}</h3>
          <ul>
            {result.answer.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer">
                  <English>{t.feedback.referenceLink(reference.title)}</English>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p>
        <button type="button" onClick={action.onClick} disabled={action.busy}>
          {action.label}
        </button>
      </p>
    </section>
  );
}

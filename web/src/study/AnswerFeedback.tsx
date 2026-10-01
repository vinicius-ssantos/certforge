import { Prompt } from "../ui/Prompt";
import type { AttemptResult, Question } from "../api/types";
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
  const heading = useFocusOnMount<HTMLHeadingElement>();
  const correctKeys = new Set(result.answer.correctOptions);
  const chosen = new Set(result.selectedOptions);

  return (
    <section aria-labelledby="result-heading">
      <h2 id="result-heading" ref={heading} tabIndex={-1}>
        {result.correct ? "Correct" : "Not quite"}
      </h2>
      <Prompt text={question.prompt} />

      <ul className="answers">
        {result.answer.options.map((option) => (
          <li key={option.key} className={option.correct ? "answer-correct" : undefined}>
            <p>
              <strong>
                {option.key}. {option.text}
              </strong>
            </p>
            <p className="muted">
              {chosen.has(option.key) ? "Your answer. " : ""}
              {correctKeys.has(option.key) ? "Correct answer." : "Incorrect answer."}
            </p>
            {option.explanation ? <p>{option.explanation}</p> : null}
          </li>
        ))}
      </ul>

      <h3>Explanation</h3>
      <Prompt text={result.answer.explanation} />

      {result.answer.references.length > 0 ? (
        <>
          <h3>Read more</h3>
          <ul>
            {result.answer.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener noreferrer">
                  {reference.title} (opens in a new tab)
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

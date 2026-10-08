import { English } from "../i18n/English";
import { useText } from "../i18n/useText";

/** One option as any of the three screens below receives it from the API. */
export type AnswerOption = {
  key: string;
  text: string;
  correct: boolean;
  explanation?: string | null;
};

/**
 * The options of an answered question, with which one was right and which the learner picked.
 *
 * Three screens show this — the feedback after a practice answer, the review of a finished
 * session, and the review after a mock exam closes — and they showed it three times over in
 * slightly different markup. One component means a change to how an answered question reads
 * happens once, and means the three screens cannot drift apart again.
 *
 * Correctness is said three ways on purpose, because colour alone is not allowed to carry it: the
 * fill and the rail, the tick or the cross, and a sentence naming both whether the option is
 * correct and whether it was the learner's.
 */
export function AnswerList({
  options,
  chosen,
  chosenFirst = false,
}: {
  options: readonly AnswerOption[];
  chosen: ReadonlySet<string>;
  /**
   * Put the learner's own answer at the top. True on the feedback screen, where the first thing
   * anyone looks for is what they picked and whether it held up; false where the list is being
   * read back as a record and the question's own order is the honest one. The sort is stable, so
   * the question's order survives inside each group.
   */
  chosenFirst?: boolean;
}) {
  const t = useText();
  const ordered = chosenFirst
    ? [...options].sort((a, b) => Number(chosen.has(b.key)) - Number(chosen.has(a.key)))
    : options;

  return (
    <ul className="answers">
      {ordered.map((option) => (
        <li key={option.key} className={option.correct ? "answer-correct" : undefined}>
          {/* The letter is announced by the prefix inside the text below, so the badge is
              decoration to a screen reader and a landmark to everyone else. */}
          <span className="key" aria-hidden="true">
            {option.key}
          </span>
          <div>
            <p className="answer-text">
              <span className="visually-hidden">{t.question.optionPrefix(option.key)}</span>
              <English>{option.text}</English>
            </p>
            <p className={option.correct ? "verdict verdict-ok" : "verdict"}>
              <span aria-hidden="true">{option.correct ? "✓" : "✗"}</span>{" "}
              {chosen.has(option.key) ? t.feedback.yourAnswer : ""}
              {option.correct ? t.feedback.correctAnswer : t.feedback.incorrectAnswer}
            </p>
            {option.explanation ? (
              <English as="p" className="why">
                {option.explanation}
              </English>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

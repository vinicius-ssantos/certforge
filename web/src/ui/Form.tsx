import { useEffect, useRef, type ReactNode } from "react";
import { useText } from "../i18n/useText";

/**
 * The error summary at the top of a form. It is an alert and takes focus when it appears, so a
 * keyboard or screen-reader user lands on the problem instead of having to search for it, and each
 * item links to the field it is about.
 */
export function ErrorSummary({
  problems,
}: {
  problems: { fieldId?: string; message: string }[];
}) {
  const t = useText();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (problems.length > 0) {
      ref.current?.focus();
    }
  }, [problems]);
  if (problems.length === 0) {
    return null;
  }
  return (
    <div ref={ref} role="alert" tabIndex={-1} className="error-summary">
      <h2>{t.form.problemTitle}</h2>
      <ul>
        {problems.map((problem, index) => (
          <li key={`${problem.fieldId ?? "form"}-${index}`}>
            {problem.fieldId ? <a href={`#${problem.fieldId}`}>{problem.message}</a> : problem.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A labelled text field with its own error and hint wired up for assistive technology. */
export function TextField({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  error,
  hint,
  below,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  hint?: ReactNode;
  /**
   * Content shown under the control rather than over it, for anything that describes what
   * has been typed. A hint belongs above, where it is read before the field is filled; a
   * readout of the field's own contents belongs below it, where the eye already is.
   * Described to assistive technology the same way the hint is.
   */
  below?: ReactNode;
}) {
  const t = useText();
  const hintId = `${id}-hint`;
  const belowId = `${id}-below`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, below ? belowId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint ? (
        <p id={hintId} className="hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error">
          <span className="visually-hidden">{t.form.errorPrefix}</span>
          {error}
        </p>
      ) : null}
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {below ? (
        <div id={belowId} className="field-below">
          {below}
        </div>
      ) : null}
    </div>
  );
}

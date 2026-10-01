import { useEffect, useRef, type ReactNode } from "react";

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
      <h2>There is a problem</h2>
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
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  hint?: ReactNode;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");
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
          <span className="visually-hidden">Error: </span>
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
    </div>
  );
}

import { LIFECYCLE, statusOf } from "./labels";

/** A status as symbol plus word. The symbol is decoration for sighted users; the word is the state. */
export function StatusMark({ status }: { status: string }) {
  const { label, symbol, tone } = statusOf(status);
  return (
    <span className={`status status-${tone}`}>
      <span aria-hidden="true">{symbol}</span>
      {label}
    </span>
  );
}

/**
 * The life of a revision as a numbered sequence, which it really is: written, reviewed, approved,
 * published. Earlier steps are marked done, the current one is announced as the current step.
 */
export function StatusRail({ status }: { status: string }) {
  const position = LIFECYCLE.indexOf(status as (typeof LIFECYCLE)[number]);
  return (
    <ol className="rail" aria-label="Revision status">
      {LIFECYCLE.map((step, index) => {
        const done = position > index || status === "PUBLISHED";
        const current = position === index;
        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className={done && !current ? "done" : undefined}
          >
            <span aria-hidden="true">{done && !current ? "✓" : index + 1}</span>
            {statusOf(step).label}
            {done && !current ? <span className="visually-hidden"> (done)</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

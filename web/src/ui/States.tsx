import type { ReactNode } from "react";
import { ApiError } from "../api/problem";
import { errorMessage } from "./messages";

/** Announced politely to screen readers; sighted users see a plain message. */
export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <p role="status" className="state">
      {label}…
    </p>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="state" aria-labelledby="empty-title">
      <h2 id="empty-title">{title}</h2>
      {children}
    </section>
  );
}

/**
 * A failure the learner can act on. It is an alert, so screen readers announce it immediately, and
 * it offers a retry. The reference is the backend request id: quoting it lets support find exactly
 * what happened.
 */
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const reference = error instanceof ApiError ? error.requestId : undefined;
  return (
    <div role="alert" className="state state-error">
      <h2>That did not work</h2>
      <p>{errorMessage(error)}</p>
      {reference ? (
        <p className="muted">
          Reference: <code>{reference}</code>
        </p>
      ) : null}
      {onRetry ? (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

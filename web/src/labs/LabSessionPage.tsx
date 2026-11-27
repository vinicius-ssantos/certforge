import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { LabSession, LabSummary } from "../api/types";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useFocusOnMount } from "../ui/useFocusOnMount";
import { LabTerminal } from "./LabTerminal";

interface NavigationState {
  lab: LabSummary;
  session: LabSession;
}

function isNavigationState(value: unknown): value is NavigationState {
  return (
    typeof value === "object" &&
    value !== null &&
    "lab" in value &&
    "session" in value
  );
}

export function LabSessionPage() {
  const t = useText();
  const { sessionId = "" } = useParams();
  const api = useApi();
  const state = useLocation().state;
  const navigationState = isNavigationState(state) ? state : null;
  const heading = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle(navigationState?.lab.title ?? t.labs.title);

  const complete = useMutation({
    mutationFn: () => unwrap(api.POST("/api/labs/sessions/{sessionId}/complete", { params: { path: { sessionId } } })),
  });

  if (!navigationState) {
    return (
      <EmptyState title={t.labs.sessionLost}>
        <p>{t.labs.sessionLostBody}</p>
        <p>
          <Link to="/labs">{t.labs.backToLabs}</Link>
        </p>
      </EmptyState>
    );
  }

  const { lab, session } = navigationState;

  return (
    <>
      <h1 ref={heading} tabIndex={-1}>
        {lab.title}
      </h1>
      <section aria-labelledby="lab-objective-heading">
        <h2 id="lab-objective-heading" className="eyebrow">
          {t.labs.objective}
        </h2>
        <p>{lab.description}</p>
        <p className="hint">{t.labs.timeLimit(Math.round(lab.timeoutSeconds / 60))}</p>
      </section>

      {complete.isSuccess ? (
        <section aria-labelledby="lab-verdict-heading">
          <h2 id="lab-verdict-heading">{complete.data.passed ? t.labs.passed : t.labs.notPassed}</h2>
          <h3 className="eyebrow">{t.labs.checksHeading}</h3>
          <ul>
            {complete.data.checks.map((check, index) => (
              <li key={index}>
                {check.passed ? "✓" : "○"} {check.description}
              </li>
            ))}
          </ul>
          <p>
            <Link to="/labs">{t.labs.backToLabs}</Link>
          </p>
        </section>
      ) : (
        <>
          <LabTerminal interactiveUrl={session.interactiveUrl} interactiveToken={session.interactiveToken} />
          {complete.isError ? <ErrorState error={complete.error} onRetry={() => complete.mutate()} /> : null}
          <button type="button" onClick={() => complete.mutate()} disabled={complete.isPending}>
            {complete.isPending ? t.labs.checking : t.labs.checkWork}
          </button>
        </>
      )}
    </>
  );
}

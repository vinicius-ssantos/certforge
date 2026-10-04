import { Outlet } from "react-router";
import { useHasAny } from "../auth/permissions";
import { useText } from "../i18n/useText";
import { EmptyState } from "../ui/States";

/** The editorial desk is for authors, reviewers and publishers; everyone else is told so. */
export function RequireEditorial() {
  const t = useText();
  const allowed = useHasAny("CONTENT_AUTHOR", "CONTENT_REVIEW", "CONTENT_PUBLISH");
  if (!allowed) {
    return (
      <>
        <h1>{t.editorial.deskTitle}</h1>
        <EmptyState title={t.editorial.noDeskAccess}>
          <p>{t.editorial.noDeskAccessBody}</p>
        </EmptyState>
      </>
    );
  }
  return <Outlet />;
}

import { Outlet } from "react-router";
import { useHasAny } from "../auth/permissions";
import { EmptyState } from "../ui/States";

/** The editorial desk is for authors, reviewers and publishers; everyone else is told so. */
export function RequireEditorial() {
  const allowed = useHasAny("CONTENT_AUTHOR", "CONTENT_REVIEW", "CONTENT_PUBLISH");
  if (!allowed) {
    return (
      <>
        <h1>Editorial desk</h1>
        <EmptyState title="You do not have access to the editorial desk">
          <p>Ask an administrator for the editor or reviewer role.</p>
        </EmptyState>
      </>
    );
  }
  return <Outlet />;
}

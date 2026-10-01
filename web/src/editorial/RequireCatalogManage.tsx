import { Outlet } from "react-router";
import { useHasAny } from "../auth/permissions";
import { EmptyState } from "../ui/States";

/** The catalog is administrators' ground; editors and reviewers do not see it. */
export function RequireCatalogManage() {
  const allowed = useHasAny("CATALOG_MANAGE");
  if (!allowed) {
    return (
      <>
        <h1>Catalog</h1>
        <EmptyState title="You do not have access to the catalog">
          <p>Managing the catalog is an administrator's job. Ask one if something there looks wrong.</p>
        </EmptyState>
      </>
    );
  }
  return <Outlet />;
}

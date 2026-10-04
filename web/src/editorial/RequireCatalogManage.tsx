import { Outlet } from "react-router";
import { useHasAny } from "../auth/permissions";
import { useText } from "../i18n/useText";
import { EmptyState } from "../ui/States";

/** The catalog is administrators' ground; editors and reviewers do not see it. */
export function RequireCatalogManage() {
  const t = useText();
  const allowed = useHasAny("CATALOG_MANAGE");
  if (!allowed) {
    return (
      <>
        <h1>{t.editorial.catalogTitle}</h1>
        <EmptyState title={t.editorial.noCatalogAccess}>
          <p>{t.editorial.noCatalogAccessBody}</p>
        </EmptyState>
      </>
    );
  }
  return <Outlet />;
}

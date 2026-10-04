import type { Catalog } from "../i18n/en";
import type { StatusTone } from "./labels";

/** Catalog status, worded for a reader, with a symbol so colour is never the only signal. */
export function catalogStatusOf(
  status: string,
  t: Catalog,
): { label: string; symbol: string; tone: StatusTone } {
  const known: Record<string, { label: string; symbol: string; tone: StatusTone }> = {
    ACTIVE: { label: t.editorial.catalogStatus.active, symbol: "●", tone: "ok" },
    DRAFT: { label: t.editorial.catalogStatus.draft, symbol: "○", tone: "draft" },
    INACTIVE: { label: t.editorial.catalogStatus.inactive, symbol: "–", tone: "draft" },
  };
  return known[status] ?? { label: status, symbol: "○", tone: "draft" };
}

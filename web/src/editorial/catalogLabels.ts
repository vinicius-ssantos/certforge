import type { StatusTone } from "./labels";

/** Catalog status, worded for a reader, with a symbol so colour is never the only signal. */
export const CATALOG_STATUS: Record<string, { label: string; symbol: string; tone: StatusTone }> = {
  ACTIVE: { label: "Active", symbol: "●", tone: "ok" },
  DRAFT: { label: "Draft", symbol: "○", tone: "draft" },
  INACTIVE: { label: "Inactive", symbol: "–", tone: "draft" },
};

export function catalogStatusOf(status: string) {
  return CATALOG_STATUS[status] ?? { label: status, symbol: "○", tone: "draft" as StatusTone };
}

import type { Catalog } from "../i18n/en";

/**
 * Dates follow the *chosen* locale, not the browser's. ADR 0012 counts "the formatting of dates
 * and numbers" as part of the interface, so a reader who switched the interface to Portuguese and
 * left their browser in English should see 4 de out. de 2026, not Oct 4, 2026.
 *
 * Formatters are cached because constructing one is the expensive part and these run per table row.
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(locale: string): Intl.DateTimeFormat {
  let found = formatters.get(locale);
  if (!found) {
    found = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
    formatters.set(locale, found);
  }
  return found;
}

export function formatDateTime(iso: string, locale: string): string {
  return formatterFor(locale).format(new Date(iso));
}

/** How each session status is named. Unknown statuses are shown as the code, as before. */
export function statusLabel(status: string, t: Catalog): string {
  const labels: Record<string, string> = {
    IN_PROGRESS: t.sessionStatus.inProgress,
    COMPLETED: t.sessionStatus.completed,
    ABANDONED: t.sessionStatus.abandoned,
    EXPIRED: t.sessionStatus.expired,
  };
  return labels[status] ?? status;
}

import type { Catalog } from "../i18n/en";

const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
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

const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

export const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  ABANDONED: "Ended early",
  EXPIRED: "Expired",
};

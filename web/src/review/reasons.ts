import type { ReviewReason } from "../api/types";
import type { Catalog } from "../i18n/en";

/**
 * What each reason means, in words. The server sends a stable code and the wording lives in the
 * catalog, the way error codes already do, so it can be reviewed and translated without touching
 * the API.
 *
 * <p>The order the server returns is the order of importance; nothing here re-sorts it.
 */
function wording(t: Catalog): Record<ReviewReason, { label: string; explanation: string }> {
  return {
    WRONG_WHILE_CONFIDENT: t.review.reasons.wrongWhileConfident,
    WRONG: t.review.reasons.wrong,
    RIGHT_BUT_UNSURE: t.review.reasons.rightButUnsure,
    DUE_FOR_RECALL: t.review.reasons.dueForRecall,
  };
}

export function reasonLabel(reason: ReviewReason, t: Catalog): string {
  return wording(t)[reason].label;
}

export function reasonExplanation(reason: ReviewReason, t: Catalog): string {
  return wording(t)[reason].explanation;
}

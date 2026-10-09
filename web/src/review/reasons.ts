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
  return wording(t)[reason]?.label ?? t.review.unknownReason;
}

export function reasonExplanation(reason: ReviewReason, t: Catalog): string {
  return wording(t)[reason]?.explanation ?? t.review.unknownReasonExplanation;
}

/**
 * The pill tone for a reason. The label carries the meaning; this only colours it.
 *
 * Red where the evidence is that something is believed and wrong — the one case nothing warned
 * the learner about. Brass where the answer happened to land but the learner said they were
 * guessing, or where time alone has made it worth asking again. An unknown code gets the neutral
 * tone rather than nothing, so a reason added to the API later still renders as a reason.
 */
export function reasonTone(reason: ReviewReason): string {
  if (reason === "WRONG_WHILE_CONFIDENT" || reason === "WRONG") return "pill-stop";
  if (reason === "RIGHT_BUT_UNSURE" || reason === "DUE_FOR_RECALL") return "pill-hold";
  return "pill-new";
}

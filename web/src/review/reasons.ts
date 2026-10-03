import type { ReviewReason } from "../api/types";

/**
 * What each reason means, in words. The server sends a stable code and the wording lives here, the
 * way error codes already work, so it can be reviewed and translated without touching the API.
 *
 * <p>The order the server returns is the order of importance; nothing here re-sorts it.
 */
const WORDING: Record<ReviewReason, { label: string; explanation: string }> = {
  WRONG_WHILE_CONFIDENT: {
    label: "Wrong, and you were sure",
    explanation:
      "You answered this incorrectly while saying you were confident. That is worth more of your attention than a question you knew you were guessing at, because nothing has told you to look again.",
  },
  WRONG: {
    label: "Wrong",
    explanation: "You answered this incorrectly.",
  },
  RIGHT_BUT_UNSURE: {
    label: "Right, but unsure",
    explanation:
      "You answered this correctly while saying you were not confident. Your accuracy counts it as a success; getting it right twice would mean more.",
  },
  DUE_FOR_RECALL: {
    label: "Due for recall",
    explanation:
      "You answered this correctly and confidently a while ago. It is here to prove it stuck, and the gap before it returns grows each time you get it right.",
  },
};

export function reasonLabel(reason: ReviewReason): string {
  return WORDING[reason].label;
}

export function reasonExplanation(reason: ReviewReason): string {
  return WORDING[reason].explanation;
}

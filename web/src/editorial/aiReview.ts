import type { Revision } from "../api/types";

/**
 * Mirrors the server's derivation (ADR 0022, `AiReview.approved` on the backend): true if any
 * review on this revision is the AI reviewer's `AI_APPROVED` decision. Made final rather than
 * provisional by ADR 0025, so unlike before there is no later confirmation that could clear this.
 */
export function aiApproved(reviews: Revision["reviews"]): boolean {
  return reviews.some((review) => review.decision === "AI_APPROVED");
}

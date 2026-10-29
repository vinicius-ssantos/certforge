import type { Revision } from "../api/types";

/**
 * Mirrors the server's derivation (ADR 0022, `AiReview.pending` on the backend): true while the
 * most recent `AI_APPROVED` decision, if there is one, has no later `AI_REVIEW_CONFIRMED`. Nothing
 * is stored for this on the client either; it is read back from the same review history the server
 * already sent.
 */
export function pendingAiApproval(reviews: Revision["reviews"]): boolean {
  let latestApproval: Revision["reviews"][number] | undefined;
  for (const review of reviews) {
    if (review.decision === "AI_APPROVED") {
      latestApproval = review;
    }
  }
  if (!latestApproval) {
    return false;
  }
  return !reviews.some(
    (review) =>
      review.decision === "AI_REVIEW_CONFIRMED" &&
      new Date(review.decidedAt) > new Date(latestApproval.decidedAt),
  );
}

import { describe, expect, it } from "vitest";
import { pendingAiApproval } from "./aiReview";
import type { Revision } from "../api/types";

function review(decision: string, decidedAt: string): Revision["reviews"][number] {
  return {
    reviewerId: "11111111-0000-4000-8000-000000000001",
    reviewerName: "Someone",
    decision,
    comment: null,
    checklist: [],
    decidedAt,
  };
}

describe("pendingAiApproval", () => {
  it("is false when nothing was ever AI-approved", () => {
    expect(pendingAiApproval([review("APPROVED", "2026-10-01T00:00:00Z")])).toBe(false);
  });

  it("is true right after an AI approval with nothing confirming it since", () => {
    expect(pendingAiApproval([review("AI_APPROVED", "2026-10-01T00:00:00Z")])).toBe(true);
  });

  it("is false once a confirmation after the approval exists", () => {
    expect(
      pendingAiApproval([
        review("AI_APPROVED", "2026-10-01T00:00:00Z"),
        review("AI_REVIEW_CONFIRMED", "2026-10-05T00:00:00Z"),
      ]),
    ).toBe(false);
  });

  it("ignores a confirmation that predates the approval it is asked about", () => {
    expect(
      pendingAiApproval([
        review("AI_REVIEW_CONFIRMED", "2026-09-01T00:00:00Z"),
        review("AI_APPROVED", "2026-10-01T00:00:00Z"),
      ]),
    ).toBe(true);
  });
});

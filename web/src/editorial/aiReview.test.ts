import { describe, expect, it } from "vitest";
import { aiApproved } from "./aiReview";
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

describe("aiApproved", () => {
  it("is false when the revision was approved by a person", () => {
    expect(aiApproved([review("APPROVED", "2026-10-01T00:00:00Z")])).toBe(false);
  });

  it("is true when the AI reviewer approved it", () => {
    expect(aiApproved([review("AI_APPROVED", "2026-10-01T00:00:00Z")])).toBe(true);
  });

  it("is false with no reviews at all", () => {
    expect(aiApproved([])).toBe(false);
  });
});

import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { renderApp } from "../test/render";

const TOPIC = "a3000000-0000-4000-8000-000000000001";

const noProgress = { "GET /api/progress/topics": { body: [] } };
const at = { path: "/progress" };

function row(overrides: Record<string, unknown> = {}) {
  return {
    topicId: TOPIC,
    topicName: "Working with Java data types",
    attempts: 3,
    questions: 1,
    lastAt: "2026-10-02T12:00:00Z",
    ...overrides,
  };
}

describe("where you were sure and wrong", () => {
  it("separates one idea stuck from a weak area", async () => {
    const { container } = renderApp(
      {
        ...noProgress,
        "GET /api/review/misconceptions": {
          body: [
            row(),
            row({
              topicId: "a3000000-0000-4000-8000-000000000002",
              topicName: "Controlling program flow",
              attempts: 3,
              questions: 3,
            }),
          ],
        },
      },
      at,
    );

    const rows = await screen.findAllByRole("row");
    // Three attempts across one question, against three across three.
    expect(rows[1]).toHaveTextContent("Working with Java data types");
    expect(rows[1]).toHaveTextContent("3");
    expect(rows[1]).toHaveTextContent("1");
    expect(rows[2]).toHaveTextContent("Controlling program flow");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("says it is evidence and not a prediction", async () => {
    renderApp({ ...noProgress, "GET /api/review/misconceptions": { body: [row()] } }, at);

    expect(await screen.findByText(/not.*a prediction about an exam/i)).toBeInTheDocument();
    // Nothing here claims readiness or mastery.
    expect(screen.queryByText(/ready/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/mastery/i)).not.toBeInTheDocument();
  });

  it("offers to review exactly those questions", async () => {
    renderApp({ ...noProgress, "GET /api/review/misconceptions": { body: [row()] } }, at);

    expect(await screen.findByRole("link", { name: "Review these questions" })).toHaveAttribute(
      "href",
      "/review",
    );
  });

  it("shows nothing at all when there is nothing to show", async () => {
    renderApp({ ...noProgress, "GET /api/review/misconceptions": { body: [] } }, at);

    await screen.findByRole("heading", { name: "No progress yet" });
    expect(
      screen.queryByRole("heading", { name: "Where you were sure and wrong" }),
    ).not.toBeInTheDocument();
  });
});

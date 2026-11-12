import { screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { renderApp } from "../test/render";

const noProgress = {
  "GET /api/progress/topics": { body: [] },
  "GET /api/review/misconceptions": { body: [] },
};
const at = { path: "/progress" };

function row(overrides: Record<string, unknown> = {}) {
  return {
    trackSlug: "java-certification",
    trackName: "Java Certification",
    topicsTotal: 10,
    topicsAttempted: 4,
    attempted: 20,
    correct: 15,
    accuracy: 0.75,
    ...overrides,
  };
}

describe("progress by certification", () => {
  it("shows coverage and accuracy for an active certification", async () => {
    const { container } = renderApp(
      { ...noProgress, "GET /api/progress/certifications": { body: [row()] } },
      at,
    );

    const heading = await screen.findByRole("heading", { name: "Progress by certification" });
    const section = heading.closest("section") as HTMLElement;
    const link = within(section).getByRole("link", { name: "Java Certification" });
    expect(link).toHaveAttribute("href", "/tracks/java-certification");
    const row0 = within(section).getAllByRole("row")[1];
    expect(row0).toHaveTextContent("4 of 10 topics");
    expect(row0).toHaveTextContent("75%");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("says a certification with no attempts yet is not started, without hiding its coverage", async () => {
    renderApp(
      {
        ...noProgress,
        "GET /api/progress/certifications": {
          body: [row({ topicsAttempted: 0, attempted: 0, correct: 0, accuracy: null })],
        },
      },
      at,
    );

    const row0 = (await screen.findAllByRole("row"))[1];
    expect(row0).toHaveTextContent("0 of 10 topics");
    expect(row0).toHaveTextContent("Not started");
  });

  it("says it is not a prediction about the exam", async () => {
    renderApp(
      { ...noProgress, "GET /api/progress/certifications": { body: [row()] } },
      at,
    );

    expect(
      await screen.findByText(/not a prediction about the exam/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/ready to pass|exam readiness/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/mastery/i)).not.toBeInTheDocument();
  });

  it("shows nothing at all when there is no active certification", async () => {
    renderApp({ ...noProgress, "GET /api/progress/certifications": { body: [] } }, at);

    await screen.findByRole("heading", { name: "No progress yet" });
    expect(
      screen.queryByRole("heading", { name: "Progress by certification" }),
    ).not.toBeInTheDocument();
  });

  it("says the section failed rather than showing nothing", async () => {
    renderApp(
      { ...noProgress, "GET /api/progress/certifications": problem(500, "internal_error") },
      at,
    );

    const failure = await screen.findByRole("alert");
    expect(failure).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Progress by certification" }),
    ).not.toBeInTheDocument();
  });
});

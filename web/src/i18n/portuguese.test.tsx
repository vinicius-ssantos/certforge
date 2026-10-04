import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { javaTrack, renderApp } from "../test/render";
import { en } from "./en";
import { ptBR } from "./pt-BR";

/**
 * The Portuguese interface, rendered. The catalog tests prove it is complete and that its counts
 * agree; these prove it actually reaches the screen, that `lang` follows it, and that the English
 * question text inside it is still marked as English.
 */
describe("the interface in Portuguese", () => {
  it("renders the navigation and the page in Portuguese", async () => {
    renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } }, { locale: "pt-BR" });

    expect(await screen.findByRole("heading", { name: ptBR.tracks.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: ptBR.layout.tracks })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: ptBR.layout.progress })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ptBR.layout.signOut })).toBeInTheDocument();

    // And not in English, which is the half a missing key would still pass.
    expect(screen.queryByRole("heading", { name: en.tracks.title })).not.toBeInTheDocument();
  });

  it("sets the document language, which is what a screen reader reads phonetics from", async () => {
    renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } }, { locale: "pt-BR" });

    expect(await screen.findByRole("heading", { name: ptBR.tracks.title })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("goes back to English when English is chosen", async () => {
    renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } }, { locale: "en" });

    expect(await screen.findByRole("heading", { name: en.tracks.title })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");
  });

  it("offers a labelled language control naming each language in itself", async () => {
    renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } }, { locale: "pt-BR" });

    const select = await screen.findByLabelText(ptBR.language.label);
    expect(select).toHaveValue("pt-BR");
    expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Português (Brasil)" })).toBeInTheDocument();
  });

  it("has no accessibility violations an automated check can see", async () => {
    const { container } = renderApp(
      { "GET /api/catalog/tracks": { body: [javaTrack] } },
      { locale: "pt-BR" },
    );

    expect(await screen.findByRole("heading", { name: ptBR.tracks.title })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("marks the English question text as English inside the Portuguese page", async () => {
    const question = {
      questionId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      revisionId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      revisionNumber: 1,
      type: "SINGLE_CHOICE" as const,
      topicId: javaTrack.topics[0]!.id,
      javaRelease: 21,
      difficulty: "MEDIUM" as const,
      prompt: "Which statement about `throws` is correct?",
      options: [
        { key: "A", text: "It declares a checked exception" },
        { key: "B", text: "It throws immediately" },
      ],
    };
    const sessionId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
    const { container } = renderApp(
      {
        [`GET /api/study/sessions/${sessionId}`]: {
          body: {
            id: sessionId,
            topicId: javaTrack.topics[0]!.id,
            status: "IN_PROGRESS",
            requestedCount: 1,
            createdAt: "2026-10-04T10:00:00Z",
            expiresAt: "2026-10-04T14:00:00Z",
            closedAt: null,
            questions: [{ position: 0, answered: false, question }],
          },
        },
      },
      { path: `/sessions/${sessionId}`, locale: "pt-BR" },
    );

    // Wait for the loaded question, not for the heading: the heading renders while the query is
    // still pending, so asserting on it would check the shell and not the content.
    const option = await screen.findByText("It declares a checked exception");

    // The interface around it is Portuguese.
    expect(screen.getByRole("heading", { name: ptBR.session.title })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ptBR.question.submit })).toBeInTheDocument();

    // The prompt is English and says so, so a screen reader does not read it with Portuguese
    // phonetics (ADR 0012).
    const prompt = container.querySelector(".prompt");
    expect(prompt).not.toBeNull();
    expect(prompt).toHaveAttribute("lang", "en");

    // So is the option text, which sits inside a Portuguese label.
    expect(option.closest("[lang='en']")).not.toBeNull();
  });

  it("remembers the choice, so a reload does not go back to the browser's language", async () => {
    const user = userEvent.setup();
    renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } }, { locale: "en" });

    expect(await screen.findByRole("heading", { name: en.tracks.title })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(en.language.label), "pt-BR");

    expect(localStorage.getItem("certforge.locale")).toBe("pt-BR");
  });
});

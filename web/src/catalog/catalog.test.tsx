import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { javaTrack, renderApp } from "../test/render";

describe("browsing tracks", () => {
  it("lists the available tracks with a link to each", async () => {
    const { container } = renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } });

    const link = await screen.findByRole("link", { name: "Java Certification" });
    expect(link).toHaveAttribute("href", "/tracks/java-certification");
    expect(screen.getByText(/Oracle · Java SE 21 \(1Z0-830\) · Java 21/)).toBeInTheDocument();
    expect(screen.getByText("2 topics")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("announces loading politely", async () => {
    renderApp({ "GET /api/catalog/tracks": () => new Promise(() => undefined) as never });

    expect(await screen.findByText(/Loading tracks/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading tracks");
  });

  it("says so when there are no tracks", async () => {
    renderApp({ "GET /api/catalog/tracks": { body: [] } });

    expect(
      await screen.findByRole("heading", { name: "No tracks are available yet" }),
    ).toBeInTheDocument();
  });

  it("shows a failure with its reference and lets the learner retry", async () => {
    const user = userEvent.setup();
    let calls = 0;
    renderApp({
      "GET /api/catalog/tracks": () =>
        ++calls === 1 ? problem(500, "internal_error") : { body: [javaTrack] },
    });

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Something went wrong on our side");
    expect(alert).toHaveTextContent("req-test-0001");
    await user.click(within(alert).getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("link", { name: "Java Certification" })).toBeInTheDocument();
  });

  it("treats a session that ended in the middle of browsing as signed out", async () => {
    renderApp({ "GET /api/catalog/tracks": problem(401, "unauthenticated") });

    expect(await screen.findByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
  });
});

describe("a track", () => {
  it("shows its topics in order, with subtopics nested, and the official objectives", async () => {
    const { container } = renderApp(
      { "GET /api/catalog/tracks/java-certification": { body: javaTrack } },
      { path: "/tracks/java-certification" },
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Java Certification" }),
    ).toBeInTheDocument();
    const topics = screen.getByRole("heading", { name: "Topics" }).nextElementSibling as HTMLElement;
    const top = within(topics).getAllByRole("listitem");
    expect(top[0]).toHaveTextContent("Handling exceptions");
    expect(within(top[0] as HTMLElement).getByText("try-with-resources")).toBeInTheDocument();
    const objectives = screen.getByRole("link", { name: /Official exam objectives/ });
    expect(objectives).toHaveAttribute("target", "_blank");
    expect(objectives).toHaveAttribute("rel", "noopener noreferrer");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("explains an unknown track and offers a way back", async () => {
    renderApp(
      { "GET /api/catalog/tracks/nope": problem(404, "track_not_found") },
      { path: "/tracks/nope" },
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("does not exist");
    expect(screen.getByRole("link", { name: "Back to all tracks" })).toHaveAttribute("href", "/");
  });
});

describe("navigation", () => {
  it("has a skip link, landmarks and a labelled navigation", async () => {
    renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } });

    await screen.findByRole("link", { name: "Java Certification" });
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main",
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tracks" })).toHaveAttribute("aria-current", "page");
  });

  it("moves focus to the new page's heading after navigating", async () => {
    const user = userEvent.setup();
    renderApp({
      "GET /api/catalog/tracks": { body: [javaTrack] },
      "GET /api/catalog/tracks/java-certification": { body: javaTrack },
    });

    await user.click(await screen.findByRole("link", { name: "Java Certification" }));

    const heading = await screen.findByRole("heading", { level: 1, name: "Java Certification" });
    expect(heading).toHaveFocus();
    await waitFor(() => expect(document.title).toBe("Java Certification · CertForge"));
  });
});

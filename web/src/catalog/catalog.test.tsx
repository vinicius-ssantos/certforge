import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { javaTrack, renderApp } from "../test/render";

describe("browsing tracks", () => {
  it("uses the real review counts to guide the next step and keeps the catalogue available", async () => {
    renderApp({
      "GET /api/catalog/tracks": { body: [javaTrack] },
      "GET /api/review/queue": { body: { dueNow: 3, waiting: 2, neverAttempted: 1, items: [] } },
    });

    const action = await screen.findByRole("link", { name: "Start reviewing" });
    expect(action).toHaveAttribute("href", "/review");
    const queue = within(screen.getByRole("region", { name: "Review queue" }));
    expect(queue.getByText("3")).toBeInTheDocument();
    expect(queue.getByText("2")).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "Java Certification" })).toBeInTheDocument();
  });

  it("offers a confirmed active session before due review", async () => {
    renderApp({
      "GET /api/catalog/tracks": { body: [javaTrack] },
      "GET /api/review/queue": { body: { dueNow: 3, waiting: 0, neverAttempted: 0, items: [] } },
      "GET /api/study/history/sessions": { body: { nextCursor: null, items: [{
        id: "active-session",
        status: "IN_PROGRESS",
        topicId: javaTrack.topics[0]!.id,
        answeredCount: 2,
        requestedCount: 10,
      }] } },
    });

    expect(await screen.findByRole("link", { name: "Resume studying" }))
      .toHaveAttribute("href", "/sessions/active-session");
    expect(screen.queryByRole("link", { name: "Start reviewing" })).not.toBeInTheDocument();
  });

  it("keeps study accessible when the review queue is unavailable", async () => {
    renderApp({
      "GET /api/catalog/tracks": { body: [javaTrack] },
      "GET /api/review/queue": problem(503, "internal_error"),
    });

    expect(await screen.findByText("The review queue is temporarily unavailable.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse tracks" })).toHaveAttribute("href", "#track-catalog");
    expect(screen.queryByRole("link", { name: "Start reviewing" })).not.toBeInTheDocument();
  });

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

  it("does not offer practice without a published question in a certification topic", async () => {
    const availability = {
      activeSessionId: null,
      contentReady: false,
      missingQuestionCount: 10,
      questionCount: 10,
      questionsPerTopic: 5,
      topics: javaTrack.topics.map((topic) => ({
        topicId: topic.id, available: 0, required: 5, missing: 5,
      })),
    };
    renderApp({
      "GET /api/catalog/tracks/java-certification": { body: javaTrack },
      "GET /api/study/mock-exams/availability": { body: availability },
    }, { path: "/tracks/java-certification" });

    const practice = await screen.findByRole("button", { name: "Practice Handling exceptions" });
    await waitFor(() => expect(practice).toBeDisabled());
    expect(await screen.findByText(/No questions available in this track\./)).toBeVisible();
    expect(screen.queryByText("No questions published.")).not.toBeInTheDocument();
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

describe("a certification that is not about a Java release", () => {
  // ADR 0017: a Kubernetes or AWS exam carries no release rather than a synthetic one, and the
  // server now serves null for it. These two screens printed it unconditionally, so a null would
  // have read "Java null" with a separator in front of it.
  const ckad = {
    ...javaTrack,
    slug: "cncf-ckad",
    name: "CKAD",
    provider: "CNCF",
    certificationName: "Certified Kubernetes Application Developer",
    examVersion: {
      ...javaTrack.examVersion,
      label: "CKAD 2026",
      examCode: "CKAD",
      javaRelease: null,
      examFormat: "PERFORMANCE_BASED",
    },
  };

  it("names the exam without inventing a release, in the list", async () => {
    renderApp({ "GET /api/catalog/tracks": { body: [ckad] } });

    const line = await screen.findByText(/CNCF · CKAD 2026/);
    expect(line.textContent).toBe("CNCF · CKAD 2026");
    expect(screen.queryByText(/Java/)).not.toBeInTheDocument();
  });

  it("names the exam without inventing a release, on the track", async () => {
    renderApp(
      { "GET /api/catalog/tracks/cncf-ckad": { body: ckad } },
      { path: "/tracks/cncf-ckad" },
    );

    const line = await screen.findByText(/CNCF · CKAD 2026/);
    expect(line.textContent).toBe("CNCF · CKAD 2026");
    expect(screen.queryByText(/Java/)).not.toBeInTheDocument();
  });
});

it("does not offer an empty catalogue as the next study action", async () => {
  renderApp({ "GET /api/catalog/tracks": { body: [] }, "GET /api/catalog/general-tracks": { body: [] } });
  expect(await screen.findByText("No tracks are available yet")).toBeVisible();
  expect(screen.queryByRole("link", { name: /Explore tracks/ })).not.toBeInTheDocument();
});

it("renders review and progress as accessible tertiary product actions", async () => {
  renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } });

  const queue = await screen.findByRole("link", { name: "See the queue" });
  const progress = screen.getByRole("link", { name: "View progress" });
  expect(queue.closest(".study-queue-links")).toBeInTheDocument();
  expect(queue).toHaveAttribute("href", "/review");
  expect(progress.closest(".study-queue-links")).toBeInTheDocument();
  expect(progress).toHaveAttribute("href", "/progress");
  expect(queue).toHaveTextContent("See the queue");
  expect(progress).toHaveTextContent("View progress");
});

it("finds tracks by provider and clears a no-match search", async () => {
  renderApp({ "GET /api/catalog/tracks": { body: [javaTrack] } });
  await screen.findByRole("link", { name: "Java Certification" });
  const searchDisclosure = screen.getByText("Find a track by name or provider", { selector: "summary" });
  expect(within(searchDisclosure).getByText("⌄")).toHaveAttribute("aria-hidden", "true");
  await userEvent.click(searchDisclosure);
  await userEvent.type(screen.getByRole("searchbox"), javaTrack.provider);
  expect(screen.getByRole("link", { name: "Java Certification" })).toBeVisible();
  await userEvent.clear(screen.getByRole("searchbox"));
  await userEvent.type(screen.getByRole("searchbox"), "No such provider");
  expect(screen.getByRole("status")).toHaveTextContent("No tracks match this search.");
  expect(screen.queryByRole("link", { name: "Java Certification" })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
  expect(screen.getByRole("link", { name: "Java Certification" })).toBeVisible();
});

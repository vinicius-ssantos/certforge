import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { javaTrack, renderApp } from "../test/render";

const infraTrack = {
  id: "ffffffff-0000-4000-8000-000000000001",
  slug: "infrastructure-devops-foundations",
  name: "Infrastructure & DevOps Foundations",
  versionId: "ffffffff-0000-4000-8000-000000000002",
  versionLabel: "Taxonomy 2026.1",
  topics: [
    { id: "ffffffff-0000-4000-8000-000000000003", slug: "docker-containers", name: "Docker and Containers", objectiveRef: null, subtopics: [] },
    { id: "ffffffff-0000-4000-8000-000000000004", slug: "kubernetes-core", name: "Kubernetes Core", objectiveRef: null, subtopics: [] },
  ],
};

describe("browsing general tracks, beside certification tracks (#176)", () => {
  it("lists a general track on the same page as certification tracks, with a link of its own", async () => {
    const { container } = renderApp({
      "GET /api/catalog/tracks": { body: [javaTrack] },
      "GET /api/catalog/general-tracks": { body: [infraTrack] },
    });

    // Both kinds, on the one page a learner switches between.
    expect(await screen.findByRole("link", { name: "Java Certification" })).toHaveAttribute(
      "href",
      "/tracks/java-certification",
    );
    expect(
      screen.getByRole("link", { name: "Infrastructure & DevOps Foundations" }),
    ).toHaveAttribute("href", "/general-tracks/infrastructure-devops-foundations");
    expect(screen.getByText("Taxonomy 2026.1 · 2 topics")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("says there is nothing only once both certification and general tracks are empty", async () => {
    renderApp({
      "GET /api/catalog/tracks": { body: [] },
      "GET /api/catalog/general-tracks": { body: [] },
    });

    expect(
      await screen.findByRole("heading", { name: "No tracks are available yet" }),
    ).toBeInTheDocument();
  });

  it("blocks only general topics without published questions", async () => {
    renderApp({
      "GET /api/catalog/general-tracks/infrastructure-devops-foundations": { body: infraTrack },
      "GET /api/study/sessions/topic-availability": { body: [
        { topicId: infraTrack.topics[0]!.id, available: 3 },
        { topicId: infraTrack.topics[1]!.id, available: 0 },
      ] },
    }, { path: "/general-tracks/infrastructure-devops-foundations" });

    const docker = await screen.findByRole("button", { name: "Practice Docker and Containers" });
    const kubernetes = screen.getByRole("button", { name: "Practice Kubernetes Core" });
    await waitFor(() => expect(docker).toBeEnabled());
    expect(kubernetes).toBeDisabled();
    expect(screen.getByText("No questions published.")).toBeVisible();
    expect(screen.queryByText("No questions available in this track.")).not.toBeInTheDocument();
  });

  it("announces empty general tracks once, without repeating the warning for every topic", async () => {
    renderApp({
      "GET /api/catalog/general-tracks/infrastructure-devops-foundations": { body: infraTrack },
      "GET /api/study/sessions/topic-availability": { body: infraTrack.topics.map((topic) => ({ topicId: topic.id, available: 0 })) },
    }, { path: "/general-tracks/infrastructure-devops-foundations" });

    expect(await screen.findByText(/No questions available in this track\./)).toBeVisible();
    expect(screen.queryByText("No questions published.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Practice Docker and Containers" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Practice Kubernetes Core" })).toBeDisabled();
  });

  it("starts a session on a general track's topic through the same endpoint a certification track uses", async () => {
    const { fetch } = renderApp(
      {
        "GET /api/catalog/general-tracks/infrastructure-devops-foundations": { body: infraTrack },
        "GET /api/study/sessions/topic-availability": { body: infraTrack.topics.map((topic) => ({ topicId: topic.id, available: 5 })) },
        "POST /api/study/sessions": {
          status: 201,
          body: {
            id: "99999999-0000-4000-8000-000000000001",
            topicId: infraTrack.topics[0]!.id,
            status: "IN_PROGRESS",
            questions: [],
            createdAt: "2026-10-24T10:00:00Z",
            expiresAt: "2026-10-24T11:00:00Z",
            closedAt: null,
          },
        },
      },
      { path: "/general-tracks/infrastructure-devops-foundations" },
    );

    expect(
      await screen.findByRole("heading", { name: "Infrastructure & DevOps Foundations" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Taxonomy 2026.1")).toBeInTheDocument();
    // No objective reference: a general taxonomy cites no exam, unlike a certification topic.
    expect(screen.queryByText(/Handling/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Practice Docker and Containers" }));

    const started = fetch.calls.find((call) => call.path === "/api/study/sessions");
    expect(started?.body).toMatchObject({ topicId: infraTrack.topics[0]!.id });
  });
});

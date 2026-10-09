import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { admin, editor, renderApp } from "../test/render";

const TRACK_ID = "a1000000-0000-4000-8000-000000000001";
const TOPIC_A = "a3000000-0000-4000-8000-000000000001";
const TOPIC_B = "a3000000-0000-4000-8000-000000000002";
const URL = "/api/admin/catalog/tracks";

function examVersion(overrides: Record<string, unknown> = {}) {
  return {
    id: "a2000000-0000-4000-8000-000000000001",
    label: "Java SE 21 (1Z0-830)",
    examCode: "1Z0-830",
    examName: "Java SE 21 Developer Professional",
    javaRelease: 21,
    objectivesUrl: "https://education.oracle.com/objectives",
    status: "ACTIVE",
    topics: [{ topicId: TOPIC_A, objectiveRef: "Handling exceptions", position: 0 }],
    ...overrides,
  };
}

function track(overrides: Record<string, unknown> = {}) {
  return {
    id: TRACK_ID,
    slug: "java-certification",
    name: "Java Certification",
    kind: "CERTIFICATION",
    status: "ACTIVE",
    provider: "Oracle",
    certificationName: "Oracle Certified Professional Java SE 21 Developer",
    examVersions: [examVersion()],
    topics: [
      { id: TOPIC_A, slug: "exceptions", name: "Handling exceptions", parentId: null },
      { id: TOPIC_B, slug: "concurrency", name: "Managing concurrent code execution", parentId: null },
    ],
    ...overrides,
  };
}

describe("who may inspect the catalog", () => {
  it("is offered to an administrator from the editorial desk", async () => {
    renderApp({ "GET /api/admin/questions": { body: [] } }, { as: admin, path: "/editorial" });

    expect(await screen.findByRole("link", { name: "Catalog" })).toHaveAttribute(
      "href",
      "/editorial/catalog",
    );
  });

  it("is not offered to an editor, and is refused if they go there", async () => {
    renderApp({ "GET /api/admin/questions": { body: [] } }, { as: editor, path: "/editorial" });
    await screen.findByRole("heading", { level: 1, name: "Questions" });
    expect(screen.queryByRole("link", { name: "Catalog" })).not.toBeInTheDocument();

    renderApp({}, { as: editor, path: "/editorial/catalog" });

    expect(
      await screen.findByRole("heading", { name: "You do not have access to the catalog" }),
    ).toBeInTheDocument();
  });
});

describe("the catalog", () => {
  it("lists tracks with their status and counts, and says it is read-only", async () => {
    const { container } = renderApp({ [`GET ${URL}`]: { body: [track()] } }, { as: admin, path: "/editorial/catalog" });

    const row = (await screen.findByRole("link", { name: "Java Certification" })).closest<HTMLElement>("li.card");
    expect(row).not.toBeNull();
    expect(row).toHaveTextContent("Active");
    expect(row).toHaveTextContent("Oracle");
    expect(row).toHaveTextContent("Java SE 21 (1Z0-830)");
    expect(row).toHaveTextContent("Certification track");
    expect(row).toHaveTextContent("2 topics");
    expect(within(row!).getByRole("link", { name: "Java Certification" })).toHaveAttribute(
      "href",
      `/editorial/catalog/${TRACK_ID}`,
    );
    expect(screen.getByText(/read-only view/)).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows distinct track kinds and draft version status without opening a track", async () => {
    const interview = track({
      id: "a1000000-0000-4000-8000-000000000002",
      name: "Java Backend Interview",
      kind: "INTERVIEW",
      status: "DRAFT",
      provider: "CertForge",
      examVersions: [examVersion({
        id: "a2000000-0000-4000-8000-000000000002",
        label: "Interview taxonomy v1",
        status: "DRAFT",
      })],
    });
    const { container } = renderApp(
      { [`GET ${URL}`]: { body: [track(), interview] } },
      { as: admin, path: "/editorial/catalog" },
    );

    const card = (await screen.findByRole("link", { name: "Java Backend Interview" }))
      .closest<HTMLElement>("li.card");
    expect(card).toHaveTextContent("Interview track");
    expect(card).toHaveTextContent("Interview taxonomy v1");
    expect(within(card!).getAllByText("Draft")).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("explains an empty catalog", async () => {
    renderApp({ [`GET ${URL}`]: { body: [] } }, { as: admin, path: "/editorial/catalog" });

    expect(await screen.findByRole("heading", { name: "There are no tracks" })).toBeInTheDocument();
  });

  it("shows a failure and retries", async () => {
    const user = userEvent.setup();
    let calls = 0;
    renderApp(
      { [`GET ${URL}`]: () => (++calls === 1 ? problem(500, "internal_error") : { body: [track()] }) },
      { as: admin, path: "/editorial/catalog" },
    );

    await user.click(within(await screen.findByRole("alert")).getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("list", { name: "Preparation tracks" })).toBeInTheDocument();
  });
});

describe("a track in the catalog", () => {
  const open = { as: admin, path: `/editorial/catalog/${TRACK_ID}` };

  it("says where content can be published and which release it must target", async () => {
    const { container } = renderApp({ [`GET ${URL}/${TRACK_ID}`]: { body: track() } }, open);

    const where = await screen.findByRole("region", { name: "Where content can be published" });
    expect(where).toHaveTextContent("published on the 1 topics mapped to Java SE 21 (1Z0-830)");
    expect(where).toHaveTextContent("written for Java 21");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("names the topics no active exam version maps, because publishing there is refused", async () => {
    renderApp({ [`GET ${URL}/${TRACK_ID}`]: { body: track() } }, open);

    const where = await screen.findByRole("region", { name: "Where content can be published" });
    expect(where).toHaveTextContent("1 topic is not mapped to the active exam version");
    expect(within(where).getByText(/Managing concurrent code execution/)).toBeInTheDocument();
    expect(within(where).queryByText(/^Handling exceptions/)).not.toBeInTheDocument();
  });

  it("says plainly when no exam version is active", async () => {
    renderApp(
      { [`GET ${URL}/${TRACK_ID}`]: { body: track({ examVersions: [examVersion({ status: "DRAFT" })] }) } },
      open,
    );

    expect(await screen.findByText(/No exam version is active/)).toBeInTheDocument();
  });

  it("lists each exam version with its mapped topics in order and the objective wording", async () => {
    renderApp({ [`GET ${URL}/${TRACK_ID}`]: { body: track() } }, open);

    const versions = await screen.findByRole("region", { name: "Exam versions" });
    expect(within(versions).getByRole("heading", { name: /Java SE 21 \(1Z0-830\)/ })).toBeInTheDocument();
    expect(within(versions).getByText(/Java SE 21 Developer Professional \(1Z0-830\) · Java 21/)).toBeInTheDocument();
    const mapping = within(versions).getByRole("row", { name: /Handling exceptions/ });
    expect(mapping).toHaveTextContent("1");
    expect(within(versions).getByRole("link", { name: /Official exam objectives/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("says when a track is not active", async () => {
    renderApp({ [`GET ${URL}/${TRACK_ID}`]: { body: track({ status: "INACTIVE" }) } }, open);

    expect(await screen.findByText(/This track is inactive, so no learner is given its questions/)).toBeInTheDocument();
  });

  it("shows a track that cannot be found", async () => {
    renderApp({ [`GET ${URL}/${TRACK_ID}`]: problem(404, "track_not_found") }, open);

    expect(await screen.findByRole("alert")).toHaveTextContent("does not exist");
    expect(screen.getByRole("link", { name: "Back to the catalog" })).toHaveAttribute(
      "href",
      "/editorial/catalog",
    );
  });
});

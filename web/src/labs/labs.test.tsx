import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { renderApp } from "../test/render";
import type { LabSummary } from "../api/types";

const dockerLab: LabSummary = {
  labId: "docker-multistage-bloat-v1",
  title: "Fix a Docker multi-stage build",
  description: "The Dockerfile ships the full build toolchain and source in its final image.",
  timeoutSeconds: 900,
};
const readinessLab: LabSummary = {
  labId: "readiness-probe-wrong-port-v1",
  title: "Fix a readiness probe",
  description: "The web Deployment's Pods never become Ready.",
  timeoutSeconds: 900,
};

/**
 * jsdom has no ResizeObserver and no real WebSocket server to connect to, so this test file gives
 * LabTerminal (and only LabTerminal) a controllable stand-in for each -- not a mock of this
 * project's own component, which the rest of the suite never does, but of two browser APIs the
 * test environment itself does not implement.
 */
class FakeWebSocket {
  static OPEN = 1;
  static CLOSED = 3;
  static instances: FakeWebSocket[] = [];
  readyState = 0;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  sent: string[] = [];
  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
    queueMicrotask(() => {
      this.readyState = FakeWebSocket.OPEN;
      this.onopen?.();
    });
  }
  send(data: string) {
    this.sent.push(data);
  }
  close() {
    this.readyState = FakeWebSocket.CLOSED;
    this.onclose?.();
  }
  /** Test-only helper: simulate the lab's shell printing something. */
  emit(data: string) {
    this.onmessage?.({ data });
  }
}

class FakeResizeObserver {
  observe() {}
  disconnect() {}
}

let originalWebSocket: typeof WebSocket;
let originalResizeObserver: typeof ResizeObserver;
let originalMatchMedia: typeof window.matchMedia;

beforeEach(() => {
  FakeWebSocket.instances = [];
  originalWebSocket = globalThis.WebSocket;
  originalResizeObserver = globalThis.ResizeObserver;
  originalMatchMedia = window.matchMedia;
  // @ts-expect-error -- test double, narrower than the real browser API
  globalThis.WebSocket = FakeWebSocket;
  // @ts-expect-error -- test double, narrower than the real browser API
  globalThis.ResizeObserver = FakeResizeObserver;
  // jsdom implements neither matchMedia (xterm reads it for the display's pixel ratio) nor a
  // real one the "prefers-color-scheme" listener in LabTerminal could attach to.
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  globalThis.WebSocket = originalWebSocket;
  globalThis.ResizeObserver = originalResizeObserver;
  window.matchMedia = originalMatchMedia;
});

describe("the labs catalog", () => {
  it("lists every shipped lab with its objective and time limit", async () => {
    renderApp({ "GET /api/labs": { body: [dockerLab, readinessLab] } }, { path: "/labs" });

    expect(await screen.findByRole("heading", { level: 1, name: "Hands-on labs" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 2, name: dockerLab.title })).toBeInTheDocument();
    expect(screen.getByText(dockerLab.description)).toBeInTheDocument();
    expect(screen.getAllByText("15 min")).toHaveLength(2);
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it("shows an empty state when no labs are shipped", async () => {
    renderApp({ "GET /api/labs": { body: [] } }, { path: "/labs" });
    expect(await screen.findByRole("heading", { name: "No labs are available right now" })).toBeInTheDocument();
  });

  it("offers a retry when the catalog cannot be read", async () => {
    renderApp({ "GET /api/labs": problem(503, "internal_error") }, { path: "/labs" });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("starts a session and opens the lab's terminal", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        "GET /api/labs": { body: [dockerLab] },
        "POST /api/labs/docker-multistage-bloat-v1/sessions": {
          status: 201,
          body: {
            sessionId: "session-1",
            labId: dockerLab.labId,
            interactiveUrl: "/api/labs/sessions/session-1/terminal",
            interactiveToken: "tok-1",
          },
        },
      },
      { path: "/labs" },
    );

    await user.click(await screen.findByRole("button", { name: "Start lab" }));

    expect(await screen.findByRole("heading", { level: 1, name: dockerLab.title })).toBeInTheDocument();
    expect(screen.getByText(dockerLab.description)).toBeInTheDocument();
    expect(screen.getByText(/Time limit: 15 minutes/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Connected"));

    expect(
      fetch.calls.some((call) => call.method === "POST" && call.path === "/api/labs/docker-multistage-bloat-v1/sessions"),
    ).toBe(true);
    // A same-origin path gets this page's own scheme as ws: (http: in this test environment),
    // not downgraded or upgraded to the other one.
    expect(FakeWebSocket.instances[0]!.url).toMatch(/^ws:\/\/.*\/api\/labs\/sessions\/session-1\/terminal\?token=tok-1$/);
  });

  it("never downgrades an already-secure interactive URL from a vendor-hosted terminal", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        "GET /api/labs": { body: [dockerLab] },
        "POST /api/labs/docker-multistage-bloat-v1/sessions": {
          status: 201,
          body: {
            sessionId: "sbx_1",
            labId: dockerLab.labId,
            // Vercel's own controller-hosted PTY: an absolute, already-secure external URL.
            interactiveUrl: "wss://sandbox.example.vercel.dev/pty",
            interactiveToken: "tok-vercel",
          },
        },
      },
      { path: "/labs" },
    );

    await user.click(await screen.findByRole("button", { name: "Start lab" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Connected"));

    expect(FakeWebSocket.instances[0]!.url).toBe("wss://sandbox.example.vercel.dev/pty?token=tok-vercel");
  });

  it("shows what the lab's shell prints and lets the learner check their work", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        "GET /api/labs": { body: [dockerLab] },
        "POST /api/labs/docker-multistage-bloat-v1/sessions": {
          status: 201,
          body: {
            sessionId: "session-1",
            labId: dockerLab.labId,
            interactiveUrl: "/api/labs/sessions/session-1/terminal",
            interactiveToken: "tok-1",
          },
        },
        "POST /api/labs/sessions/session-1/complete": {
          body: {
            passed: false,
            checks: [
              { description: "The built image's final layer does not contain the Go toolchain", passed: true },
              { description: "The built image is under 100MB", passed: false },
            ],
          },
        },
      },
      { path: "/labs" },
    );

    await user.click(await screen.findByRole("button", { name: "Start lab" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Connected"));
    FakeWebSocket.instances[0]!.emit("$ docker build .\r\ndone\r\n");
    expect(await screen.findByText(/done/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Check my work" }));

    expect(await screen.findByRole("heading", { name: "Not yet — see which checks did not pass below" })).toBeInTheDocument();
    expect(screen.getByText(/does not contain the Go toolchain/)).toBeInTheDocument();
    expect(screen.getByText(/under 100MB/)).toBeInTheDocument();
    // The session is spent once graded; nothing left to type into.
    expect(screen.queryByRole("button", { name: "Check my work" })).not.toBeInTheDocument();
  });

  it("explains that a reloaded session cannot be recovered", async () => {
    renderApp({}, { path: "/labs/sessions/some-id" });
    expect(await screen.findByRole("heading", { name: "This lab session is not open in this browser tab" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to labs" })).toHaveAttribute("href", "/labs");
  });
});

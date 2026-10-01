import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { account, javaTrack, renderApp } from "../test/render";

describe("signing in", () => {
  it("sends an anonymous visitor to the sign-in page", async () => {
    renderApp({}, { signedIn: false });

    expect(await screen.findByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe("Sign in · CertForge"));
  });

  it("labels every field and has no accessibility violations", async () => {
    const { container } = renderApp({}, { signedIn: false, path: "/login" });

    expect(await screen.findByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("explains missing fields in a summary that takes focus and links to each field", async () => {
    const user = userEvent.setup();
    const { container } = renderApp({}, { signedIn: false, path: "/login" });

    await user.click(await screen.findByRole("button", { name: "Sign in" }));

    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(summary).toHaveTextContent("Enter your email address.");
    expect(summary).toHaveTextContent("Enter your password.");
    expect(screen.getByRole("link", { name: "Enter your email address." })).toHaveAttribute(
      "href",
      "#login-email",
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(/Enter your email address/);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows a wrong password as a readable message, not the server wording", async () => {
    const user = userEvent.setup();
    renderApp(
      { "POST /api/auth/login": problem(401, "invalid_credentials") },
      { signedIn: false, path: "/login" },
    );

    await user.type(await screen.findByLabelText("Email"), "learner@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong password here");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("The email or password is incorrect.");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  it("signs in with the CSRF header and lands on the tracks", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        "POST /api/auth/login": { body: account },
        "GET /api/catalog/tracks": { body: [javaTrack] },
      },
      { signedIn: false, path: "/login" },
    );

    await user.type(await screen.findByLabelText("Email"), "  learner@example.com ");
    await user.type(screen.getByLabelText("Password"), "correct horse battery");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Certification tracks" }),
    ).toBeInTheDocument();
    const login = fetch.calls.find((call) => call.path === "/api/auth/login");
    expect(login?.headers.get("X-XSRF-TOKEN")).toBe("test-csrf-token");
    expect(login?.body).toEqual({ email: "learner@example.com", password: "correct horse battery" });
  });

  it("tells the learner how long to wait when throttled", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        "POST /api/auth/login": {
          ...problem(429, "too_many_attempts"),
          headers: { "content-type": "application/problem+json", "retry-after": "17" },
        },
      },
      { signedIn: false, path: "/login" },
    );

    await user.type(await screen.findByLabelText("Email"), "learner@example.com");
    await user.type(screen.getByLabelText("Password"), "whatever it is");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Wait 17 seconds");
  });
});

describe("creating an account", () => {
  it("checks the password length before sending anything", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp({}, { signedIn: false, path: "/register" });

    await user.type(await screen.findByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("at least 12 characters");
    expect(fetch.calls.some((call) => call.path === "/api/auth/register")).toBe(false);
  });

  it("registers, signs in and shows the tracks", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        "POST /api/auth/register": { status: 201, body: account },
        "POST /api/auth/login": { body: account },
        "GET /api/catalog/tracks": { body: [javaTrack] },
      },
      { signedIn: false, path: "/register" },
    );

    await user.type(await screen.findByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse battery");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Certification tracks" }),
    ).toBeInTheDocument();
    expect(fetch.calls.map((call) => call.path)).toContain("/api/auth/register");
    expect(fetch.calls.map((call) => call.path)).toContain("/api/auth/login");
  });

  it("reports an email that is already registered", async () => {
    const user = userEvent.setup();
    renderApp(
      { "POST /api/auth/register": problem(409, "email_already_registered") },
      { signedIn: false, path: "/register" },
    );

    await user.type(await screen.findByLabelText("Email"), "taken@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse battery");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("already exists");
  });
});

describe("session handling", () => {
  it("offers a retry when the server cannot be reached", async () => {
    const user = userEvent.setup();
    let attempts = 0;
    renderApp({
      "GET /api/auth/me": () => {
        attempts += 1;
        if (attempts === 1) throw new TypeError("fetch failed");
        return { body: account };
      },
      "GET /api/catalog/tracks": { body: [javaTrack] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("cannot be reached");
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Certification tracks" }),
    ).toBeInTheDocument();
  });

  it("signs out through the server and forgets everything", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp({
      "GET /api/catalog/tracks": { body: [javaTrack] },
      "POST /api/auth/logout": { status: 204 },
    });

    await user.click(await screen.findByRole("button", { name: "Sign out" }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument(),
    );
    const logout = fetch.calls.find((call) => call.path === "/api/auth/logout");
    expect(logout?.headers.get("X-XSRF-TOKEN")).toBe("test-csrf-token");
  });
});

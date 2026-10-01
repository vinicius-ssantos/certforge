import { beforeEach, describe, expect, it } from "vitest";
import { fakeFetch, problem } from "../test/fakeServer";
import { createApi } from "./client";

beforeEach(() => {
  // The CSRF cookie is the preferred source; tests start without one.
  document.cookie = "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
});

describe("createApi", () => {
  it("sends reads without any CSRF header", async () => {
    const fetch = fakeFetch({ "GET /api/auth/me": { body: { id: "x" } } });
    const api = createApi({ fetch });

    await api.GET("/api/auth/me");

    expect(fetch.calls).toHaveLength(1);
    expect(fetch.calls[0]?.headers.get("X-XSRF-TOKEN")).toBeNull();
  });

  it("fetches the CSRF token once and sends it on every state-changing request", async () => {
    const fetch = fakeFetch({
      "GET /api/auth/csrf": { body: { headerName: "X-XSRF-TOKEN", token: "token-1" } },
      "POST /api/auth/logout": { status: 204 },
    });
    const api = createApi({ fetch });

    await api.POST("/api/auth/logout");
    await api.POST("/api/auth/logout");

    const posts = fetch.calls.filter((call) => call.method === "POST");
    expect(posts.map((call) => call.headers.get("X-XSRF-TOKEN"))).toEqual(["token-1", "token-1"]);
    expect(fetch.calls.filter((call) => call.path === "/api/auth/csrf")).toHaveLength(1);
  });

  it("prefers the readable CSRF cookie over asking the server", async () => {
    document.cookie = "XSRF-TOKEN=from-cookie; path=/";
    const fetch = fakeFetch({ "POST /api/auth/logout": { status: 204 } });
    const api = createApi({ fetch });

    await api.POST("/api/auth/logout");

    expect(fetch.calls[0]?.headers.get("X-XSRF-TOKEN")).toBe("from-cookie");
    expect(fetch.calls.some((call) => call.path === "/api/auth/csrf")).toBe(false);
  });

  it("forgets a rejected token so the next request fetches a fresh one", async () => {
    let issued = 0;
    const fetch = fakeFetch({
      "GET /api/auth/csrf": () => ({ body: { headerName: "X-XSRF-TOKEN", token: `token-${++issued}` } }),
      "POST /api/auth/logout": (request) =>
        request.headers.get("X-XSRF-TOKEN") === "token-1" ? problem(403, "csrf_invalid") : { status: 204 },
    });
    const api = createApi({ fetch });

    const first = await api.POST("/api/auth/logout");
    const second = await api.POST("/api/auth/logout");

    expect(first.response.status).toBe(403);
    expect(second.response.status).toBe(204);
  });

  it("uses the same origin and never sends an Authorization header", async () => {
    const fetch = fakeFetch({ "GET /api/auth/me": { body: { id: "x" } } });
    const api = createApi({ fetch });

    await api.GET("/api/auth/me");

    expect(fetch.calls[0]?.headers.get("Authorization")).toBeNull();
  });
});

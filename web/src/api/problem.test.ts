import { describe, expect, it } from "vitest";
import { ApiError, networkError, problemToError, unwrap } from "./problem";

function response(status: number, headers: Record<string, string> = {}) {
  return new Response(null, { status, headers });
}

describe("problemToError", () => {
  it("keeps the stable code, title and request id of a problem body", () => {
    const error = problemToError(
      { code: "session_not_found", title: "Session not found", requestId: "abc-1234" },
      response(404),
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(404);
    expect(error.code).toBe("session_not_found");
    expect(error.message).toBe("Session not found");
    expect(error.requestId).toBe("abc-1234");
  });

  it("falls back to the request id header and carries extra properties as details", () => {
    const error = problemToError(
      { code: "insufficient_content", requested: 10, available: 3 },
      response(409, { "X-Request-Id": "from-header-1" }),
    );

    expect(error.requestId).toBe("from-header-1");
    expect(error.details).toEqual({ requested: 10, available: 3 });
  });

  it("reads Retry-After in seconds", () => {
    const error = problemToError({ code: "too_many_attempts" }, response(429, { "Retry-After": "42" }));

    expect(error.retryAfterSeconds).toBe(42);
  });

  it("copes with a body that is not a problem at all", () => {
    for (const body of [undefined, null, "oops", 42]) {
      const error = problemToError(body, response(502));
      expect(error.code).toBe("unexpected_error");
      expect(error.status).toBe(502);
    }
  });
});

describe("unwrap", () => {
  it("returns the data of a successful call", async () => {
    await expect(unwrap(Promise.resolve({ data: { ok: true }, response: response(200) }))).resolves.toEqual({
      ok: true,
    });
  });

  it("turns an error result into an ApiError", async () => {
    const call = Promise.resolve({ error: { code: "forbidden" }, response: response(403) });

    await expect(unwrap(call)).rejects.toMatchObject({ status: 403, code: "forbidden" });
  });

  it("reports an unreachable server as a network failure", async () => {
    const error = await unwrap(Promise.reject(new TypeError("fetch failed"))).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).isNetworkFailure).toBe(true);
    expect(networkError().status).toBe(0);
  });

  it("knows an unauthenticated failure", () => {
    expect(problemToError({ code: "unauthenticated" }, response(401)).isUnauthenticated).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { assertSafeE2eEnvironment } from "../e2eIsolation";

const safeLocal = {
  CERTFORGE_E2E_DISPOSABLE: "1",
  E2E_API_URL: "http://127.0.0.1:8086",
};

describe("E2E target isolation", () => {
  it("permits the dedicated disposable Compose browser/API pair", () => {
    expect(assertSafeE2eEnvironment({
      ...safeLocal, E2E_BASE_URL: "http://localhost:8083",
    })).toEqual({ apiUrl: "http://127.0.0.1:8086", browserUrl: "http://localhost:8083" });
  });

  it("permits a custom disposable API only with a dedicated local preview", () => {
    expect(assertSafeE2eEnvironment({
      CERTFORGE_E2E_DISPOSABLE: "1", E2E_API_URL: "http://localhost:8099",
    })).toEqual({ apiUrl: "http://localhost:8099", browserUrl: null });
  });

  it.each([
    {},
    { E2E_API_URL: safeLocal.E2E_API_URL },
    { CERTFORGE_E2E_DISPOSABLE: "1" },
    { ...safeLocal, CERTFORGE_E2E_DISPOSABLE: "0" },
    { CI: "true", E2E_API_URL: safeLocal.E2E_API_URL },
  ])("requires explicit opt-in and a disposable API for manual runs", (env) => {
    expect(() => assertSafeE2eEnvironment(env)).toThrow(/disposable|synthetic/i);
  });

  it.each(["8080", "8081", "8082", "8085", "4173"])(
    "rejects reserved E2E_API_URL port %s before seeding", (port) => {
      expect(() => assertSafeE2eEnvironment({
        ...safeLocal, E2E_API_URL: `http://127.0.0.1:${port}`,
      })).toThrow(/Unsafe E2E_API_URL/);
    },
  );

  it.each([
    "https://localhost:8086",
    "http://example.com:8086",
    "http://192.168.1.10:8086",
    "http://127.0.0.1:8086/api",
    "http://127.0.0.1:8086?token=secret",
    "http://admin:pass@localhost:8086",
    "http://localhost",
    "not-a-url",
  ])("rejects non-local or ambiguous API target %s", (url) => {
    expect(() => assertSafeE2eEnvironment({
      ...safeLocal, E2E_API_URL: url,
    })).toThrow(/Unsafe E2E/);
  });

  it.each([
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:4173",
    "http://example.com:8083",
    "http://localhost:8083/other",
    "https://localhost:8083",
  ])("rejects unsafe browser target %s", (url) => {
    expect(() => assertSafeE2eEnvironment({
      ...safeLocal, E2E_BASE_URL: url,
    })).toThrow(/Unsafe E2E/);
  });

  it("rejects a mismatched external browser and API pair", () => {
    expect(() => assertSafeE2eEnvironment({
      ...safeLocal, E2E_API_URL: "http://localhost:8099", E2E_BASE_URL: "http://localhost:8083",
    })).toThrow(/browser\/API pair/);
  });

  it("permits GitHub Actions' ephemeral :8080 API and release :8081 browser", () => {
    expect(assertSafeE2eEnvironment({
      CI: "true", GITHUB_ACTIONS: "true", E2E_BASE_URL: "http://localhost:8081",
    })).toEqual({ apiUrl: "http://localhost:8080", browserUrl: "http://localhost:8081" });
  });

  it("does not treat CI=true without GITHUB_ACTIONS=true as trusted", () => {
    expect(() => assertSafeE2eEnvironment({
      CI: "true", E2E_API_URL: "http://localhost:8080",
    })).toThrow(/disposable|synthetic/);
  });
});

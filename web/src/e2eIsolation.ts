/**
 * Local E2E tests publish synthetic content and register accounts.
 * Validate both the writer's API and the browser's origin BEFORE any setup writes.
 *
 * On GitHub Actions the backend and database are freshly provisioned for each job;
 * its release-image workflow deliberately uses :8081 for its ephemeral browser.
 */
type Environment = Record<string, string | undefined>;

function localOrigin(raw: string, label: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Unsafe E2E ${label}: expected an absolute loopback HTTP URL.`);
  }
  if (
    url.protocol !== "http:" ||
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    !url.port ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error(`Unsafe E2E ${label}: only a bare http://localhost:<port> loopback origin is allowed locally.`);
  }
  return url;
}

/** Returns the API target used by the local Playwright seed AND by Vite preview's /api proxy. */
export function assertSafeE2eEnvironment(env: Environment): { apiUrl: string; browserUrl: string | null } {
  // Both CI indicators are necessary: CI=true by itself must never disable local safeguards.
  const hostedDisposable = env["CI"] === "true" && env["GITHUB_ACTIONS"] === "true";
  if (hostedDisposable) {
    return { apiUrl: env["E2E_API_URL"] ?? "http://localhost:8080", browserUrl: env["E2E_BASE_URL"] ?? null };
  }
  if (env["CERTFORGE_E2E_DISPOSABLE"] !== "1" || !env["E2E_API_URL"]) {
    throw new Error("E2E writes synthetic content: use just e2e-release or set CERTFORGE_E2E_DISPOSABLE=1 and an isolated E2E_API_URL. Never run E2E on release/review.");
  }

  const api = localOrigin(env["E2E_API_URL"], "E2E_API_URL");
  // Strict positive allowlist: arbitrary loopback ports can themselves be Vite
  // development proxies forwarding /api to persistent :8080 (e.g. :5173).
  // Only our dedicated disposable Compose API port can receive local E2E writes.
  if (api.port !== "8086") {
    throw new Error("Unsafe E2E_API_URL: local tests require the dedicated disposable API on :8086; arbitrary ports may proxy persistent data.");
  }

  const external = env["E2E_BASE_URL"];
  if (external) {
    const browser = localOrigin(external, "E2E_BASE_URL");
    // Only the repository-controlled disposable Compose frontend is trusted
    // when an external browser endpoint is supplied. Otherwise start a fresh
    // local preview, also bound to the single allowlisted disposable API.
    if (browser.port !== "8083") {
      throw new Error("Unsafe E2E browser/API pair: external browser runs require the disposable web :8083 and API :8086.");
    }
  }

  return { apiUrl: api.origin, browserUrl: external ?? null };
}

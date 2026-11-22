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
  // :8080/:8081 are the persistent release installation, :8082/:8085 the review.
  // :4173 is the preview frontend; it must never be mistaken for the backend.
  if (["8080", "8081", "8082", "8085", "4173"].includes(api.port)) {
    throw new Error("Unsafe E2E_API_URL: release/review/preview ports cannot receive test fixtures.");
  }

  const external = env["E2E_BASE_URL"];
  if (external) {
    const browser = localOrigin(external, "E2E_BASE_URL");
    // Only the repository-controlled disposable Compose pair is trusted with a
    // pre-existing external browser endpoint. For custom APIs, omit E2E_BASE_URL:
    // Playwright starts a dedicated preview proxy bound to the validated API.
    if (browser.port !== "8083" || api.port !== "8086") {
      throw new Error("Unsafe E2E browser/API pair: external browser runs require the disposable web :8083 and API :8086. For another disposable API, omit E2E_BASE_URL and let Playwright start its isolated preview.");
    }
  }

  return { apiUrl: api.origin, browserUrl: external ?? null };
}

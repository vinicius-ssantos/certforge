import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const CSRF_HEADER = "X-XSRF-TOKEN";
const CSRF_COOKIE = "XSRF-TOKEN";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export interface ApiOptions {
  /** Injected in tests; the browser's fetch is used otherwise. */
  fetch?: typeof fetch;
}

function readCookie(name: string): string | undefined {
  const entry = document.cookie.split("; ").find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
}

/**
 * The typed API client.
 *
 * Authentication is a server-side session in an HttpOnly cookie, so this code never sees, stores or
 * sends an authentication token. The only secret-like value it handles is the CSRF token, which
 * the backend hands out for exactly this purpose and which has no authority on its own: it is read
 * from the readable CSRF cookie, or fetched once from `/api/auth/csrf`, and sent as a header on
 * state-changing requests.
 */
export function createApi(options: ApiOptions = {}) {
  const fetchImpl: typeof fetch = options.fetch ?? ((...args) => fetch(...args));
  let csrfToken: string | undefined;

  async function csrf(): Promise<string> {
    const fromCookie = readCookie(CSRF_COOKIE);
    if (fromCookie) {
      return fromCookie;
    }
    if (csrfToken) {
      return csrfToken;
    }
    const response = await fetchImpl("/api/auth/csrf", { credentials: "same-origin" });
    const body = (await response.json()) as { token: string };
    csrfToken = body.token;
    return csrfToken;
  }

  const client = createClient<paths>({
    // Same origin as the page: in production behind the reverse proxy, in development via the Vite
    // proxy. An absolute base also keeps non-browser environments (tests) working.
    baseUrl: window.location.origin,
    credentials: "same-origin",
    fetch: fetchImpl,
  });

  client.use({
    async onRequest({ request }) {
      if (!SAFE_METHODS.has(request.method.toUpperCase())) {
        request.headers.set(CSRF_HEADER, await csrf());
      }
      return request;
    },
    async onResponse({ response }) {
      // An expired or rotated token: forget it so the next attempt fetches a fresh one.
      if (response.status === 403) {
        const problem = (await response.clone().json().catch(() => null)) as { code?: string } | null;
        if (problem?.code === "csrf_invalid") {
          csrfToken = undefined;
        }
      }
      return response;
    },
  });

  return client;
}

export type Api = ReturnType<typeof createApi>;

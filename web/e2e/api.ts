import { request, type APIRequestContext } from "@playwright/test";

export const API_URL = process.env["E2E_API_URL"] ?? "http://localhost:8080";
export const ADMIN_EMAIL = process.env["E2E_ADMIN_EMAIL"] ?? "e2e-admin@example.com";
export const ADMIN_PASSWORD = process.env["E2E_ADMIN_PASSWORD"] ?? "e2e-admin-password-123";

/** A state-changing call with the CSRF token the backend hands out, as the web app does. */
export async function post(api: APIRequestContext, path: string, data?: unknown) {
  return send(api, "POST", path, data);
}

export async function put(api: APIRequestContext, path: string, data?: unknown) {
  return send(api, "PUT", path, data);
}

async function send(api: APIRequestContext, method: "POST" | "PUT", path: string, data?: unknown) {
  const csrf = (await (await api.get("/api/auth/csrf")).json()) as { token: string; headerName: string };
  const response = await api.fetch(path, {
    method,
    headers: { [csrf.headerName]: csrf.token },
    ...(data === undefined ? {} : { data }),
  });
  if (!response.ok()) {
    throw new Error(`${method} ${path} failed: ${response.status()} ${await response.text()}`);
  }
  return response;
}

/** An API session signed in as the administrator the backend was started with. */
export async function adminApi(): Promise<APIRequestContext> {
  const api = await request.newContext({ baseURL: API_URL });
  await post(api, "/api/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  return api;
}

/** Creates an account and gives it the roles, as an administrator would. */
export async function createStaff(roles: string[]) {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const account = { email: `staff-${unique}@example.com`, password: "a long e2e password" };
  const anonymous = await request.newContext({ baseURL: API_URL });
  const created = (await (await post(anonymous, "/api/auth/register", account)).json()) as { id: string };
  await anonymous.dispose();
  const admin = await adminApi();
  await put(admin, `/api/admin/accounts/${created.id}/roles`, { roles });
  await admin.dispose();
  return account;
}

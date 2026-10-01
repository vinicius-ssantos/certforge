import { request, type APIRequestContext } from "@playwright/test";

export const API_URL = process.env["E2E_API_URL"] ?? "http://localhost:8080";
export const ADMIN_EMAIL = process.env["E2E_ADMIN_EMAIL"] ?? "e2e-admin@example.com";
export const ADMIN_PASSWORD = process.env["E2E_ADMIN_PASSWORD"] ?? "e2e-admin-password-123";

/** A state-changing call with the CSRF token the backend hands out, as the web app does. */
export async function post(
  api: APIRequestContext,
  path: string,
  data?: unknown,
  headers: Record<string, string> = {},
) {
  return send(api, "POST", path, data, headers);
}

export async function put(api: APIRequestContext, path: string, data?: unknown) {
  return send(api, "PUT", path, data);
}

async function send(
  api: APIRequestContext,
  method: "POST" | "PUT",
  path: string,
  data?: unknown,
  headers: Record<string, string> = {},
) {
  const csrf = (await (await api.get("/api/auth/csrf")).json()) as { token: string; headerName: string };
  const response = await api.fetch(path, {
    method,
    headers: { [csrf.headerName]: csrf.token, ...headers },
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

export interface Account {
  email: string;
  password: string;
}

/** A learner account made and signed in through the API, for tests that drive the API directly. */
export async function registerLearner(api: APIRequestContext): Promise<Account> {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const account = { email: `api-learner-${unique}@example.com`, password: "a long e2e password" };
  await post(api, "/api/auth/register", account);
  await post(api, "/api/auth/login", account);
  return account;
}

interface QuestionContent {
  type: string;
  topicId: string;
  javaRelease: number;
  difficulty: string;
  difficultyRationale: string;
  prompt: string;
  explanation: string;
  options: { key: string; text: string; correct: boolean; explanation: string }[];
  references: { title: string; url: string }[];
}

/** A complete single-choice question, clearly labelled as test data. */
export function testQuestion(topicId: string, prompt: string): QuestionContent {
  return {
    type: "SINGLE_CHOICE",
    topicId,
    javaRelease: 21,
    difficulty: "EASY",
    difficultyRationale: "Test data.",
    prompt,
    explanation: "Test data: the first option is expected.",
    options: [
      { key: "A", text: "The expected option", correct: true, explanation: "Expected by the test." },
      { key: "B", text: "A wrong option", correct: false, explanation: "Wrong on purpose." },
    ],
    references: [{ title: "Java SE 21 documentation", url: "https://docs.oracle.com/en/java/javase/21/" }],
  };
}

interface RevisionView {
  id: string;
  number: number;
  status: string;
  prompt: string;
  options: QuestionContent["options"];
  references: QuestionContent["references"];
  [key: string]: unknown;
}

export interface QuestionView {
  id: string;
  revisions: RevisionView[];
}

/** Takes a revision through submit, approve and publish, as the editorial workflow requires. */
export async function publishRevision(admin: APIRequestContext, revisionId: string): Promise<void> {
  await post(admin, `/api/admin/question-revisions/${revisionId}/submit`);
  await post(admin, `/api/admin/question-revisions/${revisionId}/approve`, { comment: "E2E" });
  await post(admin, `/api/admin/question-revisions/${revisionId}/publish`);
}

/** Writes a new question and publishes it. */
export async function publishNewQuestion(
  admin: APIRequestContext,
  topicId: string,
  prompt: string,
): Promise<QuestionView> {
  const created = (await (await post(admin, "/api/admin/questions", testQuestion(topicId, prompt))).json()) as QuestionView;
  await publishRevision(admin, created.revisions[0]!.id);
  return created;
}

/** Replaces a published question with a corrected prompt through a new revision, and publishes it. */
export async function replacePublished(
  admin: APIRequestContext,
  questionId: string,
  newPrompt: string,
): Promise<QuestionView> {
  const started = (await (await post(admin, `/api/admin/questions/${questionId}/revisions`)).json()) as QuestionView;
  const draft = started.revisions[started.revisions.length - 1]!;
  const current = started.revisions[started.revisions.length - 2]!;
  await put(admin, `/api/admin/question-revisions/${draft.id}`, {
    type: "SINGLE_CHOICE",
    topicId: current["topicId"],
    javaRelease: current["javaRelease"],
    difficulty: current["difficulty"],
    difficultyRationale: current["difficultyRationale"],
    prompt: newPrompt,
    explanation: current["explanation"],
    options: current.options,
    references: current.references,
  });
  await publishRevision(admin, draft.id);
  return (await (await admin.get(`/api/admin/questions/${questionId}`)).json()) as QuestionView;
}

/** An API session signed in as the given account. */
export async function signedInApi(account: Account): Promise<APIRequestContext> {
  const api = await request.newContext({ baseURL: API_URL });
  await post(api, "/api/auth/login", account);
  return api;
}

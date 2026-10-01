import { request as playwrightRequest, type Page, type Response } from "@playwright/test";
import { expect, test } from "./test";
import { registerLearner } from "./api";
import { register } from "./helpers";
import { TOPIC_NAME } from "./seed";

/**
 * The answer-privacy boundary: until an answer has been accepted, nothing the learner's browser
 * receives, stores or shows may reveal which option is correct or why.
 *
 * Every phrase below comes from the fixture questions the end-to-end run publishes (see seed.ts),
 * so finding one in what a learner has received before answering means the answer leaked. The
 * same phrases must then appear after an accepted answer, which keeps these checks from passing
 * only because nothing was looked at.
 */
const ANSWER_PHRASES = ["Expected by the test.", "Fixture option", "the expected options are marked correct"];
const ANSWER_KEYS = ["correct", "correctOptions", "explanation", "references", "answer", "difficultyRationale"];

interface Seen {
  url: string;
  status: number;
  cacheControl: string;
  text: string;
}

async function collect(page: Page, into: Seen[]) {
  page.on("response", async (response: Response) => {
    const url = response.url();
    if (!url.includes("/api/")) return;
    const text = await response.text().catch(() => "");
    into.push({ url, status: response.status(), cacheControl: response.headers()["cache-control"] ?? "", text });
  });
}

function keysOf(value: unknown, found: Set<string> = new Set()): Set<string> {
  if (Array.isArray(value)) {
    value.forEach((item) => keysOf(item, found));
  } else if (value && typeof value === "object") {
    for (const [key, inner] of Object.entries(value)) {
      found.add(key);
      keysOf(inner, found);
    }
  }
  return found;
}

test("nothing reveals an answer before it is accepted, and everything does afterwards", async ({ page, request, isMobile }) => {
  test.skip(isMobile, "the boundary is the same on every viewport; the journey tests cover the layout");
  const seen: Seen[] = [];
  await collect(page, seen);
  await register(page);

  await page.getByRole("link", { name: "Java Certification" }).click();
  await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^Question 1 of/ })).toBeVisible();
  const sessionId = new URL(page.url()).pathname.split("/").pop()!;

  // 1. Every API response received so far: no answer-bearing field, no answer-bearing phrase.
  const before = seen.filter((entry) => entry.url.includes("/api/study/"));
  expect(before.length).toBeGreaterThan(0);
  for (const entry of before) {
    for (const phrase of ANSWER_PHRASES) {
      expect(entry.text, `${entry.url} must not contain "${phrase}"`).not.toContain(phrase);
    }
    if (entry.text.trim().startsWith("{") || entry.text.trim().startsWith("[")) {
      const keys = keysOf(JSON.parse(entry.text));
      for (const key of ANSWER_KEYS) {
        expect(keys.has(key), `${entry.url} must not have a "${key}" field before an answer`).toBe(false);
      }
    }
  }

  // 2. The page itself, and everything the browser keeps.
  const html = await page.content();
  for (const phrase of ANSWER_PHRASES) {
    expect(html).not.toContain(phrase);
  }
  const stored = await page.evaluate(async () => ({
    local: Object.entries(localStorage),
    session: Object.entries(sessionStorage),
    cookies: document.cookie,
    databases: indexedDB.databases ? (await indexedDB.databases()).length : 0,
  }));
  expect(stored.local).toEqual([]);
  expect(stored.session).toEqual([]);
  expect(stored.databases).toBe(0);
  // The session cookie cannot be read by page script; only the CSRF cookie, which has no authority.
  expect(stored.cookies).not.toContain("CERTFORGE_SESSION");
  const cookies = await page.context().cookies();
  expect(cookies.find((cookie) => cookie.name === "CERTFORGE_SESSION")?.httpOnly).toBe(true);

  // 3. Caches: a signed-in response must say it is not to be stored.
  for (const entry of seen.filter((candidate) => candidate.status === 200 && !candidate.url.includes("/api/auth/csrf"))) {
    expect(entry.cacheControl, `${entry.url} cache policy`).toContain("no-store");
  }

  // 4. Asking for the answer directly does not work either, and nobody else can ask about this session.
  const direct = await page.request.get(`/api/study/sessions/${sessionId}/questions/0/attempt`);
  expect(direct.status()).toBe(404);
  expect(await direct.text()).not.toContain("Expected by the test.");
  const stranger = await registerLearner(request);
  expect(stranger.email).toContain("@");
  expect((await request.get(`/api/study/sessions/${sessionId}`)).status()).toBe(404);
  expect((await request.get(`/api/study/sessions/${sessionId}/questions/0/attempt`)).status()).toBe(404);
  const anonymous = await playwrightRequest.newContext({ baseURL: new URL(page.url()).origin });
  expect((await anonymous.get(`/api/study/sessions/${sessionId}`)).status()).toBe(401);
  await anonymous.dispose();

  // 5. After an accepted answer the same facts do arrive, which is what makes the checks above meaningful.
  await page.locator("#option-A").check();
  await page.getByLabel(/Medium/).check();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^(Correct|Not quite)$/ })).toBeVisible();
  const after = seen.filter((entry) => entry.url.includes("/attempt") && entry.text.includes("Expected by the test."));
  expect(after.length).toBeGreaterThan(0);
});

test("the built app carries no secrets, no source maps and no token storage", async ({ page, request }) => {
  await page.goto("/");
  const scripts = await page.evaluate(() =>
    [...document.querySelectorAll("script[src]")].map((script) => (script as HTMLScriptElement).src),
  );
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of scripts) {
    const body = await (await request.get(src)).text();
    expect(body, `${src} source map reference`).not.toContain("sourceMappingURL");
    expect(body, `${src} admin password`).not.toContain("e2e-admin-password");
    expect(body, `${src} bootstrap variable`).not.toContain("BOOTSTRAP_ADMIN");
    expect(body, `${src} database password`).not.toContain("DB_PASSWORD");
    // Nothing stores a credential under a telling name. (The router library keeps one key in
    // sessionStorage for view transitions, which this app does not use; the other test proves at
    // run time that nothing at all is stored during a real session.)
    expect(body, `${src} stores something credential-like`).not.toMatch(
      /(local|session)Storage\.setItem\(\s*["'`][^"'`]*(token|auth|password|credential|jwt|session)/i,
    );
  }
});

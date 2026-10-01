#!/usr/bin/env node
// Inspects a running release stack, after real traffic has gone through it, for things that must
// never be there:
//
//   errors   every failure answers with the documented problem body and leaks no stack trace,
//            class name or SQL
//   metrics  no metric tag carries an id or an email address, and no tag has unbounded values
//   logs     no answer content, password, cookie or authorization value, in logs that are
//            not empty (so the check is not passing on nothing)
//
// Usage: node deploy/verify-privacy.mjs --logs app.log [--web URL] [--backend URL]
//          [--admin-email E --admin-password P] [--forbid text]...
// Defaults come from E2E_BASE_URL / BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD.
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
function option(name, fallback) {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
}
function options(name) {
  const found = [];
  args.forEach((value, index) => {
    if (value === `--${name}`) found.push(args[index + 1]);
  });
  return found;
}

const web = option("web", process.env.E2E_BASE_URL ?? "http://localhost:8081");
const backend = option("backend", "http://localhost:8080");
const adminEmail = option("admin-email", process.env.BOOTSTRAP_ADMIN_EMAIL);
const adminPassword = option("admin-password", process.env.BOOTSTRAP_ADMIN_PASSWORD);
const logsPath = option("logs");
const forbidden = [
  // Phrases from the fixture questions' answers (e2e/seed.ts, e2e/api.ts).
  "Expected by the test.",
  "Fixture option",
  "the expected options are marked correct",
  "Wrong on purpose.",
  // Credentials the tests use.
  "a long e2e password",
  "a long verification password",
  ...options("forbid"),
  ...(adminPassword ? [adminPassword] : []),
];

let failures = 0;
function report(ok, description, detail = "") {
  console.log(`${ok ? "ok   " : "FAIL "} ${description}${ok || !detail ? "" : `\n        ${detail}`}`);
  if (!ok) failures += 1;
}

/** A tiny cookie jar: node's fetch keeps none. */
class Session {
  constructor(base) {
    this.base = base;
    this.cookies = new Map();
  }
  header() {
    return [...this.cookies].map(([name, value]) => `${name}=${value}`).join("; ");
  }
  remember(response) {
    for (const line of response.headers.getSetCookie?.() ?? []) {
      const [pair] = line.split(";");
      const at = pair.indexOf("=");
      this.cookies.set(pair.slice(0, at), pair.slice(at + 1));
    }
  }
  async call(method, path, { body, headers = {}, raw } = {}) {
    const csrf = this.cookies.get("XSRF-TOKEN");
    const response = await fetch(`${this.base}${path}`, {
      method,
      redirect: "manual",
      headers: {
        ...(this.cookies.size ? { cookie: this.header() } : {}),
        ...(csrf && method !== "GET" ? { "X-XSRF-TOKEN": decodeURIComponent(csrf) } : {}),
        ...(body !== undefined && raw === undefined ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      ...(raw !== undefined ? { body: raw } : body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    this.remember(response);
    return response;
  }
  async signIn(email, password) {
    await this.call("GET", "/api/auth/csrf");
    const response = await this.call("POST", "/api/auth/login", { body: { email, password } });
    if (!response.ok) throw new Error(`sign-in failed with ${response.status}`);
  }
}

// ---- errors -------------------------------------------------------------------------------------

const LEAKS = /Exception|\bat [a-z][\w.]*\.[A-Za-z]+\(|org\.springframework|org\.postgresql|java\.(lang|util|sql)|jdbc|\bSELECT\b|\bINSERT\b|stack ?trace|Caused by/;
const ALLOWED_KEYS = new Set(["type", "title", "status", "detail", "instance", "code", "requestId", "violations", "retryAfterSeconds", "errors", "details", "requested", "available", "sessionId", "fields"]);

async function inspectErrors() {
  if (!adminEmail || !adminPassword) {
    report(false, "error inspection needs an administrator (BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD)");
    return null;
  }
  const session = new Session(web);
  await session.signIn(adminEmail, adminPassword);
  const probes = [
    ["GET", "/api/nothing-here", {}],
    ["GET", "/api/study/sessions/not-a-uuid", {}],
    ["GET", "/api/study/history/attempts?cursor=%25%25garbage", {}],
    ["GET", "/api/study/history/sessions?size=0", {}],
    ["GET", "/api/admin/audit?size=999999", {}],
    ["GET", "/api/admin/questions?status=NOT_A_STATUS", {}],
    ["POST", "/api/study/sessions", { raw: "{ this is not json" }],
    ["POST", "/api/study/sessions", { body: { topicId: "not-a-uuid" } }],
    ["POST", "/api/study/sessions", { body: {} }],
    ["POST", "/api/admin/questions", { body: { type: "NOT_A_TYPE" } }],
    ["PUT", "/api/admin/accounts/not-a-uuid/roles", { body: { roles: ["LEARNER"] } }],
    ["POST", "/api/study/sessions/7c9e6679-7425-40de-944b-e07fc1f90ae7/questions/0/attempt", { body: { selectedOptions: ["A"], confidence: "LOW", elapsedMillis: 1 } }],
  ];
  for (const [method, path, init] of probes) {
    const response = await session.call(method, path, init);
    const text = await response.text();
    const label = `${method} ${path} -> ${response.status}`;
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* not JSON */
    }
    const problem = (response.headers.get("content-type") ?? "").includes("application/problem+json");
    const keys = json && typeof json === "object" ? Object.keys(json) : [];
    const unknown = keys.filter((key) => !ALLOWED_KEYS.has(key));
    const ok =
      response.status >= 400 &&
      response.status < 500 &&
      problem &&
      typeof json?.code === "string" &&
      typeof json?.requestId === "string" &&
      // The id in the body is the one on the response header, which is the one in the logs.
      response.headers.get("x-request-id") === json.requestId &&
      unknown.length === 0 &&
      !LEAKS.test(text);
    report(ok, `error contract: ${label}`, ok ? "" : `problem=${problem} keys=${keys.join(",")} body=${text.slice(0, 200)}`);
  }
  return session;
}

// ---- metrics ------------------------------------------------------------------------------------

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const EMAIL = /[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i;

async function inspectMetrics() {
  const session = new Session(backend);
  await session.signIn(adminEmail, adminPassword);
  const list = await (await session.call("GET", "/actuator/metrics")).json();
  const names = (list.names ?? []).filter((name) => name.startsWith("certforge") || name.startsWith("http.server"));
  report(names.length > 0, `metrics: ${names.length} application and HTTP metrics found`);
  const offenders = [];
  const wide = [];
  for (const name of names) {
    const meter = await (await session.call("GET", `/actuator/metrics/${name}`)).json();
    for (const tag of meter.availableTags ?? []) {
      for (const value of tag.values ?? []) {
        if (UUID.test(value) || EMAIL.test(value)) offenders.push(`${name} ${tag.tag}=${value}`);
      }
      if ((tag.values ?? []).length > 50) wide.push(`${name} ${tag.tag} has ${tag.values.length} values`);
    }
  }
  report(offenders.length === 0, "metrics: no tag value is an id or an email address", offenders.slice(0, 5).join("; "));
  report(wide.length === 0, "metrics: no tag has more than 50 distinct values", wide.slice(0, 5).join("; "));
}

// ---- logs ---------------------------------------------------------------------------------------

function inspectLogs() {
  if (!logsPath) {
    report(false, "log inspection needs --logs <file>");
    return;
  }
  const text = readFileSync(logsPath, "utf8");
  const lines = text.split("\n");
  report(lines.length > 20, `logs: ${lines.length} lines to inspect`);
  for (const phrase of forbidden) {
    const at = lines.findIndex((line) => line.includes(phrase));
    report(at < 0, `logs: never contain "${phrase.length > 40 ? `${phrase.slice(0, 37)}...` : phrase}"`, at >= 0 ? lines[at].slice(0, 200) : "");
  }
  for (const pattern of [/set-cookie/i, /\bCERTFORGE_SESSION=/, /\bXSRF-TOKEN=/, /^.*authorization: /im, /cookie: /i]) {
    const at = lines.findIndex((line) => pattern.test(line));
    report(at < 0, `logs: no cookie or authorization header values (${pattern})`, at >= 0 ? lines[at].slice(0, 200) : "");
  }
}

try {
  const session = await inspectErrors();
  if (session) await inspectMetrics();
  inspectLogs();
} catch (error) {
  report(false, `inspection stopped: ${error.message}`);
}

if (failures > 0) {
  console.log(`${failures} privacy check(s) failed`);
  process.exit(1);
}
console.log("All privacy checks passed");

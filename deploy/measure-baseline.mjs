#!/usr/bin/env node
// Measures how long the primary flows take for ONE learner using a running release stack, and
// optionally holds them to a budget. This is a baseline for noticing regressions, not a capacity
// claim: one client, one backend instance, one database, sequential requests.
//
// Needs the fixture questions the end-to-end run publishes (published questions in the topic below).
//
// Usage: node deploy/measure-baseline.mjs [--web URL] [--rounds N] [--startup-log FILE] [--enforce]
// Prints a markdown table. With --enforce, exits 1 when a budget is exceeded.
import { readFileSync } from "node:fs";
import { Session } from "./lib/session.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};
const web = option("web", process.env.E2E_BASE_URL ?? "http://localhost:8081");
const rounds = Number(option("rounds", "30"));
// The review queue is derived from the attempt history on read (ADR 0013), so its cost grows with
// that history. Measuring it against an empty one would say nothing about the thing the ADR
// promised to measure, so a history is seeded before anything is timed.
const history = Number(option("history", "200"));
const enforce = args.includes("--enforce");
const startupLog = option("startup-log");

// "Date, time, text, numeric and boolean values": the topic the end-to-end fixtures fill.
const TOPIC_ID = "a3000000-0000-4000-8000-000000000001";

/**
 * Budgets are deliberately generous: several times the baseline measured on a developer machine, so
 * that a shared CI runner does not fail them by being slow, while a change that makes something
 * several times slower does.
 */
const BUDGET_MS = {
  "sign in": 1500,
  "list tracks": 400,
  "start session": 600,
  "read session": 400,
  "submit answer": 600,
  "finish session": 600,
  "read history": 500,
  "read progress": 500,
  // The heaviest read: it groups a whole attempt history. Measured at 25-47 ms with 610 and 1408
  // attempts, so this leaves roughly ten times the headroom, as the other read budgets do.
  "read review queue": 500,
};
const STARTUP_BUDGET_SECONDS = 30;

const samples = new Map();
async function timed(name, work) {
  const started = performance.now();
  const result = await work();
  const spent = performance.now() - started;
  if (!samples.has(name)) samples.set(name, []);
  samples.get(name).push(spent);
  return result;
}

function percentile(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}

const learner = new Session(web);
const email = `baseline-${Date.now()}@example.com`;
const password = "a long baseline password";
await learner.call("GET", "/api/auth/csrf");
const registered = await learner.call("POST", "/api/auth/register", { body: { email, password } });
if (registered.status !== 201) {
  console.error(`could not register the measuring account: ${registered.status}`);
  process.exit(2);
}

/** One answered-and-closed session, which is one attempt of evidence. */
async function attempt(as, confidence) {
  const started = await as.call("POST", "/api/study/sessions", {
    body: { topicId: TOPIC_ID, questionCount: 1 },
  });
  if (started.status !== 201) {
    console.error(`could not start a session (${started.status}); are the fixture questions published?`);
    process.exit(2);
  }
  const session = await started.json();
  await (
    await as.call(`POST`, `/api/study/sessions/${session.id}/questions/0/attempt`, {
      body: { selectedOptions: ["A"], confidence, elapsedMillis: 1000 },
      headers: { "Idempotency-Key": crypto.randomUUID() },
    })
  ).text();
  await (await as.call("POST", `/api/study/sessions/${session.id}/complete`)).text();
}

if (history > 0) {
  await learner.call("GET", "/api/auth/csrf");
  await learner.call("POST", "/api/auth/login", { body: { email, password } });
  // A mix of confidences, so the queue has every reason to classify rather than one.
  const spread = ["HIGH", "MEDIUM", "LOW"];
  for (let seeded = 0; seeded < history; seeded += 1) {
    await attempt(learner, spread[seeded % spread.length]);
  }
  console.log(`seeded ${history} attempts before measuring`);
}

for (let round = 0; round < rounds; round += 1) {
  // A fresh sign-in each round: it is the heaviest request (password hashing) and the first one.
  const fresh = new Session(web);
  await fresh.call("GET", "/api/auth/csrf");
  await timed("sign in", () => fresh.call("POST", "/api/auth/login", { body: { email, password } }));
  learner.cookies = fresh.cookies;

  await timed("list tracks", async () => (await learner.call("GET", "/api/catalog/tracks")).text());
  const started = await timed("start session", () =>
    learner.call("POST", "/api/study/sessions", { body: { topicId: TOPIC_ID, questionCount: 1 } }),
  );
  if (started.status !== 201) {
    console.error(`could not start a session (${started.status}); are the fixture questions published?`);
    process.exit(2);
  }
  const session = await started.json();
  await timed("read session", async () => (await learner.call("GET", `/api/study/sessions/${session.id}`)).text());
  const answer = await timed("submit answer", () =>
    learner.call("POST", `/api/study/sessions/${session.id}/questions/0/attempt`, {
      body: { selectedOptions: ["A"], confidence: "MEDIUM", elapsedMillis: 1000 },
      headers: { "Idempotency-Key": crypto.randomUUID() },
    }),
  );
  await answer.text();
  await timed("finish session", async () => (await learner.call("POST", `/api/study/sessions/${session.id}/complete`)).text());
  await timed("read history", async () => (await learner.call("GET", "/api/study/history/sessions?size=20")).text());
  await timed("read progress", async () => (await learner.call("GET", "/api/progress/topics")).text());
  await timed("read review queue", async () => (await learner.call("GET", "/api/review/queue")).text());
}

let exceeded = 0;
console.log(`| Flow | p50 (ms) | p95 (ms) | max (ms) | Budget p95 (ms) |`);
console.log(`|---|---:|---:|---:|---:|`);
for (const [name, values] of samples) {
  const sorted = [...values].sort((a, b) => a - b);
  const p50 = percentile(sorted, 50);
  const p95 = percentile(sorted, 95);
  const over = p95 > BUDGET_MS[name];
  if (over) exceeded += 1;
  console.log(
    `| ${name} | ${p50.toFixed(0)} | ${p95.toFixed(0)}${over ? " (over)" : ""} | ${sorted[sorted.length - 1].toFixed(0)} | ${BUDGET_MS[name]} |`,
  );
}
console.log(
  `\n${rounds} rounds, one learner holding ${history + rounds} attempts, sequential, through the web proxy at ${web}.`,
);

if (startupLog) {
  const match = readFileSync(startupLog, "utf8").match(/Started \w+ in ([0-9.]+) seconds/);
  if (match) {
    const seconds = Number(match[1]);
    const over = seconds > STARTUP_BUDGET_SECONDS;
    if (over) exceeded += 1;
    console.log(`Backend startup: ${seconds.toFixed(1)} s (budget ${STARTUP_BUDGET_SECONDS} s)${over ? " (over)" : ""}.`);
  } else {
    console.log("Backend startup: not found in the log.");
  }
}

if (enforce && exceeded > 0) {
  console.error(`${exceeded} budget(s) exceeded`);
  process.exit(1);
}

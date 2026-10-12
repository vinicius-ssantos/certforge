#!/usr/bin/env node
// Publishes a handful of clearly labelled demo questions, so a fresh installation has something to
// practise on while the real content pack is still waiting for its human review.
//
// These are NOT the Java SE 21 content pack. They are demo data, they say so in their own text, and
// they exist only in the database you point this at. The pack in content/java-se-21 is never
// published by automation (ADR 0005 and the content policy).
//
// It goes through the real editorial workflow, with the reviewer separation the release enforces:
// an author writes and submits, a different account reviews and approves, an administrator
// publishes. It therefore also serves as a check that the workflow works end to end on a real
// deployment.
//
// Usage: node deploy/seed-demo.mjs [--url http://localhost:8081] [--count 10]
//        BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be the administrator's.
import { Session, signInAdmin } from "./lib/session.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};

const url = option("url", process.env.E2E_BASE_URL ?? "http://localhost:8081");
const count = Number(option("count", "10"));
const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

// "Handling date, time, text, numeric and boolean values", the first seeded topic.
const TOPIC_ID = "a3000000-0000-4000-8000-000000000001";
const MARKER = "Demo question";

if (!adminEmail || !adminPassword) {
  console.error("Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD to the administrator's.");
  process.exit(2);
}

function question(number) {
  return {
    type: "SINGLE_CHOICE",
    topicId: TOPIC_ID,
    javaRelease: 21,
    difficulty: "EASY",
    difficultyRationale: "Demo data for trying the application; it teaches nothing.",
    prompt: `${MARKER} ${number}: this is demo data, not exam content. Which option does it ask for?`,
    explanation: `Demo question ${number}: the first option is the one marked correct. This text is demo data.`,
    options: [
      { key: "A", text: "The first option", correct: true, explanation: "The demo marks this one correct." },
      { key: "B", text: "The second option", correct: false, explanation: "Wrong on purpose, so feedback has something to show." },
      { key: "C", text: "The third option", correct: false, explanation: "Wrong on purpose." },
      { key: "D", text: "The fourth option", correct: false, explanation: "Wrong on purpose." },
    ],
    references: [{ title: "Java SE 21 documentation", url: "https://docs.oracle.com/en/java/javase/21/" }],
  };
}

async function json(response) {
  return JSON.parse(await response.text());
}

function fail(what, response, body) {
  console.error(`${what} failed with ${response.status}: ${body}`);
  process.exit(1);
}

const admin = new Session(url);
await signInAdmin(admin, adminEmail, adminPassword);

// How many demo questions are already published, so running this again tops up instead of piling up.
// The queue pages; the demo seed only ever has a handful, but reading one page and assuming it
// is everything is the bug that makes a re-run pile up instead of topping up.
const published = [];
for (let page = 0; ; page += 1) {
  const { items } = await json(
    await admin.call("GET", `/api/admin/questions?status=PUBLISHED&size=100&page=${page}`),
  );
  if (items.length === 0) break;
  published.push(...items);
}
const already = published.filter((q) => q.prompt?.startsWith(MARKER)).length;
if (already >= count) {
  console.log(`${already} demo questions are already published; nothing to do.`);
  process.exit(0);
}

// A reviewer, because the release refuses to let an author approve their own work.
const unique = Date.now().toString(36);
const reviewerAccount = { email: `demo-reviewer-${unique}@example.com`, password: "a long demo password" };
const anonymous = new Session(url);
await anonymous.call("GET", "/api/auth/csrf");
const registered = await anonymous.call("POST", "/api/auth/register", { body: reviewerAccount });
if (registered.status !== 201) {
  fail("registering the demo reviewer", registered, await registered.text());
}
const reviewerId = (await json(registered)).id;
const granted = await admin.call("PUT", `/api/admin/accounts/${reviewerId}/roles`, {
  body: { roles: ["LEARNER", "REVIEWER"] },
});
if (!granted.ok) {
  fail("granting the reviewer role", granted, await granted.text());
}
const reviewer = new Session(url);
await reviewer.signIn(reviewerAccount.email, reviewerAccount.password);

for (let number = already + 1; number <= count; number += 1) {
  const created = await admin.call("POST", "/api/admin/questions", { body: question(number) });
  if (created.status !== 201) {
    fail(`writing demo question ${number}`, created, await created.text());
  }
  const revisionId = (await json(created)).revisions[0].id;

  for (const [who, step, body] of [
    [admin, "submit", undefined],
    [reviewer, "approve", { comment: "Demo data, approved so the demo has questions.", checklist: [] }],
    [admin, "publish", undefined],
  ]) {
    const response = await who.call("POST", `/api/admin/question-revisions/${revisionId}/${step}`, { body });
    if (!response.ok) {
      fail(`${step} of demo question ${number}`, response, await response.text());
    }
  }
  console.log(`published demo question ${number}`);
}

console.log(`\n${count} demo questions are published. They are demo data and say so; the real pack in`);
console.log("content/java-se-21 is untouched and still waits for a human technical review.");

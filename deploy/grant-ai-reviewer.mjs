#!/usr/bin/env node
// Gives an account the AI_REVIEWER role (ADR 0022, ADR 0023), creating it first if it does not exist
// yet. Mirrors deploy/grant-reviewer.mjs; the role it grants is narrower on purpose.
//
// This is an administrative action, kept separate from deploy/publish-pack.mjs for the same reason
// grant-reviewer.mjs is: that script refuses to create accounts, because a reviewer it invented would
// be a lie in the provenance.
//
// Usage: node deploy/grant-ai-reviewer.mjs --email ... --password ... [--url http://localhost:8081]
//        BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be the administrator's.
import { Session, signInAdmin } from "./lib/session.mjs";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at >= 0 ? args[at + 1] : fallback;
};

const url = option("url", process.env.E2E_BASE_URL ?? "http://localhost:8081");
const email = option("email");
const password = option("password");
const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

function refuse(...message) {
  console.error(...message);
  process.exit(2);
}

if (!email || !password) {
  refuse("Provide --email and --password for the AI-reviewer account.");
}
if (!adminEmail || !adminPassword) {
  refuse("Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD to the administrator's.");
}
if (email === adminEmail) {
  refuse(`${email} is the administrator, which authors and publishes here. The AI reviewer must be a second account.`);
}

const admin = new Session(url);
await signInAdmin(admin, adminEmail, adminPassword);

let account;
const existing = new Session(url);
try {
  await existing.signIn(email, password);
  account = JSON.parse(await (await existing.call("GET", "/api/auth/me")).text());
  console.log(`${email} exists, with roles: ${account.roles.join(", ")}`);
} catch {
  const anonymous = new Session(url);
  await anonymous.call("GET", "/api/auth/csrf");
  const registered = await anonymous.call("POST", "/api/auth/register", { body: { email, password } });
  if (registered.status !== 201) {
    refuse(
      `Registering ${email} failed with ${registered.status}: ${await registered.text()}`,
      "\nIf the account exists with a different password, an administrator must reset it.",
    );
  }
  account = JSON.parse(await registered.text());
  console.log(`registered ${email}`);
}

if (account.roles.includes("AI_REVIEWER")) {
  console.log(`${email} is already the AI reviewer. Nothing to do.`);
  process.exit(0);
}
// Role.AI_REVIEWER's own Javadoc: never the same account as REVIEWER or ADMINISTRATOR -- that would
// make this account's approvals final, which ADR 0022 does not allow.
const finalising = account.roles.filter((role) => role === "REVIEWER" || role === "ADMINISTRATOR");
if (finalising.length > 0) {
  refuse(
    `${email} already holds ${finalising.join(", ")}, which can approve content on its own authority.`,
    "\nGranting AI_REVIEWER too would let the same account's judgement be both provisional and final.",
    "Use a separate account.",
  );
}

const roles = [...new Set([...account.roles, "LEARNER", "AI_REVIEWER"])];
const granted = await admin.call("PUT", `/api/admin/accounts/${account.id}/roles`, { body: { roles } });
if (!granted.ok) {
  refuse(`Granting the AI_REVIEWER role failed with ${granted.status}: ${await granted.text()}`);
}

console.log(`${email} now has: ${roles.join(", ")}`);
console.log(`\nPublish AI-reviewed questions with:\n  just publish-content-ai ${email} '<the password>'`);

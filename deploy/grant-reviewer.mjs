#!/usr/bin/env node
// Gives an account the REVIEWER role, creating it first if it does not exist yet, so a single
// maintainer can set up the second account the editorial workflow needs.
//
// The email is a person who will carry reviews of record, so choose a real one. This is an
// administrative action and is kept separate from deploy/publish-pack.mjs on purpose: that script
// refuses to create accounts, because a reviewer it invented would be a lie in the provenance.
//
// Usage: node deploy/grant-reviewer.mjs --email ... --password ... [--url http://localhost:8081]
//        BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD must be the administrator's.
import { Session } from "./lib/session.mjs";

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
  refuse("Provide --email and --password for the reviewer account.");
}
if (!adminEmail || !adminPassword) {
  refuse("Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD to the administrator's.");
}
if (email === adminEmail) {
  refuse(`${email} is the administrator, which authors and publishes here. A reviewer must be a second account.`);
}

const admin = new Session(url);
await admin.signIn(adminEmail, adminPassword);

// Sign-in tells us the account and its current roles; registration is only for one that is missing.
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

if (account.roles.includes("REVIEWER")) {
  console.log(`${email} already reviews. Nothing to do.`);
  process.exit(0);
}

// Roles are replaced wholesale, so keep what the account has. Every account is also a learner
// (ADR 0008).
const roles = [...new Set([...account.roles, "LEARNER", "REVIEWER"])];
const granted = await admin.call("PUT", `/api/admin/accounts/${account.id}/roles`, { body: { roles } });
if (!granted.ok) {
  refuse(`Granting the REVIEWER role failed with ${granted.status}: ${await granted.text()}`);
}

console.log(`${email} now has: ${roles.join(", ")}`);
console.log(`\nPublish the reviewed pack with:\n  just publish-content ${email} '<the password>'`);

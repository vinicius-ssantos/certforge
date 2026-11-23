import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { readPack, readReviewRecord, reviewStatusOf } from "./pack.mjs";

const script = "deploy/publish-owner-reviewed-local.mjs";
const reviewed = readReviewRecord("content/java-se-21");
const questions = readPack("content/java-se-21").filter((q) => /^t0[12]-/.test(q.name));

test("t01/t02 owner import is bound to 30 current, digest-matched approvals", () => {
  assert.equal(reviewed.reviewer, "vinicius-ssantos");
  assert.equal(questions.filter((q) => q.name.startsWith("t01-")).length, 15);
  assert.equal(questions.filter((q) => q.name.startsWith("t02-")).length, 15);
  for (const question of questions) {
    const status = reviewStatusOf(reviewed, question);
    assert.equal(status.state, "reviewed", question.name);
    assert.equal(status.verdict, "APPROVED", question.name);
    assert.equal(status.reviewer, reviewed.reviewer, question.name);
  }
});

test("owner-reviewed importer defaults to offline dry-run", () => {
  const run = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    env: { ...process.env, BOOTSTRAP_ADMIN_EMAIL: "", BOOTSTRAP_ADMIN_PASSWORD: "" },
  });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /DRY RUN: 30 current owner-approved questions/);
  assert.match(run.stdout, /No HTTP request was sent/);
});

test("owner-reviewed importer refuses release and production targets", () => {
  for (const url of ["http://127.0.0.1:8081", "https://certforge.example.com"]) {
    const run = spawnSync(process.execPath, [script, "--apply"], {
      encoding: "utf8",
      env: { ...process.env, CERTFORGE_REVIEW_URL: url },
    });
    assert.notEqual(run.status, 0);
    assert.match(run.stderr, /only on the isolated local review stack/);
  }
});

test("owner-reviewed importer refuses unsupported broader import options", () => {
  const run = spawnSync(process.execPath, [script, "--prefix", "t03-"], {
    encoding: "utf8",
  });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /Usage: node deploy\/publish-owner-reviewed-local.mjs/);
});

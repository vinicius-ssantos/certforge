import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readManifestPack, reviewDigestV2 } from "./manifest-pack.mjs";

const pack = fileURLToPath(new URL("./java-backend-interview/", import.meta.url));
const { manifest, questions } = readManifestPack(pack);
const questionId = "iv151-ocp-refactor-strategy-pattern";
const question = questions.find((item) => item.name === questionId);
const review = JSON.parse(readFileSync(join(pack, "review.json"), "utf8"));
const packManifest = JSON.parse(readFileSync(join(pack, "pack.json"), "utf8"));

test("the OCP refactor uses valid Spring List collection injection and an explicit enum-keyed registry", () => {
  assert.ok(question);
  assert.equal(question.type, "SINGLE_CHOICE");
  assert.deepEqual(question.options.filter((option) => option.correct).map((option) => option.key), ["B"]);
  const correct = question.options.find((option) => option.key === "B");
  assert.match(correct.text, /List<PaymentStrategy>/);
  assert.match(correct.text, /PaymentType supportedType\(\)/);
  assert.match(correct.text, /void charge\(PaymentRequest request\)/);
  assert.doesNotMatch(correct.text, /supportedType\(\): PaymentType/);
  assert.match(correct.text, /Collectors\.toUnmodifiableMap/);
  assert.match(correct.text, /Map<PaymentType, PaymentStrategy>/);
  assert.ok(correct.text.includes(String.fromCharCode(96) + "List<PaymentStrategy>" + String.fromCharCode(96)));
  assert.doesNotMatch(correct.text, /Spring.{0,50}populates.{0,50}Map/);
  assert.match(correct.explanation, /not automatically populate a .*Map<PaymentType, PaymentStrategy>/);
  assert.match(question.explanation, /String bean-name keys, not enum keys/);
  assert.equal(question.references.length, 1);
  assert.equal(question.references[0].url,
    "https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired.html");
  assert.deepEqual(question.options.filter((option) => !option.correct).map((option) => option.key),
    ["A", "C", "D"]);
});

test("the amended question has a digest-matched, explicitly AI-attributed review only", () => {
  const verdict = review.questions[questionId];
  assert.ok(verdict, "Corrected content needs a new review, not an inherited stale approval.");
  assert.equal(verdict.verdict, "APPROVED");
  assert.equal(verdict.reviewer, "ai-reviewer");
  assert.equal(verdict.digest, reviewDigestV2(manifest, question));
  assert.match(verdict.reviewedOn, /^\d{4}-\d\d-\d\d$/);
  assert.deepEqual([...verdict.checklist].sort(), [
    "correct-option-verified", "distractors-plausible", "explanation-complete", "reference-is-primary",
  ].sort());
  assert.equal(packManifest.editorialStatus, "DRAFT");
});

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  manifestOrphansIn,
  manifestReviewStatusOf,
  readManifestPack,
  reviewDigestV2,
  validateGeneralQuestion,
  validateManifestQuestion,
} from "./manifest-pack.mjs";

const manifest = {
  schemaVersion: 1,
  packId: "infra",
  trackSlug: "infra",
  trackKind: "GENERAL",
  trackVersion: "2026.1",
  language: "pt-BR",
  sourcePolicy: "official-v1",
  evidenceProfile: "reference-v1",
  editorialStatus: "DRAFT",
};

const interviewManifest = {
  ...manifest,
  packId: "java-backend-interview-foundation",
  trackSlug: "java-backend-interview",
  trackKind: "INTERVIEW",
  trackVersion: "Taxonomy 2026.1",
  sourcePolicy: "java-backend-authoritative-v1",
};

const sample = () => ({
  topicId: "a3000000-0000-4000-8000-000000000301",
  type: "SINGLE_CHOICE",
  difficulty: "EASY",
  difficultyRationale: "One concept",
  prompt: "Which network layer?",
  explanation: "Reference-backed explanation",
  options: ["A", "B", "C", "D"].map((key, index) => ({
    key,
    text: `Choice ${key}`,
    correct: index === 0,
    explanation: `Why ${key}`,
  })),
  references: [{ title: "Documentation", url: "https://example.org/docs" }],
  evidence: { type: "reference-backed" },
});

const guided = () => ({
  topicId: "a3000000-0000-4000-8000-000000000110",
  type: "GUIDED_RESPONSE",
  seniority: "SENIOR",
  difficulty: "HARD",
  difficultyRationale: "Requires reasoning about retries and durable state",
  prompt: "How would you make a message consumer idempotent?",
  guidedResponse: {
    referenceAnswer:
      "Use a stable idempotency key and atomically persist duplicate detection with the business effect.",
    expectedConcepts: [
      {
        text: "stable idempotency key",
        required: true,
        explanation: "Duplicate deliveries need the same durable identity.",
      },
      {
        text: "durable duplicate detection",
        required: true,
        explanation: "Process memory cannot survive retries or restarts.",
      },
    ],
    commonMistakes: ["Treating broker delivery guarantees as business idempotency."],
    followUps: ["What changes when the side effect is in another service?"],
  },
  references: [{ title: "Kafka design", url: "https://kafka.apache.org/documentation/" }],
  evidence: { type: "reference-backed" },
});

test("accepts reference-backed general-knowledge questions", () => {
  assert.equal(validateGeneralQuestion(sample(), manifest).type, "SINGLE_CHOICE");
});

test("rejects malformed questions and accidental legacy Java metadata", () => {
  assert.throws(
    () => validateManifestQuestion({ ...sample(), javaRelease: 21 }, manifest),
    /javaRelease/,
  );
  assert.throws(
    () => validateManifestQuestion({ ...sample(), options: sample().options.slice(0, 3) }, manifest),
    /4 or 5/,
  );
  assert.throws(
    () =>
      validateManifestQuestion(
        {
          ...sample(),
          options: sample().options.map((value) => ({ ...value, correct: false })),
        },
        manifest,
      ),
    /cardinality/,
  );
  assert.throws(
    () =>
      validateManifestQuestion(
        { ...sample(), references: [{ title: "Docs", url: "http://example.org" }] },
        manifest,
      ),
    /HTTPS/,
  );
});

test("exam questions must bind to their objectives", () => {
  const certification = { ...manifest, trackKind: "CERTIFICATION" };
  assert.throws(() => validateManifestQuestion(sample(), certification), /objectiveKeys/);
  assert.equal(
    validateManifestQuestion({ ...sample(), objectiveKeys: ["1.1"] }, certification)
      .objectiveKeys[0],
    "1.1",
  );
});

test("interview questions require explicit seniority", () => {
  assert.throws(
    () => validateManifestQuestion({ ...sample(), explanation: "Still objective" }, interviewManifest),
    /seniority/,
  );
  const question = { ...sample(), seniority: "PLENO" };
  assert.equal(validateManifestQuestion(question, interviewManifest).seniority, "PLENO");
  assert.throws(
    () => validateManifestQuestion({ ...question, seniority: "JUNIOR" }, interviewManifest),
    /PLENO or SENIOR/,
  );
  assert.throws(
    () => validateManifestQuestion({ ...sample(), seniority: "PLENO" }, manifest),
    /only valid for INTERVIEW/,
  );
});

test("accepts reviewed guided-response criteria only on interview packs", () => {
  const question = guided();
  assert.equal(validateManifestQuestion(question, interviewManifest).type, "GUIDED_RESPONSE");
  assert.throws(() => validateManifestQuestion(question, manifest), /INTERVIEW/);
  assert.throws(
    () =>
      validateManifestQuestion(
        {
          ...question,
          options: [
            { key: "A", text: "Choice", correct: true, explanation: "Not applicable" },
          ],
        },
        interviewManifest,
      ),
    /must not define answer options/,
  );
  assert.throws(
    () => validateManifestQuestion({ ...question, explanation: "Objective answer" }, interviewManifest),
    /objective explanation/,
  );
});

test("guided responses require a reference answer and at least one required concept", () => {
  const question = guided();
  assert.throws(
    () =>
      validateManifestQuestion(
        {
          ...question,
          guidedResponse: { ...question.guidedResponse, referenceAnswer: " " },
        },
        interviewManifest,
      ),
    /referenceAnswer/,
  );
  assert.throws(
    () =>
      validateManifestQuestion(
        {
          ...question,
          guidedResponse: {
            ...question.guidedResponse,
            expectedConcepts: question.guidedResponse.expectedConcepts.map((concept) => ({
              ...concept,
              required: false,
            })),
          },
        },
        interviewManifest,
      ),
    /required concept/,
  );
  assert.throws(
    () =>
      validateManifestQuestion(
        {
          ...question,
          guidedResponse: { ...question.guidedResponse, followUps: [""] },
        },
        interviewManifest,
      ),
    /followUps/,
  );
});

test("digest changes on semantic, policy, seniority and guided-criteria edits", () => {
  const question = guided();
  const digest = reviewDigestV2(interviewManifest, question);
  assert.equal(reviewDigestV2(interviewManifest, { ...question }), digest);
  assert.notEqual(reviewDigestV2(interviewManifest, { ...question, prompt: "Changed" }), digest);
  assert.notEqual(
    reviewDigestV2({ ...interviewManifest, trackVersion: "Taxonomy 2026.2" }, question),
    digest,
  );
  assert.notEqual(
    reviewDigestV2({ ...interviewManifest, sourcePolicy: "other-policy" }, question),
    digest,
  );
  assert.notEqual(reviewDigestV2(interviewManifest, { ...question, seniority: "PLENO" }), digest);
  assert.notEqual(
    reviewDigestV2(interviewManifest, {
      ...question,
      guidedResponse: {
        ...question.guidedResponse,
        followUps: [...question.guidedResponse.followUps, "How would you test it?"],
      },
    }),
    digest,
  );
});

test("reads one manifest-backed guided-response pack and rejects an empty one", () => {
  const dir = mkdtempSync(join(tmpdir(), "certforge-pack-"));
  try {
    writeFileSync(join(dir, "pack.json"), JSON.stringify(interviewManifest));
    assert.throws(() => readManifestPack(dir), /at least one question/);
    mkdirSync(join(dir, "messaging-idempotency"));
    writeFileSync(
      join(dir, "messaging-idempotency", "question.json"),
      JSON.stringify(guided()),
    );
    const pack = readManifestPack(dir);
    assert.equal(pack.questions.length, 1);
    assert.equal(pack.manifest.trackKind, "INTERVIEW");
    assert.equal(pack.questions[0].guidedResponse.expectedConcepts.length, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});


test("review records bind verdicts to the exact guided-response digest", () => {
  const question = { name: "messaging-idempotency", ...guided() };
  const digest = reviewDigestV2(interviewManifest, question);
  const record = {
    reviewer: "vinicius-ssantos",
    reviewerRole: "project owner and maintainer",
    reviewedOn: "2026-10-08",
    method: "Question reviewed against the generated manifest review packet.",
    questions: {
      "messaging-idempotency": { verdict: "APPROVED", digest },
    },
  };

  const reviewed = manifestReviewStatusOf(record, interviewManifest, question);
  assert.equal(reviewed.state, "reviewed");
  assert.equal(reviewed.verdict, "APPROVED");
  assert.equal(reviewed.reviewedOn, "2026-10-08");

  const changed = manifestReviewStatusOf(
    record,
    interviewManifest,
    {
      ...question,
      guidedResponse: {
        ...question.guidedResponse,
        referenceAnswer: question.guidedResponse.referenceAnswer + " Changed.",
      },
    },
  );
  assert.equal(changed.state, "changed");
  assert.notEqual(changed.recordedDigest, changed.currentDigest);
});

test("review record reports unreviewed questions and stale orphan entries", () => {
  const question = { name: "messaging-idempotency", ...guided() };
  assert.equal(manifestReviewStatusOf(null, interviewManifest, question).state, "unreviewed");
  const record = {
    questions: {
      "messaging-idempotency": { verdict: "APPROVED", digest: reviewDigestV2(interviewManifest, question) },
      removed: { verdict: "APPROVED", digest: "sha256:" + "a".repeat(64) },
    },
  };
  assert.deepEqual(manifestOrphansIn(record, [question]), ["removed"]);
});


test("validates the real Java Backend interview foundation pack", () => {
  const pack = readManifestPack("content/java-backend-interview");
  assert.equal(pack.manifest.packId, "java-backend-interview-foundation");
  assert.equal(pack.manifest.trackKind, "INTERVIEW");
  assert.equal(pack.manifest.trackSlug, "java-backend-interview");
  assert.equal(pack.questions.length, 12);
  assert.equal(new Set(pack.questions.map((question) => question.topicId)).size, 12);
  assert.deepEqual(
    pack.questions.map((question) => question.name),
    [
      "t01-java-equals-hashcode-key",
      "t02-concurrency-volatile-visibility",
      "t03-oop-payment-strategy-boundary",
      "t04-dsa-priority-queue-scheduler",
      "t05-spring-constructor-injection",
      "t06-persistence-n-plus-one",
      "t07-testing-idempotency-strategy",
      "t08-domain-boundaries-shared-table",
      "t09-distributed-retry-storm",
      "t10-messaging-kafka-idempotent-consumer",
      "t11-cloud-kubernetes-probes",
      "t12-system-design-aws-orders-idempotency",
    ],
  );
  assert.ok(pack.questions.every((question) => question.type === "GUIDED_RESPONSE"));
  assert.ok(pack.questions.every((question) => ["PLENO", "SENIOR"].includes(question.seniority)));
  assert.ok(
    pack.questions.every((question) =>
      question.guidedResponse.expectedConcepts.some((concept) => concept.required),
    ),
  );
});

# AWS certification profiles (#172)

Status (2026-11-09): all three profiles #172 names — **CLF-C02**, **DVA-C03** and **SAA-C03** —
are scaffolded, authored and merged, each at full coverage of its own seeded objective set (19/19,
12/12, 14/14). This mirrors [the CNCF roadmap doc](cncf-certification-roadmap.md)'s record-keeping
style: this project's `catalog_exam_objective_snapshot` table requires a verified version and date
per ADR 0017 point 3, and a coverage gap must be a visible, queryable fact rather than a quietly
trimmed snapshot. Unlike the CNCF profiles, none of the three AWS exams here turned out to have an
honest permanent gap — every objective AWS's own exam guide lists had a sourceable, allowlisted
citation.

## Why these three, in this order

#172 names exactly three profiles: Cloud Practitioner (foundational, no prerequisite), Developer
Associate and Solutions Architect Associate (both associate-level, no prerequisite on each other).
CLF-C02 went first as the cheapest way to prove the pattern (smallest curriculum, 19 objectives
across 4 domains) established by Terraform Associate (#173) and KCNA/KCSA (#171) before it, then
DVA-C03 and SAA-C03 followed once that pattern was confirmed to generalize to a provider with a
PDF-pinned, dated exam guide instead of a live webpage (Terraform) or a CNCF curriculum repo.

## CLF-C02 — AWS Certified Cloud Practitioner (#329, #330, #331)

**Pack:** `content/aws-cloud-practitioner-certification/` (19 questions across all 19 seeded
objectives).
**Catalog:** `V30__seed_aws_cloud_practitioner_certification_track.sql` (track
`aws-cloud-practitioner-certification`, DRAFT; 4 topics, one per domain; 19 objectives).

**Primary source:** AWS Certified Cloud Practitioner (CLF-C02) Exam Guide, version 1.3 (published
October 29, 2026) — a versioned, dated PDF, fetched directly via `curl` (not a summarizing tool),
confirmed byte-identical across two independent downloads, and hashed with sha256 on the
`verifiedOn` date (2026-11-06).
`sha256:de4d07b2b31f6df3465076342c43d7066362d26e356a1a57edd8901616c38c69`.

| Domain | Weight | Objective keys | Covered |
|---|---|---|---|
| Cloud Concepts | 24% | `CLF-1.1` … `1.4` | all 4 |
| Security and Compliance | 30% | `CLF-2.1` … `2.4` | all 4 |
| Cloud Technology and Services | 34% | `CLF-3.1` … `3.8` | all 8 |
| Billing, Pricing, and Support | 12% | `CLF-4.1` … `4.3` | all 3 |

**All 19 objectives covered.** Every citation was independently verified against the actual
fetched `docs.aws.amazon.com` page content — several guessed URLs redirected off-domain or to
archived whitepaper index pages before the real chapter page was found (see
[the AWS docs staleness note](#a-citation-trap-worth-recording) below for a related trap). The
6 broad "identify AWS X services" objectives (`CLF-3.3` … `3.8`) each test one specific,
well-documented fact about a single well-known service (EC2, DynamoDB, VPC, S3, Rekognition, SQS)
rather than a vague category question.

## DVA-C03 — AWS Certified Developer - Associate (#336, #338, #344)

**Pack:** `content/aws-developer-associate-certification/` (12 questions across all 12 seeded
objectives).
**Catalog:** `V31__seed_aws_developer_associate_certification_track.sql` (track
`aws-developer-associate-certification`, DRAFT; 4 topics; 12 objectives).

**Primary source:** AWS Certified Developer - Associate (DVA-C03) Exam Guide (registration opened
October 27, 2026) — fetched directly via `curl`, confirmed byte-identical across two independent
downloads, hashed with sha256 on the `verifiedOn` date (2026-11-07).
`sha256:98b8e605309cd90dd51567b3e69987663e454ba7c26fa4adba4291d9f64c23a9`.

| Domain | Weight | Objective keys | Covered |
|---|---|---|---|
| Development with AWS Services | 30% | `DVA-1.1` … `1.3` | all 3 |
| Security | 26% | `DVA-2.1` … `2.3` | all 3 |
| Testing and Deployment | 22% | `DVA-3.1` … `3.3` | all 3 |
| Troubleshooting and Optimization | 22% | `DVA-4.1` … `4.3` | all 3 |

**Targets DVA-C03, not DVA-C02.** An earlier DVA-C02 scaffold was closed unmerged after DVA-C02's
own exam guide turned up a notice that registration for DVA-C03 had opened October 27, 2026 and
DVA-C02's last test date was November 30, 2026 — a 3-week window from when that scaffold was
written. Authoring content against a retiring exam code would have been close to immediately
obsolete, so the profile was rebuilt against DVA-C03 instead. DVA-C03 is new enough that its exam
guide carries no populated Revisions table yet, so `providerVersion` names the registration-open
date rather than inventing a version number the source doesn't state.

**All 12 objectives covered.** Domains 3-4 (#344) were independently re-verified by the repo owner
via direct `WebFetch` against the real AWS documentation pages before merging (CodeDeploy AppSpec
hooks, CodeBuild test reporting, CodeDeploy deployment configurations, X-Ray concepts, CloudWatch
EMF, Lambda provisioned concurrency) — one factual correction came out of that pass (the AppSpec
hooks question's `difficultyRationale` wrongly claimed `BeforeInstall`/`AfterInstall` are exclusive
to EC2/On-Premises; they're also valid for Amazon ECS), fixed before merge.

## SAA-C03 — AWS Certified Solutions Architect - Associate (#337, #341, #343)

**Pack:** `content/aws-solutions-architect-associate-certification/` (14 questions across all 14
seeded objectives).
**Catalog:** `V32__seed_aws_solutions_architect_associate_certification_track.sql` (track
`aws-solutions-architect-associate-certification`, DRAFT; 4 topics; 14 objectives).

**Primary source:** AWS Certified Solutions Architect - Associate (SAA-C03) Exam Guide v1.1
(published Oct 29, 2026) — fetched directly via `curl`, confirmed byte-identical across two
independent downloads, hashed with sha256 on the `verifiedOn` date (2026-11-07).
`sha256:8959456c08b980947e6a6936e4f9e23b7a1fd0df2274b1c846222c49e7e63152`.

| Domain | Weight | Objective keys | Covered |
|---|---|---|---|
| Design Secure Architectures | 30% | `SAA-1.1` … `1.3` | all 3 |
| Design Resilient Architectures | 26% | `SAA-2.1` … `2.2` | both |
| Design High-Performing Architectures | 24% | `SAA-3.1` … `3.5` | all 5 |
| Design Cost-Optimized Architectures | 20% | `SAA-4.1` … `4.4` | all 4 |

SAA-C03 has the same 4-domain shape as CLF-C02 but a different task-statement count per domain
(3/2/5/4 = 14 objectives vs. CLF-C02's 4/4/8/3 = 19) and a different weight split (30/26/24/20 vs.
24/30/34/12) — AWS weights each exam's domains independently, so neither count nor split transfers
between profiles.

**All 14 objectives covered.** Every citation (IAM roles, VPC security groups/NACLs, S3
SSE-KMS/SSE-S3, SQS, RDS Multi-AZ/read replicas) was independently re-verified by the repo owner
via direct `WebFetch` against the real AWS documentation pages before merging — all claims
confirmed to match, including the Multi-AZ DB *cluster* read-replica exception, which the question
correctly scopes to "Multi-AZ DB instance deployment" rather than overclaiming it for every Multi-AZ
configuration.

## A citation trap worth recording

Some `docs.aws.amazon.com/whitepapers/...` pages carry a banner reading exactly: "This whitepaper
is for historical reference only. Some content might be outdated and some links might not be
available." The page still returns HTTP 200 and reads like normal docs — nothing about the URL or
response code flags it. During CLF-C02 authoring, a historical pricing whitepaper page stated a
discount figure that conflicted with the current, non-deprecated page covering the same fact
(caught only because a verification pass fetched and compared both). Any future AWS citation
should explicitly check the fetched page for this banner before trusting a specific figure, and
prefer a current, non-deprecated page within the `docs.aws.amazon.com` allowlist when one exists
for the same fact.

## Against #172's acceptance criteria

- [x] 3 profiles with official objectives and an auditable version: all three `pack.json` files
  carry a `certification` block (`provider`, `examCode`, `providerVersion`, `snapshotDigest`,
  `verifiedOn`), matching each `catalog_exam_objective_snapshot` row.
- [x] 10+ draft questions across ≥4 services and ≥3 architecture scenarios: 45 questions total
  across the three packs, spanning EC2, S3, DynamoDB, VPC, RDS, Lambda, SQS, IAM, Cognito,
  Secrets Manager, CodeDeploy, CodeBuild, X-Ray, CloudWatch, Rekognition, Kinesis and more, with
  SAA-C03 alone covering 14 distinct resiliency/performance/cost-optimization architecture
  scenarios.
- [x] Per-alternative explanations and official `docs.aws.amazon.com` references: enforced by
  `content/manifest-pack.mjs`'s `infrastructure-official-v1` source policy, same gate as every
  other infra pack.
- [x] Metrics per profile, not mixed: each profile is its own pack/track/topic set; none of the
  three shares a topic or a `pack.json` with another.
- [ ] Mandatory human review: all three packs stay `editorialStatus: DRAFT`, same as every
  unpublished infra pack. Citations were independently fetched and verified during authoring
  (several PRs: "independently re-verified by the repo owner via direct `WebFetch`"), but that is
  citation verification, not the project's full editorial sign-off (`review.json`) — no AWS pack
  has one yet. That sign-off, not authoring, is what should gate publication.
- [x] Re-check code and exam scope before publication: DVA-C02 → DVA-C03 is a live example of this
  discipline already firing once, before any content was authored against a code about to retire.

Authoring is complete for all three named profiles. What's left before this issue can close is the
same thing every other DRAFT infra pack is waiting on: a human editorial sign-off pass, not more
content.

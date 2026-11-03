# CNCF certification profiles (#171)

Status: KCNA built (catalog + content pack, DRAFT, unreviewed). CKAD, CKA, KCSA and CKS are
documented plans only — no schema rows, no content pack for any of them yet.

This doc exists because ADR 0017 decided *how* a certification profile is represented (track,
version, exam, verified objective snapshot) but left *which* exams and in what order to #171. It
records the primary-source provenance this project's `catalog_exam_objective_snapshot` table
requires (ADR 0017 point 3: "no certification is claimed without a verified version and date"),
and the plan for the four exams this round did not build.

## Why KCNA first

Of the five exams #171 names, KCNA and KCSA are the only two that are themselves multiple-choice,
proctored exams — so a question pack here can honestly claim to prepare a learner for the actual
exam *format*, not just adjacent concepts. CKAD, CKA and CKS are all hands-on, performance-based
exams graded on a live terminal; a quiz bank cannot certify readiness for them, and #171's
acceptance criteria explicitly require saying so rather than implying otherwise. KCNA also has no
prerequisite and the smallest curriculum (4 domains, 13 sub-topics) of the five, so it is the
cheapest way to prove the CERTIFICATION-track pipeline end to end (manifest → catalog seed →
import → review → objective-checked publish) before repeating it for the others.

## KCNA — built this round

**Pack:** `content/cncf-kcna-certification/` (9 questions across 9 of the 13 objectives).
**Catalog:** `V25__seed_cncf_kcna_certification_track.sql` (track `cncf-kcna-certification`, DRAFT;
4 topics, one per domain; 13 objectives, including the 4 this round's pack does not yet cover).

**Primary source:** `cncf/curriculum`'s `KCNA_Curriculum.pdf`, pinned at commit
[`c2df915`](https://github.com/cncf/curriculum/blob/c2df915fb5a07e4c7872a902f42e32192edf995b/KCNA_Curriculum.pdf)
(committed 2026-03-22). `sha256:2141ce75db8c67a72588775345d3b8448e4a6d3f3b46c37f86f4b388c153b8ff`.
Read directly with `pdftotext -layout`, not taken from a secondary summary page, and cross-checked
against `cncf.io` and `training.linuxfoundation.org`, which agree on the same four domains and
weights. Verified 2026-11-03.

| Domain | Weight | Sub-topics | Objective keys | Covered by this round's pack |
|---|---|---|---|---|
| Kubernetes Fundamentals | 44% | Core Concepts, Administration, Scheduling, Containerization | KCNA-1.1 … 1.4 | all 4 |
| Container Orchestration | 28% | Networking, Security, Troubleshooting, Storage | KCNA-2.1 … 2.4 | 2.1, 2.2, 2.4 (not 2.3) |
| Cloud Native Application Delivery | 16% | Application Delivery, Debugging | KCNA-3.1, 3.2 | 3.1 only |
| Cloud Native Architecture | 12% | Observability, Ecosystem and Principles, Community and Collaboration | KCNA-4.1 … 4.3 | 4.2 only |

The four uncovered objectives (`KCNA-2.3`, `KCNA-3.2`, `KCNA-4.1`, `KCNA-4.3`) are recorded in the
snapshot with no published question. That is deliberate, not an oversight: ADR 0017 and #171 both
want a coverage gap to be a visible, queryable fact — `catalog_exam_objective` rows with no
`qb_revision_objective_key` claiming them — rather than a snapshot quietly trimmed to match
whatever got authored. Closing them is follow-up work on the same pack, not a blocker to merging
what covers the other 9.

This pack, like every CNCF reference in it, cites `cncf.io` for governance/ecosystem facts
`kubernetes.io` doesn't own, and `kubernetes.io` for everything Kubernetes-technical — both now on
`content/manifest-pack.mjs`'s `infrastructure-official-v1` host allowlist. One trap worth
recording for future packs: the allowlist entry is the bare host `cncf.io`; `www.cncf.io` is a
*different* string and would fail the check even though it serves the same site, so always cite
the bare-domain form.

## CKAD, CKA, KCSA, CKS — plan only

All four pinned sources below were captured 2026-11-03 at commits current as of that date; the PDF
bytes are kept at `kcad.pdf`/`cka.pdf`/`kcsa.pdf`/`cks.pdf` only in the authoring session's
scratchpad, not in this repo — re-fetch and re-hash at the pinned commit before building any of
these, rather than trusting the table below indefinitely.

### CKAD — Certified Kubernetes Application Developer

Performance-based, ~2 hours, proctored hands-on exam. **A quiz pack can only test the conceptual
layer underneath it (ConfigMaps, Secrets, RBAC, resource limits, workload types) — never the
actual terminal skill the exam grades.** Any CKAD content this project ships must say so.

Source: `CKAD_Curriculum_v1.37.pdf`, commit
[`f423fa4`](https://github.com/cncf/curriculum/blob/f423fa49c0cab0820533babd95b37ebe8fd89e67/CKAD_Curriculum_v1.37.pdf)
(2026-10-01). `sha256:7736d2f0291239d62e9fc618304413ee9b6e53fc4580aac70bf4328203c1c21`.

| Domain | Weight |
|---|---|
| Application Design and Build | 20% |
| Application Deployment | 20% |
| Application Environment, Configuration and Security | 25% |
| Services and Networking | 20% |
| Application Observability and Maintenance | 15% |

Plan: weight a first pack toward the 25% domain and the two 20% build/deploy domains — those are
the most quiz-answerable (ConfigMaps/Secrets/RBAC/resource limits/workload-type facts), unlike live
troubleshooting. ~10-12 questions, 3 from the 25% domain, 2-3 each from the 20% domains, 1-2 from
Observability, labelled as conceptual preparation only — same pattern as KCNA.

### CKA — Certified Kubernetes Administrator

Performance-based, 2 hours, proctored — the flagship hands-on exam; the KCNA/KCSA caveat applies
with full force.

Source: `CKA_Curriculum_v1.37.pdf`, commit
[`b3c8508`](https://github.com/cncf/curriculum/blob/b3c8508b9f6cd0bcfa76c2e4b7cc9b6a2f109bec/CKA_Curriculum_v1.37.pdf)
(2026-10-15). `sha256:634b793704485c2ac424a90902e0f8b28f7348a49814393434f808e3e78ec18`.

| Domain | Weight |
|---|---|
| Storage | 10% |
| Workloads and Scheduling | 15% |
| Servicing and Networking | 20% |
| Cluster Architecture, Installation and Configuration | 25% |
| Troubleshooting | 30% |

Troubleshooting is the single largest domain and is almost entirely unteachable by multiple
choice — it is "diagnose this broken live cluster." Plan: document only this round; defer any
question authoring until KCNA/KCSA conceptual packs have proven the CERTIFICATION-track pipeline
and #175 (isolated labs) gives a real hands-on surface to pair a CKA pack with. Building a CKA quiz
pack with no lab component risks exactly the "quizzes alone equal readiness" failure mode #171
warns against, more than for any other exam here.

### KCSA — Kubernetes and Cloud Native Security Associate

Multiple-choice, proctored, no prerequisite — confirmed directly on `cncf.io` as "an online,
proctored, multiple-choice exam." **This is the one exam besides KCNA where a quiz pack can
legitimately claim to prepare a learner for the actual exam format**, not just adjacent concepts.

Source: `KCSA Curriculum.pdf` (filename has a literal space), commit
[`007442f`](https://github.com/cncf/curriculum/blob/007442fa374ea3bd6e9217450388041803ad06ce/KCSA%20Curriculum.pdf)
(2024-06-24 — the oldest and most stable of the four). `sha256:2855eb7db729ab9ad0136b87d002560f82297e66e811026159df946227d5114`.

| Domain | Weight |
|---|---|
| Overview of Cloud Native Security | 14% |
| Kubernetes Cluster Component Security | 22% |
| Kubernetes Security Fundamentals | 22% |
| Kubernetes Threat Model | 16% |
| Platform Security | 16% |
| Compliance and Security Frameworks | 10% |

Plan: second-best candidate after KCNA for a real pack, since the format matches. Suggested first
slice: ~10 questions weighted roughly 2-2-2-2-1-1 across the six domains, same `objectiveKeys` /
topic pattern as KCNA (e.g. `KCSA-2.x` for Cluster Component Security sub-topics). Good immediate
follow-up to KCNA once that pipeline is proven end to end.

### CKS — Certified Kubernetes Security Specialist

Performance-based, 2 hours, proctored. **Hard prerequisite: the candidate must already hold CKA**
(CKA need not still be active). Same hands-on caveat as CKA/CKAD, plus this project must record the
CKA prerequisite explicitly wherever CKS is surfaced — it should never be offered in this project's
UI before CKA is, since that mirrors a real-world requirement, not just a content ordering choice.

Source: `CKS_Curriculum v1.37.pdf` (filename has a literal space), commit
[`4de0c31`](https://github.com/cncf/curriculum/blob/4de0c318883d34f6070e760bf55df1f8dd5846eb/CKS_Curriculum%20v1.37.pdf)
(2026-11-03 — the most recently touched of the four; re-diff against the curriculum repo's
`old-versions/` if anything here ever looks off). `sha256:a755a5680bec6978de4a3074d7f0c7fe978bd7a9ad5e4f1681597aedda6f6637`.

| Domain | Weight |
|---|---|
| Cluster Setup | 15% |
| Cluster Hardening | 15% |
| System Hardening | 10% |
| Minimize Microservice Vulnerabilities | 20% |
| Supply Chain Security | 20% |
| Monitoring, Logging and Runtime Security | 20% |

Plan: same reasoning as CKA — fully performance-based, plus a hard CKA prerequisite that is itself
only a plan, not built. Document only this round.

## Follow-up tracked under #171

- Close the four uncovered KCNA objectives (`KCNA-2.3`, `KCNA-3.2`, `KCNA-4.1`, `KCNA-4.3`).
- Build the KCSA pack next, reusing this pipeline.
- Revisit CKAD once a labs surface (#175) exists to pair conceptual questions with, so the pack
  can be honest about what it does and does not prepare a learner for.
- CKA and CKS stay plan-only until #175 lands and, for CKS, until CKA itself is built.

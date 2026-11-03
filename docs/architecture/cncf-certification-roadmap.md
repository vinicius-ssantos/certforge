# CNCF certification profiles (#171)

Status (2026-11-03): KCNA merged and published (#299). KCSA and CKAD built, AI-approved and
published against a local backend; #300 (KCSA) and #301 (CKAD) are open, pending merge. CKA and
CKS remain documented plans only — no schema rows, no content pack for either yet.

This doc exists because ADR 0017 decided *how* a certification profile is represented (track,
version, exam, verified objective snapshot) but left *which* exams and in what order to #171. It
records the primary-source provenance this project's `catalog_exam_objective_snapshot` table
requires (ADR 0017 point 3: "no certification is claimed without a verified version and date"),
and the plan for the exams not yet built.

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

## KCSA — built this round (#300)

Multiple-choice, proctored, no prerequisite — confirmed directly on `cncf.io` as "an online,
proctored, multiple-choice exam." Like KCNA, a quiz pack here can legitimately claim to prepare a
learner for the actual exam *format*.

**Pack:** `content/cncf-kcsa-certification/` (9 questions across 9 of 42 objectives).
**Catalog:** `V26__seed_cncf_kcsa_certification_track.sql` (6 topics, all 42 objectives seeded).

**Primary source:** `cncf/curriculum`'s `KCSA Curriculum.pdf` (filename has a literal space),
pinned at commit
[`007442f`](https://github.com/cncf/curriculum/blob/007442fa374ea3bd6e9217450388041803ad06ce/KCSA%20Curriculum.pdf)
(committed 2024-06-24 — the oldest and most stable of the five CNCF curricula this project has
read). `sha256:2855eb7db729ab9ad0136b87d002560f82297e66e811026159df946227d5114a`. Read with
`pdftotext -layout`. Verified 2026-11-03.

| Domain | Weight | Covered by this round's pack |
|---|---|---|
| Overview of Cloud Native Security | 14% | KCSA-1.4, 1.5 (not the originally-planned 1.1 — see below) |
| Kubernetes Cluster Component Security | 22% | KCSA-2.1, 2.8 |
| Kubernetes Security Fundamentals | 22% | KCSA-3.1, 3.7 |
| Kubernetes Threat Model | 16% | KCSA-4.1, 4.7 |
| Platform Security | 16% | KCSA-5.5 (not the originally-planned 5.1 — see below) |
| Compliance and Security Frameworks | 10% | none |

Two objectives originally planned (`KCSA-1.1` the 4Cs of Cloud Native Security, `KCSA-5.1` Supply
Chain Security) turned out to have no genuinely supportive citation inside the allowed host
list — `kubernetes.io` has moved on to a different security-lifecycle framing and no longer
documents the 4Cs, and it doesn't own supply-chain-security facts either — so the pack covers a
different sub-topic in the same domain instead of forcing a weak citation. Domain 6 (Compliance
and Security Frameworks) has no question at all: its sub-topics are SOC2/PCI-DSS-style compliance
facts that neither `kubernetes.io` nor `cncf.io` document, so it is an honest, visible gap.

## CKAD — built this round (#301)

Performance-based, ~2 hours, proctored hands-on exam. **A quiz pack can only test the conceptual
layer underneath it (ConfigMaps, Secrets, RBAC, resource limits, workload types) — never the
actual terminal skill the exam grades.** Every CKAD question this project ships says so implicitly
by staying strictly conceptual: what a field does, why one workload resource fits over another —
never a live troubleshooting scenario.

**Pack:** `content/cncf-ckad-certification/` (11 questions across 11 of 24 objectives).
**Catalog:** `V27__seed_cncf_ckad_certification_track.sql` (5 topics, all 24 objectives seeded).

**Primary source:** `cncf/curriculum`'s `CKAD_Curriculum_v1.37.pdf`, pinned at commit
[`f423fa4`](https://github.com/cncf/curriculum/blob/f423fa49c0cab0820533babd95b37ebe8fd89e67/CKAD_Curriculum_v1.37.pdf)
(committed 2026-10-01). `sha256:7736d2f0291239d62e9fc618304413ee9b6e53fc4580aac70bf4328203c1c210`.
Read with `pdftotext -layout`. Verified 2026-11-03.

| Domain | Weight | Covered by this round's pack |
|---|---|---|
| Application Design and Build | 20% | CKAD-1.2, 1.4 |
| Application Deployment | 20% | CKAD-2.2, 2.4 |
| Application Environment, Configuration and Security | 25% | CKAD-3.3, 3.6, 3.8 |
| Services and Networking | 20% | CKAD-4.1, 4.3 |
| Application Observability and Maintenance | 15% | CKAD-5.2, 5.4 |

13 of the 24 seeded objectives remain uncovered — an honest gap, same policy as KCNA and KCSA.

## CKA, CKS — plan only

Both pinned sources below were captured 2026-11-03 at commits current as of that date; the PDF
bytes are kept at `cka.pdf`/`cks.pdf` only in the authoring session's scratchpad, not in this
repo — re-fetch and re-hash at the pinned commit before building either, rather than trusting the
table below indefinitely.

### CKA — Certified Kubernetes Administrator

Performance-based, 2 hours, proctored — the flagship hands-on exam; the KCNA/KCSA caveat applies
with full force.

Source: `CKA_Curriculum_v1.37.pdf`, commit
[`b3c8508`](https://github.com/cncf/curriculum/blob/b3c8508b9f6cd0bcfa76c2e4b7cc9b6a2f109bec/CKA_Curriculum_v1.37.pdf)
(2026-10-15). `sha256:634b793704485c2ac424a90902e0f8b28f7348a49814393434f808e3e78ec18c`.

| Domain | Weight |
|---|---|
| Storage | 10% |
| Workloads and Scheduling | 15% |
| Servicing and Networking | 20% |
| Cluster Architecture, Installation and Configuration | 25% |
| Troubleshooting | 30% |

Troubleshooting is the single largest domain and is almost entirely unteachable by multiple
choice — it is "diagnose this broken live cluster." It splits into two genuinely different
problems, and this project should solve them in order rather than waiting on the harder one to
unblock the whole domain:

- **Phase 1 — static diagnosis (no execution, buildable now).** Give the learner a realistic,
  already-captured symptom — a `kubectl describe pod` dump, a chunk of `kubectl get events`
  output, a log excerpt — and ask for the root cause or the next diagnostic command. This is
  reading comprehension over real output, not hands-on skill, so it fits the existing schema with
  no new infrastructure: `GUIDED_RESPONSE` (already used for interview questions) or ordinary
  multiple choice both work. This is exactly the order #175 itself specifies: *"Começar com
  leitura/debug de Dockerfile/YAML e testes estáticos; só depois laboratórios em sandbox."*
- **Phase 2 — live sandboxed labs (#175, real infrastructure, not started).** An ephemeral
  `kind`/`k3d` cluster per session, a browser terminal bridged to it, deterministic evaluation
  against the cluster's actual end state, and strict resource/network/time limits — #175
  explicitly forbids the host's Docker socket, real credentials, paid cloud and privileged
  containers, which means genuine sandboxing (gVisor/Kata/microVM-class isolation), not plain
  Docker. This is a security-sensitive infrastructure project in its own right — #175's own
  acceptance criteria require a reviewed threat model and ADR before any of it ships — not a
  content-authoring task like KCNA/KCSA/CKAD were.

Plan: Phase 1 can reasonably pair with the rest of a CKA conceptual pack (Storage, Workloads,
Networking, Cluster Architecture) once that pack is started. Phase 2, and therefore full
Troubleshooting coverage, waits on #175 landing with its own threat model and ADR. Building a CKA
pack with Troubleshooting silently skipped risks exactly the "quizzes alone equal readiness"
failure mode #171 warns against less than building it with a *fabricated* hands-on claim would —
so the gap must stay visible in the objective snapshot, the same way KCNA/KCSA/CKAD's gaps already
are, until Phase 2 closes it for real.

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

- Close the uncovered objectives in KCNA (`KCNA-2.3`, `KCNA-3.2`, `KCNA-4.1`, `KCNA-4.3`), KCSA
  (33 of 42 remain, including all of Compliance and Security Frameworks) and CKAD (13 of 24
  remain).
- Build a CKA pack covering Storage, Workloads and Scheduling, Servicing and Networking, and
  Cluster Architecture conceptually now; add Troubleshooting Phase 1 (static diagnosis, see above)
  once that pack exists; defer Troubleshooting Phase 2 and the rest of CKA's hands-on claim to
  #175.
- CKS stays plan-only until #175 lands and CKA itself is built (hard prerequisite, see above).

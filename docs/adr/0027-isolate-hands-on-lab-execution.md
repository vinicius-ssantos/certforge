# ADR 0027: Isolate hands-on lab execution with microVM-class sandboxing, not plain containers

- Status: **Accepted** (2026-11-08, by the product owner, after reviewing this ADR together with
  `docs/architecture/hands-on-labs-isolation.md` and the new "Hands-on lab runner threats" section
  of `threat-model.md` in PR #350). This satisfies #175's own first acceptance criterion
  ("Threat model, ADR e plano de isolamento com segurança revisada"). Acceptance covers the
  design only — the isolation tier, the `LabSpec` schema, and the threat enumeration — not any
  implementation, since none exists yet; see the Rollout section of the isolation plan for what
  Phase 2's actual construction still needs before it ships. **Decision 1 (Kata Containers/
  Firecracker as the self-hosted engine) is superseded by
  [ADR 0028](0028-vercel-sandbox-for-hands-on-labs.md)**, which runs the same microVM boundary on
  Vercel Sandbox instead of infrastructure this project would operate itself. Decisions 2 through 6
  below — the prohibitions, the `LabSpec` contract's intent, deterministic evaluation outside the
  learner's reach, destroy-on-exit, and the Phase 1/Phase 2 split — stand as written.
- Date: 2026-11-08
- Issue: [#175](https://github.com/vinicius-ssantos/certforge/issues/175) ("Design safe hands-on
  labs for Docker, Kubernetes and IaC"), depends on #164

## Context

#175's acceptance criteria open with the one this ADR exists to satisfy: a reviewed threat model,
ADR, and isolation plan, *before* any lab that executes a learner's command. The issue's own
`Implementação` section already splits the work into two phases:

1. **Phase 1 — static diagnosis, no execution.** A captured `kubectl describe`/`get events`/log
   excerpt, with a multiple-choice or guided-response question asking for the root cause. No
   sandbox, no new infrastructure. This phase is **done**: every CKA Troubleshooting objective
   (CKA-5.1 through 5.5, closing out #171's CKA pack to 27/27) is now covered by exactly this
   pattern, and CKAD's conceptual-only questions follow the same discipline. See
   `docs/architecture/cncf-certification-roadmap.md`.
2. **Phase 2 — this ADR's scope.** An ephemeral, learner-driven Docker/Kubernetes/IaC environment,
   evaluated deterministically against its real end state. No code for this exists yet.

ADR 0006 already decided the shape of *a* runner for learner-submitted Java: a separate, disposable,
resource-bounded environment with no database credentials and no general network access. Phase 2
cannot reuse that runner's isolation tier as-is, because the trust boundary is categorically wider:

- ADR 0006's runner compiles and executes **text the learner wrote**, inside a language runtime
  with no legitimate need for raw syscalls, device access, or kernel capabilities.
- #175's labs need the learner to drive **a real Docker daemon or Kubernetes cluster** — building
  images, scheduling Pods, inspecting cluster state. That is not optional; it is the entire point
  of a Docker/Kubernetes lab.

Making a real Docker daemon or kind/k3d cluster available to an arbitrary command stream has, in
its naive form, exactly two implementations, and the issue's own acceptance criteria forbid both:

- **Mount the host's Docker socket** (`/var/run/docker.sock`) into the lab container. Rejected by
  the issue directly ("Proibir Docker socket do host") — this is a documented root-equivalent
  escape to the host, not a hardening gap.
- **Run the lab container `--privileged`**, so it can start its own nested daemon and manage its
  own cgroups/overlay filesystem. Rejected by the issue directly ("containers privilegiados") —
  `--privileged` disables most of the namespace isolation a container provides in the first place.

With both ruled out, the lab cannot run as a normal container sharing the host kernel at all; it
needs a boundary that holds even when the thing inside it is, by design, trying to act like a
container host. That boundary is a microVM (Kata Containers over Firecracker or an equivalent) or
a user-space kernel intercepting syscalls (gVisor) — isolation at the hypervisor or syscall-
interception layer, not at the namespace layer alone. This is exactly what #175's own
`Implementação` and its 2026-11-03 scoping comment already named as the required direction; this
ADR formalizes it as a decision rather than leaving it as a comment.

## Decision

**1. Every lab session runs inside a dedicated, ephemeral microVM, never a plain container
sharing the host kernel.** Kata Containers (Firecracker-backed) is the default target; gVisor is an
acceptable lighter-weight substitute only for labs that do not themselves need to run a nested
container runtime (e.g. a plain shell-and-files lab). The choice is recorded per `LabSpec`
(decision 3), not hard-coded once for every lab.

**2. The prohibitions in #175's own `Implementação` are binding, not aspirational, and are
enforced mechanically where possible:**
   - No host Docker socket is ever mounted into a lab, in any form.
   - No lab container (or its nested daemon) ever runs `--privileged` or with an equivalent
     capability set (`CAP_SYS_ADMIN`, `CAP_SYS_MODULE`, etc.) at the host level — only inside the
     guest microVM's own kernel, which the host does not trust regardless.
   - No lab ever receives real cloud credentials, a real payment-bearing cloud account, or network
     access to paid cloud APIs.
   - Default network posture is `egress: none`; the exception (`egress: image-pull-only`) exists
     in the schema but must be justified per lab and is expected to stay unused once base images
     are pre-cached, since no prototype lab needs live internet access to be graded.

**3. A `LabSpec` is the one authoring surface for a lab, and nothing about a lab's isolation is
decided ad hoc outside it.** Its required fields (digest-pinned image, static fixture, objective
text, an explicit allowlist of permitted commands, wall-clock/memory/CPU/disk/process limits, a
network-egress mode, a bounded writable-scratch size, and a deterministic evaluation spec) are
specified in full in `docs/architecture/hands-on-labs-isolation.md`, which this ADR treats as its
isolation plan for #175's acceptance criterion. A lab with a field missing or a limit left
unbounded does not ship.

**4. Evaluation is deterministic and runs outside the learner's own shell context.** A grader
process — not an agent living inside the microVM that the learner's commands could tamper with —
inspects the lab's final state (a Pod's `Ready` condition, a Service's `EndpointSlice`, a built
image's layer composition) read-only, from the orchestrator's own access path, and reports a
verdict. The learner's shell never self-reports success.

**5. Session lifecycle is destroy-on-exit, unconditionally.** A microVM and everything inside it —
cluster state, filesystem scratch, kubeconfig, generated credentials — is destroyed at session end,
at timeout, or on any failure, and is never reused for a different session or a different learner.
Cleanup itself is a tested behavior (#175's own acceptance criterion), not an assumption.

**6. Phase 1 and Phase 2 stay separately tracked.** Phase 1 (static diagnosis, already shipped
through #171's content packs) required none of the above and is not retroactively subject to this
ADR. This ADR, and the isolation plan it points to, govern Phase 2 only — and Phase 2's
*construction* remains unbuilt even now that this document is Accepted: acceptance covers the
design, not an implementation, which is separate follow-on work the Rollout section scopes.

## Consequences

- **No lab ships before microVM-class isolation exists in this project's infrastructure.** Nothing
  about today's deployment (`compose.yaml`, `compose.e2e.yaml`, `compose.release.yaml`) provides
  this; it is new infrastructure, not a configuration change to the existing application containers.
- **The three prototype labs the issue names (readiness probe, Service selector, Docker
  multi-stage build) are specified as `LabSpec` instances in `docs/architecture/hands-on-labs-
  isolation.md`, but none are implemented by this ADR.** Writing the orchestrator, the microVM
  provisioning, and the grader is follow-on work the ADR's acceptance unblocks, not performs.
- **`docs/architecture/threat-model.md` gains a lab-specific threat section** alongside its
  existing, narrower "Future runner threats" (which was written for ADR 0006's Java case and is
  left as-is, since that runner's trust boundary is genuinely smaller than this one's).
- **CKS stays plan-only.** #175 Phase 2 is one of two blockers on CKS content (`docs/architecture/
  cncf-certification-roadmap.md`'s "CKS — plan only" section) — this ADR does not itself unblock
  CKS; it only exists to let Phase 2's actual construction start under real review.

## Rejected alternatives

- **Plain Docker-in-Docker (DinD), accepting `--privileged` as a known, documented risk.**
  Rejected: the issue's own acceptance criteria forbid privileged containers outright, and DinD's
  risk is exactly the host Docker socket / privileged-container exposure the issue is written to
  prevent — accepting it would not be a hardening tradeoff, it would be not doing the thing the
  issue asks for.
- **Sysbox or another rootless, unprivileged "container that can run containers" runtime, as a
  middle ground between plain containers and a full microVM.** Considered: it genuinely improves
  on raw `--privileged`. Rejected for this decision because it still shares the host kernel, which
  is the exact boundary a kernel or container-runtime vulnerability would need to cross to reach
  the host — the issue's threat surface (an arbitrary, browser-driven command stream from an
  unauthenticated-trust-level learner) is adversarial enough that a shared-kernel boundary is not
  the isolation tier this project wants to accept, even though it is cheaper to operate.
- **A cloud-hosted ephemeral VM per session (e.g. a real cloud provider's VM API), instead of a
  local microVM.** Rejected: it reintroduces exactly the "paid cloud" dependency the issue
  explicitly forbids, and shifts the threat model onto a third party's API credentials, which is a
  new secret this project would have to hold and scope correctly — strictly worse than a local
  microVM for this use case.
- **A fully simulated/fake "lab" (e.g. a WASM sandbox pretending to be a Kubernetes API, with
  canned responses) instead of a real Docker/Kubernetes environment.** Rejected: it would not test
  what the issue asks for. A learner fixing a readiness probe against a fake API that already knows
  the "right" YAML is not practicing anything; the entire value of a hands-on lab is that the
  evaluation is against real, inspectable state.
- **Letting the grader run as an agent inside the microVM itself, reporting its own success.**
  Rejected: that agent is reachable by the same arbitrary command stream the learner controls, so it
  cannot be trusted to self-report — the issue's "avaliação determinística" requirement is read
  here as requiring the evaluator to be outside the learner's reach, not merely automated.

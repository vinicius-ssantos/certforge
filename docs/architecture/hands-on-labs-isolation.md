# Hands-on labs: isolation plan (#175 Phase 2)

Status: design only, no code. This is the isolation plan [ADR 0027](../adr/0027-isolate-hands-on-lab-execution.md)
points to for #175's first acceptance criterion. Nothing here ships until that ADR has had an
actual human security review.

## What this document is not

- It is not Phase 1, which is already built: static-diagnosis questions over already-captured
  `kubectl`/log output, no execution, no sandbox. See `docs/architecture/cncf-certification-
  roadmap.md` — every CKA Troubleshooting objective (5.1–5.5) ships this way today.
- It is not an implementation. Provisioning code, the orchestrator, and the grader are follow-on
  work this document scopes but does not write.

## Why a microVM, not a container

ADR 0027's Context section has the full reasoning. In short: a Docker/Kubernetes lab needs the
learner to drive a real container runtime or cluster, and the issue that scopes this work forbids
both ways of giving a plain container that ability (host Docker socket, `--privileged`). What is
left is isolation at the hypervisor or syscall-interception layer — a microVM (Kata Containers /
Firecracker) by default, or gVisor for labs that don't themselves need a nested runtime.

## `LabSpec`: the one authoring surface

Every lab is exactly one `LabSpec`. A field left out or a limit left unbounded means the lab does
not ship — there is no implicit default that widens access.

```yaml
labId: string                      # unique, versioned (e.g. "readiness-probe-wrong-port-v1")
isolation: "kata" | "gvisor"       # which sandbox tier this lab runs under; "kata" unless a lab
                                    # genuinely needs no nested container runtime at all
image:
  ref: string                      # registry/repo@sha256:<digest> -- a digest, never a floating tag
fixture:
  path: string                     # a static bundle committed to this repo (manifests, a
                                    # Dockerfile, seed data) -- never fetched live at session start
objective:
  title: string
  description: string              # what the learner must fix or achieve, shown to the learner
allowedCommands:
  - string                         # a strict allowlist of binaries/subcommands the terminal
                                    # bridge will execute; anything not listed is rejected at the
                                    # bridge, not merely discouraged by the fixture
limits:
  wallClockSeconds: number         # hard session timeout; the microVM is destroyed at expiry
                                    # regardless of lab state
  memoryMiB: number
  cpuMillicores: number
  diskMiB: number
  processCount: number
network:
  egress: "none" | "image-pull-only"   # default "none"; "image-pull-only" must be justified per
                                        # lab and is expected to stay unused once images are
                                        # pre-cached in the lab's own base image
filesystem:
  writableScratchMiB: number       # bounded temp scratch; everything else in the guest is read-only
evaluation:
  type: "deterministic-probe"
  checks:
    - description: string
      probe: string                # a read-only inspection the grader runs against final state
                                    # (e.g. a kubectl jsonpath query), never something the
                                    # learner's own shell can influence the result of directly
```

## The three prototype labs the issue names

Each is sketched here as a `LabSpec` outline, not implemented. All three deliberately reuse facts
this project has already authored and independently verified in multiple-choice form (CKA/CKAD
content packs), so a learner who did the Phase 1 question first arrives at the lab already knowing
the concept the lab tests hands-on.

### 1. Fix a readiness probe

- **Fixture:** a Deployment whose Pod template's `readinessProbe` points at the wrong port (or the
  wrong path), so the Pod never reports `Ready`.
- **Objective:** edit the manifest and reapply so the Pod becomes `Ready`.
- **Evaluation:** `kubectl get pod <name> -o jsonpath='{.status.conditions[?(@.type=="Ready")].status}'`
  equals `True` within the session timeout.
- **Network:** `none` — the fixture and image are fully self-contained.

### 2. Fix a Service selector

- **Fixture:** a Service whose `spec.selector` does not match its backing Deployment's Pod labels
  — the same class of bug this session's CKA `t2`/`t27` content questions already cover
  conceptually.
- **Objective:** correct the selector so the Service has a serving endpoint.
- **Evaluation:** the Service's `EndpointSlice` has a non-empty `ENDPOINTS` column and the
  endpoint's `serving` condition is `true`.
- **Network:** `none`.

### 3. Fix a Docker multi-stage build

- **Fixture:** a Dockerfile that ships build-time toolchain and source into its final image (no
  multi-stage split), producing a bloated image with build-only binaries present at runtime.
- **Objective:** rewrite the Dockerfile as a proper multi-stage build.
- **Evaluation:** the built image's final layer does not contain the build-only binary (checked by
  path, not by trusting the learner's own `docker build` log), and its size is under a fixed budget
  for this fixture.
- **Network:** `none` — the base images this lab needs are pinned and pre-cached in the lab's own
  image, so no build-time pull from a live registry is needed.

## Session lifecycle

1. **Provision.** A fresh microVM is created from a minimal, audited base image. The `LabSpec`'s
   fixture is baked in at build time, not fetched at session start. A fresh, scoped kubeconfig (for
   Kubernetes labs) or Docker context (for Docker labs) is generated inside the VM only — it never
   exists on the host and is never returned to the learner's browser.
2. **Bridge.** The learner's browser connects to a terminal bridge that enforces the `LabSpec`'s
   `allowedCommands` allowlist. Anything not on the list is rejected at the bridge; the bridge does
   not rely on the fixture or the guest kernel to enforce this.
3. **Limits, enforced at the hypervisor, not only in-guest.** `wallClockSeconds`, `memoryMiB`,
   `cpuMillicores`, `diskMiB` and `processCount` are all caps the orchestrator enforces on the
   microVM itself. In-guest cgroups are defense in depth, not the primary boundary.
4. **Network.** Egress defaults to `none`. The microVM's network namespace routes nowhere outside
   itself unless the `LabSpec` explicitly sets `egress: image-pull-only`, and even then only to the
   specific registry the pinned digest lives on.
5. **Evaluate.** At learner-signalled completion or at timeout, the grader — a process outside the
   learner's shell context, reading the microVM's state through the orchestrator's own access path
   — runs the `LabSpec`'s `evaluation.checks` and records a verdict. The learner's shell is never
   asked to self-report success.
6. **Destroy, unconditionally.** The microVM, its scratch filesystem, its generated credentials,
   and its network namespace are torn down — on success, on failure, on timeout, and on any
   orchestrator error. Nothing is reused for a later session, by this learner or anyone else.

## Observability

Same posture as the application's existing telemetry principle
(`docs/architecture/threat-model.md`'s "Sensitive telemetry" control): structured, allowlisted
fields only. A lab session logs its `labId`, start/end time, resource usage, and the grader's
verdict (and which check passed or failed) — never the learner's raw shell transcript. If an abuse
investigation genuinely needs the transcript, that is a separate, access-controlled, retention-
bounded capability, not something captured by default.

## Abuse controls

Lab starts are rate-limited per account, the same pattern already used for sign-in throttling
(`IdentityIT`). The orchestrator holds a capacity ceiling and queues or rejects new sessions past
it rather than over-provisioning host resources.

## Rollout

- **Phase 1 — done.** Static-diagnosis questions, no execution. Shipped through #171's content
  packs; no further action from this document.
- **Phase 2 — this document's scope, not yet started.** In order:
  1. Human security review of ADR 0027 and this document; ADR 0027 is marked Accepted only as a
     result of that review, not by this document asserting it.
  2. Build the orchestrator and microVM provisioning for exactly one `LabSpec` (the readiness-probe
     lab, the simplest of the three) as a vertical slice, entirely outside the main application's
     deployment, per ADR 0006's existing "separate restricted runner service" principle.
  3. Add the grader and destroy-on-exit lifecycle, with tests proving cleanup and failure-safety —
     #175's own acceptance criterion.
  4. Extend to the remaining two prototype labs once the first's isolation, evaluation, and cleanup
     are all independently verified, not before.
  5. CI runs only against the fixtures above, never against anything resembling a real learner's
     arbitrary input, per #175's last acceptance criterion.

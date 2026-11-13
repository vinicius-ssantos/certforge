# Hands-on labs: isolation plan (#175 Phase 2)

Status: design accepted (2026-11-08, PR #350), no code yet. This is the isolation plan
[ADR 0027](../adr/0027-isolate-hands-on-lab-execution.md) points to for #175's first acceptance
criterion, now satisfied. Nothing here is implemented yet — see Rollout below for what Phase 2's
actual construction still needs.

**Updated 2026-11-13** ([ADR 0028](../adr/0028-vercel-sandbox-for-hands-on-labs.md)): the microVM
engine is Vercel Sandbox, not a self-hosted Kata/Firecracker fleet. The `LabSpec`'s `isolation`
field is dropped (every lab now gets the same microVM boundary, so there is no tier to pick) and
its `limits` block is replaced below by `sandbox`/`filesystem` fields matching what the platform
actually meters; the exact mechanism behind "Provision" and "Destroy" in the session lifecycle
changes too. Everything else on this page (the `LabSpec`'s intent, the three prototype labs,
evaluation outside the learner's reach, observability, abuse controls) is unchanged.

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
left is isolation at the hypervisor or syscall-interception layer. [ADR 0028](../adr/0028-vercel-
sandbox-for-hands-on-labs.md) provisions that boundary as a Vercel Sandbox (one Firecracker
microVM per session) rather than a self-hosted Kata Containers/Firecracker or gVisor fleet — the
same isolation property ADR 0027 asked for, from a managed API instead of infrastructure this
project would operate itself.

## `LabSpec`: the one authoring surface

Every lab is exactly one `LabSpec`. A field left out or a limit left unbounded means the lab does
not ship — there is no implicit default that widens access.

```yaml
labId: string                      # unique, versioned (e.g. "readiness-probe-wrong-port-v1")
image:
  ref: string                      # a Vercel Container Registry image, pinned by digest
                                    # (repo@sha256:<digest> or image@sha256:<digest>) --
                                    # never a floating tag
fixture:
  path: string                     # a static bundle committed to this repo (manifests, a
                                    # Dockerfile, seed data) -- never fetched live at session start
objective:
  title: string
  description: string              # what the learner must fix or achieve, shown to the learner
allowedCommands:
  - string                         # a strict allowlist of binaries/subcommands the terminal
                                    # bridge will execute; anything not listed is rejected at the
                                    # bridge itself, before it ever reaches sandbox.runCommand --
                                    # Vercel Sandbox has no native per-command allowlist of its own
sandbox:
  vcpus: number                    # 1, or an even number up to the plan ceiling; memory is fixed
                                    # at 2 GiB per vCPU and is not independently settable
  timeoutSeconds: number           # hard session timeout, capped at the plan's session max;
                                    # the session is stopped and any in-flight command rejects
                                    # at expiry regardless of lab state
  persistent: false                # always false for a lab -- never resumed, never reused across
                                    # learners or across attempts; a LabSpec that omits this, or
                                    # sets it true, does not ship
network:
  egress: "none" | "image-pull-only"   # "none" is networkPolicy "deny-all" (blocks all egress,
                                        # including DNS); "image-pull-only" is an allow-rule scoped
                                        # to the one registry the pinned digest lives on. Default
                                        # "none"; "image-pull-only" must be justified per lab and
                                        # is expected to stay unused once images are pre-cached in
                                        # the lab's own base image.
filesystem:
  writableScratchMiB: number       # bounded temp scratch; everything else in the guest is
                                    # read-only. There is no platform-level quota below the
                                    # 64 GB/session disk ceiling, and no process-count cap at all --
                                    # see ADR 0028 decision 5. A lab needing a tighter bound than
                                    # the platform offers must check it itself, as a grader probe.
evaluation:
  type: "deterministic-probe"
  checks:
    - description: string
      probe: string                # a read-only inspection the grader runs against final state
                                    # (e.g. a kubectl jsonpath query), issued by the orchestrator's
                                    # own call to the sandbox API -- never something the learner's
                                    # own terminal-bridge session can influence the result of
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

1. **Provision.** The orchestrator calls `Sandbox.create({ image, resources: { vcpus },
   timeout, persistent: false, networkPolicy })` for the `LabSpec`'s pinned image digest. The
   fixture is baked into that image at build time, not fetched at session start. A fresh, scoped
   kubeconfig (for Kubernetes labs) or Docker context (for Docker labs) is generated inside the VM
   only — it never exists on the host and is never returned to the learner's browser. The
   orchestrator authenticates to the Sandbox API with its own credential (ADR 0028 decision 3); no
   credential is placed inside the sandbox.
2. **Interactive access.** The orchestrator calls `sandbox.openInteractive()` and hands the
   resulting `{ url, token }` to the learner's browser, which connects directly to Vercel's
   controller-hosted PTY — this project's backend is not in that connection's path. The allowlist
   is still enforced, not merely discouraged, but by [ADR 0029](../adr/0029-restricted-shell-
   enforces-the-lab-allowlist.md)'s `lab-shell`, the image's default login shell, checking each
   typed line's first word against `$LAB_ALLOWED_COMMANDS` and executing the result directly
   (never through a second shell), rather than by a backend bridge inspecting the connection —
   there is no such bridge once the browser holds the Vercel credential directly. **The literal
   REST contract behind `openInteractive()` is not yet confirmed** — it has no listed REST API
   documentation page the way create/`cmd`/stop do, and is not wrapped by this project's Vercel
   MCP tools either; the orchestrator's interactive-session endpoint cannot be written against a
   guessed contract and is blocked on this confirmation (see Rollout).
3. **Limits, enforced by the platform, not only in-guest.** `timeoutSeconds` and `vcpus` are the
   caps the platform enforces on the microVM itself — the session is stopped and any in-flight
   command rejects at timeout. Disk is capped at the platform's own 64 GB/session ceiling; process
   count has no platform-level cap at all (ADR 0028 decision 5) — a fork bomb is contained to that
   one microVM but not stopped before `timeout` or the disk ceiling ends the session. In-guest
   cgroups remain defense in depth, not the primary boundary.
4. **Network.** Egress defaults to `networkPolicy: "deny-all"`. The microVM reaches nowhere outside
   itself, including DNS, unless the `LabSpec` explicitly sets `egress: image-pull-only`, which
   becomes an `allow` rule scoped to the specific registry the pinned digest lives on.
5. **Evaluate.** At learner-signalled completion or at timeout, the grader — server-side code
   holding its own call to the Sandbox API, never the learner's terminal-bridge session — runs the
   `LabSpec`'s `evaluation.checks` as read-only inspection commands and records a verdict. The
   learner's shell is never asked to self-report success.
6. **Destroy, unconditionally.** `sandbox.stop()` is called on success, on failure, on timeout, and
   on any orchestrator error, with `persistent: false` already set at creation so no filesystem
   snapshot is retained to resume from. Nothing is reused for a later session, by this learner or
   anyone else.

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
it rather than over-provisioning host resources. Under ADR 0028 this ceiling also bounds a second,
sharper cost: exposed-port traffic and sandbox egress are billable per session, on top of vCPU
time, so an unbounded lab-start loop is a direct cost, not only a capacity problem.

## Rollout

- **Phase 1 — done.** Static-diagnosis questions, no execution. Shipped through #171's content
  packs; no further action from this document.
- **Phase 2 — this document's scope. Design accepted 2026-11-08 (ADR 0027), isolation engine
  updated 2026-11-13 (ADR 0028); construction not started.** In order:
  1. ~~Human security review of ADR 0027 and this document.~~ Done — the product owner reviewed
     and accepted ADR 0027 in PR #350, and ADR 0028's change of isolation engine directly in
     conversation on 2026-11-13.
  2. **Smoke-tested 2026-11-13 — mixed result, not a pass.** A throwaway, non-persistent sandbox
     (`persistent: false`, stopped after ~2.7 minutes, ~47s active CPU) confirmed:
     - **Docker works.** `apt-get install docker.io`, starting `dockerd` directly, and
       `docker run hello-world` all succeed end-to-end inside the guest — pulling an image,
       creating a container, running it, streaming its output. This is exactly what the
       multi-stage-build lab needs (`docker build` against a real nested daemon) and it is now
       verified, not assumed.
     - **`kind` fails.** `kind create cluster` cannot bring up its control-plane node: the node
       container's own `systemd` (PID 1 inside that doubly-nested container) exits with
       `Failed to create /init.scope control group: Structure needs cleaning` /
       `Failed to allocate manager object: Structure needs cleaning` — a cgroup v2 delegation
       failure specific to running a *second* level of container nesting (a systemd-managed
       container inside the sandbox's own already-nested Docker), not a failure of nesting itself
       (plain Docker, one level deep, is fine). This blocks the readiness-probe and
       Service-selector labs **as currently specified**, which both assumed `kind`.
     - **k3s was tried next (same day) and fails too, with the same root cause.** k3s needs no
       Docker and no nested systemd — it runs as a single process directly in the sandbox — so it
       sidesteps the exact failure `kind` hit. It still cannot start: kubelet's own
       `ContainerManager` fails to create its `kubepods` cgroup v2 subtree —
       `"cannot enter cgroupv2 \"/sys/fs/cgroup/kubepods\" with domain controllers -- it is in an
       invalid state"` — immediately after rejecting both IPv4 addresses the sandbox's single
       network interface offers as a node IP (`127.0.0.1`: "nodeIP can't be loopback address";
       `169.254.0.2`: "nodeIP can't be a link-local unicast address"; nothing else is assigned).
       Both failures happen before any pod runs. **This is the same category of problem as
       `kind`'s, one level earlier**: `kind`'s node container could not get cgroup v2 delegation
       deep enough for its own nested systemd; k3s's kubelet cannot get it for its *own* top-level
       `kubepods` subtree, with no nesting involved at all. That makes it look like a property of
       this sandbox's root cgroup hierarchy, not something specific to how deeply either tool
       nests containers.
     - **Precise root cause found 2026-11-13 (independent diagnostic, not another kind/k3s
       attempt).** A second throwaway sandbox tested each of the 6 cgroup v2 controllers
       individually, writing directly to `cgroup.subtree_control`. Root can delegate `cpuset`,
       `cpu` and `pids` (confirmed propagating to a child cgroup); writing `memory`, `io` or
       `hugetlb` fails with `errno=95` (`ENOTSUP`, "Operation not supported") **even as root** —
       not a permissions problem, not fixable by a different image or a different boot order.
       Both `kind`'s systemd and k3s's `kubelet` hard-require the memory controller to initialize
       their own resource-control setup, which is exactly why both failed at the same category of
       error. This also narrows the untried directions below: a pre-booted custom image is
       unlikely to help (the gap is a kernel/guest-init property, not a boot-order one); a Connect
       private network is irrelevant to *this* blocker specifically (it would address the
       separate node-IP rejection, not the memory/io/hugetlb `ENOTSUP`).
     - Untried, now better-scoped: whether Vercel Sandbox exposes any configuration that changes
       which controllers are delegated to a guest (not confirmed to exist); whether a Kubernetes
       distribution that does not require the memory controller for its own control-plane
       bring-up exists at all (not identified). Absent either, the two Kubernetes-based prototype
       labs stay blocked on this platform.
  3. **Docker lab vertical slice — in progress, same day.** The `LabSpec` domain model
     (`dev.certforge.labs`) is migrated from this document's original schema to the one above (ADR
     0028): `Isolation`/`LabLimits` removed, `LabSandbox` (`vcpus`, `timeoutSeconds`,
     `persistent: false`) added, all three specs and their tests updated, 25/25 passing. The
     `docker-multistage-bloat-v1` fixture's `Dockerfile` referenced `go.mod`/`go.sum`/`main.go`
     that did not exist in the committed bundle -- added, then both the buggy fixture and a
     corrected multi-stage rewrite were built for real with local Docker to verify the `LabSpec`'s
     own evaluation probes actually discriminate: the buggy image is 1.27 GB and contains `go`
     (`which go` exits 0 with an explicit `--entrypoint` override, since the image's own
     `ENTRYPOINT` otherwise swallows `which go` as arguments to itself, not a command to run --
     the original probe's omission of that override was a real bug, fixed here); a corrected
     multi-stage build onto `alpine:3.20` is 15.5 MB and does not contain `go`. Both checks and a
     100 MB size budget are verified against both real images, not asserted. [ADR
     0029](../adr/0029-restricted-shell-enforces-the-lab-allowlist.md)'s `lab-shell` (restricted
     login shell enforcing the allowlist at `exec` time) and the lab's custom image Dockerfile
     (`src/main/resources/labs/image/docker-multistage-bloat-v1/`) are both written and verified
     end-to-end against a local stand-in base image (`ubuntu:24.04`, since `vercel/sandbox/ubuntu`
     is not pullable outside Vercel's own build pipeline): the fixture lands in the image, the
     allowlist environment variable is baked in, and a realistic session (`ls`, `cat`, a rejected
     `rm`) behaves exactly as `lab-shell`'s own unit-level tests already proved.
  4. **Blocked: the orchestrator's interactive-session endpoint needs `openInteractive()`'s real
     REST contract, which is not yet confirmed.** `create`/`cmd`/`stop` all have documented REST
     API pages (`POST /v2/sandboxes`, `POST .../cmd`, `POST .../stop`) this project's Java backend
     can call directly (no JVM SDK exists). `openInteractive()` has no such page, and is not
     wrapped by this project's Vercel MCP tools either -- writing the orchestrator's call to it
     now would mean guessing a contract, which this document does not do. Confirming the real
     endpoint (asking Vercel directly, or inspecting the JS SDK's own network calls) is the next
     concrete step before the vertical slice's controller and WebSocket-credential hand-off can be
     written.
  5. Add the grader and destroy-on-exit lifecycle, with tests proving cleanup and failure-safety —
     #175's own acceptance criterion.
  6. Extend to the remaining two prototype labs only once a Kubernetes distribution clears the
     cgroup delegation problem found in step 2 — not attempted by switching tools again without
     that.
  6. CI runs only against the fixtures above, never against anything resembling a real learner's
     arbitrary input, per #175's last acceptance criterion.

# ADR 0028: Run hands-on lab sessions on Vercel Sandbox, not a self-hosted Kata/Firecracker fleet

- Status: **Accepted** (2026-11-13, by the product owner, asked directly in conversation after
  being told plainly what it changes: [ADR 0027](0027-isolate-hands-on-lab-execution.md)'s decision
  1 named "Kata Containers (Firecracker-backed)... the default target; gVisor... an acceptable
  lighter-weight substitute" as a stack this project would operate itself. That stack does not run
  natively on this team's Windows development host, and nobody had yet verified it would run
  anywhere else this project deploys to. This ADR replaces *how* the microVM is provisioned, not
  *whether* one is used — ADR 0027's decisions 2 through 6 (the prohibitions, the `LabSpec`
  contract, deterministic evaluation outside the learner's reach, destroy-on-exit, the Phase
  1/Phase 2 split) are untouched and still govern #175 Phase 2.
- Date: 2026-11-13
- Issue: [#175](https://github.com/vinicius-ssantos/certforge/issues/175), depends on #164; amends
  [ADR 0027](0027-isolate-hands-on-lab-execution.md) decision 1 only

## Context

ADR 0027 decided every lab session needs a real microVM boundary, not a container sharing the host
kernel, and picked Kata Containers over Firecracker as the default engine to provide it. That
decision assumed this project would build and operate that stack itself: a Firecracker/Kata host
pool, its own provisioning code, its own patching and capacity planning.

Two things changed that assumption before any of it was built:

1. **The team's primary development host is Windows.** Firecracker needs KVM on a Linux kernel;
   Kata Containers needs a Linux container host. Building this natively requires either a
   dedicated Linux host/CI runner this project does not yet have, or WSL2 with nested
   virtualization enabled — itself an operational dependency nobody had signed up to maintain.
2. **A managed alternative already satisfies ADR 0027's actual requirement.** Vercel Sandbox
   provisions one Firecracker microVM per session over an API — the same isolation primitive ADR
   0027 picked, operated by a vendor whose product this project's own tooling already has a
   skill/MCP integration for, rather than infrastructure this project would stand up and keep
   patched itself.

ADR 0027's own "Rejected alternatives" section rejected "a cloud-hosted ephemeral VM per session
(e.g. a real cloud provider's VM API)," reasoning it "reintroduces exactly the 'paid cloud'
dependency the issue explicitly forbids, and shifts the threat model onto a third party's API
credentials, which is a new secret this project would have to hold and scope correctly." That
reasoning is reconsidered here, not ignored:

- The issue's "sem cloud paga" prohibition, read in context, is about a *lab* reaching a real,
  billable cloud account from inside the sandbox (the thing a learner's Kubernetes lab must never
  be able to do) — not about which infrastructure *hosts* the sandbox itself. ADR 0027's own choice
  (Kata/Firecracker) is also, in the literal sense, "infrastructure this project pays to run,"
  whether that payment is cloud compute cost or engineering time standing up bare-metal KVM hosts.
- The "new secret to hold" concern is smaller here than it would be for a generic cloud VM API:
  Vercel Sandbox authenticates the *orchestrator* via short-lived OIDC, and no credential needs to
  enter the sandbox itself for the lab's own operation (see Decision 3).
- The product owner weighed this tradeoff directly, with ADR 0027's original reasoning in front of
  them, and chose to accept vendor dependency over self-hosting a Linux-only virtualization stack
  this team cannot run locally today.

## Decision

**1. Every lab session is one Vercel Sandbox (`Sandbox.create()`/`getOrCreate()`), never a plain
container.** This satisfies ADR 0027 decision 1 directly — each sandbox is its own Firecracker
microVM with its own kernel, not a process sharing the host's. `isolation: "kata" | "gvisor"` is
dropped from the `LabSpec` schema (there is no longer a tier choice to make per lab; every lab gets
the same microVM boundary) — see the amended schema in
`docs/architecture/hands-on-labs-isolation.md`.

**2. Every lab uses `persistent: false`.** A lab session is created fresh and discarded, never
resumed and never reused across learners or across attempts by the same learner. This is what ADR
0027 decision 5 (destroy-on-exit, unconditional, nothing reused) requires, and it is the opposite
of Vercel Sandbox's own default (`persistent: true`, which snapshots and resumes) — every call site
must set this explicitly; a lab that omits it does not ship.

**3. The orchestrator holds the only credential; the sandbox holds none.** The orchestrator
authenticates to the Sandbox API with its own OIDC token or `VERCEL_TOKEN`/`VERCEL_TEAM_ID`/
`VERCEL_PROJECT_ID`, exactly as it already would for any other platform call. No credential is
injected into the sandbox's `env` for lab purposes — the lab's fixture is self-contained (ADR
0027 decision already requires this) and needs no external API to grade. If a future lab's fixture
genuinely needs one allowed external call, it is brokered the way the Vercel Sandbox skill
describes (a `networkPolicy` `transform` rule injecting a header at the firewall), never a
credential placed inside the VM, and that is a new `LabSpec` field this ADR does not add because no
prototype lab needs it yet.

**4. `network.egress` maps onto `networkPolicy` directly, losing nothing from ADR 0027 decision 2.**
`egress: "none"` is `networkPolicy: "deny-all"` (blocks all egress, including DNS — stricter than a
namespace with nowhere to route, the same practical effect ADR 0027 asked for). `egress:
"image-pull-only"` becomes an `allow` rule scoped to the one registry the lab's pinned digest lives
on. Both remain per-`LabSpec`, not a global setting, as ADR 0027 decision 3 already required.

**5. `limits` is rewritten to what the platform actually meters, not what a self-hosted Kata host
could have offered.** This is a real, documented narrowing from ADR 0027's original schema, not a
cosmetic rename:
   - `wallClockSeconds` → `timeout` (ms), capped at the plan's session max (45 min on Hobby, 24h on
     Pro/Enterprise) and enforced by the platform — the session is stopped and any in-flight command
     rejects at expiry, which is at least as strict as ADR 0027's "destroyed at expiry regardless of
     lab state."
   - `memoryMiB` and `cpuMillicores` collapse into one field, `vcpus` (1, or an even number up to the
     plan ceiling), with memory **fixed at 2 GiB per vCPU** — not independently tunable. A `LabSpec`
     states the `vcpus` it needs; it cannot ask for more memory without also paying for more CPU.
   - `diskMiB` is no longer a per-lab-settable quota — the platform's own ceiling (64 GB) is the
     only limit, with no documented mechanism to set a smaller one. A lab that needs disk exhaustion
     to be caught at a tighter boundary than 64 GB cannot rely on the platform for that; it would
     need its own in-guest check (e.g. a `df` probe as part of the grader's read-only inspection),
     which none of the three prototype labs currently need.
   - `processCount` has **no platform-level cap**. The skill's own text is explicit that "there are
     no per-process CPU/PID quotas inside the VM beyond the vCPU and 64 GB disk limits" — a fork
     bomb is contained to that one microVM (it cannot reach the host or other sandboxes), but it is
     not stopped from exhausting the VM's own resources until `timeout` or the vCPU/disk ceiling
     ends the session. Mitigation is a short `timeout` per lab (ADR 0027 decision 5 already asks for
     this) and accepting that in-guest resource exhaustion is a contained, time-bounded failure
     mode, not a prevented one.

**6. The grader runs from the orchestrator's own call to the Sandbox API, never inside the
microVM.** This is the same requirement ADR 0027 decision 4 already states; nothing changes except
the mechanism — the grader is server-side code holding the same `Sandbox` handle (via
`Sandbox.get({ name })`, resumed only long enough to run read-only inspection commands) that the
learner's terminal bridge never has direct access to. The learner's command stream and the grader's
command stream are issued by different callers against the same API, not by the same process.

**7. Nested container-runtime support was smoke-tested 2026-11-13, in two rounds — not left as an
open assumption.** A throwaway sandbox confirmed Docker itself works fully nested inside the guest
(`dockerd` starts, `docker run hello-world` pulls and runs end-to-end), which is what the
multi-stage-build lab needs. Both ways tried to bring up a Kubernetes node fail, with the same
underlying cause:
   - `kind create cluster` fails because its node container's own `systemd` cannot acquire a
     cgroup v2 delegation (`Structure needs cleaning`) one level deeper than plain Docker nesting
     goes.
   - `k3s`, run directly as a guest process specifically to avoid that extra nesting level, fails
     too: kubelet's `ContainerManager` cannot create its own top-level `kubepods` cgroup v2
     subtree (`"cannot enter cgroupv2 ... it is in an invalid state"`), after also rejecting both
     IPv4 addresses the sandbox's interface offers as a node IP (loopback and link-local — nothing
     else is assigned).

   The same category of cgroup v2 delegation failure blocking both tools, one at a deeper nesting
   level than the other, looks like a property of this sandbox's root cgroup hierarchy rather than
   something either tool does wrong. This blocks the readiness-probe and Service-selector labs as
   currently conceived (a full kubelet-managed node, cold-started inside the session) — **not**
   the isolation engine decision itself, which the Docker result still supports. It is new,
   unresolved follow-on work this ADR does not attempt to solve: see the Rollout section in
   `docs/architecture/hands-on-labs-isolation.md` for the full evidence and the untried directions
   worth a separately-scoped investigation.

## Consequences

- **No Kata/Firecracker/gVisor fleet is built, patched, or capacity-planned by this project.** The
  operational burden ADR 0027 implicitly accepted moves to Vercel's platform; this project's own
  operational burden becomes API usage within documented limits and cost, not kernel-level
  virtualization.
- **Billing is now a running cost per lab session**, not only a host-resource cost: exposed-port
  traffic and sandbox egress are billable, on top of vCPU time. The abuse-control section of
  `docs/architecture/hands-on-labs-isolation.md` gains this as a second reason (alongside host
  capacity) to keep the existing per-account rate limit tight.
- **`LabSpec`'s `limits` block is less expressive than ADR 0027 originally specified** (memory tied
  to vCPU count, no sub-64 GB disk quota, no process-count cap) — documented honestly in Decision 5
  above rather than silently narrowed. No prototype lab currently needs the finer control ADR 0027
  assumed would exist.
- **A new external dependency exists in the lab path: Vercel's own availability.** If Vercel Sandbox
  is unavailable, no Phase 2 lab can start; Phase 1 (static diagnosis, already shipped) is wholly
  unaffected, since it never depended on this ADR or ADR 0027 in the first place.
- **The credential surface is smaller than a generic cloud VM API would have been**, per Decision 3
  — the orchestrator's existing platform credential covers sandbox provisioning; no new secret is
  introduced for the lab's own operation.

## Rejected alternatives

- **Build the Kata/Firecracker fleet ADR 0027 originally specified, on a dedicated Linux host or CI
  runner this project would stand up for the purpose.** Rejected for now: it is a larger, slower,
  higher-maintenance path to the same isolation property Vercel Sandbox already provides today, and
  nothing about #175's acceptance criteria requires self-hosting specifically — ADR 0027 picked
  Kata/Firecracker as *an* implementation of "microVM, not a container," not as an end in itself.
- **gVisor, self-hosted, as a lighter-weight substitute avoiding full hardware virtualization.**
  Rejected for the same practical reason as Kata above: it still needs a Linux host this team's
  primary development environment is not, and does not remove the need to build and operate new
  infrastructure.
- **Keep ADR 0027's schema and `limits` fields exactly as written, and approximate them on top of
  Vercel Sandbox's coarser knobs (e.g. silently rounding a requested `memoryMiB` up to the nearest
  vCPU's fixed allotment).** Rejected: approximating a limit silently is worse than naming the
  platform's actual ceiling, because it lets a `LabSpec` author believe a tighter bound exists than
  actually does. Decision 5 states the real knobs instead.

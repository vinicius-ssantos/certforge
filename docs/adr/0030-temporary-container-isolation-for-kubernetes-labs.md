# ADR 0030: Run the two Kubernetes labs in a plain Docker container, temporarily, not a microVM

- Status: **Accepted** (2026-11-14, by the product owner, after ADR 0028 decision 7's cgroup v2
  blocker was confirmed a genuine dead end -- no kubelet/k3s/k0s/kind configuration works around
  it -- and after the product owner explicitly rejected two alternatives that would have kept a
  microVM-class boundary: a self-hosted microVM-per-session fleet (blocked on the same reason ADR
  0028 moved away from self-hosting -- the dev team's primary host is Windows), and WSL2-per-session
  (researched and confirmed to share one kernel across concurrent instances, i.e. no better than a
  plain container for this purpose). Explicitly temporary: see Consequences for the follow-up this
  ADR exists to be replaced by.)
- Date: 2026-11-14
- Issue: [#175](https://github.com/vinicius-ssantos/certforge/issues/175), depends on #164; amends
  [ADR 0027](0027-isolate-hands-on-lab-execution.md) decision 1 for these two labs only --
  [ADR 0028](0028-vercel-sandbox-for-hands-on-labs.md) is unaffected and still governs
  `docker-multistage-bloat-v1`

## Context

ADR 0028 decision 7 found both `kind` and `k3s` fail to bring up a Kubernetes node inside a Vercel
Sandbox, because the sandbox's own guest kernel refuses to delegate the `memory`, `io`, and
`hugetlb` cgroup v2 controllers (`ENOTSUP`, confirmed even as root) -- both tools hard-require the
memory controller for their own resource-control setup. Research on 2026-11-14 (recorded in
`docs/architecture/hands-on-labs-isolation.md`'s Rollout step 2) confirmed no kubelet flag, k3s
argument, k0s configuration, or kind workaround clears this: it is the sandbox platform's own
kernel/guest-init policy, not something this project's tooling choices can route around.

Three paths were considered to unblock `readiness-probe-wrong-port-v1` and
`service-selector-mismatch-v1` without abandoning microVM-class isolation:

1. **A different microVM-capable platform** (e.g. Oracle Cloud's Always Free Ampere A1 tier, which
   has enough RAM to run `kind` comfortably). Still the long-term direction -- see Consequences --
   but blocked today on account signup not yet completing.
2. **A self-hosted microVM fleet**, which ADR 0028 already moved away from for the same reason it
   would still apply here: the team's primary development host is Windows, with no Linux KVM host
   to run Kata/Firecracker on.
3. **WSL2, one distro instance per session**, proposed as a middle ground. Researched directly:
   WSL2 runs every distro inside **one shared lightweight VM and one shared kernel** per machine
   (confirmed by Microsoft's own docs and Docker's engineering analysis of the WSL2 backend) --
   isolation between concurrent WSL2 instances is namespace-level, the same category as a plain
   container, not VM-level. Choosing it over a plain container would add real implementation
   complexity (`wsl --import`/`--unregister` orchestration) for no actual isolation improvement.

With no available microVM-class option today, the product owner chose to unblock the two labs now,
temporarily, at a knowingly weaker isolation boundary, rather than leave them blocked indefinitely.

**Verified by direct prototyping before this ADR was written** (not assumed): a real
kubelet-managed `kind` cluster, including both prototype labs' actual committed fixtures, was
brought up end-to-end inside a plain, non-`--privileged` Docker container on this team's own
Windows/Docker Desktop host --
- the `memory`, `io`, `hugetlb`, `cpu`, `cpuset`, and `pids` cgroup v2 controllers are all present
  and already in `cgroup.subtree_control` inside a container started with `--cgroupns=host` and
  the host's `/sys/fs/cgroup` bind-mounted read-write -- confirming the Vercel Sandbox restriction
  was specific to that platform's own guest kernel, not a general property of nested containers;
- `kind create cluster` brought up a `Ready` control-plane node, CNI, and `StorageClass`, with one
  environment-specific fix needed on Docker Desktop hosts (`/dev/kmsg` does not exist there; kind's
  own `extraMounts` config mapping `/dev/null` to it is the documented, harmless workaround --
  applied unconditionally since it is a no-op on hosts that do have a real `/dev/kmsg`, such as the
  GitHub Actions `ubuntu-latest` runners this project's CI already uses);
- applying `readiness-probe-wrong-port-v1`'s and `service-selector-mismatch-v1`'s actual committed
  fixture YAML reproduced each lab's described bug exactly (Pod not Ready; Service with no serving
  endpoint), and applying each lab's intended fix cleared it;
- this prototyping also found and fixes a real, independent bug in both labs' `LabSpec.evaluation`
  probes (see Consequences) -- not something this ADR could have been written correctly without
  finding.

## Decision

**1. `readiness-probe-wrong-port-v1` and `service-selector-mismatch-v1` run in a plain Docker
container, started by this project's own backend against its own Docker daemon -- not Vercel
Sandbox, not any other microVM.** `docker-multistage-bloat-v1` is unaffected; `LabOrchestratorRouter`
(replacing the single `SandboxLabOrchestrator` wiring) dispatches by `labId` to
`SandboxLabOrchestrator` for the Docker lab and `ContainerLabOrchestrator` for these two.

**2. The container runs with a reduced, but not empty, privilege set -- never `--privileged`.**
Verified working: `--cgroupns=host`, the host's `/sys/fs/cgroup` mounted read-write, and
`--cap-add SYS_ADMIN --cap-add NET_ADMIN --cap-add SYS_RESOURCE --cap-add SYS_PTRACE
--security-opt seccomp=unconfined --security-opt apparmor=unconfined`. This is **not** a
microVM-equivalent boundary and this ADR does not claim otherwise: `--cgroupns=host` shares the
real host's cgroup namespace, and `SYS_ADMIN` alone is widely treated as near-equivalent to root on
the host for escape purposes. A learner's own commands never reach this level directly (they are
still behind ADR 0029's `lab-shell`, restricted to `kubectl`/`vi`/`nano`/`cat`/`ls` against the
already-running cluster) -- but the *container* this runs in is a materially weaker boundary than
any lab built so far, and the mitigations below are what this ADR is actually relying on, not the
container boundary itself:
   - **Resource limits** (`--memory`, `--cpus`, `--pids-limit`) from the `LabSpec`'s `sandbox`
     block, same intent as ADR 0028 decision 5, enforced by this project's own code since there is
     no platform doing it automatically this time.
   - **No bind mount of any host path except `/sys/fs/cgroup`** -- no access to this host's other
     files, no Docker socket mounted in (the nested daemon is this container's own, never the
     host's -- mounting the host's socket in would be strictly worse, full host-Docker-root access
     from inside the lab, not merely a cgroup-namespace concession).
   - **Network isolation**: the container runs on a dedicated bridge network with no route to this
     application's own network (database, other containers) -- see
     `docs/architecture/hands-on-labs-isolation.md` for the exact topology.
   - **Hard timeout, enforced by this project's own code**: a scheduled force-removal past
     `LabSpec.sandbox.timeoutSeconds`, since nothing external enforces this the way the Vercel
     platform does for Sandbox sessions.
   - **Destroy-on-exit, unconditional** -- the same ADR 0027 decision 5 property every other lab
     already has, enforced in a `finally` block regardless of how grading went.
   - **Operational requirement for any shared-host deployment**: lab containers must run against a
     Docker daemon dedicated to this purpose, never the same daemon as this project's own
     production `app`/`web` containers. This is stated here as a requirement the deployment must
     satisfy, not something this ADR's code alone can enforce -- see
     `docs/engineering/operations.md` for where this is recorded as a deployment precondition.

**3. There is no vendor-hosted interactive terminal for a plain container, so this project's own
backend hosts a WebSocket terminal bridge** (`/api/labs/sessions/{sessionId}/terminal`) that pipes
bytes between the learner's browser and `docker exec -it <container> lab-shell` -- unlike ADR
0029's description of Vercel Sandbox's `openInteractive()`, this project's backend *is* in the
byte path for these two labs. This does not reopen ADR 0029's rejected "proxy the terminal and
parse commands" alternative: the bridge here only relays bytes, it does not inspect or decide
anything about them -- the same `lab-shell` restricted shell, unmodified, still does all of the
actual enforcement at `exec` time, inside the container, exactly as ADR 0029 decided. The bridge
is additionally scoped by this project's existing session-cookie authentication plus a one-time,
per-session token minted at `start()` and required on the WebSocket handshake -- not because
`lab-shell` needs it, but because a WebSocket upgrade is easy to leave unauthenticated by mistake,
and this is a second, explicit check rather than relying solely on the cookie alone passing through
correctly.

**4. One shared image, not one per lab.** Unlike every other lab's image (one `Dockerfile` per
`labId`, ADR 0028's established convention), these two labs share
`src/main/resources/labs/image/k8s-container-lab/Dockerfile` -- both labs need the identical
capability (nested Docker, `kind`, `kubectl`, the same restricted shell) and differ only in which
committed fixture YAML gets applied. Deliberately not following the per-lab convention here: this
whole execution path is explicitly temporary (see Consequences), and a second near-duplicate
Dockerfile to delete alongside the first is pure cost with no benefit this ADR can identify.

**5. The placeholder application image the fixtures reference (`web:lab`, `web-backend:lab`) is
built from content already baked into the lab image at build time, never pulled at session
start.** A `busybox`-based rootfs is baked in via a multi-stage `COPY --from=busybox:1.36`, and
`docker import` materializes it into the nested daemon and `kind load docker-image`s it into the
cluster -- no network access needed once the container is running, consistent with
`network.egress: "none"` already set on both `LabSpec`s.

## A bug this prototyping found and fixes, independent of the isolation question

Both labs' `evaluation.checks[].probe` strings were written as a bare `kubectl get ... -o
jsonpath=...` command, graded the same way every other lab's probes are graded -- by **exit code**
(`SandboxLabOrchestrator`/`ContainerLabOrchestrator`'s `grade()` runs each probe through `sh -c` and
checks `exitCode == 0`). A `kubectl get` against an existing resource exits `0` whether or not the
jsonpath value it prints says the condition is actually met -- **these two labs' evaluation checks
would have reported every session as passed, bug unfixed or not**, on whichever platform finally
ran them. Confirmed directly: applying the unmodified buggy fixture and running the probe as
originally written returns exit code `0` printing an empty or `False` value. Fixed by wrapping each
probe in a shell boolean test (`test "$(kubectl get ...)" = "True"` /
`test "$(kubectl get ...)" = "true"`), verified against both labs' real buggy and real fixed states
on a live cluster before and after this ADR's orchestrator existed. This would have been wrong on
Vercel Sandbox too, had that path ever been unblocked -- it is not a consequence of choosing plain
containers.

## Consequences

- **This is a real, stated reduction in isolation strength for exactly these two labs**, accepted
  explicitly and temporarily, not discovered later. `docker-multistage-bloat-v1` keeps its ADR
  0028 microVM boundary unchanged.
- **Follow-up tracked separately: migrate both labs off this container-based execution once a
  microVM-capable platform is available** (Oracle Cloud Always Free once the account exists, or
  any other platform that clears ADR 0028 decision 7's blocker) -- filed as a GitHub issue this ADR
  links to once opened, not left as a comment in code.
- **A learner on either of these two labs has a materially larger theoretical blast radius than a
  learner on the Docker lab** -- not through anything `lab-shell` grants them directly (the
  allowlist is identical in kind), but through the weaker container boundary around the whole
  session. The mitigations in Decision 2 are what actually bounds this, and they are this
  project's own code's responsibility now, not a platform's.
- **This project's own backend is newly in the path of a learner's interactive terminal bytes**,
  for the first time since ADR 0029 was written specifically to avoid that for the Docker lab. The
  bridge's scope is deliberately narrow (byte relay only, two-factor access) to avoid quietly
  reopening ADR 0029's rejected alternative.
- **Operating this in any shared-host deployment requires a Docker daemon dedicated to lab
  containers, separate from the daemon running this project's own `app`/`web` containers** -- a
  deployment precondition this ADR states but cannot enforce from inside the code it adds.

## Rejected alternatives

- **Oracle Cloud Always Free (Ampere A1), used directly instead of a temporary container.**
  Preferred long-term outcome, not rejected on technical merit -- rejected only for *now*, because
  account creation has not completed. Tracked as the follow-up this ADR exists to be superseded by.
- **Self-hosted microVM fleet (Kata/Firecracker) on this team's own hardware.** Rejected for the
  same reason ADR 0028 already gave: the primary development host is Windows, with no Linux KVM
  host available to run it on.
- **WSL2, one distro per session.** Rejected after direct research confirmed WSL2 shares one
  kernel across all concurrently running distros on a machine -- namespace-level isolation, not
  VM-level, for materially more implementation complexity than a plain container with no
  isolation benefit over one.
- **Mount the host's own Docker socket into the lab container ("Docker outside of Docker"), instead
  of a nested daemon.** Rejected as strictly worse than Decision 2's approach: it grants the
  container's caller root-equivalent control over the *host's* Docker daemon directly, not merely a
  shared cgroup namespace -- every other lab on the host would be reachable, not just this one's
  own blast radius.
- **Full `--privileged`.** Rejected once the scoped capability set in Decision 2 was confirmed
  sufficient by direct testing -- `--privileged` grants every capability and disables all of
  seccomp/AppArmor/device restrictions, strictly more than what nested `kind` was shown to need.

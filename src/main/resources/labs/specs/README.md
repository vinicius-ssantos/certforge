# Lab specs (#175)

Each `*.json` file here is one `LabSpec` (`dev.certforge.labs.LabSpec`), loaded and validated by
`LabSpecRegistry` at application startup. See `docs/architecture/hands-on-labs-isolation.md` for
the schema and `docs/adr/0027-isolate-hands-on-lab-execution.md` /
`docs/adr/0028-vercel-sandbox-for-hands-on-labs.md` for why. The `sandbox` block (`vcpus`,
`timeoutSeconds`, `persistent: false`) names what the Vercel Sandbox platform actually meters,
not a self-hosted Kata/Firecracker fleet -- see ADR 0028 decision 5 for why this is narrower than
the schema first proposed.

**`docker-multistage-bloat-v1` has a real orchestrator and grader behind it as of this module's
own session** (the Docker lab, per ADR 0028's smoke test -- the only one of the three with its
isolation engine verified working). `image.ref` for this one still points at the placeholder
public busybox digest below, because the orchestrator provisions the sandbox straight from the
fixture's `golang:1.23` base image at session start rather than a pre-built custom image; a
pre-built, pinned custom VCR image is Rollout follow-on work, not required to run this lab today.

**`readiness-probe-wrong-port-v1` and `service-selector-mismatch-v1` remain placeholders only.**
Their isolation engine is not verified -- ADR 0028 decision 7 found both `kind` and `k3s` fail to
bring up a Kubernetes node inside a Vercel Sandbox, with the same cgroup v2 delegation root cause
at different nesting depths. `image.ref` for these two is still the same placeholder, digest-pinned
public image
(`docker.io/library/busybox@sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662`,
verified against Docker Hub's registry API on 2026-11-09) purely to satisfy the digest-pinning
rule honestly rather than with a fabricated one. Neither spec is backed by a real, runnable lab
session.

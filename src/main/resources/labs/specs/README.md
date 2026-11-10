# Lab specs (#175)

Each `*.json` file here is one `LabSpec` (`dev.certforge.labs.LabSpec`), loaded and validated by
`LabSpecRegistry` at application startup. See `docs/architecture/hands-on-labs-isolation.md` for
the schema and `docs/adr/0027-isolate-hands-on-lab-execution.md` for why.

**`image.ref` is a placeholder.** No orchestrator exists yet to build each lab's own
purpose-built image (see that doc's Rollout, phase 2 step 2), so all three specs here point at
the same digest-pinned, real, minimal public image
(`docker.io/library/busybox@sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662`,
verified against Docker Hub's registry API on 2026-11-09) purely to satisfy the digest-pinning
rule honestly rather than with a fabricated digest. None of these specs is backed by a real,
runnable lab session yet. Replace this placeholder with each lab's real built image as part of
that follow-on work, and re-verify the digest at that time rather than trusting this note
indefinitely.

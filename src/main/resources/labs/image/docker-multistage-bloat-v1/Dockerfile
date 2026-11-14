# The custom Vercel Container Registry image a learner's session for lab "docker-multistage-
# bloat-v1" boots from (#175, ADR 0028). Build context is `src/main/resources/labs` (the parent of
# both `fixtures/` and `image/`), so the fixture this builds from is the same file
# LabSpecRegistry validates against, never a duplicate that could drift from it:
#
#   docker build -f image/docker-multistage-bloat-v1/Dockerfile -t <repo>:<tag> .
#   (run from src/main/resources/labs)
#
# Publishing this to Vercel Container Registry and pointing the LabSpec's image.ref at its digest
# is follow-on work this file does not itself perform.
#
# This image needs its own Docker daemon nested inside the Vercel Sandbox microVM (verified
# working, ADR 0028 decision 7) -- not the host's socket, not --privileged, just a normal
# dockerd the guest's own kernel runs. It ships the lab's fixture pre-placed (never fetched live
# at session start, per the isolation plan) and a restricted login shell in place of bash, so the
# command allowlist is enforced by the kernel's own exec path, not by anything trusting the
# learner's typed text (see lab-shell's own comment for why).
#
# Base is `ubuntu:24.04`, not the managed `vercel/sandbox/ubuntu` the Sandbox API accepts as a
# session's `image` -- that name is a platform-internal identifier Sandbox.create() resolves
# itself, never a registry ref `docker build`/`vercel vcr build` can pull FROM (confirmed: `docker
# pull vercel/sandbox/ubuntu` returns "pull access denied ... repository does not exist"). A
# custom VCR image needs an ordinary pullable base; Ubuntu 24.04's own image already ships the
# `ubuntu` user this file's `usermod` call needs.
FROM ubuntu:24.04

RUN apt-get update && apt-get install -y --no-install-recommends docker.io \
    && rm -rf /var/lib/apt/lists/*

COPY image/docker-multistage-bloat-v1/lab-shell /usr/local/bin/lab-shell
RUN chmod +x /usr/local/bin/lab-shell \
    && usermod -s /usr/local/bin/lab-shell -aG docker ubuntu

# docker.io's own package creates the `docker` group and owns the socket by it; adding `ubuntu`
# (both lab-shell's learner and, non-root by default, the orchestrator's own grader calls) to it
# is what lets `docker` run without sudo once the daemon this session's provisioning step starts
# is actually reachable -- otherwise the socket is root-only and every allowed `docker` command
# would need sudo, which the allowlist does not grant and the orchestrator does not ask for.

ENV LAB_ALLOWED_COMMANDS="docker cat ls vi nano"

# The fixture: the single-stage Dockerfile with the bug, and the Go source it builds. The learner
# edits Dockerfile in place; main.go/go.mod/go.sum are never meant to change.
RUN mkdir -p /home/ubuntu/lab && chown ubuntu:ubuntu /home/ubuntu/lab
COPY --chown=ubuntu:ubuntu fixtures/docker-multistage-bloat-v1/Dockerfile \
    fixtures/docker-multistage-bloat-v1/go.mod fixtures/docker-multistage-bloat-v1/go.sum \
    fixtures/docker-multistage-bloat-v1/main.go /home/ubuntu/lab/

WORKDIR /home/ubuntu/lab

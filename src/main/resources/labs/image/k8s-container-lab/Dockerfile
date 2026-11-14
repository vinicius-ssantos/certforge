# The shared image `readiness-probe-wrong-port-v1` and `service-selector-mismatch-v1` boot from
# (#175, ADR 0030). Build context is `src/main/resources/labs` (same convention every other lab
# image uses), run from there:
#
#   docker build -f image/k8s-container-lab/Dockerfile -t certforge-k8s-container-lab .
#
# One image for both labs, not one each (ADR 0030 decision 4) -- they need identical capability
# and differ only in which already-baked-in fixture YAML ContainerLabOrchestrator applies. This is
# deliberately not the one-Dockerfile-per-lab convention every other lab image follows: this whole
# execution path is temporary (ADR 0030), and a second near-duplicate file to delete alongside the
# first has no benefit.
#
# Base is `docker:27-dind`, not a plain distro with `docker.io` installed by hand (verified the
# hard way, ADR 0030): a 3-level-deep nested `kind` cluster (this container -> its own nested
# dockerd -> kind's node container -> that node's own containerd) needs its root mount made
# `rshared` and its cgroup v2 root emptied into a child `/init` group before dockerd's very first
# start, or the node container's own overlay mounts fail with a plain `invalid argument` -- exactly
# what `docker:dind`'s own entrypoint (`dockerd-entrypoint.sh` -> the `dind` wrapper script) already
# does, and what a hand-rolled `apt-get install docker.io` image does not. Reusing the official
# image's own entrypoint, unmodified, is simpler and more correct than replicating that script by
# hand would be. Its default CMD already starts dockerd through that same entrypoint -- this file
# never overrides it, so dockerd is already reachable by the time ContainerLabOrchestrator execs in.
#
# The placeholder application image both labs' committed fixtures reference (`web:lab`,
# `web-backend:lab`) -- baked in as a plain rootfs, never pulled over the network at session start
# (ADR 0030 decision 5; both LabSpecs already set network.egress: "none"). ContainerLabOrchestrator
# turns this into a real image inside the nested daemon with `docker import`, then `kind load`s it.
FROM busybox:1.36 AS placeholder-rootfs
RUN mkdir -p /www && printf 'ok' > /www/healthz

FROM docker:27-dind

RUN apk add --no-cache curl bash shadow \
    && curl -Lo /usr/local/bin/kind https://kind.sigs.k8s.io/dl/v0.30.0/kind-linux-amd64 \
    && chmod +x /usr/local/bin/kind \
    && curl -Lo /usr/local/bin/kubectl https://dl.k8s.io/release/v1.34.0/bin/linux/amd64/kubectl \
    && chmod +x /usr/local/bin/kubectl

# The restricted login shell, reused unchanged from the Docker lab's image (ADR 0029) -- the build
# context is the same `labs/` root, so this reaches across lab image directories without a copy.
# It is a POSIX `#!/bin/sh` script, so it runs under Alpine's `ash` exactly as it does under
# Ubuntu's `dash` in that image.
# sed strips a stray \r a Windows checkout can introduce (CRLF breaks the #!/bin/sh shebang's own
# exec -- the interpreter path becomes "/bin/sh\r", which does not exist) -- defensive, since the
# committed file itself is LF-only; this is insurance against the checkout, not the file.
COPY image/docker-multistage-bloat-v1/lab-shell /usr/local/bin/lab-shell
RUN sed -i 's/\r$//' /usr/local/bin/lab-shell && chmod +x /usr/local/bin/lab-shell

# A non-root learner, with no `docker` group membership at all -- this learner only ever runs
# `kubectl` against the cluster ContainerLabOrchestrator already brought up as root, never `docker`
# itself. KUBECONFIG points at the file the orchestrator writes after `kind create cluster`,
# readable by this user once it does (see ContainerLabOrchestrator.provision()). `shadow` (added
# above) provides `useradd` on Alpine, which does not ship it by default.
RUN useradd -m -s /usr/local/bin/lab-shell learner
ENV KUBECONFIG=/home/learner/kubeconfig
ENV LAB_ALLOWED_COMMANDS="kubectl vi nano cat ls"

COPY --from=placeholder-rootfs / /opt/web-lab-rootfs/

# Both labs' fixtures, pre-placed (never fetched live at session start, same principle every other
# lab's fixture follows). ContainerLabOrchestrator picks which file(s) to `kubectl apply` by
# LabSpec.fixture().path(), already validated by LabSpecRegistry against this same committed file.
RUN mkdir -p /opt/fixtures
COPY fixtures/readiness-probe-wrong-port-v1/ /opt/fixtures/readiness-probe-wrong-port-v1/
COPY fixtures/service-selector-mismatch-v1/ /opt/fixtures/service-selector-mismatch-v1/

# CertForge task runner. `just` on its own lists everything.
#
# The secrets below are for a throwaway local stack and nothing else. A real deployment sets its own
# and never takes them from a file in the repository, which is why compose.release.yaml refuses to
# start without DB_PASSWORD rather than defaulting it.

set shell := ["bash", "-uc"]

# On Windows, `bash` on the PATH is usually the WSL launcher, and a WSL distribution has no Docker
# unless its integration is switched on. The recipes want Git Bash, so it is named outright. If Git
# is installed somewhere else, pass the path once:
#     just --shell "D:/Git/bin/bash.exe" --shell-arg -uc demo
# This setting only takes literal values, so it cannot read that path from the environment.
set windows-shell := ["C:/Program Files/Git/bin/bash.exe", "-uc"]

export DB_PASSWORD := env_var_or_default("DB_PASSWORD", "local-only-password")
export BOOTSTRAP_ADMIN_EMAIL := env_var_or_default("BOOTSTRAP_ADMIN_EMAIL", "admin@example.com")
export BOOTSTRAP_ADMIN_PASSWORD := env_var_or_default("BOOTSTRAP_ADMIN_PASSWORD", "a long local password")

web_url := env_var_or_default("WEB_URL", "http://localhost:8081")
backend_url := env_var_or_default("BACKEND_URL", "http://localhost:8080")

# Distinct project names, so the release stack and the development database never recreate each
# other's containers (a plain `docker compose` would take the directory name and collide).
dev := "docker compose -p certforge-dev"
release := "docker compose -p certforge-release -f compose.release.yaml"
# Relaxes reviewer separation and the registration throttle, for the test suite only.
release_test := release + " -f compose.e2e.yaml"

_default:
    @just --list --unsorted

# ---- running it ------------------------------------------------------------------------------

# Build and start the whole thing (web, backend, PostgreSQL), then wait until it is ready.
[group('run')]
up:
    {{release}} up --build -d
    @just _wait
    @echo "CertForge is at {{web_url}} — a fresh database has no questions yet, so try: just demo"

# Start it and publish ten clearly labelled demo questions, so there is something to practise on.
[group('run')]
demo: up
    node deploy/seed-demo.mjs --url {{web_url}}
    @echo "Sign in as {{BOOTSTRAP_ADMIN_EMAIL}} at {{web_url}}"

# Stop it and keep the data.
[group('run')]
down:
    {{release}} down

# Stop it and delete the data, so the next start is a fresh database.
[group('run')]
reset:
    {{release_test}} down -v

# Follow the logs, of everything or of one service: just logs app
[group('run')]
logs service="":
    {{release}} logs -f {{service}}

# What is running.
[group('run')]
ps:
    {{release}} ps

_wait url=backend_url:
    @for attempt in $(seq 1 90); do \
        if curl -sf {{url}}/actuator/health/readiness > /dev/null; then exit 0; fi; \
        sleep 2; \
    done; \
    echo "the backend did not become ready; try: just logs app"; exit 1

# Maven, on the JDK the build requires. The pom pins the build to JDK 25, so a machine whose
# JAVA_HOME is a different major fails the enforcer; rather than skipping that rule, this looks for
# an installed 25. Set CERTFORGE_JAVA_HOME to choose one yourself.
_mvn +args:
    #!/usr/bin/env bash
    set -euo pipefail
    home="${CERTFORGE_JAVA_HOME:-}"
    if [ -z "$home" ] && ! "${JAVA_HOME:-/nonexistent}/bin/java" -version 2>&1 | grep -q '"25'; then
        home="$(ls -d "$HOME"/.jdks/*25* /usr/lib/jvm/*25* \
            /Library/Java/JavaVirtualMachines/*25*/Contents/Home 2>/dev/null | head -1 || true)"
        if [ -z "$home" ]; then
            echo "This build needs JDK 25. Install one, or set CERTFORGE_JAVA_HOME." >&2
        fi
    fi
    if [ -n "$home" ]; then export JAVA_HOME="$home"; fi
    ./mvnw {{args}}

# ---- developing ------------------------------------------------------------------------------

# PostgreSQL on its own, for running the backend and the web app from source.
[group('develop')]
db:
    {{dev}} up -d postgres

# The backend from source, against `just db`. Ctrl-C stops it.
[group('develop')]
backend: db
    @just _mvn --batch-mode spring-boot:run

# The web app from source, with hot reload, against the backend on :8080.
[group('develop')]
web:
    cd web && npm install && npm run dev

# ---- checking the code -----------------------------------------------------------------------

# Everything CI runs that does not need Docker images: the backend suite and all the web checks.
[group('check')]
check: test-backend test-web lint typecheck budget

# The backend suite, on PostgreSQL in Testcontainers.
[group('check')]
test-backend:
    @just _mvn --batch-mode --no-transfer-progress verify

# The web unit tests.
[group('check')]
test-web:
    cd web && npm run test

# ESLint, including the accessibility rules.
[group('check')]
lint:
    cd web && npm run lint

# TypeScript, for the app and for the browser tests.
[group('check')]
typecheck:
    cd web && npm run typecheck

# The size of what the browser downloads, against its budget.
[group('check')]
budget:
    cd web && npm run build && npm run budget

# The browser tests against a dev server. Needs `npx playwright install chromium` once.
[group('check')]
e2e:
    cd web && npm run e2e

# The browser tests against the release images, which is what CI does.
[group('check')]
e2e-release:
    {{release_test}} up --build -d
    @just _wait
    cd web && npm run build && E2E_BASE_URL={{web_url}} npm run e2e

# ---- checking a running stack ----------------------------------------------------------------

# Security headers, hidden operations endpoints, the error contract and rate-limit trust.
[group('inspect')]
verify:
    bash deploy/verify-release.sh {{web_url}} {{backend_url}}

# Errors, metric labels and logs, after traffic has gone through.
[group('inspect')]
verify-privacy:
    mkdir -p target
    {{release}} logs --no-color app > target/app.log
    E2E_BASE_URL={{web_url}} node deploy/verify-privacy.mjs --logs target/app.log

# How long the primary flows take for one learner, against their budgets.
[group('inspect')]
baseline rounds="20":
    node deploy/measure-baseline.mjs --url {{web_url}} --rounds {{rounds}}

# Back the database up, restore it into a new PostgreSQL and compare every table.
[group('inspect')]
rehearse-restore:
    bash deploy/rehearse-restore.sh -p certforge-release -f compose.release.yaml

# Known vulnerabilities in the two images, as CI fails on them. CI always builds from scratch, so a
# cached build here can report a package that a fresh one would have upgraded away: `just scan fresh`
# rebuilds without the cache and is what matches CI.
# MSYS_NO_PATHCONV keeps Git Bash on Windows from rewriting the container paths into Windows ones;
# it means nothing on other systems.
[group('inspect')]
scan fresh="":
    {{release}} build {{ if fresh != "" { "--no-cache --pull" } else { "" } }}
    for image in certforge-release-app certforge-release-web; do \
        MSYS_NO_PATHCONV=1 docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:0.74.0 image \
            --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 "$image"; \
    done

# Secrets in the whole git history.
[group('inspect')]
scan-secrets:
    MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:v8.30.1 detect \
        --source /repo --config /repo/.gitleaks.toml --no-banner --redact

# ---- content and contract --------------------------------------------------------------------

# Rebuild the packet a technical reviewer works from, after changing the question pack.
[group('content')]
review-packet:
    node content/build-review-packet.mjs

# Import the real question pack as drafts awaiting review. It publishes nothing.
[group('content')]
import-content email password:
    java content/ContentImporter.java --base-url {{backend_url}} --email {{email}} --password {{password}}

# Regenerate the API contract from the backend and the types the web app is built against.
[group('content')]
contract:
    @just _mvn --batch-mode --no-transfer-progress -Dtest=NoSuchTest -Dit.test=OpenApiContractIT -Dopenapi.update=true -Dsurefire.failIfNoSpecifiedTests=false -DfailIfNoTests=false verify
    cd web && npm run api:generate

# Recapture the screenshots in the demonstration scripts, against a running test stack.
[group('content')]
screenshots:
    cd web && CAPTURE=1 E2E_BASE_URL={{web_url}} npx playwright test e2e/screenshots.spec.ts --project desktop

# Format the Java sources, as the build requires.
[group('content')]
format:
    @just _mvn --batch-mode --no-transfer-progress spotless:apply

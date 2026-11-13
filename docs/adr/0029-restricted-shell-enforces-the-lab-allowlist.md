# ADR 0029: Enforce a lab's command allowlist with a restricted login shell, not a backend proxy

- Status: **Accepted** (2026-11-13, by the product owner, asked directly in conversation, choosing
  "a real interactive terminal" over a file-write-only bridge, then choosing this reconciliation
  over proxying the terminal through the backend once told what each costs)
- Date: 2026-11-13
- Issue: [#175](https://github.com/vinicius-ssantos/certforge/issues/175), depends on #164; amends
  [ADR 0027](0027-isolate-hands-on-lab-execution.md) decision 2's "rejected at the bridge" wording
  for interactive sessions specifically; [ADR 0028](0028-vercel-sandbox-for-hands-on-labs.md) is
  unaffected

## Context

ADR 0027 decision 2 says a lab's command allowlist is "rejected at the bridge, not merely
discouraged by the fixture" -- written when "the bridge" was assumed to be this project's own
backend, sitting between the learner and the microVM, inspecting every command before it runs.

Vercel Sandbox's `sandbox.openInteractive()` does not give this project a bridge to sit in. It
returns a WebSocket URL and token for the learner's own browser to connect directly to a
**controller-hosted PTY inside Vercel's platform** -- a real interactive shell, with line editing,
Ctrl+C, and full-screen programs (`vi`, `nano`) all working as the learner expects. This project's
backend is never in that connection's path once it hands the credential over.

Two ways to reconcile "a real terminal" with "the allowlist is enforced, not discouraged":

1. **Proxy the WebSocket through this project's own backend anyway**, parsing the raw PTY byte
   stream to decide what counts as "a command" before forwarding keystrokes. Rejected below.
2. **Enforce the allowlist inside the guest, at the point of `exec`**, so it holds regardless of
   which path bytes took to get there. This is the direction taken.

## Decision

**1. The learner's default shell, inside the lab's pinned image, is a small restricted wrapper
(`lab-shell`), not `bash`.** It is set via `usermod -s /usr/local/bin/lab-shell <user>` at image
build time, so `openInteractive()`'s controller-hosted PTY starts it as the session's controlling
process automatically -- no change to how `openInteractive()` is called, no backend involvement in
the terminal stream at all.

**2. `lab-shell` enforces the allowlist by tokenizing, never by re-interpreting.** It reads one
line at a time, splits it into words with its own field splitting, checks the first word (the
bare command name, not a path -- `./docker` or `/usr/bin/docker` are refused outright, closing the
basename-only bypass a naive check would leave open) against `$LAB_ALLOWED_COMMANDS`, and only then
execs the resulting argv directly. It never passes the typed line to a second shell (`sh -c
"$line"` or `eval`) -- that single rule is what keeps `;`, `&&`, backticks and `$()` in a rejected
or accepted line from ever being interpreted as a second command; they reach a rejected check's
error message, or an accepted command's own argv, as inert text. See the script's own comment in
`src/main/resources/labs/image/<labId>/lab-shell` for the full reasoning.

**3. `$LAB_ALLOWED_COMMANDS` is baked into the image at build time, from the `LabSpec`'s own
`allowedCommands`, never supplied by anything the learner can reach at runtime.** It is read by
`lab-shell` as an environment variable set in the `Dockerfile`, not passed in by the orchestrator
per session -- there is nothing in the learner's session able to widen it.

**4. This reconciliation is specific to the interactive-terminal path.** Any evaluation or
provisioning command the orchestrator itself issues (ADR 0027 decision 4, ADR 0028 decision 6)
still goes through the ordinary `cmd` API as that same privileged caller, not through
`lab-shell` -- the restricted shell only ever constrains the *learner's* session.

## Consequences

- **ADR 0027 decision 2's "rejected at the bridge" no longer describes the interactive path
  precisely.** The allowlist is still rejected before anything disallowed executes; it is rejected
  by the guest's own login shell at `exec` time, not by a backend process in the middle of the
  connection. This ADR is the correction, not a silent edit of ADR 0027's own text.
- **A learner with a real shell has more latitude than a backend-mediated bridge would allow in
  the small**, e.g. shell builtins of the restricted wrapper itself (`cd`, `exit` if ever added)
  are a design surface this project now owns and must keep as narrow as the allowlist itself --
  `lab-shell` today defines none beyond reading a line and dispatching it.
- **Enforcement correctness now depends on `lab-shell`'s own code being right**, not on the
  orchestrator's logic. It is covered by local, repeatable tests run against the actual script
  (allowed command runs; disallowed command refused and never executed; a path-qualified name
  refused; a `;`/`&&`-laden line treated as one command's literal, inert arguments) rather than
  only reasoned about.
- **No change to resource limits, network egress, or destroy-on-exit** -- those remain exactly
  ADR 0027/0028's decisions, enforced by the platform, independent of which shell runs inside.

## Rejected alternatives

- **Proxy `openInteractive()`'s WebSocket through this project's backend, parsing the PTY byte
  stream for command boundaries.** Rejected: terminal input includes line editing (backspace,
  arrow-key history), control characters, and shell features a byte-stream parser would have to
  reimplement correctly to avoid false negatives -- and a learner typing `alias d=docker; d build`,
  `$(printf docker) build`, or splitting a command across a backslash-continued line defeats a
  naive text match without ever being blocked. Enforcing at the kernel's own `exec` boundary, after
  this project's own code has already tokenized the line with ordinary POSIX word splitting (not
  attempting to simulate what a general-purpose shell would do with the result), is robust to all
  of these in a way pattern-matching raw bytes is not.
- **A file-write-only bridge (no interactive terminal at all), with `vi`/`nano` replaced by a
  direct "submit corrected file content" API call.** Considered seriously first -- simpler, no PTY
  involved -- but rejected once the product owner chose a real terminal: it would not let a
  learner use `vi`/`nano` the way the `LabSpec`'s own `allowedCommands` already names them, and
  would not generalize to a future lab where driving an actual interactive program (not just
  editing a file) is the point.

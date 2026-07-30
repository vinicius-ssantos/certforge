# ADR 0006: Isolate future code execution

- Status: Accepted
- Date: 2026-07-30

## Context

Executing learner-provided Java code introduces a fundamentally different trust boundary from serving questions. Placing arbitrary execution inside the main application would expose data, credentials, network access, and service availability.

## Decision

When introduced, Java compilation and execution will run in a separate restricted runner service using disposable, resource-bounded environments. The runner will have no direct database credentials, no general network access, and no access to application secrets.

## Consequences

- The runner has a narrow job/result contract.
- Operational complexity is intentionally deferred until `v0.5.0`.
- Runner-specific threat modeling, quotas, observability, patching, and abuse controls are release prerequisites.
- The main application treats runner output as untrusted and sanitizes it.

## Rejected alternatives

- In-process Java compilation and execution.
- Reusing the main application container as an execution sandbox.
- Allowing unrestricted network or persistent workspace access.

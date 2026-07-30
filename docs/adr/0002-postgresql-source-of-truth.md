# ADR 0002: Use PostgreSQL as the source of truth

- Status: Accepted
- Date: 2026-07-30

## Context

The product requires transactional integrity across publication, sessions, attempts, audit evidence, and rebuildable progress projections. These relationships are strongly structured and benefit from constraints and durable transactions.

## Decision

Use PostgreSQL as the authoritative persistence system. Manage schema evolution with Flyway and validate behavior against real PostgreSQL through integration tests.

## Consequences

- Relational constraints and transactions enforce critical integrity.
- Progress projections remain rebuildable from durable attempt evidence.
- Module ownership must be preserved even in one database.
- Redis, search engines, and analytics stores may be introduced later only as derived or operational systems, not silent alternate sources of truth.

## Rejected alternatives

- MongoDB as the primary store.
- Event sourcing for the initial release.
- Multiple databases per module before operational need exists.

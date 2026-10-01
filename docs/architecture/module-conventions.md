# Module Conventions

Issue: #4 — Enforce modular monolith boundaries. See [ADR 0001](../adr/0001-modular-monolith.md) and [ADR 0007](../adr/0007-generalize-preparation-catalog.md).

## Modules and packages

Each module is a direct sub-package of `dev.certforge`. Java package names cannot contain hyphens, so the module `preparation-catalog` and `question-bank` are implemented as `preparationcatalog` and `questionbank`. There is no parallel `certification-catalog` module.

| Module | Package | Allowed dependencies |
|---|---|---|
| `platform` | `dev.certforge.platform` | none |
| `identity` | `dev.certforge.identity` | `platform` |
| `preparation-catalog` | `dev.certforge.preparationcatalog` | `platform`, `identity` |
| `question-bank` | `dev.certforge.questionbank` | `platform`, `identity`, `preparationcatalog`, `audit` |
| `study` | `dev.certforge.study` | `platform`, `identity`, `preparationcatalog`, `questionbank` |
| `progress` | `dev.certforge.progress` | `platform`, `identity`, `preparationcatalog`, `study` |
| `audit` | `dev.certforge.audit` | `platform`, `identity` |

The allowed dependencies are declared with `@ApplicationModule(allowedDependencies = ...)` in each module's `package-info.java` and follow the direction rules in the [architecture overview](overview.md).

## Public API and internals

- Types in the module's base package are its public API: other modules may use them.
- Everything under `<module>.internal` (and any other sub-package) is private to the module. Other modules must not reference it.
- Persistence types (`*Repository`, `*Entity`) must live in an `internal` package. A type that must cross a boundary is exposed as a separate API type, never as a persistence entity.
- Modules exchange stable identifiers (for example `ActorId`) and immutable value types (for example `AuditFact`), not internal state.

## Transactions and internal events

- A use case runs in one local transaction owned by the module that exposes it.
- Cross-module writes go through the other module's public API, never through its repositories.
- Spring application events may be used inside the process to decouple modules, for example to feed projections or audit. They are plain in-process events: they do not imply Kafka, an outbox, or eventual consistency. Introducing any of these requires its own ADR.

## Enforcement

`ModularityTest` runs in CI (`mvn verify`) and fails the build when:

- the set of modules differs from the table above;
- a module depends on a module that is not in its allowed list;
- a module references another module's internal types;
- a `*Repository` or `*Entity` type is declared outside an `internal` package.

## Minimal interaction example

`audit.AuditFact` records an auditable action and references `identity.ActorId`. The `audit` module depends on `identity` only through its public API and declares that dependency explicitly.

## The `platform` module

`platform` holds what every module shares on the web boundary and depends on no other module: `ProblemException`, the base type for every domain failure, which the single error advice turns into an RFC 9457 problem with a stable `code` and the `requestId`; `RequestId`, the correlation identifier; and the `Page`/`PageCursor` types of keyset pagination. Modules raise failures by extending `ProblemException` and never build an error body themselves. See [operations](../engineering/operations.md).

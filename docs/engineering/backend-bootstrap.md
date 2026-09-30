# Backend Bootstrap

Issue: #3 — Bootstrap the backend platform and CI quality gates

## Selected baseline

The bootstrap favors current stable releases with an LTS Java runtime and delegates transitive dependency versions to Spring Boot where possible.

| Component | Selected baseline | Policy |
|---|---:|---|
| Java | 25 LTS | Project compilation/runtime baseline |
| Spring Boot | 4.1.1 | Stable application platform |
| Spring Modulith | 2.1.1 | Version selected now; module implementation belongs to #4 |
| Maven | 3.9.16 recommended | Builds require Maven 3.9.x |
| PostgreSQL server | 18.6 | Local/Testcontainers database image |
| Flyway | 12.4.0 | Managed by Spring Boot 4.1.1 |
| PostgreSQL JDBC | 42.7.13 | Managed by Spring Boot 4.1.1 |
| Testcontainers | 2.0.5 | Managed by Spring Boot 4.1.1 |

Spring Boot 4.1.1 supports Java versions through Java 26, so Java 25 provides a current LTS baseline without adopting a preview JDK.

Spring Modulith is dependency-managed but no application module is introduced in #3. Architectural modules and verification are owned by #4.

## Local prerequisites

- JDK 25
- Maven 3.9.x (3.9.16 recommended)
- Docker with Compose support

No production credentials are required for local development.

## Build

A clean checkout is verified with:

```bash
mvn verify
```

The `verify` lifecycle runs:

- Maven Enforcer toolchain checks;
- unit tests;
- integration tests through Maven Failsafe;
- PostgreSQL integration through disposable Testcontainers infrastructure;
- Flyway migration validation through application startup;
- Spotless formatting checks;
- PMD static analysis.

To apply Java formatting before verification:

```bash
mvn spotless:apply
```

## Run locally

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Start CertForge:

```bash
mvn spring-boot:run
```

The default local database connection is:

- database: `certforge`
- user: `certforge`
- password: `certforge`
- port: `5432`

These defaults are local-only and may be overridden with `DB_URL`, `DB_USER`, and `DB_PASSWORD`.

Health is exposed at:

```text
GET /actuator/health
```

Only `health` and `info` actuator endpoints are exposed over HTTP.

## Database bootstrap

Flyway owns schema evolution from the first commit. The initial migration creates only the technical `certforge` schema. It deliberately introduces no product/domain table.

Integration tests start PostgreSQL 18.6 using Testcontainers and verify that Flyway successfully records the migration from an empty database.

## Dependency policy

- Spring Boot manages supported versions for its dependency ecosystem.
- Spring Modulith uses its BOM.
- Dependabot checks Maven and GitHub Actions dependencies weekly.
- Snapshot dependencies are not part of the bootstrap.
- Version upgrades that change platform compatibility require a documented review.

## Deferred from #3

- domain modules and architecture enforcement (#4);
- authentication (#5);
- preparation catalog/domain tables (#6);
- frontend;
- Kafka or other external messaging;
- Redis;
- Kubernetes;
- production deployment;
- Java code runner.

## Reference sources checked at bootstrap

- Spring Boot 4.1.1 reference and dependency management
- Spring Modulith 2.1.1 reference/release train
- Oracle Java 25 LTS announcement
- Apache Maven 3.9.16 release history
- PostgreSQL 18.6 release announcement

## ADDED Requirements

### Requirement: JPA page total metadata SHALL not assert unconditional COUNT queries

The `Page<T>` interview answer SHALL describe a typical COUNT query and the documented optimization permitting COUNT omission when the total is inferable. Key C SHALL stay correct.

#### Scenario: Count optimization

- **GIVEN** a partial page that reveals the total
- **THEN** the answer SHALL allow Spring Data to skip the COUNT query

### Requirement: Pessimistic write locking SHALL distinguish conflicting and nonlocking reads

The PESSIMISTIC_WRITE interview answer SHALL describe serialization of competing row updates/locks while noting that ordinary MVCC snapshot reads may proceed. Key D SHALL remain correct.

#### Scenario: Plain SELECT under MVCC

- **GIVEN** a transaction holds a pessimistic row write lock
- **THEN** a plain nonlocking snapshot SELECT MAY observe the previously committed version without blocking

### Requirement: Native SQL result mapping SHALL allow supported non-entity forms

The nativeQuery interview answer SHALL explain dialect portability and SHALL allow scalar, tuple, projection or explicit DTO mapping rather than requiring @SqlResultSetMapping for all structured rows. Key B SHALL remain correct.

#### Scenario: Reporting query with ranking result

- **GIVEN** a native window-function report not mapped as an entity
- **THEN** consumers MAY receive scalar/tuple/projection/DTO results with suitable mapping

### Requirement: Template Method versus Strategy SHALL accurately allow fixed-sequence composition

The `iv156-template-method-report-pipeline` question SHALL preserve correct key C while avoiding the claim that a Strategy cannot coexist with a fixed run() sequence. Alternative A SHALL explicitly lack the shared skeleton; explanations SHALL acknowledge that a Strategy can be injected within a shared run() while Template Method is the direct inheritance-based choice described in C.

#### Scenario: Composition can keep pipeline order

- **GIVEN** a ReportJob.run() fixes the load, transform, write order
- **THEN** injecting a transformation Strategy can retain that order, even though a Template Method implements it using subclass overrides

### Requirement: Source-only JPA repairs SHALL not record editorial approvals

The change SHALL retain original answer keys and SHALL not alter `review.json`, `pack.json` or publish the DRAFT pack.

#### Scenario: Pending V2 review

- **GIVEN** source files change
- **THEN** independent V2 signoff is deferred until after the source-only change merges

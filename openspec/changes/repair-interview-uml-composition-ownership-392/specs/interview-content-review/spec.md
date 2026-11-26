## ADDED Requirements

### Requirement: Ownership semantics for UML composition SHALL be explicit

An interview question contrasting Java object references with UML composition and aggregation SHALL identify ownership and lifecycle as *model assumptions*, not as conclusions automatically enforced by `new`, `private` or `final`. An independently owned association SHALL NOT be asserted to be UML shared aggregation unless a whole–part model is intended.

#### Scenario: Engine owned exclusively, Driver assigned independently

- **GIVEN** a car owns its engine exclusively as a lifecycle-dependent part
- **AND** a driver is owned independently and can be reassigned
- **WHEN** a learner compares the designs
- **THEN** composition is the correct interpretation for the engine under the stated contract
- **AND** ordinary association or optional shared aggregation is the correct interpretation for driver
- **AND** the evidence cites an authoritative UML modeling source.

## ADDED Requirements

### Requirement: Executor saturation must not be conflated with lifecycle rejection

A technical interview question describing `ThreadPoolExecutor` with an unbounded queue SHALL distinguish ordinary saturation while running from rejection after shutdown and SHALL describe potential unbounded backlog and OOM as a risk, rather than inevitable behavior.

#### Scenario: Saturated running executor with unbounded queue

- **GIVEN** a fixed-size running executor whose LinkedBlockingQueue has no explicit capacity
- **WHEN** arrivals outpace the workers over a sustained period
- **THEN** the answer explains why work queues rather than growing the pool beyond its core size
- **AND** it describes heap exhaustion as possible, not guaranteed
- **AND** it does not claim submission cannot be rejected after shutdown.

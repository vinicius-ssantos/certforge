## ADDED Requirements

### Requirement: Java concurrency and exception review decisions remain source bound
A Java backend interview review batch SHALL record AI_APPROVED only for
individually checked current sources, verified answer options and primary
documentation. Review entries SHALL use the exact V2 digest with explicit
ai-reviewer attribution, not imply owner review, and shall not publish the
interview pack while questions remain unreviewed.

#### Scenario: Six concurrency, OOP and testing review decisions
- **WHEN** the repaired volatile, dynamic-dispatch and JUnit fixture questions and three independently checked Java exception/stream questions receive verdicts
- **THEN** the six keys remain B, C, B, D, D and C respectively
- **AND** each source V2 digest matches its recorded review
- **AND** all unrelated reviews remain intact and editorialStatus stays DRAFT.

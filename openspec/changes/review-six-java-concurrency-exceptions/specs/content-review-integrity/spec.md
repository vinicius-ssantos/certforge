## ADDED Requirements

### Requirement: Java concurrency and exception review decisions remain source bound
A Java backend interview review batch SHALL record AI_APPROVED only for
individually checked current sources, verified answer options and primary
documentation. Review entries SHALL use the exact V2 digest with explicit
ai-reviewer attribution, not imply owner review, and shall not publish the
interview pack while questions remain unreviewed.

#### Scenario: Six concurrency, OOP and testing review decisions
- **WHEN** the individually reviewed questions `iv150-polymorphism-dynamic-dispatch`, `iv155-test-isolation-shared-fixtures`, `iv286-volatile-visibility-not-atomicity`, `iv286-try-with-resources-suppressed-exception`, `iv286-stream-single-use-pipeline`, and `iv286-checked-vs-unchecked-recoverability` receive verdicts
- **THEN** their exact respective answer keys remain B, C, B, D, D, and C
- **AND** each source V2 digest matches its recorded review
- **AND** all unrelated reviews remain intact and editorialStatus stays DRAFT.

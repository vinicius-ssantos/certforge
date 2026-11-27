## ADDED Requirements

### Requirement: Twenty-four SRE, Spring, DDD and design-pattern interview questions SHALL receive individual V2 approvals only after source verification

Every one of the twenty-four question identifiers documented in this change's design SHALL have a separate AI-reviewer digest and checklist generated using the canonical recorder against its exact current question content. All distractors and technical references SHALL have been checked, and the review-only PR SHALL not edit any question file or pack metadata.

#### Scenario: SRE operational troubleshooting

- **GIVEN** symptoms involving CPU, tracing, retries, cascade, deployment latency and database round trips
- **THEN** correct answers SHALL be individually verified against official vendor or original SRE references.

#### Scenario: Framework infrastructure and DDD boundaries

- **GIVEN** a Spring Boot configuration, transaction or startup question or a DDD repository/context question
- **THEN** the unique correct answer and distractor weaknesses SHALL be verified independently before recording APPROVED.

#### Scenario: Editorial safety for unresolved source defects

- **GIVEN** flawed or version-sensitive question wording remains uncorrected
- **THEN** no APPROVED review SHALL be created for those questions.
- **AND** the pack SHALL stay DRAFT and issues #392 and #428 SHALL remain open.

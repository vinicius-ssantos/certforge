## ADDED Requirements

### Requirement: Corrected HashMap and DCL questions receive only source-bound reviews
A Java backend interview technical correction SHALL NOT inherit an earlier
editorial approval; new V2 AI review verdicts SHALL be recorded only after
individual review of the exact corrected question, answer alternatives,
explanation and authoritative sources. Review entries SHALL have a current
source-bound SHA-256 V2 digest and disclose ai-reviewer as the actual reviewer.

#### Scenario: HashMap mutable-key and unsafe DCL questions pass individual review
- **WHEN** the revised questions `iv286-mutable-key-breaks-hashmap-lookup` and `iv286-double-checked-locking-without-volatile` are independently reviewed against Oracle Java SE 21 and JSR-133
- **THEN** their correct answers remain C and C, in that exact order
- **AND** both review digests match their post-repair question sources
- **AND** the earlier 38 review decisions remain unchanged and the pack stays DRAFT without publication.

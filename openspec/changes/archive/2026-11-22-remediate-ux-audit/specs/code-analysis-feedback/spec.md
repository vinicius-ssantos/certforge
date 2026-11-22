## ADDED Requirements

### Requirement: Explanation-first disclosure
Practice feedback SHALL present the authored explanation before optional expanded verification evidence. Complete evidence SHALL remain keyboard-accessible and inert.

#### Scenario: Read feedback containing verification files
- **WHEN** read feedback containing verification files
- **THEN** the explanation precedes a disclosure containing all fixed evidence

### Requirement: Local author preview
Authors SHALL be able to preview unsaved prompt formatting locally without saving or publishing a revision. Existing validation and dirty-navigation protection SHALL remain effective.

#### Scenario: Preview a draft containing code
- **WHEN** preview a draft containing code
- **THEN** the learner renderer displays its current text without a network write

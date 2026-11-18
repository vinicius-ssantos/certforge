# Spec Delta

## Purpose

Helps learners understand Java compilation, runtime behavior and program output using fixed, author-reviewed examples with explanations disclosed only when study feedback is permitted.

## ADDED Requirements

### Requirement: Code analysis feedback shall explain observed Java behavior
After accepted study feedback, code-oriented questions SHALL give learners a reviewed explanation that connects fixed source code with its compilation outcome, runtime behavior or output and the relevant Java language rule.

#### Scenario: Learner receives practice feedback about Java output
- **WHEN** the server accepts an answer to a code-oriented practice question
- **THEN** the learner can inspect the authored rationale for the expected result and relevant code behavior without executing new code

#### Scenario: Learner reviews a compilation failure
- **WHEN** feedback for a question about a fixed Java compilation failure becomes available
- **THEN** the review explains the relevant language constraint and expected failure rather than claiming a runtime output

### Requirement: Code solutions shall remain hidden in an active timed mock
Correct options, compiler diagnostics, expected results and explanatory rationales SHALL remain unavailable while a timed mock has not reached a terminal state.

#### Scenario: Learner is in an active mock
- **WHEN** the learner navigates a timed mock containing a code-analysis question before final submission or expiration
- **THEN** the learner can read the source and record selections but cannot see the expected result, diagnostic or explanatory answer key

#### Scenario: Learner sees a terminal mock result
- **WHEN** the server finalizes or expires the timed mock
- **THEN** the learner can inspect reviewed feedback and expected behavior without changing the recorded submission

### Requirement: Fixed code evidence shall not bypass editorial review
Questions treated as verified code examples SHALL have deterministic evidence for their fixed source and outcome, and published explanatory content SHALL still require explicit human editorial acceptance.

#### Scenario: Proof exists but explanation is not approved
- **WHEN** a fixed Java 21 example passes its deterministic build check but its authored explanation has not passed editorial review
- **THEN** compiler evidence alone does not authorize publishing that explanation or claiming human approval

#### Scenario: Learner submits arbitrary code
- **WHEN** a request would require compiling or executing source submitted by the learner
- **THEN** this capability does not execute that source or claim its behavior is proved by the fixed content pack

### Requirement: Code-oriented feedback shall remain accessible and safe
Code-analysis feedback SHALL preserve source indentation and reading order, remain keyboard and mobile accessible, and display fixed code as text rather than executable markup.

#### Scenario: Narrow screen and keyboard navigation
- **WHEN** a learner views code-oriented feedback on a narrow screen or navigates by keyboard
- **THEN** code remains readable using wrapping or a keyboard-reachable scroll region without losing meaningful line breaks

#### Scenario: Source contains markup-like characters
- **WHEN** fixed source includes HTML-like characters or an unsupported language tag
- **THEN** the renderer displays the characters as escaped text instead of interpreting or running markup

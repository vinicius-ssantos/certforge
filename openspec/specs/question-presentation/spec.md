# question-presentation Specification

## Purpose

Learners can read paragraphs and code examples with the structure intended by the question author.

## Requirements

### Requirement: Equivalent presentation across line endings

The web prompt renderer SHALL display equivalent paragraph boundaries, code content, indentation and syntax highlighting for LF, CRLF and mixed line endings.

#### Scenario: Windows line endings in Java examples
- **WHEN** a learner opens a prompt containing paragraphs and a fenced Java snippet separated by CRLF sequences
- **THEN** blank lines separate paragraphs and the snippet appears in a focusable highlighted code block with its original indentation.

#### Scenario: Mixed line endings in plain code
- **WHEN** a prompt mixes LF and CRLF around and inside an untagged code fence
- **THEN** the learner sees the same plain code lines and surrounding paragraphs as in the LF version.


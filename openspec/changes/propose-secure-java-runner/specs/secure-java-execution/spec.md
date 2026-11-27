# Spec Delta

## Purpose

Lets a learner complete an author-written Java scaffold, have it compiled and run in an isolated, disposable environment, and receive a deterministic verdict grounded in what actually happened, never a judgment call.

## ADDED Requirements

### Requirement: A learner submits one completion of an authored scaffold

The system SHALL accept exactly one text submission per attempt, inserted into a single author-defined insertion point within an editorially-reviewed scaffold. The system SHALL NOT accept or execute a learner-authored program that is not placed inside such a scaffold.

#### Scenario: Submitting a completion
- **WHEN** a learner submits text for the scaffold's insertion point
- **THEN** the system compiles and runs the completed program without asking the learner anything further about how to run it.

### Requirement: Execution is isolated and disposable

The system SHALL compile and run every submission in a sandboxed environment with no database credentials, no general network access, and no access to application secrets, and SHALL destroy that environment once grading completes, win or lose.

#### Scenario: A submission cannot reach anything but its own output
- **WHEN** a submitted completion is compiled and run
- **THEN** the sandboxed process has no path to the application's database, secrets, or any host outside its own disposable environment, and the environment no longer exists once the verdict is produced.

### Requirement: The verdict is deterministic and stated in words

The system SHALL compare the program's actual compiled behavior (compile success or failure, and recorded output) against the scaffold's author-defined expectation, and SHALL present whether it passed in words, never by color alone.

#### Scenario: A submission does not compile
- **WHEN** the learner's completion fails to compile
- **THEN** the system reports that it did not compile, and shows the compiler's own diagnostic text, rather than treating it as a silent failure or a runtime result.

#### Scenario: A submission compiles but produces the wrong output
- **WHEN** the learner's completion compiles and runs, but its recorded output does not match the scaffold's expectation
- **THEN** the system states plainly that it did not pass and shows the actual recorded output beside the authored expectation.

### Requirement: Sandbox output is treated as untrusted

The system SHALL treat every byte a sandboxed execution produces (compiler diagnostics, program output, and any error text) as untrusted input from the learner's own submission, and SHALL sanitize it before it reaches any other part of the application or another learner.

#### Scenario: Output containing control sequences or markup
- **WHEN** a submission's compiler output or program output contains characters that would otherwise be interpreted as markup, control sequences, or application-internal syntax
- **THEN** the system displays them as inert text to the learner, never as executable or interpretable content.

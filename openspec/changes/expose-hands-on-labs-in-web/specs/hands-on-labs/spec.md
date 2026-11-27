# Spec Delta

## Purpose

A learner can find, start, work in, and get a verdict from one of the shipped hands-on labs,
without needing to know the underlying REST contract or which orchestration engine runs it.

## ADDED Requirements

### Requirement: Learner-facing lab catalog

The web application SHALL list every shipped lab's id, objective title, objective description and
time limit, reading only fields a learner needs — never the lab's image reference, sandbox limits,
allowed-command list or evaluation probe text.

#### Scenario: Browsing available labs
- **WHEN** a signed-in learner opens `/labs`
- **THEN** every shipped lab appears with its objective and time limit, each with a way to start it.

#### Scenario: No labs shipped
- **WHEN** the catalog is empty
- **THEN** the learner sees an explicit empty state, not a blank page.

### Requirement: Starting a session opens its real terminal

Starting a lab SHALL open an interactive terminal connected to the session the backend actually
started, whichever orchestration engine runs it, without the learner needing to know which engine
that is.

#### Scenario: Starting any shipped lab
- **WHEN** a learner starts a lab
- **THEN** the objective is shown, and a connected interactive terminal appears, accepting typed
  input and displaying the shell's output as it arrives.

### Requirement: Checking work shows the recorded verdict in words

Completing a session SHALL show whether it passed and, for each check the grader ran, its
description and whether it passed — in words, not color alone.

#### Scenario: A check does not pass
- **WHEN** a learner checks their work and one or more checks fail
- **THEN** the result states it did not pass and lists which checks did and did not, by name.

### Requirement: A session that is not open in this tab says so

The web application SHALL NOT claim to recover a lab session it has no record of (for example
after a page reload), and SHALL explain plainly that the session exists only in the tab that
started it.

#### Scenario: Reloading mid-session
- **WHEN** a learner reloads or directly opens a lab session URL this tab never started
- **THEN** they see an explicit explanation and a way back to the lab list, not a broken or
  silently empty page.

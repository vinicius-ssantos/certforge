# frontend-navigation Specification

## Purpose
Enable consistent, keyboard-accessible navigation and shareable filtering across learner and editorial screens, including compact layouts and route-aware bundle costs.

## Requirements

### Requirement: Editorial criteria shall stay consistent with the URL
Editorial criteria SHALL stay consistent with the URL.

#### Scenario: Change editorial status
- **WHEN** an editor searches and then selects another status
- **THEN** the search stays applied, pagination resets and browser history restores the criteria

### Requirement: Dense study screens shall remain navigable on narrow layouts
Dense study screens SHALL remain navigable on narrow layouts.

#### Scenario: Use a table or question navigator by keyboard
- **WHEN** columns overflow or the learner changes questions
- **THEN** extra columns remain available and keyboard focus identifies the current section

### Requirement: Frontend budgets shall distinguish entry from total cost
Frontend budgets SHALL distinguish entry from total cost.

#### Scenario: Build route bundles
- **WHEN** optional product surfaces are split into chunks
- **THEN** initial gzip is measured separately and the total distribution remains bounded

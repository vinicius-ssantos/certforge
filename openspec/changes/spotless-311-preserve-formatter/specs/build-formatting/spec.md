## ADDED Requirements

### Requirement: Formatter version must remain explicit across plugin updates

The Java formatting gate SHALL use a declared google-java-format version
rather than silently changing the formatting policy when a Spotless Maven
plugin update modifies its default formatter. An upgrade that changes the
formatting baseline SHALL be isolated and reviewed as a separate change.

#### Scenario: Upgrade the Spotless Maven plugin without changing formatting

- **WHEN** the Maven Spotless plugin is upgraded from 3.10.4 to 3.11.0
- **THEN** the configured google-java-format version remains 1.36.1
- **AND** no Java source file is reformatted as part of the dependency upgrade
- **AND** Maven verify continues to run the Spotless check as a CI gate.

#### Scenario: A future formatter upgrade changes source layout

- **WHEN** the project intentionally changes google-java-format version
- **THEN** the resulting source diffs receive explicit review in their own PR
- **AND** tests must pass without treating mechanical formatting as semantic acceptance.

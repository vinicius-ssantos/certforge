## ADDED Requirements

### Requirement: Separation of test fixtures from learner review data
Local release, review and end-to-end test stacks SHALL use separate database projects/volumes. E2E fixture seeding SHALL require a disposable test environment, and review stack startup SHALL NOT publish unreviewed or synthetic questions.

#### Scenario: Start review beside an existing release database
- **WHEN** a developer starts the isolated review stack with an existing release stack
- **THEN** the review uses its own volume and ports without changing release sessions, objectives or questions

#### Scenario: Launch E2E locally
- **WHEN** E2E global setup is invoked without disposable-environment opt-in
- **THEN** it fails before creating questions or modifying exam objectives

### Requirement: Resume announcements shall be transient
The learner SHALL receive a brief status when joining an existing practice or mock session, and SHALL NOT see stale resume notices throughout subsequent questions.

#### Scenario: Answer the first question after resuming
- **WHEN** a resumed practice session records a successful answer
- **THEN** its resume announcement disappears and answer feedback remains available

### Requirement: Study availability for general-knowledge topics
An authenticated learner SHALL be able to obtain learner-eligible published question counts for the topics of an active general-knowledge track, including nested topics. The response SHALL omit answer keys and editorial details, refuse unauthenticated access, and return not-found for an inactive or unknown general track.

#### Scenario: Active general track with mixed published coverage
- **WHEN** an authenticated learner opens its topics
- **THEN** practice is offered only on topics whose eligible published question count is greater than zero, without revealing any answer material

#### Scenario: Unknown or inactive general track
- **WHEN** an authenticated learner requests its topic availability
- **THEN** the endpoint reports not found without disclosing any unpublished content

### Requirement: Previously approved local owner-review content is imported with truthful attribution
Importing previously recorded owner-approved questions into the isolated local review stack SHALL verify the current approval digests, use the existing authenticated editorial commands, and identify self-review as such. The importer SHALL refuse external and release deployments and SHALL not create or impersonate an independent reviewer.

#### Scenario: Restore approved Java t01 and t02 content
- **WHEN** the isolated review database lacks t01/t02 questions with intact owner approvals
- **THEN** an explicit review-only import publishes exactly those eligible questions under a disclosed administrator self-review, enabling their study topics without weakening publication rules

### Requirement: Browser and seeder must use the same isolated test backend
Local E2E runs SHALL allow only the disposable API on loopback port 8086 and validate the browser target before writes. A Playwright-managed preview SHALL proxy API calls to that API and refuse to reuse unknown listeners. External browser URLs SHALL be accepted only for the dedicated disposable Compose pair. Hosted GitHub Actions with ephemeral databases MAY use their own ports.

#### Scenario: Run local E2E with a custom disposable API and no browser URL
- **WHEN** an opted-in developer supplies a loopback disposable `E2E_API_URL` but no `E2E_BASE_URL`
- **THEN** Playwright starts a fresh preview on the known preview port, proxies `/api` to the supplied disposable backend, and the seeder writes fixtures to that same backend

#### Scenario: Misconfigured E2E browser or API target
- **WHEN** a local run targets release/review ports, a remote hostname, an unknown pre-existing preview, or a mismatched external browser/API pair
- **THEN** the run fails before seeding test content or registering accounts

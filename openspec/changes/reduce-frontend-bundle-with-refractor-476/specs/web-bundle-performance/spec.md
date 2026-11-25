## ADDED Requirements

### Requirement: Fenced code highlighting preserves safe and accessible Prism rendering

The web frontend MUST render Java, YAML, Dockerfile and HCL fenced code as escaped React text and Prism/Refractor CSS-class tokens, MUST preserve the authored whitespace, and MUST NOT interpret question text as raw HTML or introduce inline token styles. Unknown language tags MUST remain unhighlighted and preserve plain code text.

#### Scenario: Learner reads syntax-highlighted code across supported grammars

- **WHEN** a question prompt includes fenced Java, YAML, Dockerfile or HCL
- **THEN** its visible code text and line breaks remain identical to the source, and highlighting uses existing `.token` CSS classes without inline styles
- **AND** code stays inside a keyboard-focusable `pre` with an accessible label and a reversible wrap control
- **AND** text resembling HTML is displayed literally rather than inserted as DOM markup.

#### Scenario: Learner reads an unsupported fence

- **WHEN** a prompt includes an unknown code-language tag
- **THEN** the same source characters are rendered as ordinary escaped code text without artificial syntax tokens.

### Requirement: JavaScript gzip budgets remain real, bounded and reproducible

Every frontend dependency or code change MUST respect **155 KiB initial JS** and **212 KiB total JS** as measured by the existing deterministic gzip budget script. CI MUST NOT relax these budgets, ignore failed checks, or use rounded displays instead of exact bytes to claim acceptance.

#### Scenario: React Router and React Query updates follow a validated bundle optimization

- **WHEN** React Router 8.5.2 and React Query 5.108.2 are built together with the reduced renderer
- **THEN** total JavaScript gzip is below 217,088 exact bytes with documented headroom
- **AND** each dependency PR still requires its own fresh CI, Codex and E2E checks before integration.

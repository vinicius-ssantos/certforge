# Contributing to CertForge

CertForge is currently in its foundation phase. Contributions must preserve the product boundaries, content integrity, and release strategy described in `docs/`.

## Before opening a change

1. Confirm that the work belongs to the active release.
2. Link the change to an issue with acceptance criteria.
3. Read the relevant ADRs and product documentation.
4. Keep product behavior and documentation in the same pull request when they change together.

## Branch and pull request conventions

Use focused branches such as:

- `feat/issue-123-study-session`
- `fix/issue-234-attempt-validation`
- `docs/issue-345-content-policy`

Prefer conventional commit prefixes: `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `ci`, and `chore`.

A pull request must explain:

- the user or operational problem;
- the chosen solution;
- alternatives or trade-offs when relevant;
- test evidence;
- security, privacy, accessibility, and migration impact;
- documentation changed.

## Certification content contributions

All questions and explanations must be authorial, technically reviewed, version-scoped, and backed by authoritative references. Exam dumps, reconstructed exam questions, and unverifiable claims are prohibited. See `docs/product/content-policy.md`.

## Definition of done

A change is complete only when the criteria in `docs/engineering/definition-of-done.md` are satisfied.

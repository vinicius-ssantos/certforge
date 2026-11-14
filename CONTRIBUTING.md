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

### Stacked branches and concurrent agents

When more than one contributor or agent is active on the same feature area at once:

- Target `main` directly whenever possible. Only stack a branch on top of another feature branch
  (rather than `main`) when there is no reasonable alternative — stacking is what turned a correct
  review into a merge gap in #379/#380, where the feature branch's own PR based itself on another
  in-flight branch instead of `main`.
- Before merging, confirm the pull request's actual base with
  `gh pr view <number> --json baseRefName`. A PR based on anything other than `main` does not put
  its content on `main` when it merges, regardless of what the PR's "Merged" status says.
- After any merge meant to land code on `main`, verify it actually did:
  `git merge-base --is-ancestor <merged-commit-sha> origin/main`. Treat "Merged" on GitHub as
  confirmation that the PR's own base received the commit, not that `main` did.
- State which branch and issue you are starting before opening a PR, and again once it is open, so
  any other active agent or reviewer always knows the real base and head before relying on it.
- Use a separate `git worktree` per contributor or agent working at the same time (e.g.
  `git worktree add -b my-branch ../certforge-my-branch main`) rather than sharing one checkout.
  A shared checkout means one agent's `git checkout`/`stash` moves every other agent's `HEAD` out
  from under them without warning — this happened live while writing this section.

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

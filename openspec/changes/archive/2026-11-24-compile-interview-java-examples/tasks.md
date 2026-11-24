## Java interview runnable code corrections

- [x] Confirm the original prompt snippets do not compile as ordinary Java 21 units.
- [x] Add complete `main` wrappers, preserving program semantics and answer keys.
- [x] Recompile both corrected programs with `javac --release 21` and verify output.
- [x] Preserve DRAFT and do not forge any AI_APPROVED review entry.
- [x] Validate full CI and CodeQL after opening the PR.
- [x] Merge after review, then perform genuine source review and archive the OpenSpec change.

### Merge and review evidence

- Integrated on `main` via PR #439 (squash `6637e495`) with all eight CI/CodeQL checks passing.
- The corrected content was additionally subject to independent source-bound AI review in PR #442 where applicable; no human UX acceptance or pack-wide editorial publication is claimed. The interview pack remains DRAFT.

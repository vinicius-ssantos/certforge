## Formatter-preserving upgrade

- [x] Inspect #395, release notes and failed Maven job to identify the default formatter-version change.
- [x] Choose explicitly to retain the existing 1.36.1 formatter baseline instead of silently reformatting 46 Java files.
- [x] Upgrade Spotless Maven plugin to 3.11.0 and pin Google Java Format at 1.36.1.
- [x] Limit code changes to pom.xml and this OpenSpec change; modify zero Java source files.
- [ ] Confirm GitHub Maven verify/Spotless check, frontend, E2E, images, secret scan and CodeQL on the final head.
- [ ] Complete review, update issue #425, merge only after successful checks.

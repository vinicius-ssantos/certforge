## Formatter-preserving upgrade

- [x] Inspect #395, release notes and failed Maven job to identify the default formatter-version change.
- [x] Choose explicitly to retain the existing 1.36.1 formatter baseline instead of silently reformatting 46 Java files.
- [x] Upgrade Spotless Maven plugin to 3.11.0 and pin Google Java Format at 1.36.1.
- [x] Limit code changes to pom.xml and this OpenSpec change; modify zero Java source files.
- [x] Confirm all gates on PR #432 head 8f30c3e50c487a1224a753685b1be011cd6fa958: CI 45209651855 (Maven verify/Spotless, frontend, E2E, images and secret scan) and CodeQL 45209651887 passed.
- [x] Codex review completed without findings; issue #425 updated and closed; PR #432 merged as ab73a74bec97d8dec9a759aad5b67bf0dc4ca70e after successful checks.

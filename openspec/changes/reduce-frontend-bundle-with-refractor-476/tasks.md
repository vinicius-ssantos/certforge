## Measured implementation and verification

- [x] Reproduce exact current main gzip total: 217,086/217,088 bytes (2 bytes spare).
- [x] Reproduce combined React Router 8.5.2 + React Query 5.108.2 regression: 217,321/217,088 bytes (233 bytes over).
- [x] Rule out Terser substitution and nonfunctional code-splitting tweaks as insufficient/worse.
- [x] Identify Refractor/Prism AST and remove unnecessary syntax-highlighter rendering layers while retaining four grammars.
- [x] Replace the highlighter with a safe escaped React token renderer and remove obsolete package and TypeScript types.
- [x] Verify unchanged strict 155/212 KiB budgets: 213,508 bytes with existing versions; 213,775 bytes with both future dependency upgrades.
- [x] Confirm final targeted YAML/HCL + existing Prompt regression suite, full lint/types/unit tests and OpenSpec strict validation.
- [ ] Confirm 8/8 fresh CI/CodeQL/Maven/Web/Playwright/release-image/secret-scan checks on exact PR head, plus clean independent Codex review and zero blocking threads.
- [ ] Squash-merge the renderer-only PR, then separately integrate/revalidate both Dependabot updates and close #476 only after full green gates.
- [ ] Archive completed OpenSpec in a follow-up documentation PR; keep issue #428 open for real human accessibility evidence and never deploy automatically.

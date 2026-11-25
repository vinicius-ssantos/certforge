## Scope and equivalence

Previous code uses `react-syntax-highlighter/dist/esm/prism-light`, four Prism language grammars, `useInlineStyles={false}` and an accessible custom `CodePre`. The library depends internally on Refractor and on HTML/AST rendering utilities. The new renderer imports **Refractor 5.0.0 directly** (as an explicit versioned dependency), registers exactly `java`, `yaml`, `dockerfile` (alias of the `docker` grammar), and `hcl`, and maps only the tokenizer's `text` and `element` nodes to escaped React text and `<span className>` nodes.

- `CodePre` remains the same `<pre class="code" tabIndex={0} aria-label={t.prompt.codeExample}>`; keyboard scrolling and screen-reader semantics remain intact.
- The code is wrapped in a semantic `<code class="language-...">` element. Existing CSS `.token` classes are produced from Refractor HAST `className` arrays (no inline styles).
- React escapes all source text; no HTML parsing or insertion is added. Plain unknown code fences remain unhighlighted and their exact content is preserved.
- `splitFences` and locale-driven code-wrap controls are unchanged.
- Fenced Java/YAML/Dockerfile/HCL each retain readable tokens, and nested token children are recursively represented in React.

## Dependency integrity

Remove `react-syntax-highlighter` and `@types/react-syntax-highlighter`, their obsolete `tsconfig.json` type reference, and dependency-only transitive packages no longer required. Declare `refractor@5.0.0` directly. Changes to `web/package-lock.json` must come from `npm install` with the project's Node 24.15 and `npm ci` must reproduce the lockfile.

## Measurement protocol

The original build plus combined #467/#469 upgrades were tested in a **disposable Git worktree**, leaving the user's existing checkout on its original branch. Local builds used `npm ci` / fixed versions, `tsc --noEmit`, `vite build`, `npm run budget` and an isolated analysis script using the exact `gzipSync(readFileSync(asset)).length` calculation used by CI. The temporary analysis script is **not committed**. Full CI, CodeQL, Playwright, release images, final review and independent merge checks are still required in GitHub.

## Rollout and acceptance

1. Commit the renderer-only optimization under PR governance and strict OpenSpec.
2. Verify every required CI gate and exact-head Codex review. Never merge while a gate fails.
3. Merge this PR separately; then refresh Dependabot #467 and #469 against new main, verify their *combined* effect with the unchanged 155/212 KiB ceilings, review independently, and merge one by one as green.
4. Archive the completed OpenSpec after integration, update #476, keep #428 OPEN without manufacturing human-device validation.

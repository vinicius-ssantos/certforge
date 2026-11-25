## Why

The CertForge frontend enforces **155 KiB initial** and **212 KiB total** JavaScript gzip budgets. Current production dependencies build to **217,086 bytes** against a hard total ceiling of **217,088 bytes**, only **2 bytes of margin**. Dependabot React Router #467 and React Query #469 each fail the same precise-byte gate; both updates together measure **217,321 bytes (212.2275 KiB)**, 233 bytes above the ceiling.

Source-map inspection identified `web/src/ui/Prompt.tsx`'s `react-syntax-highlighter` wrapper stack as a significant optional cost. Refractor 5 is already the Prism tokenizer beneath that wrapper; using its own AST in React retains the same four grammars without `react-syntax-highlighter` rendering layers.

## What Changes

- Replace `react-syntax-highlighter` with **direct `refractor@5.0.0`** in `Prompt.tsx`, preserving Java, YAML, Dockerfile alias, and HCL grammars.
- Render Refractor's typed text/element tokens as **React text nodes and CSS-class spans**; never use raw HTML or `dangerouslySetInnerHTML`. Preserve plain-code fallback for unknown grammar, `<pre class="code">` with `aria-label`, keyboard tab target, line breaks, code-wrap checkbox, and UI locale semantics.
- Remove obsolete `@types/react-syntax-highlighter` and TypeScript type entry. Update npm lockfile deterministically.
- Extend regression tests for YAML/HCL rendering alongside existing Java, Dockerfile, unknown-fence, CRLF/whitespace, XSS safety, a11y and CSS token tests.

## Verified local size evidence

Builds use Node 24.15, Vite 8.3.8 and the same fixed gzipSync budget script:

| Package set | Previous total JS | Direct Refractor total JS | Savings |
| --- | ---: | ---: | ---: |
| Current main versions (React Router 8.5.1, React Query 5.107.1) | 217,086 bytes | 213,508 bytes | **3,578 bytes** |
| Both Dependabot upgrades (React Router 8.5.2, React Query 5.108.2) | 217,321 bytes | 213,775 bytes | **3,546 bytes** |

With both upgrades, initial JS remains **156,690 bytes (153.02 KiB)** versus a 155 KiB limit, and total JS is **208.76 KiB**, leaving more than **3 KiB of real budget headroom**.

## Boundaries

This PR deliberately does **not** merge #467/#469 or raise bundle limits; they must be rebased and independently CI validated after this optimization. No backend, question editorial verdict, API contract, deployment/publication, or human accessibility issue #428 acceptance changes. Issue #476 tracks the remaining linked dependency updates.

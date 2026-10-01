# ADR 0009: Build the learner web app as a contract-first React SPA

- Status: Accepted
- Date: 2026-09-30

## Context

`v0.1.0` needs a learner web app (#13) that works with the session-cookie authentication of ADR 0008, stays accessible by keyboard and screen reader, and cannot drift from the API it consumes.

## Decision

- Build a **single-page app** in `web/` with React 19, TypeScript (strict), Vite, React Router and TanStack Query for server state.
- Make the API **contract-first**. The backend generates `web/openapi.json` from the running application (springdoc, in `OpenApiContractIT`); the frontend generates `src/api/schema.d.ts` from it with `openapi-typescript` and calls the API through `openapi-fetch`. There are no hand-written API models. CI fails if the committed contract differs from what the backend produces, or if the generated types differ from the contract. Update with `mvn -Dtest=OpenApiContractIT -Dopenapi.update=true verify` and `npm run api:generate`.
- Keep the app **same-origin** with the API (reverse proxy in production, Vite proxy in development). The session stays in the `HttpOnly` cookie; the code only reads the CSRF cookie (or fetches `/api/auth/csrf`) to send `X-XSRF-TOKEN` on state-changing requests. No authentication token exists in JavaScript or in browser storage.
- Show **learner-facing messages chosen by stable error codes**, never server titles or details, and always show the `requestId` so a failure can be reported.
- Treat **accessibility as a tested requirement**: ESLint `jsx-a11y`, `vitest-axe` checks on each page, a skip link, labelled landmarks, form errors in a focus-taking summary linked to fields, and focus moved to the page heading after navigation. End-to-end checks with Playwright and axe follow with the study flow.
- Drop everything cached in memory on logout, so nothing from one learner is visible to the next.

## Consequences

- API changes are visible in review as a diff of `openapi.json`, and break the web build at compile time instead of at run time.
- Generating the contract needs the backend test run; changing a response shape is a two-step update.
- The OpenAPI document is available only to tests (`springdoc.api-docs.enabled=false` by default); the running application does not publish it.
- A SPA needs the proxy or a static host to serve `index.html` for client routes.

## Rejected alternatives

- **Server-rendered pages (Thymeleaf/HTMX):** simpler deployment, but less suited to the interactive study flow and to a typed contract shared with future clients.
- **A full-stack React framework (Next.js):** adds a second server runtime and a second place for authentication logic.
- **Hand-written API types:** drift silently from the backend.
- **Token authentication in the browser:** rejected in ADR 0008.

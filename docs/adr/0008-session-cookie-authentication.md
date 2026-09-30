# ADR 0008: Authenticate with server-side sessions and open registration

- Status: Accepted
- Date: 2026-09-30

## Context

`v0.1.0` needs individual learner accounts and explicit authorization for learner, editor, reviewer, and administrator capabilities. The future web frontend (#13) must not expose authentication material to browser code, and logout or revocation must take effect immediately. Two product decisions were made for this release: how clients authenticate, and whether anyone may create an account.

## Decision

- Authenticate with **server-side sessions** stored in PostgreSQL (Spring Session JDBC) and identified by an `HttpOnly`, `SameSite=Lax` cookie. `Secure` follows the request scheme unless configured explicitly.
- Protect state-changing requests with **CSRF tokens** using the double-submit cookie pattern (`XSRF-TOKEN` cookie echoed in the `X-XSRF-TOKEN` header).
- Allow **open registration**: anyone can create a learner account with an email and password. Higher roles are granted only by an administrator. The first administrator is created from configuration when none exists.
- Hash passwords with the Spring Security delegating encoder (bcrypt). The password policy is length-based (12 characters minimum, 72 bytes maximum, no composition rules).
- Keep the principal name of a session equal to the **account id**, so sessions can be found and revoked by account without using the email address.
- Enforce authorization on the server through explicit **permissions**. Roles only group permissions; other modules check permissions, never role names.

## Consequences

- Logout, role changes, and disabling an account take effect immediately because the affected sessions are deleted server-side.
- No token is readable by JavaScript except the CSRF token, which carries no authority on its own.
- Sessions are shared across application instances through the database, at the cost of a database read per authenticated request.
- Open registration exposes the registration endpoint to abuse. It is mitigated with per-address rate limiting and stable error responses, but it cannot hide whether an email is already registered, because the duplicate-email response must be visible to the person registering.
- Email verification and password reset are **not** part of this decision and are deferred. Until they exist, an account's email is unverified and a forgotten password cannot be recovered without an administrator.
- Rate limiting is in memory per instance. Running several instances requires a shared store first.

## Rejected alternatives

- **Stateless JWT access tokens:** revocation and immediate logout would need a deny-list or short-lived tokens with refresh, and the token would typically be reachable by browser code.
- **External identity provider (OIDC):** adds infrastructure and an external dependency before `v0.1.0` proves value. It remains possible later behind the `identity` module boundary.
- **Provisioned accounts only:** safer for a private product but rejected as the release default so learners can self-serve.

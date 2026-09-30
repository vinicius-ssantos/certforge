# Identity and Access

Issue: #5 — Implement identity, authentication, and role-based authorization. Decision record: [ADR 0008](../adr/0008-session-cookie-authentication.md).

## Roles and permissions

Permissions are the unit of authorization. Roles only group them.

| Permission | Protects |
|---|---|
| `STUDY` | Learner study operations |
| `CONTENT_AUTHOR` | Creating and editing draft questions |
| `CONTENT_REVIEW` | Recording review decisions and approving revisions |
| `CONTENT_PUBLISH` | Publishing, replacing, and deprecating revisions |
| `CATALOG_MANAGE` | Controlled catalog operations |
| `ACCOUNT_MANAGE` | Assigning roles and enabling or disabling accounts |

| Role | Permissions |
|---|---|
| `LEARNER` | `STUDY` |
| `EDITOR` | `CONTENT_AUTHOR` |
| `REVIEWER` | `CONTENT_REVIEW` |
| `ADMINISTRATOR` | `CATALOG_MANAGE`, `CONTENT_AUTHOR`, `CONTENT_REVIEW`, `CONTENT_PUBLISH`, `ACCOUNT_MANAGE` |

Every account has `LEARNER`. Roles may be combined, for example an account can be both `EDITOR` and `REVIEWER`. Other modules protect operations with `@PreAuthorize("hasAuthority('CONTENT_PUBLISH')")` and read the caller with `CurrentActor`; they never check role names.

## Endpoints

| Endpoint | Access |
|---|---|
| `GET /api/auth/csrf` | Public. Issues the `XSRF-TOKEN` cookie and returns the header name and token. |
| `POST /api/auth/register` | Public. Creates a `LEARNER` account. |
| `POST /api/auth/login` | Public. Starts a session. |
| `POST /api/auth/logout` | Authenticated. Destroys the session. |
| `GET /api/auth/me` | Authenticated. Current account, roles, and permissions. |
| `PUT /api/admin/accounts/{id}/roles` | `ACCOUNT_MANAGE`. Replaces the account's roles. |
| `POST /api/admin/accounts/{id}/disable`, `.../enable` | `ACCOUNT_MANAGE`. |
| `GET /actuator/health`, `/actuator/info` | Public. |

Everything else requires authentication. The default is deny, so a new endpoint is protected until it is listed as public.

## Sessions

- Sessions are stored in `certforge.identity_session` and identified by the `CERTFORGE_SESSION` cookie: `HttpOnly`, `SameSite=Lax`, path `/`.
- `Secure` follows the request scheme. Set `SESSION_COOKIE_SECURE=true` when TLS is terminated by a proxy in front of the application.
- Idle timeout is 30 minutes (`spring.session.timeout`). There is no absolute lifetime yet.
- The session id is changed on login to prevent session fixation.
- The session principal name is the account id. Changing an account's roles or disabling it deletes all of its sessions, so the change applies immediately.
- Logout destroys the session server-side; a copied cookie stops working.

## CSRF

State-changing requests must send the `X-XSRF-TOKEN` header with the value of the `XSRF-TOKEN` cookie. A client calls `GET /api/auth/csrf` first. Missing or mismatched tokens return `403` with code `csrf_invalid`. Scripts that do not use browsers must do the same.

## Credentials

- Passwords are hashed with the Spring Security delegating encoder (bcrypt). Plaintext is never stored, logged, or returned.
- Policy: at least 12 characters and at most 72 bytes (bcrypt ignores input beyond 72 bytes); the password must not equal the email. There are deliberately no composition rules. A breached-password blocklist is deferred.
- Emails are compared case-insensitively and stored once per case-insensitive value.

## Abuse protection

- Login failures are counted per email and per client address in a 15 minute sliding window: 5 per email and 50 per address by default. Beyond the limit the response is `429` with `Retry-After`, even for the correct password.
- Registrations are limited to 10 per client address per window.
- Limits are per application instance and in memory. They are lost on restart.
- Because the address is `getRemoteAddr()`, deployments behind a reverse proxy must configure trusted forwarded headers (`server.forward-headers-strategy`) or every client shares the proxy's address.
- Trade-off: a third party can deliberately fail logins for a known email to lock that email out for a window. The per-address limit bounds how far one source can do this.

## Error contract

Identity endpoints return RFC 9457 problem responses with a stable `code`. Bodies never include submitted values.

| Status | `code` | Meaning |
|---|---|---|
| 400 | `validation_failed` | Invalid request; `fields` lists the field names only |
| 400 | `password_too_short`, `password_too_long`, `password_equals_email` | Password policy |
| 401 | `unauthenticated` | No valid session |
| 401 | `invalid_credentials` | Login failed. Identical for an unknown email, a wrong password, and a disabled account |
| 403 | `forbidden` | Authenticated but lacking the permission |
| 403 | `csrf_invalid` | CSRF token missing or wrong |
| 404 | `account_not_found` | Target account does not exist |
| 409 | `email_already_registered` | Registration with an existing email |
| 409 | `own_admin_access` | An administrator tried to remove or disable their own access |
| 429 | `too_many_attempts` | Rate limit reached |

A disabled account is only rejected after the password has been verified, so it cannot be told apart from a wrong password by response or timing.

### Known enumeration trade-off

`email_already_registered` reveals that an email has an account. This is inherent to open registration without email verification, where the person registering must be told. It is mitigated by the registration rate limit. Login, the path attackers use for credential stuffing, does not reveal account existence.

## First administrator

Set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` for the first start. An `ADMINISTRATOR` account is created only if no administrator exists; the password must satisfy the policy. The password is never logged, and both values should be removed from the environment after the first start. There is no default administrator.

## Local development

- `docker compose up -d postgres`, then run the application with the bootstrap variables set to create an administrator.
- Local defaults need no production secrets. Do not reuse the local database credentials anywhere else.
- Over plain HTTP the cookie is not `Secure`, which is expected locally.

## Deferred

Email verification, password reset, multi-factor authentication, social login or SSO, absolute session lifetime, a breached-password blocklist, a shared rate-limit store, and audit events for account changes (see #12).

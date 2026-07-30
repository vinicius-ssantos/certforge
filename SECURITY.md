# Security Policy

## Reporting a vulnerability

Do not disclose vulnerabilities through public issues, discussions, or pull requests. Contact the repository owner privately through the security-reporting channel configured for the project. Include reproduction steps, impact, affected versions, and any safe mitigation you identified.

## Supported versions

The project has not released an application version yet. Security support begins with the first published pre-release. Until then, security findings against repository configuration or documentation are still welcome.

## Security principles

- Collect the minimum personal data required.
- Never store plaintext passwords, access tokens, or secrets.
- Keep administrative and learner capabilities separate.
- Audit publication and modification of certification content.
- Treat all future code submissions as untrusted.
- Keep the future code runner isolated from the application database, secrets, internal network, and host filesystem.
- Apply CPU, memory, process, output, filesystem, and execution-time limits to code execution.

The initial threat model is documented in `docs/architecture/threat-model.md`.

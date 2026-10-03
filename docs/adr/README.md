# Architecture Decision Records

ADRs capture decisions that are structurally important, costly to reverse, or necessary to preserve product integrity.

| ADR | Decision | Status |
|---|---|---|
| [0001](0001-modular-monolith.md) | Start as a modular monolith | Accepted |
| [0002](0002-postgresql-source-of-truth.md) | Use PostgreSQL as the source of truth | Accepted |
| [0003](0003-version-published-questions.md) | Version immutable published questions | Accepted |
| [0004](0004-authorial-content-only.md) | Allow only authorial certification content | Accepted |
| [0005](0005-ai-not-source-of-truth.md) | Do not use AI as the source of correctness | Accepted |
| [0006](0006-isolate-code-execution.md) | Isolate future code execution | Accepted |
| [0007](0007-generalize-preparation-catalog.md) | Generalize the catalog root without generalizing v0.1 behavior | Accepted |
| [0008](0008-session-cookie-authentication.md) | Authenticate with server-side sessions and open registration | Accepted |
| [0009](0009-web-frontend-stack.md) | Build the learner web app as a contract-first React SPA | Accepted |
| [0010](0010-first-deployment-posture.md) | Run v0.1.0 as one instance behind a TLS terminator, with daily off-host backups | Accepted |
| [0011](0011-grade-content-evidence.md) | Grade content evidence, and verify references mechanically | Accepted |
| [0012](0012-interface-language.md) | Translate the interface, keep the question text in English | Accepted |
| [0013](0013-derived-review-queue.md) | Derive the review queue from attempt evidence, and say why each item is in it | **Proposed** |
| [0014](0014-one-topic-one-track.md) | Keep one topic in one track, and put fundamentals in the interview track | **Proposed** |
| [0015](0015-separate-mock-exam-aggregate.md) | Model mock exams as a separate study aggregate | Accepted |

New ADRs should include context, decision, consequences, rejected alternatives, and status. Superseded ADRs remain in history and link to their replacement.

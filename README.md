# CertForge

**English** | [Português (Brasil)](README.pt-BR.md)

> Adaptive and verifiable preparation for Java certifications and technical interviews.

CertForge is an open-source learning platform for software engineers who want deliberate practice, reviewed technical content, explainable progress, and evidence-based preparation.

The first committed product scope remains Java certification preparation, beginning with Oracle Java SE 21 Developer content. The product direction now also includes technical interview preparation, but interview capabilities are explicitly deferred until the Study Core is proven.

## Why CertForge exists

Traditional quiz applications usually measure whether a learner selected the expected option. CertForge is intended to go further by recording the reasoning context around each attempt, identifying recurring weaknesses, scheduling targeted reviews, supporting richer technical questions, and eventually validating Java snippets in an isolated execution environment.

The product is guided by five principles:

1. **Learning value before feature count.** Every release must provide a usable study capability.
2. **Authorial and reviewable content.** Exam dumps, leaked questions, and copied interview banks are not accepted.
3. **Deterministic correctness first.** Compilation, execution, tests, reviewed answers, and explicit evaluation criteria take precedence over AI-generated judgment.
4. **Progress must be explainable.** Readiness indicators must be derived from visible evidence.
5. **Security is architectural.** Future code execution will be isolated from the main application and its data.

## Release strategy

| Release | Name | User outcome |
|---|---|---|
| `v0.1.0` | Study Core | Study curated questions and track progress by topic |
| `v0.2.0` | Adaptive Review | Revisit mistakes through a confidence-aware review queue |
| `v0.3.0` | Mock Exams | Complete timed simulations and receive weakness reports |
| `v0.4.0` | Code Analysis | Practice compilation, runtime, and output reasoning questions |
| `v0.5.0` | Secure Java Runner | Compile and execute snippets in an isolated service |
| `v0.6.0` | Study Planner | Receive evidence-based study plans and readiness forecasts |
| `v0.7.0` | AI Study Assistant | Use AI for supplementary explanations and practice generation |

Only `v0.1.0` is committed scope. Later releases express product direction and may change as evidence is collected.

Interview Prep is a parallel future product direction, not part of `v0.1.0` and not automatically assigned to one of the numbered releases above. Its design must reuse proven study primitives without weakening certification-specific correctness or scope discipline.

## Initial architecture direction

CertForge starts as a modular monolith with clear domain boundaries:

- identity and access;
- preparation catalog;
- question bank;
- study sessions;
- attempts and progress;
- administration and editorial workflow.

The first catalog profile is Java certification. Future interview tracks may reuse the same topic and study foundations while retaining interview-specific evaluation rules.

The initial source of truth will be PostgreSQL. A future Java runner will be deployed as a separate, restricted service and will not receive direct database credentials.

## Documentation

- Also available in [Brazilian Portuguese](docs-pt-br/README.md)
- [Product vision](docs/product/vision.md)
- [Scope and non-goals](docs/product/scope-and-non-goals.md)
- [Content policy](docs/product/content-policy.md)
- [Interview Prep direction](docs/product/interview-prep.md)
- [Release roadmap](docs/roadmap/releases.md)
- [`v0.1.0` Study Core](docs/roadmap/v0.1-study-core.md)
- [Architecture overview](docs/architecture/overview.md)
- [Initial domain model](docs/architecture/domain-model.md)
- [Identity and access](docs/architecture/identity-and-access.md)
- [Preparation catalog](docs/architecture/preparation-catalog.md)
- [Question bank](docs/architecture/question-bank.md)
- [Security and threat model](docs/architecture/threat-model.md)
- [Architecture decisions](docs/adr/README.md)

## Project status

**Foundation phase — documentation only.**

No application code should be introduced until the `v0.1.0` scope, domain language, editorial policy, and initial architecture decisions are reviewed and accepted.

## Contributing

The project is being established incrementally. See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes. Published learning content must follow the authorial-content and technical-review rules defined in the content policy.

## Security

Do not report security vulnerabilities through public issues. Follow [SECURITY.md](SECURITY.md).

## License

Licensed under the Apache License 2.0.
# DevOps editorial pack — integration readiness (2026-10-12)

## Current audited state

- **70 source questions:** 15 Docker and 55 Kubernetes.
- **70 exact-source approvals** stored in `content/infrastructure-devops-foundations/review.json`, each tied to a Git blob SHA and answer key. This is **human editorial acceptance**, not an approval registered in the backend API.
- `content/infrastructure-devops-foundations/pack.json` is still `editorialStatus: DRAFT`.
- At head `5eff504efb948e6ef3839a887b628515cb1a3b4f`, PR #206 has 8/8 successful GitHub checks, including Java 25, web, Playwright, secret scan, CodeQL, and release/Trivy. Checks must be re-evaluated at each subsequent integration commit.
- **No publication or merge is authorized by editorial sign-offs.** Preserve the separate API reviewer and publication gates.

## Stacked branch graph

| Step | Branch | PR | Base | Draft scope |
| --- | --- | --- | --- | --- |
| 1 | `feat/infra-draft-editorial-pipeline` | #181 | `main` | First 25 source questions; original import/review gates |
| 2 | `feat/devops-docker-expansion-15` | not confirmed open | #181 head branch | Docker Q26–Q30 |
| 3 | `feat/k8s-operations-expansion-23` | #202 | Docker expansion branch | K8s Q31–Q38 |
| 4 | `feat/k8s-advanced-expansion-31` | #203 | #202 head branch | K8s Q39–Q46 |
| 5 | `feat/k8s-troubleshooting-expansion-39` | #204 | #203 head branch | K8s Q47–Q54 |
| 6 | `feat/k8s-production-expansion-47` | #205 | #204 head branch | K8s Q55–Q62 |
| 7 | `feat/k8s-reliability-expansion-55` | #206 | #205 head branch | K8s Q63–Q70, plus technical CI corrections |

The PRs must not be merged out of order; a successful check on #206 does not retroactively turn the historical checks of #202–#205 green. A reviewer should confirm and, where needed, reconcile the missing Docker-expansion PR before any merge authorization.

## Changes and corrections on the tip branch

- Test fixtures count 70 staged and 70 accepted source questions; mutation of an approved prompt reduces valid acceptances to 69.
- `MigrationUpgradeIT` enumerates migrations present in the branch rather than assuming every integer version exists; validate the V18/V19 migration interaction against current `main` when rebasing or merging.
- Gitleaks narrow allowlist covers a single Java test-output false positive from historical documentation; the full-history scan passes without disabling general rules.
- Backend runtime image uses Eclipse Temurin 25 on Ubuntu Noble rather than the vulnerable `pebble` binary present in the earlier image. The release image scan passes on the tip commit.

## Pre-integration gates (do not bypass)

1. Obtain explicit authorization before **any** merge, publication or API approval.
2. Confirm that the Docker expansion is represented by an appropriately based, reviewable PR.
3. Confirm all 70 `question.json` blobs still match `review.json` and no answer key changed. Never transfer approval to edited content automatically.
4. Reconcile `main` drift, especially schema migrations and version numbers, without manufacturing an empty migration merely to satisfy tests.
5. Run Java, web, content-integrity, Playwright, CodeQL, Gitleaks and release/Trivy checks on the exact integration candidate commit.
6. Maintain `DRAFT` status until backend editorial review and authorized publication happen through their own workflow.
7. Record final PR ancestry and review results; perform merge only with human authorization.

## Known sequencing issue

PRs #202–#205 were checked against earlier stacked heads and showed historical failures. Later fixes exist on the tip branch #206, so those intermediate commits must not be considered individually green. Prefer explicit forward-porting or rebuilding an integration candidate branch and revalidating it, not turning off security checks and not mass-editing approved questions.

## Why
The java-backend-interview OCP question iv151-ocp-refactor-strategy-pattern
incorrectly asserts that Spring automatically creates an enum-keyed map of
strategy beans. Automatic map collection injection requires String bean-name
keys, so the marked-correct alternative was not implementable as written (#427).

## What Changes
- Retain the OCP choice and existing answer key while implementing valid
  Spring collection injection followed by explicit enum-keyed registration.
- Cite the exact Spring Framework @Autowired documentation.
- Record a fresh disclosed AI review tied to the revised V2 content digest.
- Test the question's wiring claim, reference and digest integrity.

## Impact
One interview question, one targeted AI review entry, regression test and
specification. Pack-level DRAFT status is not changed. No local database import,
publication, deployment, or broad human-review claim.

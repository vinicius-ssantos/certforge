## Independent per-question checks

| Question | Correct | Primary evidence | Distinct verification |
| --- | --- | --- | --- |
| `iv150-class-vs-object` | C | Oracle Java Tutorials: class / object creation | The corrected standalone `Counter` program compiled with Java 21 (`javac --release 21`) and printed `2 1`; fields are instance-local, not static |
| `iv150-overriding-vs-overloading` | A | Oracle Java Tutorials: methods and overriding | The corrected standalone `OverloadDemo` compiled with Java 21 and printed `Special: hello`; selection of `print(Object)` is static while override dispatch is dynamic |
| `iv150-composition-over-inheritance` | A | Oracle Java SE 21 `List` and `ListIterator` API, official wrapper and inheritance tutorials | Composition can control insertion; must intercept or restrict all supported mutation entry points, including list iterator and mutable subList views. Simple overrides of inherited `add` and `addAll` cannot guarantee that behavior |
| `iv155-junit5-lifecycle` | C | Versioned JUnit 5.14.3 Test Instance Lifecycle guide | Standard default is PER_METHOD, unless globally overridden. The merged prompt now explicitly excludes a global override |
| `iv155-test-pyramid-tradeoffs` | A | Martin Fowler, Test Pyramid / Practical Test Pyramid | Many smaller/faster low-level tests, fewer expensive E2E tests, not fixed per-layer quotas |
| `iv157-value-object-vs-entity` | A | Martin Fowler, Value Object | Money is compared by amount+currency with no tracked identity; immutable value semantics distinguish it from entity/aggregate root/service |

Each question's original options and explanations were inspected, including the incorrect alternatives. Each has exactly one defensible `correct:true` option and a relevant primary source. V2 digests were computed using the serialization in `manifest-pack.mjs::reviewDigestV2`; the SHA-256 implementation was verified against the standard `abc` test vector and an existing digest-matched HashMap question.

## Governance

No `CHANGES_REQUESTED` entry is hidden or silently overwritten. Use an explicitly named AI reviewer, not owner/human attribution. Leave `pack.json` `editorialStatus: DRAFT` and preserve all unrelated recorded decisions. Do not treat this as permission to auto-approve the remaining 182 questions.

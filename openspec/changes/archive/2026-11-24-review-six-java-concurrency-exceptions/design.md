## Per-question technical evidence

| Question | Key | Evidence | Review reasoning |
| --- | --- | --- | --- |
| `iv150-polymorphism-dynamic-dispatch` | B | Oracle Java polymorphism tutorial; JDK 21 `javac --release 21` and `java PolymorphismDemo` output `Woof` | Non-static overrides dispatch on the concrete runtime type Dog, not declared reference type Animal |
| `iv155-test-isolation-shared-fixtures` | C | Fixed official JUnit 5.14.3 Test Instance Lifecycle and Test Execution Order pages | Explicit `@TestInstance(PER_CLASS)` shares mutable instance fields; independent `@BeforeEach` fixture initialization prevents order-dependent test pollution; no source-order guarantee |
| `iv286-volatile-visibility-not-atomicity` | B | Oracle JLS SE 21 §17.4 and repaired PR #443 prompt | Volatile visibility/happens-before does not make `counter++` atomic; lost updates may occur but 1000 is also possible, so the repair removes the previous overclaim |
| `iv286-try-with-resources-suppressed-exception` | D | Oracle Java Tutorials on suppressed exceptions; actual JDK 21 test using two separate IOExceptions | The body exception A propagates and the close exception B is attached via `A.getSuppressed()`; not a synthetic multi-exception |
| `iv286-stream-single-use-pipeline` | D | Oracle Java SE 21 java.util.stream package docs; actual JDK 21 stream `count()` then `forEach()` test | A terminal operation consumes the pipeline; attempting to reuse it raises IllegalStateException, not replays, resumes or silently skips |
| `iv286-checked-vs-unchecked-recoverability` | C | Oracle Java Tutorials, Unchecked Exceptions — The Controversy | In the stated scenario callers cannot reasonably recover from JDBC connectivity failure; wrapping as an unchecked repository-boundary exception follows the documented client-recoverability guideline |

Each prompt, all four answer texts, wrong-option explanations, rationale, and the cited original source were reviewed individually. Each has exactly one correct key. For JUnit the two exact official versioned URLs were opened and verified against PER_CLASS semantics. The SHA-256 V2 digest serialization is the one implemented in `content/manifest-pack.mjs::reviewDigestV2`; the independent implementation matched the standard `abc` vector and an existing `review.json` entry.

## Governance

Never assume that a human owner signed off on these AI-attributed decisions. Preserve all previously recorded reviews. Neither `pack.json` nor any question text changes in the review PR. Do not automatically approve unrelated questions. Keep the pack DRAFT while 176 remain unreviewed after this batch.

## Why

During the source-by-source AI review for issue #392, three unreviewed Java interview questions were found to contain technical presentation defects. An unsynchronized volatile increment can lose updates but does not **guarantee** any loss; a dynamic-dispatch example contained Java statements outside any method while asking what the code prints.

## What Changes

- Qualify the volatile counter outcome as potentially below 1000 (or exactly 1000), preserving answer B: volatile provides visibility and does not make compound increments atomic.
- Wrap the Animal/Dog polymorphism example in a complete, runnable Java 21 `PolymorphismDemo` with a `main` method, preserving answer B, output `Woof`.
- Clarify that the JUnit test-isolation question deliberately uses `@TestInstance(Lifecycle.PER_CLASS)`, making mutable instance state shared across test methods; pin its two official references to JUnit 5.14.3, preserving answer C.
- Leave all unrelated questions and `review.json` untouched. No `AI_APPROVED` verdict is recorded prior to the corrected source being independently reviewed.

## Impact

Two question files and OpenSpec records only. The pack remains DRAFT with no deployment, publishing or human-approval assertion.

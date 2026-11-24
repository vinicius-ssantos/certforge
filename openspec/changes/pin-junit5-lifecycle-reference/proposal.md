## Why

The Java backend interview question `iv155-junit5-lifecycle` refers to a JUnit 5 guide using a `current` URL that now points to JUnit 6. The unqualified prompt also ignores that the default test instance lifecycle can be overridden by a global JUnit Jupiter configuration property. Issue #392 requires exact reference-backed technical verification before content review approval.

## What Changes

Pin the reference to the versioned official JUnit 5.14.3 Test Instance Lifecycle guide and explicitly state that the scenario assumes no global lifecycle override. Preserve the correct answer C and the original reasoning for the standard PER_METHOD mode.

## Impact

Edit one previously unreviewed question and add its scoped OpenSpec change. No `AI_APPROVED` entry, no pack publishing; `editorialStatus` remains `DRAFT`, and there is no deploy.

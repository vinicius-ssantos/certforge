## Why

Issue #392 identified that `iv150-aggregation-vs-composition` classifies UML-like composition using Java `new`, `private` and `final` without a sufficiently explicit modeling contract. Its original Java object-creation references did not substantiate UML ownership and lifecycle semantics.

## What changes

Clarify exclusive ownership and lifecycle-dependence as **scenario assumptions** rather than treating Java field/constructor syntax as a proof of composition. Explain that an independently owned Driver is ordinary association (or shared aggregation only if modeled as a whole–part relationship), preserve correct answer B, and cite IBM's UML 2 association/aggregation/composition guide as primary evidence.

## Impact

One question-source correction and OpenSpec delta only. No review verdict, `review.json` edit, change to pack `DRAFT`, publication or deploy. A separate exact-source V2 PR may follow once the source fix is merged and independently reviewed.

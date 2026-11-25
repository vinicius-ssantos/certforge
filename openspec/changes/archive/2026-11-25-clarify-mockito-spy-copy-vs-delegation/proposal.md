## Why

Individual interview question review for issue #392 identified an unreviewed test-double question `iv155-mock-stub-fake-spy` with technically incorrect claims that a Mockito spy *wraps an object and delegates its real calls to that original instance*. Official Mockito 5.24.0 Javadoc explicitly explains a regular `spy(Object)` **does not delegate** to the passed original; Mockito copies its state and unstubbed real methods execute on the spy. Martin Fowler also distinguishes classic test spies, stubs, fakes and mocks more generally. Accurate terminology is mandatory before a V2 AI review.

## Change

- Correct option **D** (preserving the correct key) to identify spy as a test double that records calls while permitting real method behavior, without promising delegation to the original object.
- Clarify option D's explanation and overall rationale with the concrete Mockito state-copy behavior and real methods acting on the spy.
- Pin the Mockito source to versioned **5.24.0** Javadoc and retain the original Martin Fowler source; preserve wrong option texts A/B/C while correcting their potentially misleading rationales about test-double roles and spies.

## Scope and exclusions

Only the previously unreviewed question `iv155-mock-stub-fake-spy/question.json` and this OpenSpec change. No review.json verdict, no pack status change, no human sign-off, no publication or deploy. After a source correction PR merges and the new V2 digest is independently validated, a **separate** editorial PR may approve the corrected question. Editorial issue #392 remains OPEN and UX acceptance issue #428 remains separately OPEN.

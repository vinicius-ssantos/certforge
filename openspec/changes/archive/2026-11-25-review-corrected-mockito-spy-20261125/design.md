## Independent post-correction source verification

- Exact question: `iv155-mock-stub-fake-spy`, correct key **D**, after source-only PR #472.
- Exact corrected `main` Git blob: `a3493cecaaec0d193420d70e717fa667d3c94ee2`.
- Source PR merge commit: `606071c2bc9f2e96de5b7abf00ef4c5baee9663b`.
- Author-origin taxonomy source: Martin Fowler, *Mocks Aren't Stubs*, https://martinfowler.com/articles/mocksArentStubs.html — borrowing Meszaros's terminology, a classic test spy is a recording stub, *not necessarily* real-method execution.
- First-party framework source: Mockito **5.24.0** `Mockito.spy(Object)` Javadoc, https://javadoc.io/static/org.mockito/mockito-core/5.24.0/org.mockito/org/mockito/Mockito.html — copying the supplied state, executing unstubbed real methods on the spy and not delegating to the original object.

### Source question, options and justifications rechecked

The **prompt** now explicitly asks about `Mockito.spy(existingObject)` *rather than* the classic Meszaros/Fowler recording stub. Distractor **A** wrongly equates stubs and mocks; **B** wrongly defines a fake as chained Mockito verification and a spy as external fixture replay; **C** wrongly claims all spy methods must be stubbed and no real behavior is possible. Option **D** alone combines canned stub answers, mock interaction verification, functional fake behavior, and concrete Mockito.spy copied-state real-method semantics. The full rationale and four option explanations consistently distinguish classic test-spy taxonomy from Mockito's specific API.

### Exact V2 digest evidence

The canonical ordered tuple from `content/manifest-pack.mjs::reviewDigestV2` was hashed with SHA-256 using UTF-8 JSON serialization. Hash implementation was verified against `SHA-256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` and the already approved `iv155-when-mocking-hurts` digest before calculating this specific corrected `main` question.

`iv155-mock-stub-fake-spy` → `sha256:7feccdd2c805c75cf5bbdfb31353cd3544b883e1b5760239f16a97f52077cf2d`.

Exactly 54 earlier review decisions preserved unchanged; the pack remains DRAFT and no human sign-off is claimed.

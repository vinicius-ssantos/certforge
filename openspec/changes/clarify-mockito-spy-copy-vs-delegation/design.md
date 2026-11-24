## Original source defect

The earlier correct choice D described a spy as *wrapping a real object and delegating to it*, and its explanation repeated the same inaccurate forwarding claim. Mockito 5.24.0 `Mockito.spy(Object)` Javadoc states plainly that Mockito **does not delegate calls to the supplied real instance**: it creates a **copy** of the object. When an unstubbed real method executes on the spy, state effects occur on the spy, not the original passed object. The behavior can matter for test correctness and assertions.

### Source correction

The corrected D key remains valid in its broader test-double terminology:
- A **stub** returns predetermined responses.
- A **mock** permits interaction verification.
- A **fake** offers a functional but simplified implementation.
- A **spy** observes interactions and can retain real-method behavior; specifically a Mockito spy operates against its copied state.

The wrong choices still falsely conflate terminology, deny fake behavior or pretend spies must have all methods stubbed. The overall explanation now differentiates classic spy vocabulary from Mockito's concrete implementation. The test-double description is backed by Martin Fowler's *Mocks Aren't Stubs* and pinned Mockito 5.24.0 API at `https://javadoc.io/static/org.mockito/mockito-core/5.24.0/org.mockito/org/mockito/Mockito.html`.

### Review isolation

No `review.json` entry is created in this source repair PR. Preserve correct key **D** and require a new post-merge exact SHA-256 V2 digest and independently verified AI review in a later PR. Issue #392 stays OPEN, pack DRAFT, UX issue #428 remains outside scope; no human sign-off, deploy or publication.

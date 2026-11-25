## Independent technical verification of post-correction sources

| Question | Answer | Exact merged source Git blob | First-party / author-origin basis |
| --- | --- | --- | --- |
| `iv286-completablefuture-async-thread` | **D** | `81a38e97a3073f4e9610b770b9808a2e0025937d` | Java SE 21 `CompletableFuture` official Javadoc: dependent actions of non-async methods may run in the completing thread **or another caller of a completion method**. `thenApplyAsync(fn, executorB)` schedules the dependent function using `executorB`, without promising a specific worker-thread identity. |
| `iv155-mock-stub-fake-spy` | **D** | `e3a1a409936580999df0bea58f6f73b3071e6494` | Official Mockito **5.24.0** `Mockito.spy(Object)` Javadoc states it copies the provided object's state instead of delegating calls to the original. Martin Fowler's original *Mocks Aren't Stubs* distinguishes role-based stubs (predefined responses), mocks (interaction verification), fakes (functional simplified implementation), and spies (observation with real behavior). |

### Complete answer-option review

- **CompletableFuture**: A is wrong because an explicit executor changes async execution; B wrongly guarantees the original caller's thread; C reverses the meaning of `thenApplyAsync`. D is uniquely supported by Oracle's Javadoc and does not guarantee one non-async thread. Main rationale and all four option explanations were read after #457.
- **Mockito**: A wrongly collapses mock and stub roles; B wrongly says fakes have no real logic and equates spy to fixture replay; C wrongly claims all spy methods require stubbing; D correctly distinguishes the test doubles while explicitly avoiding the false delegation-to-original claim. The full corrected explanation and A/B/C/D rationales were read after #458.

### Exact V2 SHA-256 source digests

Use the canonical ordered review tuple in `content/manifest-pack.mjs::reviewDigestV2` with UTF-8 JSON serialization; check the standard `sha256("abc")` vector and an existing recorded `iv155-when-mocking-hurts` V2 digest before these independent calculations.

| ID | Digest |
| --- | --- |
| `iv286-completablefuture-async-thread` | `sha256:d58aa0f4430128f4c26b1085acc85c90e8368f258a843d234d2f3f9f568066ad` |
| `iv155-mock-stub-fake-spy` | `sha256:233078dfe71b8b3eaaa327fb71117046340d3eac5e7aecc48b4f15bccba4698b` |

Both question source Git blobs on `main` match their corrected PR branches; no review verdicts existed before this change. The 53 older review objects remain unmodified. This is AI-review fast lane under ADR 0026, not owner approval or WCAG acceptance.

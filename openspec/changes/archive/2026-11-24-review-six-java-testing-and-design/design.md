## Six independent technical checks

| Exact question ID | Key | Source and verification |
| --- | --- | --- |
| `iv154-stack-lifo-use-case` | **D** | Java SE 21 `Deque` API explicitly supports LIFO stack semantics; for nested bracket matching the most recently opened bracket must close first. FIFO queue, set membership, and BST sorting do not preserve the necessary stack order. |
| `iv155-flaky-vs-deterministic` | **B** | Martin Fowler's original `Eradicating Non-Determinism in Tests` identifies clocks, concurrency, unseeded randomness, I/O and uncontrolled environment timing as non-deterministic test inputs. JUnit does not randomize assertion order inside a single method; mocks alone do not eliminate real scheduling/time. |
| `iv286-completablefuture-exception-propagation` | **C** | Oracle Java SE 21 `CompletionStage` and `CompletableFuture` APIs describe propagating exceptional completion through dependent `then*` stages. An OpenJDK 21 `javac --release 21` smoke test of an exceptionally completed upstream produced `completionException=IllegalArgumentException`, `thenApplyCalls=0`, `thenAcceptCalls=0`. `thenApply` and `thenAccept` do not run on a null substitute, hang, or independently execute. |
| `iv152-similar-but-different-rules` | **B** | Sandi Metz's original `The Wrong Abstraction` and the DRY notion of knowledge duplication distinguish two independently owned policies coincidentally sharing numeric thresholds from one duplicated decision. Merging marketing and fulfillment eligibility would improperly couple future changes; all merge/delete/rename alternatives fail the stated independent ownership. |
| `iv288-request-scope-proxy-mode` | **A** | Spring Framework `Bean Scopes` and `@Scope` Javadoc explain request-scoped objects and injection through scoped proxies. With a default eagerly created singleton, injecting an actual request-scoped dependency at context startup without an active HTTP request fails resolution unless an appropriate scoped proxy/provider is used. The container does not silently widen scope or inject null. |
| `iv155-when-mocking-hurts` | **D** | Martin Fowler's `Mocks Aren't Stubs` contrasts state/outcome verification and interaction verification; exact internal call order assertions can fail after observable behavior remains correct. The described refactor changes only call sequencing, so D correctly diagnoses an over-specified implementation-coupled test. Alternatives over-generalize mocking, elevate internal assertions categorically, or invent Mockito nondeterminism. |

Every entire question, including distractor-specific explanations and overall rationale, was read independently. Java SE21 `Deque`, `CompletableFuture` and Spring scoped-bean documentation were cross-checked against first-party sources. Fowler and Sandi Metz's original explanatory materials are author-origin sources. Sources are in each `question.json`.

### Current source-digest evidence

Exact `content/manifest-pack.mjs::reviewDigestV2` ordered JSON tuple hashed with SHA-256, verified against standard SHA-256 `abc` vector and an already recorded `iv150-class-vs-object` V2 review digest:

| Question | V2 digest |
| --- | --- |
| `iv154-stack-lifo-use-case` | `sha256:f3fc51e0069d7b80c0005aa1e4a228b5f8772c49b92c6a1c5e667f25033bfe62` |
| `iv155-flaky-vs-deterministic` | `sha256:6f6e93ad41e5368a34e277ef046b340d549f542ac58ded45711b250f4a6b4487` |
| `iv286-completablefuture-exception-propagation` | `sha256:d31291e64a2e526cf9fc103451c0032efd70c77033eb8a9c70c2378792d0f4b6` |
| `iv152-similar-but-different-rules` | `sha256:4921721edb7acbbc833288e7fd4bfba44974e1d37c10e32641adad934839496a` |
| `iv288-request-scope-proxy-mode` | `sha256:b0da244665cdf4fc1c97d6c78a7e3b2806c80df8cadbcef67d6e399f4fb6e178` |
| `iv155-when-mocking-hurts` | `sha256:039682efaedcc44b21d58b58f85f9194928ca3732c4809edc42a6d78d776f732` |

No question source text was changed in this PR; all 47 prior review objects are preserved. No premature source-approval for the two excluded technically ambiguous questions (explicit issue #392 findings and pending source corrections). All new records disclose AI reviewer identity and leave pack DRAFT, no deploy or human acceptance.

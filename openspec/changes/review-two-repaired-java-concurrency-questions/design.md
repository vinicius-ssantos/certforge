## Independently verified source decisions

### `iv286-mutable-key-breaks-hashmap-lookup` — C

The revised scenario expressly states a key mutated from an original hash-derived bucket to a different bucket index, with no resize. HashMap retrieval by the mutated reference computes the new hash and searches the new bucket, leaving the original entry present but inaccessible by that lookup. Correct option C describes that exact mechanism. Wrong answers A, B and D are not defensible: HashMap does not silently evict ordinary entries, both `equals` and `hashCode` were overridden, and not *every* mutation of any key field changes hash/equality semantics. The explanatory rationale now acknowledges that even different hashes selecting the same bucket may prevent retrieval due to stored hash mismatch, and cites official `Map`, `HashMap` and `Object.hashCode` Java SE 21 Javadocs. `Map` warns that behavior of a map is unspecified when a stored mutable key is changed in a way affecting equality.

Java 21 smoke test on OpenJDK **21.0.12.1** (`javac --release 21`): mutable key's hash changes 1 → 2 in a default `HashMap`; output `before=entry`, `after=null`, `size=1`. This deterministic example confirms the scoped failure, not the invalid claim that arbitrary key mutations always fail.

V2 digest: `sha256:9e85edd8ae6459940d0e77c616a9aa7be3cb17531eed173fcdb73e32a4fe5d5c`.

### `iv286-double-checked-locking-without-volatile` — C

The revised scenario gives `Helper` a normal **non-final** `int state` assigned **42** in its constructor, with no other safe-publication mechanism. The plain `helper` reference is tested outside the synchronized block. An observer taking that path may see a non-null reference while seeing the field's default **0** because the constructor's writes are not safely published to it. This outcome is *permitted*, not mandatory. The original issue conflated this with JLS §17.5's special final-field guarantees; explicitly defining a non-final field removes that ambiguity. Option C correctly states the possible visibility failure, while A erroneously extends monitor protection outside the lock, B wrongly claims duplicate allocation through a protected inner check, and D invents an IllegalMonitorStateException.

Primary sources: Oracle JLS SE 21 §17.4 and §17.5; University of Maryland hosted JSR-133 expert-group "Double-Checked Locking is Broken" declaration, including its correction using `volatile` on JDK 5+. The Java 21 `Helper` example compiled; sequential execution showed `dclNormalPath=42`, **not** a race test, so we do not misrepresent a nondeterministic concurrency defect as reproducible on every run.

V2 digest: `sha256:845d943af4c44a200b95c5b737391c1e71b5da7766a2cb708997c64beaf34f16`.

### Review integrity boundary

Both digests were independently computed using `manifest-pack.mjs::reviewDigestV2`'s exact ordered JSON tuple after PR #448 was merged on main, verified against the standard SHA-256 `abc` test vector and one already recorded current V2 review digest. The correct keys are exactly **C, C**. All 38 earlier entries remain unchanged. Both verdicts explicitly name `ai-reviewer`, not the owner. The interview pack remains DRAFT, issue #392 OPEN, and no deployment or publication occurs.

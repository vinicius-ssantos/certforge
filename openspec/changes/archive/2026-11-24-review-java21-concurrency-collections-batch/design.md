## Independent question evidence (Java 21)

| Question ID | Key | Primary source and verification |
| --- | --- | --- |
| `iv286-reentrantlock-vs-synchronized` | B | Oracle Java SE 21 `ReentrantLock` API: `tryLock(long, TimeUnit)` permits timed acquisition; `lockInterruptibly()` permits interruption; `isLocked()` is a monitoring query. Intrinsic monitors are reentrant but do not expose those APIs. The alternatives falsely deny reentrancy, mutual exclusion or memory visibility of `synchronized`. |
| `iv286-synchronized-happens-before` | A | JLS SE 21 §17.4.5 states that an unlock on a monitor happens-before every subsequent lock on the same monitor. The required shared-field visibility does not depend on `volatile`, CPU affinity or only final-field rules. |
| `iv286-system-gc-no-guarantee` | B | Oracle Java SE 21 `System.gc()` Javadoc explicitly makes garbage collection a nonbinding suggestion; timing, amount of reclamation, and whether any collection completes are not guaranteed. Finalizers are deprecated for removal; `System.gc()` cannot guarantee timely file-handle release. |
| `iv286-stream-laziness-short-circuit-infinite` | A | Oracle Java SE 21 `java.util.stream` documentation: `filter` is a lazy intermediate operation and `findFirst` is short-circuiting. Compiled the exact expression with OpenJDK 21 (`javac --release 21`), which produced `first=1024` for `Stream.iterate(1, x -> x * 2).filter(x -> x > 1000).findFirst()`. |
| `iv286-deadlock-inconsistent-lock-order` | B | Oracle Java Tutorials' Deadlock example demonstrates mutual waiting on monitors; acquiring two account locks in a consistent global order removes circular wait. Reentrant monitors and JVM lock optimizations do not prevent opposite-order deadlocks. |
| `iv154-heap-priority-queue` | D | Oracle Java SE 21 `PriorityQueue` API expressly documents O(log n) `offer` and `poll` for its heap implementation. A fully sorted array requires shifting O(n) elements for insertions. `PriorityQueue`'s comparator can select the maximum priority as the head; heaps maintain partial, not total, order. Codex P2 caught the previous B distractor rationale falsely denying O(log n) sorted extraction; corrected explanation distinguishes partial heap order from fully sorted backing array while acknowledging O(log n) per head extraction. |

Each exact question prompt, four answer alternatives, four alternative-specific explanations and overall rationale was read independently. Sources above are first-party Oracle/JLS or Oracle tutorials (the heap question also provides Wikipedia as supplemental context, but the complexity claim was verified against the Oracle Javadoc). All six have exactly one defensible correct answer and no pre-existing `review.json` entry.

### Integrity

The exact `manifest-pack.mjs::reviewDigestV2` ordered tuple was used to compute each SHA-256 digest. The implementation matched the `sha256("abc")` test vector and an already recorded `iv150-class-vs-object` digest, before producing the six new records. After the Codex P2 correction of `iv154-heap-priority-queue`, its source-bound V2 digest was recomputed as `sha256:d836025a3425c1325fc7b415c78a13d7ea8279de21d3e81a737915894e000e57`, and the review entry was updated after verifying option D and the corrected B rationale against the Java SE 21 PriorityQueue API. Preserve all 32 existing entries unchanged. This is AI reviewer technical verification, not human acceptance, editorial publication or deploy.

### Intentionally excluded until source repairs

- `iv286-mutable-key-breaks-hashmap-lookup`: mutate a key but do not establish that the new hash maps to a different bucket.
- `iv286-double-checked-locking-without-volatile`: scope Helper to non-final mutable state initialized during construction to disambiguate final-field safe publication.

These are discussed on issue #392. Neither receives a review here.

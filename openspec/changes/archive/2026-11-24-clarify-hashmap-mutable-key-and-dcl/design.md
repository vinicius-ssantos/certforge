## Source-based technical corrections

### Mutable HashMap keys

Java SE 21 `Map` explicitly warns that changing a stored key in a way affecting equality leaves behavior unspecified. `HashMap` uses hash-selected buckets and compares hash/equality on retrieval. The earlier question stated a hash-dependent field was mutated but did not guarantee the mutation changed the bucket; collisions can lead to alternative observations. The revised scenario explicitly fixes a changed bucket index and an unchanged table capacity, making key C's wrong-bucket explanation unambiguous. It also clarifies that a change preserving the bucket **index** can still prevent lookup if the hash differs; only changes not affecting equality/hash behavior necessarily avoid that specific hazard.

Smoke test on OpenJDK 21 (`javac --release 21`) with a mutable key whose hash changes from 1 to 2: `before=entry`, `after=null`, `size=1`. The key object remains physically stored; retrieval via its mutated reference no longer reaches the entry. The `Map`, `Object.hashCode`, and `HashMap` Java SE 21 Javadocs are primary references.

### Broken double-checked locking

The JSR-133 expert group's broken double-checked locking declaration and JLS SE 21 §17.4 explain why the outer read of a plain `helper` reference may see a non-null object without a happens-before edge from initialization writes. However, JLS §17.5 includes special construction guarantees for properly initialized `final` fields, so leaving Helper's state unspecified risks confusing the desired example. The repaired question specifies an ordinary non-final `int state`, assigned 42 inside Helper's constructor, and asks about another thread observing 0 via the unsynchronized fast path. The revised answer C and explanation describe a **visibility/safe-publication** risk, not a guarantee that the constructor is still actively running. `volatile` publication fixes the pattern on modern Java.

### Review boundary

Both keys remain C. Neither changed source receives a new V2 `AI_APPROVED` digest in this repair PR. Independently verify new exact source after merge, then add properly attributed decisions in a separate editorial PR. Keep issue #392 OPEN and the pack DRAFT.

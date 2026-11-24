## Correctness rationale

### Volatile counter — non-atomic read-modify-write

The prior prompt claimed a result less than 1000 was **reliable**, which is false. Under JLS §17.4, volatile establishes visibility/happens-before relationships for accesses but does not make `counter++` atomic. Scheduling can allow all ten threads to perform their 100 increments without lost updates (final value 1000), while overlapping reads and writes can lose increments (final below 1000). The corrected prompt explicitly permits both cases while testing the same distinction; the correct answer remains B.

### Dynamic method dispatch — executable Java sample

Previously the statement `Animal a = new Dog(); System.out.println(a.sound());` appeared outside a method or initializer after class definitions. This is not a compilable Java compilation unit. Wrap in `public class PolymorphismDemo` with `public static void main(String[] args)`, compile with OpenJDK 21 `javac --release 21`, and verify output `Woof`. The Oracle Java polymorphism tutorial confirms that `Dog.sound()` overrides the method and is selected by dynamic dispatch at runtime, regardless of the reference's declared `Animal` type. The answer remains B.

### Editorial boundary

Neither question receives a verdict or review digest in this correction PR. Compute exact V2 digests only after the corrected source is merged and separately checked; keep the interview pack in DRAFT.

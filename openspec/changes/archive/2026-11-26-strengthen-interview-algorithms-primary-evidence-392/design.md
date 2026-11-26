## Evidence-first, source-only repair

Compare each original question to the academic or official source for the asserted data structure behavior; replace only the `references` array if the source addresses the underlying claim. Sources include Sedgewick & Wayne *Algorithms, 4th Edition*, Cornell University CS 2110 graph representations, and Oracle Java SE 21 `LinkedHashMap` Javadoc. An abstract hash map's adversarial worst case does not claim Java 21 HashMap always has linear collisions under all implementations. `LinkedHashMap` is used to illustrate the ordinary hash-table and doubly-linked-list LRU design; the question asks about the generic structure rather than a specific library implementation.

Each final question review remains an *individual* source-bound V2 decision, not a mass approval; editorial evidence, digest and reviewer must be recorded in a separate PR after merge. No pack publication, deploy, or human-accessibility gate changes.

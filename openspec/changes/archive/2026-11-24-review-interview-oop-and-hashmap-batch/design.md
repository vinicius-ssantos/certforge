## Per-question technical verification

1. `iv286-hashmap-no-ordering-guarantee` — A: Oracle Java SE 21 HashMap explicitly does not guarantee insertion order. LinkedHashMap documents the contrasting insertion-order traversal. B, C and D rely on false insertion-order claims.
2. `iv150-encapsulation-rationale` — B: a public mutable field allows callers to bypass invariants; private state with validating operations centralizes the invariants. An unrelated `final` or field naming change does not provide controlled mutation. Oracle Java Tutorials on objects and access control provide the primary references.
3. `iv150-interface-vs-abstract-class` — D: the abstract superclass can contain shared per-instance fields and concrete methods; an interface models a capability that unrelated classes can implement. Oracle's official abstract classes and interfaces documentation directly supports the distinction. Wrong choices incorrectly treat interface fields as instance state or claim abstract classes cannot share code.

The three V2 digests bind `pack.json` metadata and exact question fields under `manifest-pack.mjs::reviewDigestV2`; all three questions have exactly one correct option. No named human approval is implied. No verdicts are recorded for snippets requiring code correction or questions with incorrect/non-versioned references; the pack stays `DRAFT`.

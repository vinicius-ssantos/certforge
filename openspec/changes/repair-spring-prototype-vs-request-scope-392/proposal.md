## Why

`iv288-singleton-vs-prototype-scope-mutable-state` conflated a Spring prototype bean with a per-HTTP-request instance. Spring states that a prototype is created for each container lookup/injection, and injection of a prototype into a singleton is performed only once. This overstated the security/isolation improvement of merely changing the scope annotation.

## What changes

Preserve correct option C but prioritize method-local or appropriately request-scoped state, and specify that a fresh prototype instance must be explicitly retrieved for each use. Correct the explanation and add the distinction to the prompt. Continue citing Spring's official Bean Scopes reference.

## Impact

One source-only question correction. No `review.json`, package status, publication, deploy, or human approval changes. Exact-source V2 approval remains separately gated under #392.

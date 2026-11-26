## Semantics

Spring's default `singleton` scope creates a shared bean per IoC container. `prototype` creates a new bean for each lookup/injection, not for each HTTP request. When a prototype is injected into a singleton, the dependency is resolved once, and the singleton keeps it. In a web context, `request` scope is the distinct lifecycle aligned to a single HTTP request.

Therefore the smallest correct isolation fix is to eliminate mutable per-call state from a singleton field and use a method-local accumulator. Request-scoped beans or dynamically acquired prototype beans can also isolate state if configured and obtained correctly. A synchronized/volatile/concurrent shared field does not isolate result ownership.

Primary source: https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html

Keep correct C, authoring attribution, and V2 approval separate. A subsequent `record-ai-review.mjs` action shall hash only the exact merged source.

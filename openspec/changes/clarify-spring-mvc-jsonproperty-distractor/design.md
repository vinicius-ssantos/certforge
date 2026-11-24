## Correctness evidence

### Spring MVC return-value routing

Official Spring Framework `@ResponseBody` documentation says it instructs handler methods to serialize and write their returned values to the HTTP response through a suitable message converter. `@RestController` composes `@Controller` with `@ResponseBody`. Under the question's given `@Controller`-only scenario, an ordinary UserDto return value is handled via model/view processing; the supplied unresolved-view failure is consistent with missing response-body handling. Therefore answer **A** remains uniquely correct.

### Jackson annotation's actual role

The primary Jackson 2.13 `@JsonProperty` API explicitly allows use on object fields, getter/setter methods and constructor parameters to represent logical properties, with names and access. Its role is broader than *only* customizing names. However, it does not cause a Spring MVC controller to select the response-body return-value handler, so answer B's suggestion to add it does not address the reported unresolved view. The revised B distractor explanation states that precise distinction.

### Review integrity

No unrelated option, prompt, overall rationale or question is edited. Add the versioned Jackson reference so current source's future V2 SHA-256 review digest is re-computed after merge and a separate genuine source-backed review. No premature AI_APPROVED or false human approval. Issue #392 remains open with 40/208 on current main before the pending editorial PR #451. The pack remains DRAFT, no deploy.

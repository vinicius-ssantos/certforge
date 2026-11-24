## Post-repair independent evidence

The entire corrected source `content/java-backend-interview/iv288-restcontroller-vs-controller-responsebody/question.json` (integrated via PR #452) was read and checked: prompt, all four alternatives, option-specific explanations, overall rationale and both versioned/official references.

### Answer A

The supplied scenario has a `@Controller` handler returning a `UserDto`, no `@ResponseBody`, no explicit view name and an *observed unresolved-view error*. Spring Framework's official [`@ResponseBody` reference](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responsebody.html) explicitly explains the return-value handling that writes serialized data to the HTTP response via `HttpMessageConverter`; `@RestController` composes the `@Controller` and `@ResponseBody` behaviors. A plain DTO return does not automatically trigger HTTP-body serialization, so adding `@ResponseBody` to the method is the direct fix. The correct key is **A**.

### Individually excluded alternatives

- **B:** Jackson's `@JsonProperty` annotation can define logical properties on fields, accessors and constructor parameters, and affect JSON names/access (see [versioned Jackson 2.13 Javadoc](https://fasterxml.github.io/jackson-annotations/javadoc/2.13/com/fasterxml/jackson/annotation/JsonProperty.html)), but cannot select Spring MVC's response-body handler. It therefore cannot fix the stated view-resolution failure; corrected B explanation is accurate.
- **C:** `UserDto` being an ordinary class rather than a Java record is not the deciding factor in MVC handler return-value dispatch.
- **D:** Jackson being absent from the classpath is not the reason the handler went through view resolution; missing a converter does not by itself cause Spring MVC to treat a DTO as a model attribute instead of a response body.

The question's stated view-resolution symptom removes ambiguity about hypothetical alternate MVC setups. There is exactly one correct answer, **A**; the four option explanations and overall rationale are aligned with first-party Spring/Jackson sources.

### Exact digest and governance

The current post-merge question was hashed using the ordered V2 source tuple in `content/manifest-pack.mjs::reviewDigestV2`, with the SHA-256 implementation cross-checked against the standard `abc` test vector (`ba7816bf...`) and an already-approved source-bound `iv150-class-vs-object` entry. The exact result is `sha256:3ae603fc639f3cb9230598477b42481a17f926c163c8bb09edefe815105bc8fd`.

PR #452 source repair and this AI review are separate. The previous 46 review entries remain unchanged. No fabricated human approval, bulk stamping, publishing or deployment; interview pack DRAFT, review issue #392 OPEN, UX issue #428 OPEN.

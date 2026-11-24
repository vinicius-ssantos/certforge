## Why

During independent editorial review under issue #392, the unreviewed question `iv288-restcontroller-vs-controller-responsebody` was found to have a technically imprecise **wrong-option B explanation**: it said Jackson's `@JsonProperty` **only** customizes field names. First-party Jackson documentation contradicts that overclaim: the annotation also identifies logical properties on fields, accessors and constructor parameters and can configure property access. The correct answer A remains that Spring MVC's `@ResponseBody` mechanism is absent; Jackson property annotations do not replace it.

## Change

Correct only wrong-option B's explanation to distinguish Jackson JSON property introspection from Spring MVC return-value handling, and cite versioned primary Jackson `@JsonProperty` API next to the already cited official Spring MVC `@ResponseBody` reference. Preserve answer key A and all other options unchanged.

## Boundaries

Only this unreviewed `question.json` source and one OpenSpec change. No `review.json` verdict in this correction PR; independently evaluate and recompute the source-bound V2 digest **after** the source repair is merged. Pack DRAFT, no deploy or publication; issue #392 and UX issue #428 remain open.

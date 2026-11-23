## Technical review — 2026-11-23
Spring Framework documentation:
https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired.html

The Spring container can inject a List of matching strategy beans into
PaymentService; it automatically maps bean names only when the map key is String.
The corrected option B explicitly collects the list into an immutable
Map<PaymentType, PaymentStrategy> using each strategy's supportedType() method.
A new payment type still requires a new enum value and strategy component,
but not another conditional in PaymentService. Duplicated keys make the
toUnmodifiableMap collector fail rather than overwrite an implementation.
Unsupported payment types must be reported explicitly.

Critical check of all alternatives:
A: a switch replaces syntax but not the need to modify the service for each type.
B: correct OCP approach; List injection and explicit registry are valid.
C: a boolean flag adds another branch in the same service.
D: a marker interface adds no callable charge contract or dispatch criterion.

This is the independent technical basis for a disclosed AI review only.
The actual reviewer identity shall be recorded by record-ai-review.mjs as
ai-reviewer with a digest calculated after the correction. No human
reviewer, review of the other 208 questions, or publication is implied.

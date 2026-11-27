## Individually verified review ledger — 2026-11-27

Each line was checked against the exact learner-facing prompt, four options (one marked correct), option explanations, overall explanation and the original published primary reference(s). Source site references identify original author, vendor or API documentation. AI review does not substitute for human sign-off.

1. **iv151-dip-scenario-domain-constructs-infra — D.** Only D reverses dependency direction via order-owned OrderNotifier, keeping SMTP behind an infrastructure implementation; A is mere concrete constructor DI, B repositions construction, C only prioritizes a bean. **Primary-source check:** Spring Framework Reference, DI; original vendor documentation.

2. **iv151-isp-conceptual-fat-interface — A.** A recognizes implementer obligation and client coupling to unrelated operations; B mistakes length for design, C mistakes lambda eligibility for the principle, D default methods cannot dissolve contract coupling. **Primary-source check:** Oracle Java Tutorials, interface contracts.

3. **iv151-isp-scenario-worker-interface — B.** B segregates Coder from Documenter capabilities; A replaces unsupported behavior with Optional<Void>, C hides it behind no-ops, D adds runtime probes instead of narrowing static contracts. **Primary-source check:** Oracle Java Tutorials, default methods.

4. **iv151-lsp-violation-unsupported-operation — D.** D explains behavior-contract non-substitutability despite matching generic type; A blames generics, B blames class vs record, C wrongly assumes every interface documents unsupported operations as optional. **Primary-source check:** Oracle Java SE 21, UnsupportedOperationException and List contracts.

5. **iv151-ocp-conceptual-extension-points — A.** A balances foreseeable extension axes and speculative abstraction; B requires interfaces everywhere, C equates no edits with extension, D encourages unrestricted protected overriding. **Primary-source check:** Oracle Java Tutorials, abstract classes (Java extension mechanism).

6. **iv151-ocp-violation-payment-if-else — C.** C identifies each new payment method requiring charge() modification; A conflates line count, B incorrectly condemns enum ==, D incorrectly condemns guarding unknown types. **Primary-source check:** Oracle Java Tutorials, interfaces (Java strategy extension mechanism).

7. **iv151-srp-conceptual-reasons-to-change — D.** D checks distinct actor-driven reasons for change; A counts methods, B imports and C lines, none of which measures independent responsibility. **Primary-source check:** Martin Fowler, CodeSmell.

8. **iv151-srp-refactor-extract-collaborators — A.** A separates validation, persistence, email and audit behind cohesive collaborators while retaining orchestration; B extracts only private methods, C adds inheritance, D leaks infrastructure into entity. **Primary-source check:** Spring Framework Reference, constructor DI.

9. **iv151-srp-violation-god-service — B.** B identifies independently evolving validation, storage, notifications and audit; A wrongly relies on one public method, C wrongly demands factories, D confuses framework dependency and SRP. **Primary-source check:** Martin Fowler, Beck Design Rules.

10. **iv152-generic-framework-overkill — A.** A chooses explicit switch for two fixed channels; B and D overvalue speculative extensibility and C restricts simplicity to asymptotic complexity. **Primary-source check:** Martin Fowler, Beck Design Rules.

11. **iv152-kiss-principle-core — B.** B minimizes design complexity while meeting requirements; A outlaws useful patterns, C equates brevity with simplicity, D confuses documentation with architecture. **Primary-source check:** Martin Fowler, Beck Design Rules.

12. **iv152-low-cohesion-god-class — C.** C extracts independent tax/email/analytics/shipping/PDF responsibilities; A mistakes method names, B confuses internal cohesion with external coupling, D replaces class design with static methods. **Primary-source check:** Martin Fowler, Extract Class refactoring catalog.

13. **iv152-over-extraction-readability-tradeoff — D.** D values meaningful abstraction and reuse versus fragmented one-line indirection; A and B invent absolute method length/reuse rules, C dismisses tractable readability costs. **Primary-source check:** Martin Fowler, Is High Quality Software Worth the Cost?.

14. **iv155-repository-mock-tradeoff — A.** A scopes repository mock to service branching logic, with separate persistence tests; B and C make opposite universal mock/database claims, D incorrectly ties this choice solely to @Transactional. **Primary-source check:** Martin Fowler, UnitTest; official Spring Boot testing guide.

15. **iv155-spring-test-slices — B.** B accurately distinguishes MVC slice plus supplied collaborators, JPA slice and full SpringBootTest context; A reverses weight, C invents JPA HTTP testing, D equates distinct slices. **Primary-source check:** Spring Boot official testing guide.

16. **iv155-test-level-proof — D.** D bounds unit test proof to mocks and isolates wiring concerns for integrated and E2E tests; A/C overclaim one level and B discards fast targeted unit feedback. **Primary-source check:** The Practical Test Pyramid, author-published Martin Fowler site.

17. **iv155-testing-async-behavior — C.** C waits on the completion condition or future with a timeout; A assumes fixed sleep guarantees, B imagines InterruptedException changes execution threading, D rejects automation without basis. **Primary-source check:** Spring MVC test framework and JUnit 5 official guides.

18. **iv157-aggregate-root-role — A.** A describes externally referenced invariant-enforcing root; B uses field count, C confuses repository convention with definition, D confuses construction order with aggregate boundary. **Primary-source check:** Martin Fowler, DDD_Aggregate.

19. **iv157-anti-corruption-layer-legacy — B.** B translates legacy model at the boundary; A/C directly contaminate domain types, D incorrectly requires wholesale system replacement. **Primary-source check:** Microsoft Azure Architecture Center, Anti-corruption Layer pattern.

20. **iv157-bounded-context-integration-contract — C.** C uses narrow explicit inter-context events or API DTOs translated into Shipping terms; A imports Billing entity, B shares mutable table, D merges unlike domains. **Primary-source check:** Martin Fowler, BoundedContext.

## Blocked question found during case-by-case inspection

`iv157-protect-invariant-aggregate` is intentionally **not approved**. A root method that reads available balance then writes the debit inside one ordinary transaction can still allow lost updates at commonly used isolation levels without locking/version checks. A valid correction must specify an atomic guarded UPDATE or optimistic version check with retry, or pessimistic row locking and rechecking, or equivalent serializable concurrency enforcement, while keeping invariant checks at the aggregate boundary. Sources: Martin Fowler's DDD_Aggregate pattern; Oracle database *Data Concurrency and Consistency*; Aalto OpenCS *Concurrency and Isolation*. Resolve learner-facing question separately and subsequently reverify its digest.

## Integrity boundaries

Use `content/record-ai-review.mjs` independently for each current question; never fabricate a human reviewer, approve an unverified prompt, or alter source question files in this review-only PR. Record source SHA, tests and independent Codex findings in the PR; archive the OpenSpec only after merge, in a separate docs-only change.

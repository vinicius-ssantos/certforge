# content-review-integrity Specification

## Purpose
Ensure interview content makes accurate technical claims and that each revised question carries a truthful, digest-matched editorial verdict rather than inheriting a stale approval.

## Requirements

### Requirement: Spring strategy registry examples must use supported injection
The interview content SHALL distinguish Spring's injection of matching
strategy beans into a typed collection from the explicit construction of a
Map keyed by the PaymentType enum. It SHALL NOT assert that Spring automatically
constructs that enum-keyed map. The explanation SHALL reference the specific
official Spring Framework autowiring documentation.

#### Scenario: The learner selects Strategy for OCP
- **WHEN** the learner reads option B in the OCP question
- **THEN** it describes injecting a strategy list, explicitly building a
  registry and dispatching without a new PaymentService conditional.

### Requirement: Technical corrections receive a truthful versioned review
An amended question SHALL NOT inherit an earlier review of different text.
Its verdict SHALL be recorded with the V2 digest of its current source and
the actual reviewer identity, without suggesting human approval or publication.

#### Scenario: An AI reviewer approves a corrected question
- **WHEN** the reviewer checks all options against the official source
- **THEN** the review record names ai-reviewer, records the current digest,
  and leaves unrelated questions and the pack publication status unchanged.

### Requirement: Interview delegation examples account for indirect mutations
The Java backend interview question on composition over inheritance SHALL explain
that replacing a subclass with a List delegate does not automatically intercept
all mutations. It SHALL distinguish direct `add`/`addAll` calls from positional
inserts and additions through list iterators or writable sublist views.

#### Scenario: A learner chooses a delegating logging wrapper
- **WHEN** the learner selects option A in the EventLoggingList question
- **THEN** the answer describes intercepting or preventing all supported
  insertion paths, including `ListIterator.add` and writable sublists
- **AND** the authoritative Java SE API references cover those mutation routes.

### Requirement: Unreviewed content remains unapproved after source edits
A technical correction to an unreviewed interview question SHALL NOT grant
an editorial approval without a separate genuine review of the corrected text.

#### Scenario: Correct an unanswered technical review finding
- **WHEN** an unreviewed interview question is edited to resolve a finding
- **THEN** its review.json entry remains absent until a proper digest-matched
  verdict is intentionally recorded, and the pack stays DRAFT.

### Requirement: Runnable Java interview examples compile as complete programs
When a Java interview prompt presents an entire program whose console output
is the subject of a question, the program SHALL compile for the designated
Java release without requiring the learner to guess missing method wrappers.
The correction SHALL preserve the unique valid answer and its explanation.

#### Scenario: Review class instance state and method dispatch
- **WHEN** the learner compiles the Counter and OverloadDemo programs with Java 21
- **THEN** both compile and run without preview features
- **AND** their outputs are `2 1` and `Special: hello`, respectively
- **AND** the correct options remain C and A without auto-publishing the pack.

### Requirement: Versioned testing-library interview references match the scope
An interview question about JUnit 5's test instance lifecycle SHALL cite
a fixed version of the official JUnit 5 documentation rather than a moving
current/latest link. It SHALL make clear whether the global lifecycle default
has been overridden, so a standard PER_METHOD answer is unambiguous.

#### Scenario: Review default JUnit 5 class instance state
- **WHEN** the learner encounters the JUnit Jupiter test instance question
- **THEN** it specifies no global lifecycle override and cites the versioned JUnit 5 guide
- **AND** the correct answer remains C (PER_METHOD), without editorial publication.

### Requirement: AI-reviewed OOP and Map questions retain source-backed exact verdicts
The Java backend interview pack SHALL record `AI_APPROVED` verdicts only
for individually verified questions with exact source-matched V2 review digests,
clear `ai-reviewer` attribution, and primary references for technical claims.
The questions about HashMap ordering, encapsulation and abstract classes
SHALL retain exactly one defensible correct option each, respectively A, B and D.

#### Scenario: A source-backed review batch is recorded
- **WHEN** the three verified Java/OOP questions gain AI review verdicts
- **THEN** each review matches the current V2 digest, references and answer key
- **AND** unrelated review entries remain intact and the pack remains DRAFT.

### Requirement: AI review batches contain only individually verified decisions
The Java backend interview pack SHALL record an AI review verdict only for
questions whose correct answer, distractors, explanations and primary
references were individually checked; it SHALL use the current V2 digest
and the disclosed `ai-reviewer` identity. An AI review batch SHALL NOT
change the pack editorialStatus to published while other questions remain
unreviewed or require correction.

#### Scenario: A reviewed batch contains three verified questions
- **WHEN** DIP versus DI, ConcurrentHashMap check-then-act, and Spring Boot
  ConditionalOnMissingBean questions receive technically justified verdicts
- **THEN** review.json records only those three new AI_APPROVED entries with
  source-matched V2 digests and leaves all other verdicts unchanged
- **AND** the interview pack remains DRAFT.

### Requirement: Corrected interview questions receive independent V2 AI reviews
The Java backend interview pack SHALL record a `review.json` verdict only
after verifying the corrected question's exact source, answer key,
distractors, explanatory rationale and primary references.
An approved question SHALL have its current V2 source digest and
explicit `ai-reviewer` attribution, without implying human sign-off.

#### Scenario: Six corrected and primary-sourced questions are reviewed
- **WHEN** the four recently corrected Java/JUnit questions and the two independently checked OOP/testing/DDD concepts receive AI verdicts
- **THEN** their six answer keys remain C, A, A, C, A, A respectively
- **AND** all other review entries remain unchanged and the pack is still DRAFT.

#### Scenario: Unreviewed content remains outside the fast lane
- **WHEN** the 208-question pack has fewer than 208 current verified approvals
- **THEN** the editorial status remains DRAFT and the unreviewed remainder is not represented as approved.

### Requirement: Concurrent increment examples distinguish permitted races from guaranteed outcomes
Interview questions about a volatile read-modify-write operation SHALL state that
lost updates **can** occur, not that they **must** occur in every execution.
They SHALL distinguish visibility from atomicity with a Java Memory Model reference.

#### Scenario: Evaluate the volatile counter race
- **WHEN** ten threads each execute 100 increments of a volatile int without compound synchronization
- **THEN** the question allows a final count of 1000 or a smaller count
- **AND** answer B explains non-atomic read-modify-write behavior.

### Requirement: Console-output polymorphism examples compile on Java 21
A Java interview question that asks for a program's printed output SHALL
show an executable compilation unit and retain the unique correct answer.

#### Scenario: Run the Animal and Dog override sample
- **WHEN** a learner compiles PolymorphismDemo with Java 21
- **THEN** it compiles and prints Woof
- **AND** answer B identifies runtime virtual method dispatch.

### Requirement: JUnit shared-instance questions declare their lifecycle
When a test-isolation question assumes an instance field survives multiple
JUnit 5 test methods, its scenario SHALL explicitly select PER_CLASS lifecycle
and SHALL cite versioned official JUnit 5 references instead of a moving latest link.

#### Scenario: Diagnose order-dependent test pollution
- **WHEN** one JUnit test leaves mutable instance state visible to another
- **THEN** the question specifies PER_CLASS and distinguishes it from the PER_METHOD default
- **AND** answer C recommends fresh independent test state.

### Requirement: Java concurrency and exception review decisions remain source bound
A Java backend interview review batch SHALL record AI_APPROVED only for
individually checked current sources, verified answer options and primary
documentation. Review entries SHALL use the exact V2 digest with explicit
ai-reviewer attribution, not imply owner review, and shall not publish the
interview pack while questions remain unreviewed.

#### Scenario: Six concurrency, OOP and testing review decisions
- **WHEN** the individually reviewed questions `iv150-polymorphism-dynamic-dispatch`, `iv155-test-isolation-shared-fixtures`, `iv286-volatile-visibility-not-atomicity`, `iv286-try-with-resources-suppressed-exception`, `iv286-stream-single-use-pipeline`, and `iv286-checked-vs-unchecked-recoverability` receive verdicts
- **THEN** their exact respective answer keys remain B, C, B, D, D, and C
- **AND** each source V2 digest matches its recorded review
- **AND** all unrelated reviews remain intact and editorialStatus stays DRAFT.

### Requirement: Java concurrency and priority-queue reviews use exact verified sources
A Java backend interview AI review verdict SHALL correspond to the question's
current V2 digest and an independently verified correct answer, distractors,
explanatory rationale and authoritative Java or JLS reference.
The reviewer SHALL be disclosed as ai-reviewer, never as a fabricated human.
No question SHALL be promoted to published while the pack is incomplete.

#### Scenario: Six Java 21 concurrency and collections questions receive approved verdicts
- **WHEN** the questions `iv286-reentrantlock-vs-synchronized`, `iv286-synchronized-happens-before`, `iv286-system-gc-no-guarantee`, `iv286-stream-laziness-short-circuit-infinite`, `iv286-deadlock-inconsistent-lock-order`, and `iv154-heap-priority-queue` are individually reviewed in that exact order
- **THEN** their correct keys are respectively B, A, B, A, B and D
- **AND** the heap wrong-option B rationale correctly distinguishes the heap's partially ordered backing array from O(log n) sorted head extraction
- **AND** the six V2 digests match current source content, without changing the 32 existing entries
- **AND** `editorialStatus` remains DRAFT; no deployment or human sign-off is implied.

### Requirement: Mutable hash-map key scenarios specify the failure-producing hash change
A Java interview question about mutated HashMap keys SHALL explicitly describe
a mutation that changes the lookup's hash-derived bucket, or otherwise avoid
claiming all mutations necessarily break retrieval. It SHALL cite first-party
Java Map/HashMap/hashCode documentation and preserve its unique correct key.

#### Scenario: Retrieve an entry after key mutation
- **WHEN** a key already stored in a HashMap changes its computed hash to select a different bucket without a resize
- **THEN** lookup with the same mutated key may fail while the entry remains stored
- **AND** the question correctly retains answer C without implying every key mutation must fail.

### Requirement: Broken double-checked locking examples identify ordinary non-final state
A Java memory-model interview question about reading a partly visible Helper
through unsynchronized double-checked locking SHALL identify the ordinary
non-final field being initialized. It SHALL distinguish publication ordering
from the special final-field guarantees in JLS §17.5.

#### Scenario: Observe stale state through plain helper reference
- **WHEN** Helper has a non-final field assigned in construction and the helper reference is not volatile
- **THEN** a concurrent reader of the unsynchronized outer check may observe a non-null reference but a stale default field value
- **AND** the answer remains C and no editorial verdict is automatically granted.

### Requirement: Corrected HashMap and DCL questions receive only source-bound reviews
A Java backend interview technical correction SHALL NOT inherit an earlier
editorial approval; new V2 AI review verdicts SHALL be recorded only after
individual review of the exact corrected question, answer alternatives,
explanation and authoritative sources. Review entries SHALL have a current
source-bound SHA-256 V2 digest and disclose ai-reviewer as the actual reviewer.

#### Scenario: HashMap mutable-key and unsafe DCL questions pass individual review
- **WHEN** the revised questions `iv286-mutable-key-breaks-hashmap-lookup` and `iv286-double-checked-locking-without-volatile` are independently reviewed against Oracle Java SE 21 and JSR-133
- **THEN** their correct answers remain C and C, in that exact order
- **AND** both review digests match their post-repair question sources
- **AND** the earlier 38 review decisions remain unchanged and the pack stays DRAFT without publication.

### Requirement: Java Collections and Spring interview verdicts remain technically source-bound
A Java backend interview AI reviewer SHALL validate the exact question prompt,
all answer options and explanations against a primary Java or Spring reference
before recording a V2 digest tied to the current source. An answer SHALL NOT
be approved if a distractor explanation materially misstates the reference.
Recorded decisions SHALL disclose ai-reviewer and keep the interview pack
DRAFT until the remaining editorial queue is completed.

#### Scenario: Six Java and Spring Boot source-backed reviews
- **WHEN** the specific questions `iv286-arraylist-vs-linkedlist-access-pattern`, `iv288-self-invocation-bypasses-transactional-proxy`, `iv288-profile-specific-bean-missing-from-active-profile`, `iv288-component-scan-bean-not-found`, `iv288-property-source-precedence-env-vs-yaml`, and `iv288-transactional-propagation-required-vs-requires-new` are reviewed in that order
- **THEN** their exact correct keys respectively remain B, B, B, B, C, B
- **AND** the profile-option D explanation distinguishes unprofiled/negated conditions from the unmatched `prod` condition
- **AND** the component-scan option D explanation correctly acknowledges additional `spring.main.sources` sources without denying the default `@SpringBootApplication` scan
- **AND** every newly recorded V2 digest matches its corresponding current question source after those two P2 corrections
- **AND** all prior 40 review decisions remain intact
- **AND** `editorialStatus` is DRAFT, with no implied human acceptance or publishing.

### Requirement: Spring MVC distractors distinguish Jackson metadata from response-body routing
An interview question that diagnoses a controller's unresolved view SHALL
distinguish the effect of Spring MVC `@ResponseBody` from Jackson
`@JsonProperty` property metadata. Wrong-option explanations SHALL not
falsely claim `@JsonProperty` only renames JSON fields; instead they SHALL
accurately describe its property-discovery/access uses and explain why
Jackson annotations do not enable HTTP response-body handling.

#### Scenario: Explain an @Controller method returning a DTO
- **WHEN** a `@Controller` handler without `@ResponseBody` returns a DTO and view resolution fails
- **THEN** the correct solution remains to add `@ResponseBody` (answer A)
- **AND** option B's rationale explains that `@JsonProperty` cannot select Spring MVC response-body handling
- **AND** authoritative versioned Jackson and official Spring MVC references support the corrected claim
- **AND** the repaired question remains unapproved until its new exact source digest receives separate review.

### Requirement: Corrected Spring MVC response-body questions receive independent source-bound review
A Spring MVC interview question corrected after an inaccurate Jackson annotation
explanation SHALL receive a fresh technical review of the complete corrected
source before recording an AI-approved V2 digest. A reviewer SHALL distinguish
Spring MVC response-body routing from JSON property metadata and SHALL disclose
ai-reviewer as the actual reviewer, not imply owner/human acceptance.

#### Scenario: Review the corrected @Controller DTO question
- **WHEN** `iv288-restcontroller-vs-controller-responsebody` is independently reviewed after its source correction is merged
- **THEN** the uniquely correct key remains A: applying `@ResponseBody` writes the DTO via a message converter
- **AND** wrong-option B accurately explains why `@JsonProperty` cannot enable Spring MVC response-body handling
- **AND** the recorded V2 SHA-256 digest matches the complete current post-repair question source
- **AND** all earlier 46 review decisions stay unchanged and the interview pack remains DRAFT without publication.

### Requirement: Testing and asynchronous interview reviews preserve primary-source semantics
An AI reviewer approving Java interview questions about testing, concurrency,
design principles, data structures or Spring scopes SHALL independently
verify the current entire question, answer distractors and explanation
against author-origin or first-party technical sources. Source-bound V2
digests SHALL reflect exact current source text; uncorrected technical
overclaims SHALL prevent review rather than receive blanket approval.

#### Scenario: Six distinct Java and testing sources receive vetted decisions
- **WHEN** the questions `iv154-stack-lifo-use-case`, `iv155-flaky-vs-deterministic`, `iv286-completablefuture-exception-propagation`, `iv152-similar-but-different-rules`, `iv288-request-scope-proxy-mode`, and `iv155-when-mocking-hurts` receive individually verified verdicts in that order
- **THEN** their correct keys respectively remain D, B, C, B, A, D
- **AND** the six current V2 SHA-256 digests match their source objects
- **AND** all previous 47 reviews remain unchanged, and reviewer identity is disclosed as ai-reviewer
- **AND** `iv286-completablefuture-async-thread` and `iv155-mock-stub-fake-spy` remain without verdicts until corrected
- **AND** the pack remains DRAFT with issue #392 open, no publication, deploy or human sign-off.

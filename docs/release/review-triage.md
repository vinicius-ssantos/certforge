# Review triage: the 130 unreviewed questions in `content/java-se-21`

Mechanical triage to shorten human review. **This document approves nothing.** Per
[ADR 0005](../adr/0005-ai-not-source-of-truth.md) and [ADR 0011](../adr/0011-grade-content-evidence.md),
correctness is a named human's call recorded in `content/java-se-21/review.json`, which this document
does not touch. Everything below reports what the *evidence* shows, so a reviewer can spend their
attention where the machine cannot help.

## What was read

- **130 questions read** — all directories in `content/java-se-21/` except the 20 listed in
  `review.json`, which were skipped. 13 per topic, t01 through t10.
- All 130 carry a verification program: 123 a flat `Main.java`, 7 a `modules/` graph
  (`t07-export-does-not-make-type-public`, `t07-implicit-java-base`, `t07-java-module-launch`,
  `t07-module-service-directives`, `t07-open-module-semantics`, `t07-qualified-exports`,
  `t07-requires-static`). All 130 have `expected.txt`.
- **57 carry at least one flag. 73 have nothing to flag.**

## The structural fact that frames everything else

`ContentPackTest.answerKeyAgreesWithTheProgram` links the program to the answer key only when an
option's text is *literally* the program's output. It returns early otherwise. Of the 130:

| | count |
|---|---|
| Answer key mechanically linked to program output | **30** |
| `expected.txt` starts with `COMPILE_ERROR:` → key check skipped entirely | **11** |
| Prose options, multi-line diagnostic output → key check silently skipped | **89** |

So **100 of 130 questions have a program that the build compiles and runs, and an answer key the
build never checks against it.** That is not a defect — ADR 0011 names it ("Questions whose options
are prose rather than the literal output say nothing this can check") — but it means the Verified
tier here is weaker than the 130/130 program coverage suggests. The reviewer's real job in this batch
is reading `expected.txt` against the option marked `correct`. I did that for all 100; the 15
questions under **Program does not establish the key** below are where it does not hold up.

A second systemic note: in most prose-option questions the program demonstrates the *correct* option
and the distractors' wrongness is asserted. Where that is incidental I left it alone; where the
distractors *are* the substance of the question (all three say "this does not compile") I flagged it.

## Flags ranked by how many questions they affect

| # | Flag | Questions |
|---|---|---|
| 1 | **Reference is an anchor-less landing page, or its title misnames the target** | 20 |
| 2 | **Program does not establish the claim the answer key makes** | 15 |
| 3 | **Explanation or code comment asserts something false or unsupported** | 7 |
| 4 | **Depends on locale/CLDR data, JVM-global state, or the test harness's launch command** | 6 |
| 5 | **An option's `explanation` does not explain why that option is wrong** | 4 |
| 6 | **Prompt ambiguous about what it asks, or admits more than one true answer** | 4 |
| 7 | **A printed line is a hardcoded constant, not a measurement** | 4 |
| 8 | **Near-duplicate of another question in the pack** | 3 |
| 9 | **Distractors not plausible / `difficultyRationale` does not match what is tested** | 1 |

Three of the 20 reference flags are **title mismatches**, verified against the live official pages —
these are the hardest for a reviewer to catch by eye and the easiest to fix.

**Clean negative result worth recording:** the brief asked about `difficultyRationale` that merely
restates the prompt. I found none. All 130 rationales name a reason (a confusion being tested, a rule
being isolated). Only `t10-collator-locale-sensitive` has a rationale problem, and it is the opposite
one: the rationale promises a contrast the options do not contain. ADR 0011's reference check also
holds everywhere — every URL is on the allowlist and release-correct; the 20 flags below are about
*granularity and titling*, which ADR 0011 explicitly does not verify.

---

## t01 — Date, time, text, numeric and boolean values

**t01-bigdecimal-equals-scale** — Program prints `equals=false` / `compareTo=0`; option B's prose
says exactly that.
- *Reference granularity.* The only reference is the whole `BigDecimal` class page with no anchor,
  but the claim is about two specific methods. `#equals(java.lang.Object)` and
  `#compareTo(java.math.BigDecimal)` both exist as anchors.

**t01-bigdecimal-nonterminating-divide** — Program proves `ArithmeticException` with no rounding
mode and `0.3333` with scale 4; option C matches. Nothing flagged.

**t01-bigdecimal-striptrailingzeros-scale** — Program proves `scale=-3`, `unscaled=1`,
`value=1000`; option C is `-3`. Nothing flagged.

**t01-boolean-parseboolean** — Program proves `true`/`TRUE`/`TrUe` true and `yes` false; the three
correct options are exactly those. Nothing flagged.

**t01-integer-division-assignment** — Prints `2.0`; key mechanically linked. Nothing flagged.

**t01-localdate-invalid-withday** — Program proves `DateTimeException` and that day 30 is accepted;
option C matches. Nothing flagged.

**t01-localdate-plus-years-leap-day** — Program proves `2025-02-28` and `2028-02-29`; option A
matches. Nothing flagged.

**t01-math-round-negative** — Program proves `Math.round(-1.5d)` is `-1`, which is what option B
says. **The answer is right; the reason given for it is wrong.**
- *Explanation asserts something the reference does not state, and that is false.* The explanation
  says "`Math.round(double)` is equivalent to taking the floor of `a + 0.5` and converting to long".
  The Java 21 javadoc for `Math.round(double)` — the question's own and only reference — says
  "Returns the closest `long` to the argument, with ties rounding to positive infinity" and gives no
  such formula. The formula is also not true: on this repository's JDK,
  `Math.round(0.49999999999999994)` returns `0` while `(long) Math.floor(0.49999999999999994 + 0.5)`
  returns `1`. The `floor(a + 0.5)` wording was removed from the javadoc years ago for exactly this
  reason. The `Main.java` comment repeats it ("Math.round adds a half and floors"). A reviewer should
  decide whether to restate the explanation as "ties round toward positive infinity, so -1.5 rounds
  to -1", which is both the javadoc's wording and sufficient for this question.

**t01-numeric-promotion-byte-addition** — Program prints `inferred=Integer`; option C is `int`.
- *Proof is indirect.* The prompt asks for the **compile-time type** of `result`. The program boxes
  via `((Object) result).getClass().getSimpleName()` and prints `Integer`. Nothing in the output ever
  says `int`. The inference (boxing an `int` yields `Integer`, therefore `var` inferred `int`) is
  sound but is a step the reviewer supplies, not the program. Low severity; noted because this is the
  one t01 question where output and key are not the same statement.

**t01-period-vs-duration** — Program prints `periodUnits=[Years, Months, Days]` and
`durationUnits=[Seconds, Nanos]`, matching options A and B. The two anchor-less class pages are the
right granularity here, because the claim is about what each type models. Nothing flagged.

**t01-string-repeat** — Prints `ababab`; key mechanically linked. Nothing flagged.

**t01-string-strip-vs-trim** — Program proves `strip` removes U+2003 and `trim` does not; option A
matches.
- *Reference granularity.* The reference is the entire `String` class page with no anchor. The claim
  is about two methods that each have an anchor (`#strip()`, `#trim()`), and `String.html` is one of
  the largest pages in the API.

**t01-stringbuilder-reverse-chain** — Prints `21ba`; key mechanically linked.
- *Reference granularity.* Anchor-less `StringBuilder` class page; the claim is about `append(int)`
  then `reverse()`, both of which have anchors.

## t02 — Controlling program flow

**t02-case-null-pattern-switch** — Program proves `case null` matches null and that a pattern switch
without it throws `NullPointerException`; option A matches. Nothing flagged.

**t02-continue-for-update** — Program prints `visited=023`, which proves the update expression runs
on a `continue`; option A matches. Two small things:
- *Option explanation does not explain the wrongness.* Option D is "The loop always terminates",
  which is not an answer to the prompt ("What happens before the loop condition is tested again?")
  at all. Its explanation — "Continue starts the next iteration path; it does not inherently
  terminate the loop" — explains a claim D does not make. A reviewer should decide whether D is a
  plausible distractor or a category error.
- *Printed constant.* `System.out.println("terminated=true")` is a literal; it would print
  `terminated=true` whatever happened. Termination is proved by the program finishing, not by that
  line. Harmless but it reads like evidence and is not.

**t02-dangling-else** — Program proves `outerTrueInnerFalse=else` / `outerFalse=none`; option B
matches.
- *Option explanation does not explain the wrongness.* Option A is "Always the outermost if", and its
  explanation is "That would require braces or restructuring when the nearest if should not receive
  the else." That describes how a programmer would *get* the outer association; it never says that
  the grammar does not do this. Compare option C's explanation ("Condition length has no role in
  parsing"), which does the job.
- *Reference granularity (minor).* `JLS 14.5 Statements` is correctly titled (verified), but it is
  the statement-grammar section; the dangling-else rule has to be inferred from the
  `StatementNoShortIf` productions rather than read off a sentence.

**t02-do-while-first-execution** — Program proves `runsWithFalseCondition=1` against
`whileRunsWithFalseCondition=0`; option A matches, and option C ("exactly once") is correctly wrong
even though it happens to describe this program. Nothing flagged.

**t02-enhanced-for-variable-assignment** — Program proves `[1, 2, 3]` then `[2, 3, 4]`; option B
matches, and the program compiling disproves option D. Nothing flagged.

**t02-for-update-order** — Prints `012`; key mechanically linked. Nothing flagged.

**t02-labeled-break-count** — Prints `4`; key mechanically linked. Nothing flagged.

**t02-labeled-continue** — Prints `3`; key mechanically linked. Nothing flagged.

**t02-pattern-variable-and-scope** — Program proves option A's form
(`obj instanceof String s && s.length() > 0`) compiles and behaves.
- *Program does not establish the key.* The whole question is which of four forms is *valid*.
  Options B, C and D (`||`, `|`, `^`) are claimed invalid, and `Main.java` contains none of them, so
  nothing mechanical supports three quarters of the question. `expected.txt` is runtime output, so
  there is no compile-error evidence either. The reviewer is doing the JLS 6.3.1 flow-scoping
  analysis for B/C/D unaided. (The analysis is right as far as I can tell — `s` is introduced when
  the `instanceof` is true, so it is not in scope in the right operand of `||`, and `|`/`^` do not
  short-circuit — but that is my reading, not the build's.) The program also demonstrates a
  negated-`if` case the prompt never asks about.

**t02-switch-expression-exhaustive** — `COMPILE_ERROR: not.exhaustive`, from a switch expression over
a sealed interface covering one of two permitted subclasses. Option B is "It must be exhaustive."
- *Program establishes one instance of a general claim.* Because `expected.txt` is a
  `COMPILE_ERROR:`, the answer-key check is skipped outright. The program proves one non-exhaustive
  sealed-interface switch expression fails; the key asserts exhaustiveness is required in general.
  That is a fair generalisation, but it is the reviewer's generalisation. Option C in particular
  ("must always contain a default label, even when enum cases are exhaustive") is about enums, which
  the program never touches.

**t02-switch-null-default-combination** — Program proves `case null, default` compiles and catches
both `null` and unmatched values; option A matches.
- *Reference title misnames the section.* The reference is titled `JLS 14.11.1 The Selector
  Expression`, but JLS SE 21 §14.11.1 is titled **"Switch Blocks"** (verified against the live
  page). The URL is right — §14.11.1 does specify "A `case null, default` label applies to every
  value" — so this is a titling error, not a wrong citation, but ADR 0011's mechanical check only
  looks at the URL and would never catch it.

**t02-switch-rule-no-fallthrough** — Program proves `ran=one` with no `break` written; option B
matches. Nothing flagged.

**t02-switch-yield-block** — Program proves `yield` produces the arm's value; option C matches.
- *An option's explanation asserts something false.* Option B is `return value;`, explained as
  "`return` exits the enclosing method, not just the switch expression arm." That is not what Java
  does: a `return` inside a switch *expression* is a compile-time error. I compiled it with
  `--release 21`: `error: attempt to return out of a switch expression`. So B is wrong for a stronger
  reason than the explanation gives, and a learner who reads this explanation comes away believing
  something the compiler rejects. ADR 0011 says explanation completeness is the human's job; this is
  explanation *correctness*, and it is the second-clearest substantive error in the batch.

## t03 — Object-oriented concepts in Java

**t03-class-method-beats-default** — Program proves `inherited=superclass method`; option B matches.
Nothing flagged.

**t03-constructor-order-super-first** — Prints `AB`; key mechanically linked. Nothing flagged.

**t03-covariant-return** — Program compiles an `Integer value()` override of `Number value()` and
prints `declaredType=Integer`; option A matches. Nothing flagged.

**t03-default-method-conflict** — `COMPILE_ERROR: types.incompatible` from a class inheriting two
unrelated `move()` defaults.
- *Program proves the failure, not the remedy the key asserts.* Option B is "Override the method and
  resolve the conflict explicitly." The program contains `class Amphibian implements Walks, Swims {}`
  with no override and does not compile. Nothing in the question demonstrates that *adding* an
  override makes it compile — which is the claim the answer makes. Converting this to a two-class
  program (one that fails, one with the override that succeeds and prints) would close the gap; as it
  stands the reviewer must supply the remedy half.

**t03-enum-constructor-access** — Program proves `declaredCount=1`, `isPrivate=true`,
`isPublic=false`, `isProtected=false`; option C matches.
- *Printed constant.* `System.out.println("sourceParameters=1,reflected=" + only.getParameterCount())`
  hardcodes the `1`. Only the `reflected=3` half is measured. Minor.
- Options A and B assert that `public`/`protected` enum constructors are compile-time errors. The
  explanation states this too. Nothing mechanical shows it, though the `isPrivate=true` result makes
  the key itself solid.

**t03-generic-erasure-overload** — `COMPILE_ERROR: name.clash.same.erasure`, which names exactly the
rule option B states. The cleanest of the compile-error questions. Nothing flagged.

**t03-overload-most-specific** — Program prints `chosen=String` with all three overloads present;
option B matches, and it disproves A and C by selection rather than by assertion. Nothing flagged.

**t03-private-interface-method** — Program prints `Hello Ana!` (proving option A, the helper is
callable from a `default` method in the same interface) and `punctuationInPublicApi=false`.
- *Program does not establish option C as worded.* Option C is "It is not part of the implementing
  class's callable inherited API", evidenced by `English.class.getMethods()` not containing
  `punctuation`. But `getMethods()` returns only **public** members by definition, so it would omit
  `punctuation` whether or not the method were inherited. The check cannot distinguish "not
  inherited" from "inherited but not public" — which is precisely the distinction between options B
  and C. The decisive evidence would be a compile error on `new English().punctuation()`, which the
  question cannot carry because `expected.txt` is runtime output. A reviewer should decide whether C
  is adequately supported.

**t03-record-compact-normalization** — Prints `7`; key mechanically linked. Option D's explanation
correctly distinguishes reassigning the parameter from assigning the component field. Nothing
flagged.

**t03-record-components-members** — Program proves `fieldPrivate`, `fieldFinal`, public accessor
named after the component, no setter, class final; options A and B match.
- *Reference granularity (minor).* The claim is carried entirely by `JLS 8.10 Record Classes`
  (anchored, correct). The second reference, the anchor-less `java.lang.Record` class page, is a
  three-method abstract class page that does not specify which members a record declaration mandates,
  so it adds nothing a reviewer can verify the claim against.

**t03-record-pattern-destructuring** — Prints `5`; key mechanically linked. Nothing flagged.

**t03-sealed-direct-subclass-modifier** — Program compiles `final`, `sealed` and `non-sealed` direct
subtypes and prints `finalIsFinal=true`, `sealedIsSealed=true`, `nonSealedIsSealed=false`,
`permitted=3`; options A, B, C match. Strong evidence.
- *Prompt and program describe different declarations.* The prompt says "For an ordinary class that
  directly **extends a sealed class**", but the program's `Shape` is a `sealed interface` and all
  three subtypes `implements` it. JLS 8.1.1.2 imposes the same obligation either way, so the answer
  is unaffected — but the evidence is about implementing a sealed interface, and a reviewer checking
  "does the program prove what the prompt asks" should know that before deciding.

**t03-static-method-hiding** — Program proves `throughVariable=parent` / `throughType=child`;
option B matches. Nothing flagged.

## t04 — Handling exceptions

**t04-autocloseable-close-contract** — Program prints
`autoCloseable=[class java.lang.Exception]` straight from reflection, plus
`closeable=[class java.io.IOException]` to kill option A; option B matches. Nothing flagged.

**t04-catch-order-unreachable** — `COMPILE_ERROR: except.already.caught`, which names the rule option
A states. Nothing flagged.

**t04-finally-abrupt-completion** — Prints `thrown`; key mechanically linked. Nothing flagged.

**t04-finally-return-overrides** — Prints `2`; key mechanically linked. Nothing flagged in itself.
- *Batching note.* This, `t04-finally-abrupt-completion`, and the **already-reviewed**
  `t04-finally-return` are three questions on adjacent rules about abrupt completion of `finally`
  (return discarded by a throw / return replaced by a return / finally runs before the return
  completes). They are genuinely distinct rules, not duplicates, but a reviewer will be faster
  reading the two new ones side by side with the reviewed one than meeting them separately.

**t04-multicatch-parameter-reassignment** — `COMPILE_ERROR: multicatch.parameter.may.not.be.assigned`;
option B matches, and the diagnostic code names the rule. Nothing flagged.

**t04-multicatch-related-types** — `COMPILE_ERROR: multicatch.types.must.be.disjoint`; option B
matches, and the diagnostic code names the rule. Nothing flagged.

**t04-overriding-checked-exception** — Program proves both halves of the key: `quietThrows=0` (an
override may omit the checked exception) and `narrowThrows=FileNotFoundException` caught as
`IOException` through the supertype. Good evidence for options A and B.
- *Option explanation does not explain the wrongness.* Option D is "Replace the checked exception
  with arbitrary unrelated checked exceptions", explained as "Unrelated checked exceptions must still
  satisfy the overriding throws-clause restrictions." That is circular — it restates that a rule
  exists without saying the rule forbids this. Option C's explanation ("That would widen the checked
  exception contract and is not allowed") is the model to follow.

**t04-precise-rethrow** — The method `void run(boolean) throws IOException, SQLException` with
`catch (Exception ex) { throw ex; }` compiling *is* the proof, and the runtime output
(`io=IOException`, `sql=SQLException`) confirms both paths. Option B matches. Nothing flagged.

**t04-suppressed-exception** — Program proves `primary=E1 from body`, `suppressedCount=1`,
`suppressed=E2 from close`; option B matches.
- *Prompt hedges where the language does not.* The prompt asks "What is the **usual** result defined
  by the language translation?" JLS 14.20.3.1 defines this deterministically — there is no unusual
  case for the scenario described. "Usual" invites a reader to wonder what the exception is. A
  reviewer should decide whether to drop the hedge; the content policy asks for "one defensible
  interpretation of the prompt".

**t04-suppressed-order-multiple-resources** — Prints `body B A`; key mechanically linked. Nothing
flagged.

**t04-throw-null** — Program proves `thrown=NullPointerException` and, by compiling at all, disproves
option D; option A matches. Nothing flagged.

**t04-try-resource-effectively-final** — Program proves option B: `read=line` then
`closed=true:IOException`, so the pre-declared `reader` really was closed by leaving `try (reader)`.
- *Program does not establish option A.* Option A is "`reader` **must** be final or effectively
  final." The program shows only the positive case — a variable that is never reassigned and
  therefore works. There is no counterexample showing that a reassigned variable fails to compile,
  and `expected.txt` is runtime output so there cannot be one in this question as structured. The
  "must" is asserted. Option C's explanation ("Reassignment would conflict with the effective-final
  requirement") leans on the same unproven requirement.

**t04-unchecked-exception-classes** — Program proves `IllegalStateException` and
`StackOverflowError` need no `throws`, and that `IOException` is in neither branch; options A and B
match. Nothing flagged.

## t05 — Arrays and collections

**t05-arrays-aslist-backed** — Program proves `writesThroughToArray=z`, `add=`/`remove=`
`UnsupportedOperationException`; options A and C match, and D is disproved by the write-through.
Nothing flagged.

**t05-arrays-binarysearch-insertion-point** — Prints `-3`; key mechanically linked. Nothing flagged.

**t05-generic-invariance** — `COMPILE_ERROR: prob.found.req` on `List<Number> numbers = integers;`;
option B matches. Nothing flagged.

**t05-list-first-last** — Prints `ac`; key mechanically linked.
- *Reference granularity.* Both references are anchor-less class pages (`List`, `SequencedCollection`),
  and `List.html` is one of the largest in `java.util`. The claim is about `getFirst()`/`getLast()`,
  which have anchors on both pages.

**t05-map-merge-null-removes** — Prints `false`; key mechanically linked. Option D's explanation
correctly frames null as a defined removal signal. Nothing flagged.

**t05-map-of-null-rejection** — Program proves `nullKey=NullPointerException` and
`nullValue=NullPointerException`; options A and B match.
- *Reference granularity.* Anchor-less `Map` class page. The `Map.of` null contract lives in the
  class page's "Unmodifiable Maps" block, which is reachable as `Map.html#unmodifiable`, and the
  individual `of(...)` overloads have their own anchors.
- *Near-duplicate.* `t08-concurrenthashmap-null` is the same question in a different topic: same
  program shape (`thrownBy(...)` helper, two `put`/`of` calls), same output shape
  (`nullKey=NullPointerException` / `nullValue=NullPointerException`), same options A/B ("reject null
  keys" / "reject null values"), both `EASY`. Both are legitimate topic coverage, but a reviewer
  should decide whether the pack wants both, and can review them together in one pass.

**t05-sequenced-collection-reversed** — Program proves `reversedOrder=[3, 2, 1]`,
`firstBecomesLast=true`, and — by adding to the backing list after taking the view — `isView=true`,
which disproves option C; options A and B match. Good evidence.
- *Reference granularity.* Anchor-less `SequencedCollection` page; `#reversed()` has an anchor.

**t05-sequencedmap-first-entry** — Program proves `first=a`, `last=c`, `reversed=[c, b, a]`; option A
matches.
- *Reference granularity.* Two anchor-less class pages (`LinkedHashMap`, `SequencedMap`);
  `#firstEntry()` has an anchor on `SequencedMap`.

**t05-set-of-duplicate-elements** — Program proves `thrown=IllegalArgumentException`; option C
matches, and option A's explanation usefully contrasts this with mutable `Set.add`.
- *Reference granularity.* Anchor-less `Set` class page; the duplicate-rejection contract is on the
  individual `of(...)` overloads, which have anchors.

**t05-treeset-comparator-uniqueness** — Program proves `areEqual=false`, `secondAdded=false`,
`size=1`, `kept=first`, which is unusually complete: it disproves options A and D by measurement
rather than assertion. The anchor-less `TreeSet` page is the right granularity here, because the
"consistent with equals" discussion is in the class description. Nothing flagged.

**t05-unmodifiable-list-view** — Program proves `addThroughView=UnsupportedOperationException`,
`viewSeesBackingChange=2`, `backingStillModifiable=2`; options A and B match and C/D are disproved.
Nothing flagged.

**t05-wildcard-extends-read** — Program compiles `Number n = values.get(0)` under three different
actual type arguments (`Integer`, `Double`, `Long`) and prints each; option A matches. Nothing
flagged.

**t05-wildcard-super-integer** — Program compiles `values.add(Integer.valueOf(1))` and
`Object x = values.get(0)` against `List<Integer>`, `List<Number>`, `List<Object>` and
`List<Comparable<Integer>>`; options A and B match. The `listOfObject` case makes option C's
explanation concrete rather than hypothetical. Nothing flagged.

## t06 — Streams and lambda expressions

**t06-collectors-tomap-duplicate-key** — Program proves `thrown=IllegalStateException` and
`withMergeFunction={a=ab}`; option C matches and option A is disproved by the contrast. Nothing
flagged.

**t06-findfirst-ordered-stream** — Program proves `sequential=a` and `parallel=a`, which disproves
options B and D by measurement; option A matches. Nothing flagged.

**t06-flatmap-flatten** — Program proves `map=[2, 1]` against `flatMap=[1, 2, 3]`; option A matches.
Nothing flagged.

**t06-functional-interface-extra-methods** — Strong evidence: the interface carries
`@FunctionalInterface` plus a `default`, a `static` and three abstract `Object`-method
redeclarations, and `Named named = () -> "ana";` compiles. If any of those cost the interface its
single abstract method the file would not compile. Options A, B, C match.
- *Option explanation hedges.* Option D's explanation is "That **generally** leaves more than one
  abstract method and prevents functional-interface status." For the case D states — two unrelated
  abstract instance methods with different signatures — the outcome is not "generally", it is
  certain. The hedge leaves a learner unsure whether there is an exception.

**t06-generate-limit-count** — Prints `3`; key mechanically linked. Nothing flagged.

**t06-intstream-average** — Prints `2.0`; key mechanically linked. Nothing flagged.

**t06-lambda-effectively-final** — `COMPILE_ERROR: cant.ref.non.effectively.final.var`, a diagnostic
code that names option B's rule directly. Nothing flagged.

**t06-lambda-this-enclosing-instance** — Program proves `lambda=true:enclosing:enclosing`,
`anonymous=false:true:enclosing`, `lambdaThisIsEnclosing=true`; option B matches, and the
anonymous-class contrast disproves option A by measurement. Nothing flagged.

**t06-parallel-foreachordered** — Prints `0123`; key mechanically linked.
- *Reference title names a type that does not have the method.* The reference is titled
  `BaseStream and IntStream forEachOrdered (Java SE 21)` and the URL is
  `IntStream.html#forEachOrdered(java.util.function.IntConsumer)`. `BaseStream` declares no
  `forEachOrdered` at all — it is declared on each of `Stream`, `IntStream`, `LongStream`,
  `DoubleStream`. The URL is fine; the title should drop `BaseStream`.

**t06-reduce-empty-identity** — Program proves `empty=10` and `nonEmpty=13`; option B matches and the
non-empty case disproves option A's premise. Nothing flagged.

**t06-stream-single-use** — Program proves `first=3` then `second=IllegalStateException`; option B
matches.
- *Reference granularity.* Anchor-less `Stream` class page, one of the largest in the API. The
  single-use rule is in the class description's stream-operations block, reachable as
  `Stream.html#StreamOps`.

**t06-string-length-method-reference** — Program proves `applied=4` through
`ToIntFunction<String> length = String::length;`, so option A is established.
- *Prompt admits more than one true answer, and the program proves it.* The prompt is "Which
  functional-interface target is **compatible** with the method reference `String::length`?" The same
  program then compiles `Function<String, Integer> boxed = String::length;` and prints `boxed=3`. So
  the question's own evidence shows at least two compatible targets, and the `Main.java` comment says
  so outright: "The boxing form fits too, which is why the question asks for the primitive one." But
  the *prompt* does not ask for the primitive one — nothing in it narrows to a primitive
  specialisation, and only the absence of `Function<String, Integer>` from the option list makes A
  unique. This is the clearest prompt-ambiguity case in the batch, and the author already identified
  it in a code comment. Rewording to "which of the following targets" or "which primitive-specialised
  target" would resolve it.

**t06-to-unmodifiable-list-null** — Program proves `add=UnsupportedOperationException` and
`withNullElement=NullPointerException`; options A and B match and D is disproved. Nothing flagged.

## t07 — Packaging, deploying and the Java Platform Module System

**t07-automatic-module-jar** — Program builds a JAR with no descriptor, finds it with
`ModuleFinder.of`, and proves `automatic=true`, `name=com.example.widgets`, `version=1.4`,
`packages=[com.example.widgets]`, `requires=[mandated java.base]`. Option A matches, and the derived
name and version are genuinely strong evidence.
- *One check looks at the wrong place.* The first line is
  `System.out.println("hasModuleInfo=" + Files.exists(dir.resolve("module-info.class")))`. `dir` is
  the temporary *directory* the JAR was written into, not the JAR. The line therefore tests whether a
  loose `module-info.class` sits next to the JAR — which it never would — rather than whether the
  JAR contains one. The premise it is meant to establish ("An ordinary JAR has no
  `module-info.class`") is true by construction of the `JarOutputStream` a few lines above, so the
  answer is unaffected; the output line is simply not evidence for the thing it is named after. A
  reviewer deciding whether this question's program "really establishes" its claim should know one of
  its six output lines does not.
- The reference (`ModuleDescriptor.isAutomatic()`, anchored) describes automatic modules but is not
  where the module-path discovery rule lives; `ModuleFinder.of` or JLS 7.7.1 would support the prompt
  more directly. Minor.

**t07-export-does-not-make-type-public** — `COMPILE_ERROR: not.def.public.cant.access` from a module
graph where the exported package's *public* type is reachable and its package-private sibling is not;
option B matches, and the code names the exact distinction. One of the better compile-error
questions. Nothing flagged.

**t07-implicit-java-base** — Program proves `requires=[java.base[MANDATED]]` for a module declared
as `module app {}` with no directives, plus `readsJavaBase=true`; option A matches.
- *Printed constant.* `System.out.println("declaredRequires=0")` is a literal string. It happens to
  be true, and the computed `requires=` line immediately below does establish that java.base is the
  only requirement, so this is redundant rather than misleading — but it reads as a measurement and
  is not one.

**t07-import-wildcard-no-subpackages** — `COMPILE_ERROR: cant.resolve.location` on
`ConcurrentHashMap` after `import java.util.*;`. Option A matches.
- *The asserted diagnostic code does not pin the rule.* `cant.resolve.location` is javac's generic
  "cannot find symbol" code. The build asserts only that *some* error carries it, so this question
  would still pass if the program failed for an unrelated reason — a typo, a missing import, a
  renamed class. Contrast `t03-generic-erasure-overload` (`name.clash.same.erasure`) or
  `t04-multicatch-related-types` (`multicatch.types.must.be.disjoint`), where the code names the rule
  and the evidence is therefore specific. Same issue in `t07-unnamed-package-import`. A reviewer
  should treat the evidence here as "this does not compile" rather than "this does not compile for
  the stated reason".

**t07-java-module-launch** — Program prints `initialModule=com.example.app`, `mainClass=p.Main`,
`modulePathWasGiven=true`, read from `jdk.module.main`, `jdk.module.main.class` and
`jdk.module.path`. Option A matches.
- *Evidence lives in the test harness, not the question.* The `Main.java` comment is candid: "This
  question is proved by how the build runs it." `ContentPackTest.modularEntryPoint` builds
  `--module-path <out> --module <module>/<mainclass>`, and the program reads back what that launch
  recorded. That is real evidence, but it is the only question in the pack whose proof is a property
  of the harness rather than of the question's own code: if `modularEntryPoint` were ever rewritten to
  launch differently, this question's evidence would change silently and the build would still be
  green. It also says nothing about why options B, C and D are wrong.
- *Reference granularity.* The reference is the `java` command man page with no anchor — a very long
  page. The `--module-path` and `--module` descriptions have anchors within it.

**t07-module-service-directives** — Excellent evidence: a three-module graph where `provider` is
pulled in only because `app` declares `uses s.Greeter`, proving `providerResolved=true`,
`loaded=[LOUD from provider]`, `declaredUses=[s.Greeter]`,
`providerProvides=[s.Greeter->[p.Loud]]`. Options A and B match.
- *Prompt asks for a "pair" but the options are single directives.* The prompt is "which directive
  **pair** is correct? Select all that apply." Option A is one directive (`uses ...`), option B is
  one directive (`provides ... with ...`); none of the four options is a pair. A reader can resolve
  this (the pair is A together with B) but has to guess that the prompt means "which halves of the
  pair are stated correctly". Rewording to "which directives are correct" would remove the guess.

**t07-object-module-name** — Prints `java.base`; key mechanically linked. Nothing flagged.

**t07-open-module-semantics** — The strongest module program in the batch: it proves `isOpen=true`,
`opensDirectives=0`, `exportsDirectives=[l]`, that the *unexported* package `h` is nonetheless open
(`hOpenToApp=true`), and that deep reflection into it succeeds
(`privateFieldOfUnexported=deeplyReflected`) while `hInExports=false`. Options A and C match.
- *Half the disproof of option B lives in another question.* The code comment says so explicitly:
  "The compile-time half of this — that a non-exported package still cannot be named in source — is
  proved by `t07-export-does-not-make-type-public`." That is an honest and sensible division (a
  program cannot both run and fail to compile), but it means option B ("Every package is
  automatically exported for ordinary source-level access") is disproved here only by
  `hInExports=false`, a descriptor query, with the behavioural half delegated. A reviewer should
  review the two questions together.

**t07-qualified-exports** — Program proves `toApp=true`, `toOther=true`, `toJavaBase=false`,
`lUnqualified=false`, `qUnqualified=true`, and that a module named in the `to` clause really can call
in (`readFromOther=internal`). Option A matches; the unqualified `exports q` control makes the
contrast concrete. Nothing flagged.

**t07-requires-static** — Program proves the run-time half of the key convincingly:
`optionalResolved=false` and `classLoaded=false` even though `optional` was compiled into the same
module path directory, and `modifiers=[STATIC]`.
- *Program never exercises the compile-time half it claims.* Option B is "The dependency is required
  at compile time but optional at run time", and the comment asserts "The whole graph compiled, which
  is the compile-time half of the claim." But `modules/app/a/Main.java` imports only
  `java.lang.module.ModuleDescriptor` and reaches the optional module's type exclusively through
  `Class.forName("o.Flag")` — a string, resolved at run time. **Nothing in `app` depends on
  `optional` at compile time**, so `app` would compile identically with `requires static optional;`
  deleted. The program therefore demonstrates that a static requires does *not* resolve at run time,
  and demonstrates nothing at all about compile time. Adding one compile-time use of `o.Flag` in
  `app` would make the whole key mechanical. This is the sharpest evidence gap in the batch.

**t07-static-import-member** — Prints `5`; key mechanically linked. Nothing flagged.

**t07-unnamed-module-isnamed** — Prints `false`; key mechanically linked. The prompt states the
class-path launch condition explicitly, which matches how the harness runs non-modular questions.
Nothing flagged.

**t07-unnamed-package-import** — `COMPILE_ERROR: cant.resolve.location` when a type in package `p`
names a top-level type from the unnamed package. Option C matches, and the code comment is honest
that `import Helper;` is not even grammatical so a plain reference is the fair test.
- *The asserted diagnostic code does not pin the rule.* Same as
  `t07-import-wildcard-no-subpackages`: `cant.resolve.location` is javac's generic cannot-find-symbol
  code, so the evidence is "this does not compile", not "this does not compile because of the
  unnamed-package restriction".

## t08 — Managing concurrent code execution

**t08-atomic-compare-and-set** — Prints `true 20`; key mechanically linked. Nothing flagged.

**t08-atomicinteger-update-and-get** — Prints `6`; key mechanically linked. Nothing flagged.

**t08-completablefuture-join-vs-get** — Program proves `join=CompletionException` and
`get=ExecutionException`, which is exactly the distinction options A and B draw.
- *A printed line does not do what it is named.* The third line is
  `System.out.println("bothWrapTheSameCause=" + CompletableFuture.completedFuture("ok").join())`,
  which prints `bothWrapTheSameCause=ok`. That is the result of joining a **successfully** completed
  future; it says nothing whatever about whether `join` and `get` wrap the same cause. The label
  promises a comparison the code never performs. (The underlying claim is true — both wrap the cause
  — but it is unevidenced, so the line should either be renamed to what it shows, or extended to
  compare `getCause()` from both.)
- Option B also mentions `InterruptedException`, which the program never produces. Minor.

**t08-computeifabsent-null-result** — Program proves `returned=null`, `containsKey=false`, `size=0`;
option B matches and A is disproved. Nothing flagged.

**t08-concurrenthashmap-null** — Program proves `nullKey=NullPointerException` and
`nullValue=NullPointerException`; options A and B match.
- *Reference granularity.* Anchor-less `ConcurrentHashMap` class page. The null prohibition is in the
  class description, so the page is defensible, but there is no anchor to the paragraph.
- *Near-duplicate.* See `t05-map-of-null-rejection`; the two are structurally the same question.
  Review them together.

**t08-countdownlatch-count** — Prints `0`; key mechanically linked.
- *Reference granularity.* Anchor-less `CountDownLatch` class page; `#countDown()` and `#getCount()`
  both have anchors.

**t08-reentrantlock-finally** — A rich program: `lockedAfterFinally=false`,
`holdCountAfterFinally=0`, the reentrancy sequence `2 → 1 → 0`, and
`unlockWithoutLock=IllegalMonitorStateException`. Option A matches.
- *A code comment contradicts its own code and the program's own output.* The `withoutFinally()`
  method is:
  `LOCK.lock(); try { throw new IllegalStateException("boom"); } catch (IllegalStateException e) { LOCK.unlock(); throw e; }`
  and its comment reads "The unlock here **is skipped** by the throw above in the common shape of
  this mistake: placing it after the protected code, inside the try, instead of in a finally." The
  unlock is not skipped — it is in the `catch`, it runs, and the program then prints
  `catchVariantAlsoReleases=true` confirming the lock *was* released. So the comment describes a
  different code shape than the one written, and the one thing this method demonstrates is a case
  where unlocking outside a `finally` works — which cuts against option C's explanation ("Inside a
  catch block only … would miss normal completion"). The answer (option A) is still right and still
  well evidenced by `protectedWork()`. A reviewer should decide whether to fix the comment, change
  the method to the shape the comment describes (unlock as the last statement inside `try`), or drop
  it.
- *Reference granularity.* Anchor-less `Lock` interface page; the lock/`finally`/unlock idiom is in
  its class description.

**t08-start-virtual-thread** — Program proves `returnsAThread=true`, `isVirtual=true`, `ran=true`,
`ranOnCallingThread=false`, which disproves options B and C by measurement; option A matches.
Nothing flagged.

**t08-synchronized-method-lock** — Program uses `Thread.holdsLock` to prove
`instanceHoldsReceiver=true`, `instanceHoldsClass=false`, `staticHoldsClass=true`,
`staticHoldsInstance=false`, with `beforeAnyLock`/`afterAllLocks` controls at both ends. Options A
and B match and D is disproved. One of the cleanest questions in the batch. Nothing flagged.

**t08-synchronized-reentrant** — Program proves `outer=entered` then `inner=entered`, so the nested
acquisition of the same monitor succeeded; option B matches, and the program not hanging disproves
option A.
- *Printed constant.* `System.out.println("deadlocked=false")` is a literal. The real proof of
  "no self-deadlock" is that the program reached that line at all. Harmless but it reads as a
  measurement.

**t08-thread-interrupted-clears** — Program proves `first=true` then `second=false`; option A matches
and option B is disproved by the second call. Nothing flagged.

**t08-virtual-thread-builder-unstarted** — Program proves `isVirtual=true`, `state=NEW`,
`alive=false`, and `startVirtualThreadIsNew=false` as a contrast; options A and B match and C is
disproved.
- *Reference granularity.* Anchor-less `Thread.Builder.OfVirtual` page; `#unstarted(java.lang.Runnable)`
  has an anchor.

**t08-volatile-increment** — Program proves the visibility half of option B rigorously: the spin on
`while (!flag)` terminates only because a volatile write from another thread became visible.
- *Program does not establish the second half of the key, and the code says so.* Option B is
  "Updates are visible according to volatile semantics, **but increments can still be lost**." The
  `Main.java` comment is explicit: "The lost-update half cannot be made deterministic … Asserting
  that a loss was observed would be a test that passes most of the time, which is worse than not
  asserting it." What it prints instead is `neverExceedsExpected=true` and `atLeastOne=true` — both
  of which hold perfectly well in a run where *no* increment is lost. That decision is the right
  engineering call (a flaky assertion would be worse), but the consequence is that for its central
  claim this question is **Asserted wearing a Verified program**, which is the exact failure mode ADR
  0011's closing consequence warns about: "calling a question Verified when its program does not
  actually establish the answer." The build derives the tier from the presence of a program, so
  nothing surfaces this.
- *Explanation asserts something the reference does not cover.* The explanation's load-bearing claim
  is that "`count++` is a compound read-modify-write operation and is not made atomic merely because
  the field is volatile." The only reference is `JLS 17.4.5 Happens-before Order`, which specifies
  visibility and ordering and says nothing about the decomposition of `count++`. That is JLS 15.14.2
  (postfix increment) together with JLS 17.4's non-atomicity discussion. A reviewer verifying the
  explanation against the cited source will not find the non-atomicity claim there.

## t09 — Java I/O API

**t09-bufferedreader-readline** — Program proves `line1=one`, `line2=two`, `end=null`. The absence of
blank lines in `expected.txt` is genuine evidence for option A (terminators excluded), and `end=null`
is direct evidence for option B. Nothing flagged.

**t09-dataoutput-readutf** — Prints `Java`; key mechanically linked. Nothing flagged.

**t09-files-copy-existing-target** — Program proves `thrown=FileAlreadyExistsException` and then
`afterReplaceExisting=from the source`, so the opt-in nature of replacement is demonstrated rather
than asserted; option C matches. Nothing flagged.

**t09-files-lines-close** — Program proves `read=[one, two, three]`,
`afterClose=IllegalStateException`, `firstOnly=one`. Option A matches.
- *Program does not establish the key, and one check is vacuous.* The key is "Use it in
  try-with-resources so the stream, **and therefore the file**, is closed." Two problems. First,
  `streamIsAutoCloseable=true` is computed as
  `AutoCloseable.class.isAssignableFrom(Stream.class)` — a property of `Stream` itself, true of
  *every* stream including one from `List.of(...)`, because `BaseStream extends AutoCloseable`. It
  does not distinguish a file-backed stream from any other, yet the comment above it says "An
  ordinary Stream from a collection has nothing to release", implying it does. Second,
  `afterClose=IllegalStateException` is likewise true of any closed stream and shows nothing about a
  file handle. The comment is candid about the gap: "that closing is also what releases the file
  handle is what the javadoc states". So the operative claim rests on the javadoc, not the program.
  A reviewer should decide whether to accept that (reasonable — releasing a handle is hard to observe
  portably) or to strengthen it, e.g. by deleting or re-opening the file on a platform where an open
  handle prevents it.

**t09-files-readstring-utf8** — Program prints `defaultMatchesUtf8=true`, `explicitUtf8Matches=true`,
`latin1Matches=false`. Option B is "UTF-8."
- *The program cannot distinguish the correct option from option A.* Option A is "The platform
  default charset." Since JEP 400 (Java 18), **the platform default charset *is* UTF-8**, so
  `defaultMatchesUtf8=true` is exactly what you would observe whether `Files.readString(Path)`
  specifies UTF-8 or merely delegates to the platform default. The `latin1Matches=false` line only
  rules out ISO-8859-1, which no option proposes. The key is correct — the one-argument overload is
  specified as UTF-8, and the cited `Files.readString(Path)` javadoc says so — but the *program
  proves nothing that separates B from A*, and A is the question's most attractive distractor. Making
  this mechanical would need the run to force a non-UTF-8 default (`-Dfile.encoding=ISO-8859-1`),
  which the harness does not support. Worth the reviewer's eye precisely because the question looks
  verified and the distractor is the live confusion.

**t09-files-walk-close** — Program genuinely proves option B (laziness):
`visitedWhenThreeTaken=3 taken=3` from `walk.peek(visited::add).limit(3)` shows only three entries
were ever visited, which disproves option D by measurement. `depthOneEntries=7` against
`totalEntries=12` is a nice `maxDepth` control.
- *One check is vacuous.* `streamIsAutoCloseable=true` is again
  `AutoCloseable.class.isAssignableFrom(Stream.class)`, true of every stream, under a comment
  claiming it shows "the walk holds directory handles open as it descends". Option A ("should
  normally be used in try-with-resources") rests on the javadoc, not on this line.

**t09-path-normalize-namecount** — Prints `2`; key mechanically linked. Nothing flagged.

**t09-path-relativize** — Prints `3`; key mechanically linked. Nothing flagged.

**t09-path-resolve-absolute** — Program proves `resolveReturnsOther=true` and
`resolveRelativeAppends=true` as a control, and derives the absolute path with `toAbsolutePath()` so
it works on every platform; option B matches. Nothing flagged.

**t09-randomaccessfile-seek** — Program proves `pointerAfterSeek=3`, `readAt3=D`,
`pointerAfterRead=4`, `readAt3Again=D` (absolute, not relative), in-place write
(`content=AxCDEFGH`), and seek-past-end (`lengthAfterSeekPastEnd=8`, `readPastEnd=-1`). Option A
matches and B/C are disproved. Nothing flagged.

**t09-reader-vs-inputstream** — Program proves `chars=2 bytes=3`,
`inputStreamRead=[97, 195, 169]` against `readerRead=[97, 233]`, which is direct evidence for
options A and B. Good evidence.
- *A code comment contradicts the file's actual bytes.* The comment reads "One character that is not
  ASCII, written **as an escape so this source file stays ASCII**: U+00E9". The source does not use an
  escape: `String text = "aé";` contains raw UTF-8 bytes `C3 A9`. I verified it — this is one of only
  three files in the pack with non-ASCII bytes (the other two are the t10 Collator questions, which
  make no ASCII claim). It compiles because `ContentPackTest` passes
  `StandardCharsets.UTF_8` to the file manager, but a learner who copies the snippet into a build
  that relies on the platform source encoding may not get the same result, which is the "hidden
  dependency on unspecified environment behavior" the content policy asks a reviewer to check.
  Writing `"aé"` would make the comment true.

**t09-serialization-serialversionuid** — The most elaborate program in the batch, and it earns it:
`declared=102030405060708`, `computedIsNonZero=true`, `roundTrip=kept`,
`identifierFoundInStream=true`, then it flips one bit of the UID inside the serialized bytes and gets
`mismatch=InvalidClassException` with `mentionsIncompatible=true`. Option B is established end to
end. Nothing flagged.

**t09-serialization-transient-static** — Program proves `kept=kept-original`, `transient=null`, and
`static=static-changed` (the static was reassigned after writing and the change survived
deserialization, proving it was never instance state). Options A and B match. Good evidence.
- *Reference title names a section the URL does not reach.* The reference is titled
  `Java Object Serialization Specification: Serializable Fields` and points at
  `.../specs/serialization/serial-arch.html` with no anchor. That page is titled **"1 - System
  Architecture"** and has no section called "Serializable Fields"; the text that supports the claim
  ("Default serializable fields of a class are defined to be the non-transient and non-static
  fields") is §1.5 "Defining Serializable Fields for a Class", anchored as
  `#defining-serializable-fields-for-a-class`. Verified against the live page. The citation is to the
  right document and the right chapter, but a reader following the title will not find a section by
  that name.

## t10 — Implementing localization

**t10-collator-locale-sensitive** — Program proves a lot: `String.compareTo` puts `"a"` after `"B"`
while an English `Collator` puts it before (`theyDisagree=true`), and German sorts `ä` before `z`
while Swedish sorts it after (`sameInputDifferentOrder=true`). Option A ("Collator") matches.
- *Distractors are not plausible, and the `difficultyRationale` describes a different question.* The
  options are `Collator`, `StringBuilder`, `Scanner`, `Formatter`. None of the three distractors is a
  string-comparison API at all, so a candidate who has merely heard of `Collator` answers this
  without any of the knowledge the program demonstrates. The rationale says the question "Tests the
  API intended for locale-sensitive string comparison **rather than code-unit or natural String
  ordering**" — but `String.compareTo` and `Comparator`, the two things that contrast would be
  against, are not among the options. The program tests the stated contrast; the question does not.
  A reviewer should decide whether the `MEDIUM` label survives, and whether swapping a distractor for
  `String.compareTo` would make the item test what its rationale claims.
- *Locale-data dependency.* `german_umlautA_z=before` and `swedish_umlautA_z=after` come from the
  JDK's bundled CLDR collation data. That data is versioned with the JDK *build*, not with the Java
  *release*, so ADR 0011's release-scoped reference check offers no protection here: a CLDR update in
  a future 21.0.x could in principle change the expected output. Lower risk for this well-established
  Swedish rule than for most, but it is a class of dependency the rest of the pack avoids.

**t10-collator-primary-strength** — Program proves `primaryIgnoresCase=true`,
`primaryIgnoresAccent=true`, `primarySeesBaseLetters=false`, then walks the strength ladder
(`secondarySeesAccent=true`, `secondaryIgnoresCase=true`, `tertiarySeesCase=true`) and confirms
`compare == 0` agrees with `equals`. Option A matches; thorough evidence.
- *Locale-data dependency.* Same CLDR caveat as above, and the source contains raw non-ASCII bytes
  (`"résume"`). The strength semantics being tested are stable, so the risk is lower than the
  dependency's generality suggests, but a reviewer checking "no hidden dependency on unspecified
  environment behavior" should see it.

**t10-currency-us-code** — Prints `USD`; key mechanically linked. Nothing flagged.

**t10-datetimeformatter-locale-immutability** — Program proves `sameInstance=false`,
`baseLocale=en-US`, `frenchLocale=fr-FR`, which establishes option B and disproves option C.
- *Half of option A is unevidenced.* Option A is "DateTimeFormatter is immutable **and
  thread-safe**." `sameInstance=false` shows `withLocale` returns a different object; it does not
  show the class is immutable in general, and nothing in the program touches threads at all. Both
  properties are documented in the class description, so the key is sound — but a reviewer checking
  whether the program establishes the answer should know only the `withLocale` half is mechanical.
- *Reference granularity (minor).* Anchor-less `DateTimeFormatter` page; the immutability and
  thread-safety statement is in the class description.

**t10-locale-builder-language-tag** — Prints `pt-BR`; key mechanically linked. Option B's explanation
usefully contrasts `toString` formatting with BCP 47. Nothing flagged.

**t10-locale-default-categories** — Program proves `categories=[DISPLAY, FORMAT]`, that setting one
leaves the other alone (`displayAfterSet=fr_FR`, `formatAfterSet=ja_JP`, `categoriesDiffer=true`),
and that the no-argument `setDefault` moves both.
- *Program does not establish what the key actually claims.* Options A and B are not "the two
  categories exist and are independent" — they are "`DISPLAY` is associated with **display-oriented
  locale data**" and "`FORMAT` is associated with **locale-sensitive formatting**". Nothing in the
  program ever calls a display API or a formatting API, so it never shows that either category *does
  the job its name describes*. What it proves is the mechanics (two enum constants, independent
  defaults). The semantics the options assert come from the javadoc. One `getDisplayLanguage()` call
  and one `NumberFormat`/`DateTimeFormatter` call under the two mismatched defaults would close this
  gap completely, and would be a better question for it.
- *Mutates JVM-global state.* The program calls `Locale.setDefault(...)` four times, restoring in a
  `finally` (with a comment about restore ordering). Harmless as the harness runs each program in its
  own JVM, but it is the only question in the batch whose program changes process-wide state, and it
  would become a cross-test hazard if programs were ever run in-process.

**t10-locale-language-tag** — Program proves `language=pt`, `country=BR`; option A matches.
- *Reference granularity.* Anchor-less `Locale` class page, one of the largest in `java.util`. The
  claim is about `forLanguageTag`, `getLanguage` and `getCountry`, all of which have anchors.

**t10-locale-root** — Program proves `language=[]`, `country=[]`, `variant=[]`, `toString=[]`,
`toLanguageTag=und`, `equalsEnglish=false`; options A and B match and D is disproved. Nothing
flagged.

**t10-messageformat-apostrophe** — Program proves all four pattern cases:
`placeholder=value is x`, `quoted=value is {0}`, `doubled=it's x`, `loneQuote=its {0}`. Option A
matches, and `quoted=` disproves option C (the quote characters are not emitted) by measurement. Uses
`Locale.ROOT` explicitly so nothing depends on the machine default. The best-evidenced question in
t10. Nothing flagged.

**t10-numberformat-currency-instance** — Program proves `usCurrency=USD`, `usFractionDigits=2`,
`japanCurrency=JPY`, `japanFractionDigits=0`, `currenciesDiffer=true`, `formatsDiffer=true`; option A
matches.
- *Reference granularity.* Anchor-less `NumberFormat` class page; `#getCurrencyInstance(java.util.Locale)`
  has an anchor, as do the two distractor factories.
- The fraction-digit and symbol results come from JDK locale data; stable for USD/JPY, but it is the
  same class of dependency as the two Collator questions.

**t10-percent-format-us** — Prints `25%`; key mechanically linked. Nothing flagged.

**t10-resourcebundle-missing-key** — Program proves `present=a value`,
`missing=MissingResourceException`, `containsKey=false`; option C matches and A/D are disproved.
Nothing flagged.

**t10-resourcebundle-parent-lookup** — Program proves `fromParent=from the parent`,
`childOverrides=child value`, `keySetIncludesParent=true`; option A matches and C is disproved.
Nothing flagged.

---

## The ten to put in front of a human first

Ordered by how much reviewer time the finding saves, and how likely it is that the reviewer would
otherwise miss it.

1. **`t01-math-round-negative`** — the explanation states a rule (`Math.round(a)` ≡
   `(long) Math.floor(a + 0.5d)`) that the question's own Java 21 reference does not contain and that
   is false: verified locally, `Math.round(0.49999999999999994)` is `0` while
   `floor(0.49999999999999994 + 0.5)` is `1`. The answer is right, the stated reason is wrong, and a
   learner memorising the explanation will get a different question wrong. Fixable in one sentence.

2. **`t02-switch-yield-block`** — option B's explanation says `return value;` "exits the enclosing
   method"; javac says `error: attempt to return out of a switch expression` (I compiled it with
   `--release 21`). A distractor's explanation teaching the opposite of what the compiler does.
   Also a one-sentence fix.

3. **`t07-requires-static`** — the question claims "required at compile time but optional at run
   time" and the comment claims "the whole graph compiled, which is the compile-time half". But
   `app` reaches the optional module only through `Class.forName("o.Flag")`, so nothing in it depends
   on `optional` at compile time and the module would compile with the directive deleted. The run-time
   half is excellent; the compile-time half is unproven. One added import makes the key fully
   mechanical.

4. **`t08-volatile-increment`** — the program, by its author's own documented choice, cannot
   demonstrate a lost update; `neverExceedsExpected=true` holds in runs where nothing is lost. So the
   second half of the answer key is Asserted while the question presents as Verified — the exact
   honesty risk ADR 0011's final consequence names. Its reference (JLS 17.4.5, happens-before) also
   does not cover the `count++` non-atomicity the explanation rests on. Needs a human decision about
   whether this is a Verified question at all.

5. **`t09-files-readstring-utf8`** — `defaultMatchesUtf8=true` cannot distinguish the correct answer
   ("UTF-8") from the leading distractor ("the platform default charset"), because since JEP 400 the
   platform default *is* UTF-8. The question looks mechanically verified and its evidence is silent
   on the only confusion it tests.

6. **`t08-reentrantlock-finally`** — a comment asserts "The unlock here is skipped by the throw
   above" about code where the unlock is in a `catch`, runs, and is confirmed to run by the program's
   own `catchVariantAlsoReleases=true`. The comment, the code, and the output disagree with each
   other, and the surviving demonstration slightly undercuts option C's explanation. Needs an author
   decision, not just a wording tweak.

7. **`t06-string-length-method-reference`** — the prompt asks which functional-interface target is
   "compatible" with `String::length`, and the question's own program compiles two of them
   (`ToIntFunction<String>` and `Function<String, Integer>`) and prints both. The uniqueness of the
   key comes only from the option list, not the prompt. The author flagged it in a comment; a
   reviewer should settle the wording.

8. **`t07-java-module-launch`** — the only question whose proof is a property of
   `ContentPackTest.modularEntryPoint` rather than of the question's own code; it reads back the
   launch flags the harness happened to use. Worth a deliberate decision about whether that counts as
   Verified, because the same pattern will be tempting for future launcher questions and the build
   would stay green if the harness changed.

9. **`t09-files-lines-close` with `t09-files-walk-close`** — both hinge on
   `AutoCloseable.class.isAssignableFrom(Stream.class)`, which is true of every stream ever created
   and therefore proves nothing about a file-backed one, presented under comments claiming it does.
   `files-walk` does separately earn its laziness claim; `files-lines` ends up resting its whole key
   on the javadoc. Review them together — one decision fixes both.

10. **`t02-switch-null-default-combination`, `t06-parallel-foreachordered`,
    `t09-serialization-transient-states`** — the three reference **title** mismatches, verified
    against the live official pages: §14.11.1 is "Switch Blocks", not "The Selector Expression";
    `BaseStream` has no `forEachOrdered`; and `serial-arch.html` is "1 - System Architecture" with no
    section called "Serializable Fields" (the supporting text is §1.5, anchored
    `#defining-serializable-fields-for-a-class`). All three URLs are official, release-correct and
    actually contain the supporting text, so ADR 0011's mechanical check passes and will never catch
    these. Cheapest batch of fixes in the whole document, and the only flag class where the pack is
    currently telling a reader something checkably untrue about its own sources.

### Suggested reading order for the rest

The 20 reference-granularity flags are mechanical and can be swept in one sitting without exam
knowledge — most are a matter of appending an existing anchor. The 15 "program does not establish the
key" flags are the ones that need someone who knows Java 21, and nine of them cluster in t07 and t09.
Everything marked *Nothing flagged* above still needs ADR 0011's Verified-tier human checks (one
defensible reading, plausible distractors, complete explanations, accessible formatting) — this
document has not performed those; it has only found the places where the evidence and the answer key
do not line up.

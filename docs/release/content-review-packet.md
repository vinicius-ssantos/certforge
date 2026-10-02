# Content review packet

Generated from `content/java-se-21` by `content/build-review-packet.mjs`. **Do not edit by hand**: regenerate it, and make changes in the pack. Verdicts live in `content/java-se-21/review.json`.

**20 of 100 questions carry a current review** by vinicius-ssantos, recorded on 2026-10-02. 0 have been edited since being reviewed and need a new one; 80 have never been reviewed. Each is marked below.

The build checks that every code snippet compiles for Java 21 and prints what the question says (the "Verified by the build" lines), and that an option carrying that output is the one marked correct. It cannot judge wording, ambiguity, the quality of the explanations or whether the question tests the exam objective. That is what a human review is for.

## What this review does not establish

- The questions are AI-assisted drafts written in this repository, and the reviewer is the project owner rather than an independent third party. The content policy allows exactly this, but a second reviewer would be stronger evidence.
- The reviewer reported no errors rather than ticking each of the seven policy checks per question, so this record claims a verdict, not a per-check audit.
- A question with no runnable code rests entirely on this review and its references, because the build verifies nothing about it. The packet lists which ones those are, as it stands.
- The exam objective wording seeded in the catalog was not part of this review of the questions. It was checked separately against Oracle's page, in a browser on 2026-10-02, and matched.
- Nothing is verified by the build in 73 of the 100 questions: `t01-bigdecimal-equals-scale`, `t01-bigdecimal-nonterminating-divide`, `t01-boolean-parseboolean`, `t01-integer-boxing-guarantee`, `t01-localdate-plus-years-leap-day`, `t01-numeric-promotion-byte-addition`, `t01-period-vs-duration`, `t01-string-strip-vs-trim`, `t02-case-null-pattern-switch`, `t02-continue-for-update`, `t02-do-while-first-execution`, `t02-enhanced-for-variable-assignment`, `t02-pattern-variable-and-scope`, `t02-switch-rule-no-fallthrough`, `t02-switch-yield-block`, `t03-covariant-return`, `t03-default-method-conflict`, `t03-enum-constructor-access`, `t03-overload-most-specific`, `t03-private-interface-method`, `t03-record-components-members`, `t03-sealed-direct-subclass-modifier`, `t04-autocloseable-close-contract`, `t04-catch-order-unreachable`, `t04-multicatch-parameter-reassignment`, `t04-multicatch-related-types`, `t04-overriding-checked-exception`, `t04-suppressed-exception`, `t04-unchecked-exception-classes`, `t05-arrays-aslist-backed`, `t05-map-of-null-rejection`, `t05-sequenced-collection-reversed`, `t05-set-of-duplicate-elements`, `t05-treeset-comparator-uniqueness`, `t05-wildcard-extends-read`, `t05-wildcard-super-integer`, `t06-findfirst-ordered-stream`, `t06-flatmap-flatten`, `t06-lambda-effectively-final`, `t06-reduce-empty-identity`, `t06-stream-facts`, `t06-stream-single-use`, `t06-string-length-method-reference`, `t06-to-unmodifiable-list-null`, `t07-automatic-module-jar`, `t07-exports-and-opens`, `t07-implicit-java-base`, `t07-java-module-launch`, `t07-module-service-directives`, `t07-open-module-semantics`, `t07-qualified-exports`, `t07-requires-static`, `t08-completablefuture-join-vs-get`, `t08-concurrenthashmap-null`, `t08-start-virtual-thread`, `t08-synchronized-method-lock`, `t08-synchronized-reentrant`, `t08-thread-interrupted-clears`, `t08-volatile-increment`, `t09-bufferedreader-readline`, `t09-files-copy-existing-target`, `t09-files-lines-close`, `t09-path-resolve-absolute`, `t09-randomaccessfile-seek`, `t09-reader-vs-inputstream`, `t09-serialization-transient-static`, `t10-collator-locale-sensitive`, `t10-datetimeformatter-locale-immutability`, `t10-locale-default-categories`, `t10-locale-language-tag`, `t10-messageformat-apostrophe`, `t10-numberformat-currency-instance`, `t10-resourcebundle-missing-key`.

## How to review

1. Read each question as a learner would, **without** looking at the answer key, and answer it yourself.
2. Compare with the answer key and the reasons. Run the code if there is any doubt.
3. Make the checks below yourself. A question that is ambiguous or disputed must not be published: write what is wrong under it.
4. Record the verdict in `content/java-se-21/review.json`: your name, the date, and for each question its verdict and the digest printed under it. A question you did not look at must not get an entry.
5. Then, in the editorial desk, approve it (a person other than the author) or request changes with the comment you wrote here.
6. Check the objective wording of the topics against Oracle's page for the exam (see "Before publishing anything in this track" in the [content authoring guide](../engineering/content-authoring.md)).

The checks, from the [content policy](../product/content-policy.md):

1. There is one defensible interpretation of the prompt.
2. The answer is correct for Java 21, and any code compiles and behaves as stated.
3. There is no hidden dependency on the environment or on unspecified behavior.
4. The wrong options are plausible, and not tricks unrelated to the objective.
5. Every explanation is complete and right, including the reasons for the wrong options.
6. Code and prose are readable with assistive technology.
7. The references let someone verify the answer independently.

## Questions

| # | Question | Topic | Type | Difficulty | Runnable code | Review |
|---:|---|---|---|---|---|---|
| 1 | [`t01-bigdecimal-equals-scale`](#1-t01-bigdecimal-equals-scale) | Date, time, text, numeric and boolean values | single | medium | no (conceptual) | **not reviewed** |
| 2 | [`t01-bigdecimal-nonterminating-divide`](#2-t01-bigdecimal-nonterminating-divide) | Date, time, text, numeric and boolean values | single | medium | no (conceptual) | **not reviewed** |
| 3 | [`t01-boolean-parseboolean`](#3-t01-boolean-parseboolean) | Date, time, text, numeric and boolean values | multiple | easy | no (conceptual) | **not reviewed** |
| 4 | [`t01-integer-boxing-guarantee`](#4-t01-integer-boxing-guarantee) | Date, time, text, numeric and boolean values | single | medium | no (conceptual) | reviewed 2026-10-02 |
| 5 | [`t01-localdate-plus-months`](#5-t01-localdate-plus-months) | Date, time, text, numeric and boolean values | single | medium | yes, shown | reviewed 2026-10-02 |
| 6 | [`t01-localdate-plus-years-leap-day`](#6-t01-localdate-plus-years-leap-day) | Date, time, text, numeric and boolean values | single | medium | no (conceptual) | **not reviewed** |
| 7 | [`t01-numeric-promotion-byte-addition`](#7-t01-numeric-promotion-byte-addition) | Date, time, text, numeric and boolean values | single | easy | no (conceptual) | **not reviewed** |
| 8 | [`t01-period-vs-duration`](#8-t01-period-vs-duration) | Date, time, text, numeric and boolean values | multiple | medium | no (conceptual) | **not reviewed** |
| 9 | [`t01-string-strip-vs-trim`](#9-t01-string-strip-vs-trim) | Date, time, text, numeric and boolean values | single | medium | no (conceptual) | **not reviewed** |
| 10 | [`t01-stringbuilder-reverse-chain`](#10-t01-stringbuilder-reverse-chain) | Date, time, text, numeric and boolean values | single | easy | yes, shown | **not reviewed** |
| 11 | [`t02-case-null-pattern-switch`](#11-t02-case-null-pattern-switch) | Controlling program flow | single | medium | no (conceptual) | **not reviewed** |
| 12 | [`t02-continue-for-update`](#12-t02-continue-for-update) | Controlling program flow | single | medium | no (conceptual) | **not reviewed** |
| 13 | [`t02-do-while-first-execution`](#13-t02-do-while-first-execution) | Controlling program flow | single | easy | no (conceptual) | **not reviewed** |
| 14 | [`t02-enhanced-for-variable-assignment`](#14-t02-enhanced-for-variable-assignment) | Controlling program flow | single | medium | no (conceptual) | **not reviewed** |
| 15 | [`t02-labeled-break-count`](#15-t02-labeled-break-count) | Controlling program flow | single | medium | yes, shown | **not reviewed** |
| 16 | [`t02-pattern-switch-guard`](#16-t02-pattern-switch-guard) | Controlling program flow | single | medium | yes, shown | reviewed 2026-10-02 |
| 17 | [`t02-pattern-variable-and-scope`](#17-t02-pattern-variable-and-scope) | Controlling program flow | single | hard | no (conceptual) | **not reviewed** |
| 18 | [`t02-switch-dominance`](#18-t02-switch-dominance) | Controlling program flow | single | hard | yes, shown | reviewed 2026-10-02 |
| 19 | [`t02-switch-rule-no-fallthrough`](#19-t02-switch-rule-no-fallthrough) | Controlling program flow | single | easy | no (conceptual) | **not reviewed** |
| 20 | [`t02-switch-yield-block`](#20-t02-switch-yield-block) | Controlling program flow | single | medium | no (conceptual) | **not reviewed** |
| 21 | [`t03-covariant-return`](#21-t03-covariant-return) | Object-oriented concepts in Java | single | medium | no (conceptual) | **not reviewed** |
| 22 | [`t03-default-method-conflict`](#22-t03-default-method-conflict) | Object-oriented concepts in Java | single | hard | no (conceptual) | **not reviewed** |
| 23 | [`t03-enum-constructor-access`](#23-t03-enum-constructor-access) | Object-oriented concepts in Java | single | easy | no (conceptual) | **not reviewed** |
| 24 | [`t03-overload-most-specific`](#24-t03-overload-most-specific) | Object-oriented concepts in Java | single | medium | no (conceptual) | **not reviewed** |
| 25 | [`t03-overload-null`](#25-t03-overload-null) | Object-oriented concepts in Java | single | medium | yes, shown | reviewed 2026-10-02 |
| 26 | [`t03-private-interface-method`](#26-t03-private-interface-method) | Object-oriented concepts in Java | multiple | medium | no (conceptual) | **not reviewed** |
| 27 | [`t03-record-compact-normalization`](#27-t03-record-compact-normalization) | Object-oriented concepts in Java | single | medium | yes, shown | **not reviewed** |
| 28 | [`t03-record-components-members`](#28-t03-record-components-members) | Object-oriented concepts in Java | multiple | medium | no (conceptual) | **not reviewed** |
| 29 | [`t03-record-facts`](#29-t03-record-facts) | Object-oriented concepts in Java | multiple | medium | yes, not shown | reviewed 2026-10-02 |
| 30 | [`t03-sealed-direct-subclass-modifier`](#30-t03-sealed-direct-subclass-modifier) | Object-oriented concepts in Java | multiple | medium | no (conceptual) | **not reviewed** |
| 31 | [`t04-autocloseable-close-contract`](#31-t04-autocloseable-close-contract) | Handling exceptions | single | medium | no (conceptual) | **not reviewed** |
| 32 | [`t04-catch-order-unreachable`](#32-t04-catch-order-unreachable) | Handling exceptions | single | easy | no (conceptual) | **not reviewed** |
| 33 | [`t04-finally-abrupt-completion`](#33-t04-finally-abrupt-completion) | Handling exceptions | single | medium | yes, shown | **not reviewed** |
| 34 | [`t04-finally-return`](#34-t04-finally-return) | Handling exceptions | single | easy | yes, shown | reviewed 2026-10-02 |
| 35 | [`t04-multicatch-parameter-reassignment`](#35-t04-multicatch-parameter-reassignment) | Handling exceptions | single | medium | no (conceptual) | **not reviewed** |
| 36 | [`t04-multicatch-related-types`](#36-t04-multicatch-related-types) | Handling exceptions | single | medium | no (conceptual) | **not reviewed** |
| 37 | [`t04-overriding-checked-exception`](#37-t04-overriding-checked-exception) | Handling exceptions | multiple | medium | no (conceptual) | **not reviewed** |
| 38 | [`t04-suppressed-exception`](#38-t04-suppressed-exception) | Handling exceptions | single | hard | no (conceptual) | **not reviewed** |
| 39 | [`t04-try-with-resources-order`](#39-t04-try-with-resources-order) | Handling exceptions | single | medium | yes, shown | reviewed 2026-10-02 |
| 40 | [`t04-unchecked-exception-classes`](#40-t04-unchecked-exception-classes) | Handling exceptions | multiple | easy | no (conceptual) | **not reviewed** |
| 41 | [`t05-arrays-aslist-backed`](#41-t05-arrays-aslist-backed) | Arrays and collections | multiple | medium | no (conceptual) | **not reviewed** |
| 42 | [`t05-immutable-and-fixed-size-lists`](#42-t05-immutable-and-fixed-size-lists) | Arrays and collections | single | medium | yes, shown | reviewed 2026-10-02 |
| 43 | [`t05-list-first-last`](#43-t05-list-first-last) | Arrays and collections | single | easy | yes, shown | **not reviewed** |
| 44 | [`t05-list-remove-overload`](#44-t05-list-remove-overload) | Arrays and collections | single | medium | yes, shown | reviewed 2026-10-02 |
| 45 | [`t05-map-of-null-rejection`](#45-t05-map-of-null-rejection) | Arrays and collections | multiple | easy | no (conceptual) | **not reviewed** |
| 46 | [`t05-sequenced-collection-reversed`](#46-t05-sequenced-collection-reversed) | Arrays and collections | multiple | medium | no (conceptual) | **not reviewed** |
| 47 | [`t05-set-of-duplicate-elements`](#47-t05-set-of-duplicate-elements) | Arrays and collections | single | easy | no (conceptual) | **not reviewed** |
| 48 | [`t05-treeset-comparator-uniqueness`](#48-t05-treeset-comparator-uniqueness) | Arrays and collections | single | hard | no (conceptual) | **not reviewed** |
| 49 | [`t05-wildcard-extends-read`](#49-t05-wildcard-extends-read) | Arrays and collections | single | medium | no (conceptual) | **not reviewed** |
| 50 | [`t05-wildcard-super-integer`](#50-t05-wildcard-super-integer) | Arrays and collections | multiple | medium | no (conceptual) | **not reviewed** |
| 51 | [`t06-findfirst-ordered-stream`](#51-t06-findfirst-ordered-stream) | Streams and lambda expressions | single | medium | no (conceptual) | **not reviewed** |
| 52 | [`t06-flatmap-flatten`](#52-t06-flatmap-flatten) | Streams and lambda expressions | single | medium | no (conceptual) | **not reviewed** |
| 53 | [`t06-intstream-average`](#53-t06-intstream-average) | Streams and lambda expressions | single | easy | yes, shown | **not reviewed** |
| 54 | [`t06-lambda-effectively-final`](#54-t06-lambda-effectively-final) | Streams and lambda expressions | single | easy | no (conceptual) | **not reviewed** |
| 55 | [`t06-reduce-empty-identity`](#55-t06-reduce-empty-identity) | Streams and lambda expressions | single | medium | no (conceptual) | **not reviewed** |
| 56 | [`t06-stream-facts`](#56-t06-stream-facts) | Streams and lambda expressions | multiple | medium | no (conceptual) | reviewed 2026-10-02 |
| 57 | [`t06-stream-laziness`](#57-t06-stream-laziness) | Streams and lambda expressions | single | hard | yes, shown | reviewed 2026-10-02 |
| 58 | [`t06-stream-single-use`](#58-t06-stream-single-use) | Streams and lambda expressions | single | easy | no (conceptual) | **not reviewed** |
| 59 | [`t06-string-length-method-reference`](#59-t06-string-length-method-reference) | Streams and lambda expressions | single | medium | no (conceptual) | **not reviewed** |
| 60 | [`t06-to-unmodifiable-list-null`](#60-t06-to-unmodifiable-list-null) | Streams and lambda expressions | multiple | medium | no (conceptual) | **not reviewed** |
| 61 | [`t07-automatic-module-jar`](#61-t07-automatic-module-jar) | Packaging, deploying and the Java Platform Module System | single | medium | no (conceptual) | **not reviewed** |
| 62 | [`t07-exports-and-opens`](#62-t07-exports-and-opens) | Packaging, deploying and the Java Platform Module System | multiple | hard | no (conceptual) | reviewed 2026-10-02 |
| 63 | [`t07-implicit-java-base`](#63-t07-implicit-java-base) | Packaging, deploying and the Java Platform Module System | single | easy | no (conceptual) | **not reviewed** |
| 64 | [`t07-java-module-launch`](#64-t07-java-module-launch) | Packaging, deploying and the Java Platform Module System | single | medium | no (conceptual) | **not reviewed** |
| 65 | [`t07-module-service-directives`](#65-t07-module-service-directives) | Packaging, deploying and the Java Platform Module System | multiple | medium | no (conceptual) | **not reviewed** |
| 66 | [`t07-open-module-semantics`](#66-t07-open-module-semantics) | Packaging, deploying and the Java Platform Module System | multiple | hard | no (conceptual) | **not reviewed** |
| 67 | [`t07-qualified-exports`](#67-t07-qualified-exports) | Packaging, deploying and the Java Platform Module System | single | medium | no (conceptual) | **not reviewed** |
| 68 | [`t07-requires-static`](#68-t07-requires-static) | Packaging, deploying and the Java Platform Module System | single | hard | no (conceptual) | **not reviewed** |
| 69 | [`t07-requires-transitive`](#69-t07-requires-transitive) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | reviewed 2026-10-02 |
| 70 | [`t07-unnamed-module-isnamed`](#70-t07-unnamed-module-isnamed) | Packaging, deploying and the Java Platform Module System | single | medium | yes, shown | **not reviewed** |
| 71 | [`t08-atomicinteger-update-and-get`](#71-t08-atomicinteger-update-and-get) | Managing concurrent code execution | single | easy | yes, shown | **not reviewed** |
| 72 | [`t08-completablefuture-join-vs-get`](#72-t08-completablefuture-join-vs-get) | Managing concurrent code execution | multiple | hard | no (conceptual) | **not reviewed** |
| 73 | [`t08-concurrenthashmap-null`](#73-t08-concurrenthashmap-null) | Managing concurrent code execution | multiple | easy | no (conceptual) | **not reviewed** |
| 74 | [`t08-executor-close`](#74-t08-executor-close) | Managing concurrent code execution | single | medium | yes, shown | reviewed 2026-10-02 |
| 75 | [`t08-start-virtual-thread`](#75-t08-start-virtual-thread) | Managing concurrent code execution | single | medium | no (conceptual) | **not reviewed** |
| 76 | [`t08-synchronized-method-lock`](#76-t08-synchronized-method-lock) | Managing concurrent code execution | multiple | medium | no (conceptual) | **not reviewed** |
| 77 | [`t08-synchronized-reentrant`](#77-t08-synchronized-reentrant) | Managing concurrent code execution | single | medium | no (conceptual) | **not reviewed** |
| 78 | [`t08-thread-interrupted-clears`](#78-t08-thread-interrupted-clears) | Managing concurrent code execution | single | medium | no (conceptual) | **not reviewed** |
| 79 | [`t08-virtual-thread-daemon`](#79-t08-virtual-thread-daemon) | Managing concurrent code execution | single | medium | yes, not shown | reviewed 2026-10-02 |
| 80 | [`t08-volatile-increment`](#80-t08-volatile-increment) | Managing concurrent code execution | single | medium | no (conceptual) | **not reviewed** |
| 81 | [`t09-bufferedreader-readline`](#81-t09-bufferedreader-readline) | Java I/O API | multiple | easy | no (conceptual) | **not reviewed** |
| 82 | [`t09-files-copy-existing-target`](#82-t09-files-copy-existing-target) | Java I/O API | single | medium | no (conceptual) | **not reviewed** |
| 83 | [`t09-files-lines-close`](#83-t09-files-lines-close) | Java I/O API | single | medium | no (conceptual) | **not reviewed** |
| 84 | [`t09-path-normalize-namecount`](#84-t09-path-normalize-namecount) | Java I/O API | single | medium | yes, shown | **not reviewed** |
| 85 | [`t09-path-resolve-absolute`](#85-t09-path-resolve-absolute) | Java I/O API | single | medium | no (conceptual) | **not reviewed** |
| 86 | [`t09-randomaccessfile-seek`](#86-t09-randomaccessfile-seek) | Java I/O API | single | medium | no (conceptual) | **not reviewed** |
| 87 | [`t09-read-all-lines`](#87-t09-read-all-lines) | Java I/O API | single | medium | yes, shown | reviewed 2026-10-02 |
| 88 | [`t09-reader-vs-inputstream`](#88-t09-reader-vs-inputstream) | Java I/O API | multiple | easy | no (conceptual) | **not reviewed** |
| 89 | [`t09-serialization-facts`](#89-t09-serialization-facts) | Java I/O API | multiple | hard | yes, not shown | reviewed 2026-10-02 |
| 90 | [`t09-serialization-transient-static`](#90-t09-serialization-transient-static) | Java I/O API | multiple | medium | no (conceptual) | **not reviewed** |
| 91 | [`t10-collator-locale-sensitive`](#91-t10-collator-locale-sensitive) | Implementing localization | single | medium | no (conceptual) | **not reviewed** |
| 92 | [`t10-datetimeformatter-locale-immutability`](#92-t10-datetimeformatter-locale-immutability) | Implementing localization | multiple | medium | no (conceptual) | **not reviewed** |
| 93 | [`t10-locale-builder-language-tag`](#93-t10-locale-builder-language-tag) | Implementing localization | single | easy | yes, shown | **not reviewed** |
| 94 | [`t10-locale-default-categories`](#94-t10-locale-default-categories) | Implementing localization | multiple | medium | no (conceptual) | **not reviewed** |
| 95 | [`t10-locale-language-tag`](#95-t10-locale-language-tag) | Implementing localization | single | easy | no (conceptual) | **not reviewed** |
| 96 | [`t10-locale-to-string`](#96-t10-locale-to-string) | Implementing localization | single | easy | yes, shown | reviewed 2026-10-02 |
| 97 | [`t10-messageformat-apostrophe`](#97-t10-messageformat-apostrophe) | Implementing localization | single | hard | no (conceptual) | **not reviewed** |
| 98 | [`t10-numberformat-currency-instance`](#98-t10-numberformat-currency-instance) | Implementing localization | single | easy | no (conceptual) | **not reviewed** |
| 99 | [`t10-resource-bundle-fallback`](#99-t10-resource-bundle-fallback) | Implementing localization | single | hard | yes, shown | reviewed 2026-10-02 |
| 100 | [`t10-resourcebundle-missing-key`](#100-t10-resourcebundle-missing-key) | Implementing localization | single | medium | no (conceptual) | **not reviewed** |

## 1. t01-bigdecimal-equals-scale

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Given `BigDecimal a = new BigDecimal("1.0")` and `BigDecimal b = new BigDecimal("1.00")`, which statement is correct?

- **A** a.equals(b) is true and a.compareTo(b) is 0.
- **B** a.equals(b) is false and a.compareTo(b) is 0.
- **C** a.equals(b) is true and a.compareTo(b) is nonzero.
- **D** Both methods throw ArithmeticException because the scales differ.

### Answer key and reasons

- **A: incorrect.** `equals` also considers scale, and the scales differ.
- **B: correct.** The scales differ for `equals`, while the numerical values compare as equal.
- **C: incorrect.** This reverses both relevant contracts.
- **D: incorrect.** Different scales are valid BigDecimal representations and do not cause these comparisons to throw.

### Explanation

`BigDecimal.equals` requires both numerical value and scale to be equal, so these values are not equal by `equals`. `compareTo` compares numerical value and therefore returns zero.

### Why this difficulty

Requires distinguishing BigDecimal's representation-sensitive equals contract from its numerical ordering comparison.

### References

- [BigDecimal (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:9ef4fd637d6c94153ba2213f7b71028a6ee0cdb9613b5ff5af8fee0aeb9eb69a"`, `"verified": null`

**Comments:**

&nbsp;

## 2. t01-bigdecimal-nonterminating-divide

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What happens when `new BigDecimal("1").divide(new BigDecimal("3"))` is evaluated with no rounding mode or MathContext?

- **A** It returns 0.3333333333 using a default precision.
- **B** It returns 0 because both operands were created from integer-looking strings.
- **C** It throws ArithmeticException.
- **D** It returns Double.NaN.

### Answer key and reasons

- **A: incorrect.** This overload does not silently choose a default precision.
- **B: incorrect.** BigDecimal division is decimal arithmetic, not integer division.
- **C: correct.** A non-terminating decimal expansion requires a rounding rule for this operation.
- **D: incorrect.** BigDecimal does not represent this situation with floating-point NaN.

### Explanation

The exact decimal expansion of 1/3 is non-terminating. The no-rounding overload requires an exact representable quotient and throws `ArithmeticException` otherwise.

### Why this difficulty

Tests the exact division contract of BigDecimal when no rounding mode is supplied.

### References

- [BigDecimal.divide(BigDecimal) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html#divide(java.math.BigDecimal))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:fc689ebbf924f5d369c3ad37c59325b46029037e46d2cf05ddf1f167b4847ac8"`, `"verified": null`

**Comments:**

&nbsp;

## 3. t01-boolean-parseboolean

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** multiple choice, select all that apply · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which strings cause `Boolean.parseBoolean(value)` to return `true`? Select all that apply.

- **A** "true"
- **B** "TRUE"
- **C** "TrUe"
- **D** "yes"

### Answer key and reasons

- **A: correct.** It matches `true` exactly.
- **B: correct.** The comparison is case-insensitive.
- **C: correct.** Mixed case also matches because case is ignored.
- **D: incorrect.** The method does not treat `yes` as a true value.

### Explanation

`Boolean.parseBoolean` returns true exactly when the argument is non-null and equals `"true"` ignoring case.

### Why this difficulty

Checks the exact text rule used by Boolean.parseBoolean rather than relying on common truthy-string conventions from other languages.

### References

- [Boolean.parseBoolean(String) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Boolean.html#parseBoolean(java.lang.String))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:0b1e7623275f6a34616baa9b67706d684411c852f8fda72205d1a0a30cae7b2e"`, `"verified": null`

**Comments:**

&nbsp;

## 4. t01-integer-boxing-guarantee

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Two `Integer` variables `a` and `b` are each initialized by autoboxing the same `int` literal. Which statement is guaranteed by the Java language specification?

- **A** For `Integer a = 100, b = 100;` the expression `a == b` is always `true`.
- **B** For `Integer a = 1000, b = 1000;` the expression `a == b` is always `false`.
- **C** When both operands are `Integer`, `==` unboxes them and compares the numeric values.
- **D** `a.equals(b)` returns `false` whenever `a` and `b` are different objects.

### Answer key and reasons

- **A: correct.** JLS 5.1.7 requires boxing conversions of the same int value between -128 and 127 to produce identical references, so the comparison is always true.
- **B: incorrect.** The specification does not promise a new object for values outside the cached range. An implementation may cache more values, so the result is unspecified rather than always false.
- **C: incorrect.** Unboxing happens for == only when one operand is a primitive numeric type. With two reference operands, == is a reference equality test.
- **D: incorrect.** Integer.equals compares the wrapped int values, so two distinct Integer objects holding the same value are equal.

### Explanation

Autoboxing an int between -128 and 127 is guaranteed to yield the same Integer object every time, so == on two such values is true. For values outside that range the specification allows either outcome, so code must not depend on it. When both operands of == are references, the operator compares identity, not numeric value; use equals to compare values.

### Why this difficulty

Separates what the language specification guarantees about boxed Integer identity from what a typical JVM happens to do, which is a common source of wrong assumptions.

### References

- [JLS 5.1.7 Boxing Conversion](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html#jls-5.1.7)
- [JLS 15.21.3 Reference Equality Operators == and !=](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.21.3)
- [Integer.valueOf(int), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Integer.html#valueOf(int))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:a2fbe740c9fa46fdb62cd9e5e9b5287d1abf6ebb534c3d4e67384a9757be5d0b"`, `"verified": null`

**Comments:**

&nbsp;

## 5. t01-localdate-plus-months

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> import java.time.LocalDate;
>
> public class Main {
>   public static void main(String[] args) {
>     LocalDate date = LocalDate.of(2024, 1, 31);
>     System.out.println(date.plusMonths(1));
>   }
> }
> ```

- **A** 2024-02-29
- **B** 2024-03-02
- **C** 2024-02-28
- **D** It throws a DateTimeException.

### Answer key and reasons

- **A: correct.** The day-of-month 31 is invalid in February, so the last valid day is used. 2024 is a leap year, which makes it the 29th.
- **B: incorrect.** This is what overflowing by days would give, but java.time never rolls over into the next month when adding months.
- **C: incorrect.** This would be correct in a non-leap year. 2024 is a leap year, so February has 29 days.
- **D: incorrect.** An invalid day-of-month after plusMonths is adjusted, not rejected. Exceptions come from invalid inputs to factory methods such as LocalDate.of.

### Explanation

LocalDate.plusMonths adds the months and, if the resulting day-of-month does not exist in the target month, uses the last valid day of that month. February 2024 has 29 days because 2024 is a leap year, so 31 January plus one month is 29 February.

### Why this difficulty

The naive expectation is an overflow into the next month or an exception; the candidate must know that java.time clamps to the last valid day.

### References

- [LocalDate.plusMonths(long), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html#plusMonths(long))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
2024-02-29
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:24805254eb5d6198170d923e3d1a25233edb90f634da9d21b943ff930afd0788"`, `"verified": "sha256:2b65ec693644068605c58315fc62d32e4eff6b2f515de973ce63f5bc6e3dcadf"`

**Comments:**

&nbsp;

## 6. t01-localdate-plus-years-leap-day

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What date results from `LocalDate.of(2024, 2, 29).plusYears(1)`?

- **A** 2025-02-28
- **B** 2025-03-01
- **C** 2024-02-28
- **D** It throws DateTimeException.

### Answer key and reasons

- **A: correct.** The invalid leap day is adjusted to the last valid day of February 2025.
- **B: incorrect.** The method adjusts to the last valid day of the target month rather than overflowing into March.
- **C: incorrect.** The year does advance by one.
- **D: incorrect.** `plusYears` defines an adjustment for this invalid target date.

### Explanation

Adding one year initially targets 2025-02-29, which is invalid because 2025 is not a leap year. `plusYears` resolves the result to the last valid day of the month, 2025-02-28.

### Why this difficulty

Requires knowing how LocalDate resolves an invalid leap-day result after adding years.

### References

- [LocalDate.plusYears(long) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html#plusYears(long))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:443fbe5186672dfe196388a78b2d33cb5a269f4d958d29769d30aae519dc2349"`, `"verified": null`

**Comments:**

&nbsp;

## 7. t01-numeric-promotion-byte-addition

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Given the declarations below, what is the compile-time type of `result`?
>
> ```java
> byte a = 10;
> byte b = 20;
> var result = a + b;
> ```

- **A** byte
- **B** short
- **C** int
- **D** long

### Answer key and reasons

- **A: incorrect.** The operands are bytes, but binary numeric promotion promotes them before the addition.
- **B: incorrect.** The result is not promoted merely to short; integral promotion reaches int for byte and short operands.
- **C: correct.** Binary numeric promotion converts both byte operands to int, so the addition expression has type int.
- **D: incorrect.** No operand is long, so there is no reason for the expression to be promoted to long.

### Explanation

For binary numeric addition, operands narrower than int are promoted to int. Therefore `a + b` has type int, and `var` infers int.

### Why this difficulty

Tests binary numeric promotion, a frequent source of surprises when arithmetic is applied to byte and short operands.

### References

- [JLS 5.6 Numeric Contexts](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html#jls-5.6)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:316807c7951d482af8c9258c8489c77a8b5155ec187a8d28e2970601f25f3ede"`, `"verified": null`

**Comments:**

&nbsp;

## 8. t01-period-vs-duration

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements correctly distinguish `Period` and `Duration`? Select all that apply.

- **A** Period is date-based and uses years, months, and days.
- **B** Duration is time-based and represents seconds plus a nanosecond adjustment.
- **C** Period is intended to represent nanosecond-precision elapsed time.
- **D** Duration stores years and months directly.

### Answer key and reasons

- **A: correct.** Those are the components represented by Period.
- **B: correct.** That is the representation documented for Duration.
- **C: incorrect.** Nanosecond-precision elapsed time belongs to Duration, not Period.
- **D: incorrect.** Duration is based on seconds and nanoseconds, not calendar years and months.

### Explanation

`Period` models a date-based amount in years, months, and days. `Duration` models a time-based amount in seconds and nanoseconds.

### Why this difficulty

Requires separating date-based amounts from time-based amounts in the java.time model.

### References

- [Period (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Period.html)
- [Duration (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Duration.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:7664d4024c80d840583bbce6e1c0538a346fcc1221123c3f46f1858e97452c0f"`, `"verified": null`

**Comments:**

&nbsp;

## 9. t01-string-strip-vs-trim

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statement best describes the difference between `String.strip()` and `String.trim()`?

- **A** strip() is Unicode-aware through Character.isWhitespace, while trim() uses the older <= U+0020 rule.
- **B** trim() removes all Unicode whitespace while strip() removes only ASCII spaces.
- **C** strip() changes internal whitespace but trim() changes only leading whitespace.
- **D** The two methods are specified to be identical for every possible string.

### Answer key and reasons

- **A: correct.** That is the key semantic difference documented by String.
- **B: incorrect.** This reverses their relevant whitespace behavior.
- **C: incorrect.** Both concern leading and trailing characters, not internal whitespace normalization.
- **D: incorrect.** They can differ for whitespace characters outside the legacy trim range.

### Explanation

`strip()` removes leading and trailing characters considered whitespace by `Character.isWhitespace`. `trim()` uses the older definition based on characters whose code point is less than or equal to U+0020.

### Why this difficulty

Requires distinguishing legacy trim semantics from the Unicode-aware whitespace semantics of strip.

### References

- [String (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:18beae388763468f5c0a8093db0a0a07798a3cb1b3ae7c63534d8059465f34ec"`, `"verified": null`

**Comments:**

&nbsp;

## 10. t01-stringbuilder-reverse-chain

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     var builder = new StringBuilder("ab");
>     builder.append(12).reverse();
>     System.out.println(builder);
>   }
> }
> ```

- **A** ab12
- **B** 21ba
- **C** 12ba
- **D** ba12

### Answer key and reasons

- **A: incorrect.** That is the state after append, before reverse is applied.
- **B: correct.** The entire sequence `ab12` is reversed.
- **C: incorrect.** reverse does not reverse only the original text; it reverses the whole current sequence.
- **D: incorrect.** This would reverse only `ab`, but reverse acts on all characters in the builder.

### Explanation

`append(12)` changes the builder from `ab` to `ab12`. `reverse()` then reverses the entire builder, producing `21ba`.

### Why this difficulty

Tests fluent StringBuilder mutation and the fact that reverse operates on the entire current sequence.

### References

- [StringBuilder (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuilder.html)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
21ba
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:aea8331fa93333dfad0351da8c4cbbfd9232762f383669c610388dd3a7b807f7"`, `"verified": "sha256:2726d07fc3e65530cfda68174f66f84801a7a197596407dfc620a796ca6ef207"`

**Comments:**

&nbsp;

## 11. t02-case-null-pattern-switch

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> In a Java 21 switch that needs to handle a null selector value explicitly, which label is designed for that case?

- **A** case null ->
- **B** case Object o ->
- **C** default null ->
- **D** case Optional.empty() ->

### Answer key and reasons

- **A: correct.** `case null` is the dedicated label for matching a null selector value.
- **B: incorrect.** A type pattern is not the dedicated null label.
- **C: incorrect.** This is not valid switch label syntax.
- **D: incorrect.** Optional.empty() is an object value and is unrelated to a null selector.

### Explanation

Java 21 switch labels may use `case null` to handle a null selector explicitly instead of handling null outside the switch.

### Why this difficulty

Tests the Java 21 switch feature that lets null handling be expressed directly in the switch labels.

### References

- [JLS 14.11 The switch Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.11)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:dcfcf7cf389a01f97b7ed8330171a5309a501c0afc0d0288477f85119b250b76"`, `"verified": null`

**Comments:**

&nbsp;

## 12. t02-continue-for-update

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Inside a basic `for (init; condition; update)` loop, a `continue` statement targets that loop. What happens before the loop condition is tested again?

- **A** The update expressions execute, then the condition is tested again.
- **B** The condition is tested immediately and the update expressions are skipped.
- **C** The initialization expressions execute again.
- **D** The loop always terminates.

### Answer key and reasons

- **A: correct.** That is the continue behavior for the basic for statement.
- **B: incorrect.** The update part is not skipped by a continue that targets the for loop.
- **C: incorrect.** Initialization occurs only when the for loop is first entered.
- **D: incorrect.** Continue starts the next iteration path; it does not inherently terminate the loop.

### Explanation

For a basic for statement, continuing the loop first executes the update expressions, then evaluates the condition for the next iteration.

### Why this difficulty

Requires knowing where a continue transfers control inside the basic for-loop execution sequence.

### References

- [JLS 14.14.1.3 Abrupt Completion of for Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.14.1.3)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:54629b7b4ee290d5f6db3807f98f71cd6ef7e8247d30cbacd8e325b424e9f295"`, `"verified": null`

**Comments:**

&nbsp;

## 13. t02-do-while-first-execution

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What guarantee does a `do { ... } while (condition);` loop make about its body?

- **A** The body executes at least once before the first condition test.
- **B** The condition is always tested before the body.
- **C** The body executes exactly once.
- **D** The body is skipped when the condition is initially false.

### Answer key and reasons

- **A: correct.** The condition follows the body in a do-while statement.
- **B: incorrect.** That describes a while statement, not a do-while statement.
- **C: incorrect.** It may repeat while the condition remains true.
- **D: incorrect.** The first condition test occurs after one body execution.

### Explanation

The body of a do statement executes before the condition is evaluated, so it executes at least once whenever control reaches the statement normally.

### Why this difficulty

Checks the defining control-flow distinction between do-while and while.

### References

- [JLS 14.13 The do Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.13)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:afd742e7cc3ab7537a7f2cff562ba7b7b9e5426307690adafa1f61f651ecba1d"`, `"verified": null`

**Comments:**

&nbsp;

## 14. t02-enhanced-for-variable-assignment

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Given `int[] values = {1, 2, 3};`, what happens to the array after `for (int value : values) { value++; }` completes?

- **A** The array becomes {2, 3, 4}.
- **B** The array remains {1, 2, 3}.
- **C** The array becomes {2, 2, 3}.
- **D** The code does not compile because enhanced-for variables are implicitly final.

### Answer key and reasons

- **A: incorrect.** The loop variable is incremented, not the corresponding array element.
- **B: correct.** Each primitive element is copied into the iteration variable.
- **C: incorrect.** No element is written through the loop variable.
- **D: incorrect.** The iteration variable can be reassigned.

### Explanation

For each iteration, the current array element is assigned to the local iteration variable. Incrementing that local variable does not write a new primitive value back into the array.

### Why this difficulty

Requires distinguishing assignment to the enhanced-for iteration variable from mutation of the array element it was initialized from.

### References

- [JLS 14.14.2 The enhanced for statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.14.2)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:dfe236fb2fbacc249157abb42b1791277c5cb0251fd49f850015a73f1216b490"`, `"verified": null`

**Comments:**

&nbsp;

## 15. t02-labeled-break-count

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     int count = 0;
>     outer:
>     for (int i = 0; i < 3; i++) {
>       for (int j = 0; j < 3; j++) {
>         if (i == 1 && j == 1) {
>           break outer;
>         }
>         count++;
>       }
>     }
>     System.out.println(count);
>   }
> }
> ```

- **A** 3
- **B** 4
- **C** 5
- **D** 9

### Answer key and reasons

- **A: incorrect.** There is one additional increment at `i == 1, j == 0` before the labeled break.
- **B: correct.** Three increments occur for `i == 0`, then one more before the labeled break exits the outer loop.
- **C: incorrect.** The increment after the break condition is never reached.
- **D: incorrect.** The labeled break prevents the remaining loop iterations.

### Explanation

The first outer iteration increments `count` three times. On the second outer iteration it increments once for `j == 0`, then `break outer` exits both loops when `j == 1`. The final count is 4.

### Why this difficulty

Requires tracing nested loops and understanding that a labeled break exits the labeled statement rather than only the inner loop.

### References

- [JLS 14.15 The break Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.15)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
4
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:c01c05f1a2c10ad9dd3156dbc7ca74feae974a0b396d6d727ffcc6931d37c9d4"`, `"verified": "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"`

**Comments:**

&nbsp;

## 16. t02-pattern-switch-guard

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     Object value = 42;
>     String result =
>         switch (value) {
>           case Integer i when i > 40 -> "large";
>           case Integer i -> "small";
>           case String s -> "text";
>           default -> "other";
>         };
>     System.out.println(result);
>   }
> }
> ```

- **A** large
- **B** small
- **C** other
- **D** The code does not compile.

### Answer key and reasons

- **A: correct.** The first label, `Integer i when i > 40`, matches because the selector is an Integer and the guard 42 > 40 is true.
- **B: incorrect.** That label is reached only by Integer values for which the earlier guard is false. 42 satisfies the guard, so it never gets there.
- **C: incorrect.** The default label applies only when no other label matches. An Integer selector matches the first label.
- **D: incorrect.** The switch is exhaustive because of the default label, and the guarded label precedes the unguarded one, so there is no dominance error.

### Explanation

A switch with pattern labels evaluates the labels from top to bottom and selects the first one that matches. The value is an Integer and 42 is greater than 40, so the guarded label matches first and the result is large. The unguarded Integer label would only apply to Integer values that fail the guard.

### Why this difficulty

Requires reading a pattern-matching switch with a guard in order and recognising that the first matching label wins.

### References

- [JLS 14.11 The switch Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.11)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
large
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:7b9f33bbab91807a0a5d1a72bcba7224065f0a6ee616a936fe993599f9439974"`, `"verified": "sha256:d35c416a85b807e9b5384915d6ebb4a9f7352713efd89857b45a242f473728a9"`

**Comments:**

&nbsp;

## 17. t02-pattern-variable-and-scope

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Assume `obj` has type `Object`. Which condition validly uses pattern variable `s` on the right-hand side?

- **A** obj instanceof String s && s.length() > 0
- **B** obj instanceof String s || s.length() > 0
- **C** obj instanceof String s | s.length() > 0
- **D** obj instanceof String s ^ s.length() > 0

### Answer key and reasons

- **A: correct.** The right side executes only after the String pattern matched, so `s` is in scope.
- **B: incorrect.** The right side can execute after the pattern fails, so `s` is not definitely matched there.
- **C: incorrect.** Non-short-circuit `|` evaluates the right operand regardless of whether the pattern matched.
- **D: incorrect.** The right operand is not guarded by successful pattern matching.

### Explanation

With `&&`, the right operand is evaluated only if the pattern match succeeded, so `s` is definitely matched there. With `||`, `|`, or `^`, the right operand can be evaluated when the pattern did not match.

### Why this difficulty

Tests flow-sensitive scope of a pattern variable across short-circuit boolean operators.

### References

- [JLS 6.3.1 Scope of a Pattern Declaration](https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.3.1)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:a22c81aba1df224d02f15fca5e50fd29f7d02134896da423c07ae6ffc54da33a"`, `"verified": null`

**Comments:**

&nbsp;

## 18. t02-switch-dominance

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> What happens when this program is compiled and run with Java 21?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     Object value = 42;
>     String result =
>         switch (value) {
>           case Number n -> "number";
>           case Integer i -> "integer";
>           default -> "other";
>         };
>     System.out.println(result);
>   }
> }
> ```

- **A** It prints number.
- **B** It prints integer.
- **C** It does not compile because a case label is dominated by a preceding case label.
- **D** It compiles but throws a MatchException at run time.

### Answer key and reasons

- **A: incorrect.** This is what would happen if the program compiled, which is why the trap is tempting. It cannot run because of the dominance error.
- **B: incorrect.** The most specific label is not preferred. Labels are tried in order, and in any case the program is rejected before it runs.
- **C: correct.** Case Number dominates case Integer, which the compiler reports as an error. Reordering the labels so the more specific type comes first fixes it.
- **D: incorrect.** MatchException signals a failure to match in an exhaustive switch at run time. Here the problem is detected at compile time.

### Explanation

A pattern label dominates a later label when every value the later label could match is already matched by the earlier one. Every Integer is a Number, so the Integer label can never be selected after the Number label. The language makes this a compile-time error rather than silently ignoring the unreachable label, so the program does not compile.

### Why this difficulty

The code looks reasonable and would run if it compiled. The candidate must know the dominance rule for pattern labels and that it is a compile-time, not a run-time, problem.

### References

- [JLS 14.11.1 Switch Blocks (dominance of case labels)](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.11.1)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
COMPILE_ERROR: pattern.dominated
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:1b08bfb104293ab6a09b7785345619c737e8b747e4c7e8ea8ae77ca907055e12"`, `"verified": "sha256:9bc000eb5e1d7638deac445c820e4b235e7d8035a51679f335382f0c726c4b4c"`

**Comments:**

&nbsp;

## 19. t02-switch-rule-no-fallthrough

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which statement about an arrow-form switch rule such as `case 1 -> action();` is correct?

- **A** Execution automatically falls through to the next case unless break is written.
- **B** The rule does not fall through into the next case.
- **C** Arrow rules are allowed only in switch expressions, never switch statements.
- **D** The right side of an arrow rule must always be a block.

### Answer key and reasons

- **A: incorrect.** That is the risk with colon-style statement groups, not arrow rules.
- **B: correct.** Arrow rules have no implicit fall-through.
- **C: incorrect.** Arrow rules are available in both switch statements and switch expressions.
- **D: incorrect.** A rule may use an expression, a block, or a throw statement where the grammar permits.

### Explanation

Arrow switch rules do not fall through into a following rule. After the selected rule completes normally, the switch completes.

### Why this difficulty

Checks the control-flow distinction between arrow switch rules and traditional colon-labeled statement groups.

### References

- [JLS 14.11 The switch Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.11)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:b242031edf316e072ac889f837b7727dbd545e65e888ef81931e0ee3d68ce33e"`, `"verified": null`

**Comments:**

&nbsp;

## 20. t02-switch-yield-block

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A `case` arm of a switch expression uses a block and must produce the value of that arm. Which statement is used to provide that value from the block?

- **A** break value;
- **B** return value;
- **C** yield value;
- **D** continue value;

### Answer key and reasons

- **A: incorrect.** `break` does not provide a result value for a switch expression block.
- **B: incorrect.** `return` exits the enclosing method, not just the switch expression arm.
- **C: correct.** `yield` transfers control out of the switch expression block while providing its value.
- **D: incorrect.** `continue` applies to loops and does not produce a switch expression result.

### Explanation

A block in a switch expression uses `yield` to produce the value of the switch expression. `break` exits a switch statement but does not yield a value for a switch expression block.

### Why this difficulty

Requires distinguishing statement-style control transfer from producing a value from a block in a switch expression.

### References

- [JLS 14.21 The yield Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.21)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:1f903957483547db1a7824aebe113ae55eabdb87db3c96384d0eb2f1992e5573"`, `"verified": null`

**Comments:**

&nbsp;

## 21. t03-covariant-return

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A superclass declares `Number value()`. Which return type may an overriding instance method in a subclass declare?

- **A** Integer
- **B** Object only
- **C** String
- **D** void

### Answer key and reasons

- **A: correct.** Integer is a subtype of Number, so it is a covariant return type.
- **B: incorrect.** Object is broader than Number, not a covariant narrowing.
- **C: incorrect.** String is not a subtype of Number.
- **D: incorrect.** Changing a non-void return to void is not a valid override.

### Explanation

Java permits covariant return types for overriding methods. The overriding method may return a subtype of the overridden method's reference return type, such as `Integer` for `Number`.

### Why this difficulty

Checks a key overriding rule: an overriding method can narrow a reference return type.

### References

- [JLS 8.4.5 Method Result](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.5)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:26eeff7f3509172605a9ff9dc38ed7baecbf83c9534bc1890e2f5059bd22b95c"`, `"verified": null`

**Comments:**

&nbsp;

## 22. t03-default-method-conflict

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> A class implements two unrelated interfaces, and both interfaces declare a default method with the same signature. Neither default is more specific. What must the class do to compile?

- **A** Nothing; Java chooses the first interface listed in implements.
- **B** Override the method and resolve the conflict explicitly.
- **C** Mark the class final.
- **D** Make both interface methods static.

### Answer key and reasons

- **A: incorrect.** The order of interfaces in the implements clause does not resolve a default-method conflict.
- **B: correct.** An overriding declaration in the class removes the ambiguity.
- **C: incorrect.** Final prevents subclassing but does not resolve inherited default methods.
- **D: incorrect.** That would change the interfaces themselves; it is not the rule for resolving inherited defaults in the class.

### Explanation

When unrelated inherited defaults conflict and no rule selects one as more specific, the implementing class must provide an overriding method that resolves the conflict.

### Why this difficulty

Tests the conflict-resolution rule when a class inherits unrelated default methods with the same signature.

### References

- [JLS 9.4.1.3 Inheriting Methods with Override-Equivalent Signatures](https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html#jls-9.4.1.3)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:eb4409af4125d56ff4a03527eb2e922dfd072622a1414b72cfc421f545166833"`, `"verified": null`

**Comments:**

&nbsp;

## 23. t03-enum-constructor-access

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which statement about constructors declared in an enum class is correct?

- **A** An enum constructor may be public so callers can create new enum constants.
- **B** An enum constructor may be protected for subclass use.
- **C** An enum constructor is implicitly private when no access modifier is present.
- **D** An enum cannot declare a constructor.

### Answer key and reasons

- **A: incorrect.** Enum constants are fixed by the declaration; public enum constructors are prohibited.
- **B: incorrect.** Enum constructors cannot be protected.
- **C: correct.** That is the enum-specific constructor access rule.
- **D: incorrect.** Enums can and commonly do declare constructors for their constants.

### Explanation

An enum constructor is implicitly private when no access modifier is written, and it is a compile-time error to declare an enum constructor `public` or `protected`.

### Why this difficulty

Tests the special access rule for enum constructors, which differs from ordinary classes.

### References

- [JLS 8.9.2 Enum Body Declarations](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.9.2)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:c116ca78accd40bbd6dbc8e897375631b0e7d4f7dceea2f4a44267192f53df2e"`, `"verified": null`

**Comments:**

&nbsp;

## 24. t03-overload-most-specific

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Suppose a class declares `m(Object)`, `m(String)`, and `m(String...)`. Which overload is selected by the call `m("x")`?

- **A** m(Object)
- **B** m(String)
- **C** m(String...)
- **D** The call is ambiguous.

### Answer key and reasons

- **A: incorrect.** String is a subtype of Object, so the String overload is more specific for this argument.
- **B: correct.** It is the most specific applicable fixed-arity overload.
- **C: incorrect.** The varargs overload is not chosen when the more specific fixed-arity String overload applies.
- **D: incorrect.** Overload resolution can select the String overload unambiguously.

### Explanation

The fixed-arity `m(String)` overload is applicable and is more specific than `m(Object)`. The varargs method is not preferred over the more specific fixed-arity match.

### Why this difficulty

Requires applying overload resolution rather than assuming the broadest or varargs overload wins.

### References

- [JLS 15.12.2.5 Choosing the Most Specific Method](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.12.2.5)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:1b6f352210c6837847f625af4e8baaaa292dfd33fe43182cc6ebd1bf46154355"`, `"verified": null`

**Comments:**

&nbsp;

## 25. t03-overload-null

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> public class Main {
>   static void show(Object o) {
>     System.out.print("Object ");
>   }
>
>   static void show(String s) {
>     System.out.print("String ");
>   }
>
>   public static void main(String[] args) {
>     Object text = "hello";
>     show(text);
>     show("hello");
>     show(null);
>   }
> }
> ```

- **A** Object String String
- **B** String String String
- **C** Object Object String
- **D** The code does not compile because show(null) is ambiguous.

### Answer key and reasons

- **A: correct.** show(text) uses the static type Object; show("hello") and show(null) both select the most specific applicable method, show(String).
- **B: incorrect.** Methods are not chosen by the run-time type of an argument. The variable text has static type Object.
- **C: incorrect.** The literal "hello" has static type String, so the more specific overload applies to the second call.
- **D: incorrect.** A call is ambiguous only when neither candidate is more specific. String is a subtype of Object, so show(String) is strictly more specific. It would be ambiguous with two unrelated types such as String and Integer.

### Explanation

Overload resolution uses the static type of the argument. The variable text is declared as Object, so show(Object) is chosen even though it holds a String. The literal "hello" has type String, so the more specific show(String) applies. The null literal is compatible with both overloads and String is more specific than Object, so show(String) is chosen without ambiguity.

### Why this difficulty

Requires separating compile-time overload resolution, which uses static types, from run-time dispatch, and knowing how a null argument is resolved.

### References

- [JLS 15.12.2 Compile-Time Step 2: Determine Method Signature](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.12.2)
- [JLS 15.12.2.5 Choosing the Most Specific Method](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.12.2.5)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
Object String String
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:610a17628ad547aed33f9478cf6b1d1d2d4d9757394de00e0cbc27f3ea34827a"`, `"verified": "sha256:108f635869465d369f8d263885c1849c80b0c4ac86c984373abe5e27fcc27cf3"`

**Comments:**

&nbsp;

## 26. t03-private-interface-method

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about a `private` method declared in an interface are correct? Select all that apply.

- **A** It can be used as an implementation helper by methods declared in the same interface.
- **B** It is inherited as a private member by every implementing class.
- **C** It is not part of the implementing class's callable inherited API.
- **D** It is implicitly public because every interface method is public.

### Answer key and reasons

- **A: correct.** Private interface methods exist to share implementation details inside the interface.
- **B: incorrect.** Private interface methods are not inherited by implementing classes.
- **C: correct.** Its accessibility is confined to the interface that declares it.
- **D: incorrect.** Interfaces may explicitly declare private methods; the blanket public rule does not apply to them.

### Explanation

A private interface method is available only within the body of that interface. It is not inherited by implementing classes and is not part of their externally callable API.

### Why this difficulty

Requires understanding why interfaces can contain private helper methods without adding them to the implementing class's inherited API.

### References

- [JLS 9.4 Method Declarations in Interfaces](https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html#jls-9.4)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:cb5b92dca6b5a7d30cff7a1bdb4f8c2824df319cd28332d32d1ead6e35f48ff9"`, `"verified": null`

**Comments:**

&nbsp;

## 27. t03-record-compact-normalization

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> record Positive(int value) {
>   Positive {
>     value = Math.abs(value);
>   }
> }
>
> public class Main {
>   public static void main(String[] args) {
>     System.out.println(new Positive(-7).value());
>   }
> }
> ```

- **A** -7
- **B** 7
- **C** 0
- **D** It does not compile because compact constructors cannot reassign parameters.

### Answer key and reasons

- **A: incorrect.** The compact constructor changes the parameter before the implicit field assignment.
- **B: correct.** The parameter is normalized to 7, then the implicit canonical assignment stores 7.
- **C: incorrect.** There is no default-value assignment that overrides the canonical constructor parameter.
- **D: incorrect.** The parameter can be reassigned; direct assignment to the record component field is what is restricted in a compact constructor.

### Explanation

In a compact canonical constructor, the component fields are implicitly assigned from the constructor parameters after the body runs. Reassigning parameter `value` to its absolute value therefore changes what is stored.

### Why this difficulty

Tests the special assignment semantics of a compact canonical constructor in a record.

### References

- [JLS 8.10.4 Record Constructor Declarations](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10.4)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
7
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:df04a9d6024d47016bfe1f545c0be5e73b773d6309724d67b6110e0ea2c64ca1"`, `"verified": "sha256:7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"`

**Comments:**

&nbsp;

## 28. t03-record-components-members

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> For a record component declared in a record header, which members are mandated by the record declaration? Select all that apply.

- **A** A private final field corresponding to the component.
- **B** A public accessor method with the same name as the component.
- **C** A public setter method for the component.
- **D** A protected mutable field corresponding to the component.

### Answer key and reasons

- **A: correct.** Each component is represented by a private final field.
- **B: correct.** A public accessor is mandated for every record component.
- **C: incorrect.** Record components are not given setters; the corresponding fields are final.
- **D: incorrect.** The mandated field is private and final, not protected and mutable.

### Explanation

For each record component, the compiler provides a private final field and a public accessor with the component's name. A record also has a canonical constructor and is implicitly final as a class.

### Why this difficulty

Requires knowing which members the language mandates for a record instead of treating a record as only compact syntax.

### References

- [JLS 8.10 Record Classes](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10)
- [Record (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:0ff6b907dc8f3ebd5c84b47981593c5acf73d18ad45fc74bbcd638d25717afb8"`, `"verified": null`

**Comments:**

&nbsp;

## 29. t03-record-facts

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Consider the declaration `record Point(int x, int y) { }`. Which statements are true? Select all that apply.

- **A** The record class is implicitly final.
- **B** The record can explicitly extend another class, for example `extends Shape`.
- **C** The record can implement interfaces such as `Comparable<Point>`.
- **D** The record can declare extra instance fields in its body, such as `int z;`.
- **E** The field generated for each component is private and final.

### Answer key and reasons

- **A: correct.** JLS 8.10 states that a record class is implicitly final, so it cannot be extended.
- **B: incorrect.** A record implicitly extends java.lang.Record and its declaration has no extends clause.
- **C: correct.** A record may have an implements clause; it only cannot have an extends clause.
- **D: incorrect.** Instance fields other than those implied by the components are not allowed in a record body. Static fields are allowed.
- **E: correct.** For each record component the compiler implicitly declares a private final field.

### Explanation

A record is a restricted kind of class. It is implicitly final, implicitly extends java.lang.Record (so it cannot extend another class), and it may implement interfaces. For each component the compiler declares a private final field, and a record cannot declare further instance fields outside its header.

### Why this difficulty

Each statement targets a distinct rule about what a record may and may not declare, so guessing from general class knowledge leads to mistakes.

### References

- [JLS 8.10 Record Classes](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
true
java.lang.Record
true
true
2
```

That program, in one file:

`Main.java`:

```java
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;

public class Main {
  record Point(int x, int y) implements Comparable<Point> {
    public int compareTo(Point other) {
      return Integer.compare(x, other.x);
    }
  }

  public static void main(String[] args) throws Exception {
    Class<?> type = Point.class;
    Field x = type.getDeclaredField("x");
    System.out.println(Modifier.isFinal(type.getModifiers()));
    System.out.println(type.getSuperclass().getName());
    System.out.println(Modifier.isPrivate(x.getModifiers()) && Modifier.isFinal(x.getModifiers()));
    System.out.println(Comparable.class.isAssignableFrom(type));
    System.out.println(type.getDeclaredFields().length);
  }
}
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:f5f4762b3f2a338b25cdba4922389326500e4fb5396487f286fe1f66885aef2f"`, `"verified": "sha256:04b97a311ea0caea2d7a1f0630c56f85e39bc9c6cdb81d8e186d37c3bde1fd1b"`

**Comments:**

&nbsp;

## 30. t03-sealed-direct-subclass-modifier

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> For an ordinary class that directly extends a sealed class, which modifiers can satisfy the requirement that the subclass explicitly declare how sealing continues? Select all that apply.

- **A** final
- **B** sealed
- **C** non-sealed
- **D** abstract by itself

### Answer key and reasons

- **A: correct.** A final subclass closes that branch of the hierarchy.
- **B: correct.** A sealed subclass continues to restrict which declarations may directly extend it.
- **C: correct.** A non-sealed subclass reopens that branch to unrestricted subclassing.
- **D: incorrect.** `abstract` alone does not state the sealing status required for a direct subclass of a sealed class.

### Explanation

A direct subclass of a sealed class must be declared `final`, `sealed`, or `non-sealed` (subject to the detailed rules for the kind of declaration). These modifiers state whether the hierarchy stops, continues with a restricted set, or becomes open again.

### Why this difficulty

Requires knowing the closure rules for direct subclasses of a sealed class rather than only the syntax of the permits clause.

### References

- [JLS 8.1.1.2 sealed, non-sealed, and final Classes](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.1.2)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:0589970f182f47e2dba49a322d5becd6a7e221066cebe87e959d38c6a866d48a"`, `"verified": null`

**Comments:**

&nbsp;

## 31. t04-autocloseable-close-contract

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What checked exception type is the `AutoCloseable.close()` method declared to throw?

- **A** IOException only
- **B** Exception
- **C** Throwable
- **D** No checked exception

### Answer key and reasons

- **A: incorrect.** `Closeable.close()` narrows to IOException, but AutoCloseable itself declares Exception.
- **B: correct.** That is the declared checked exception type on AutoCloseable.close().
- **C: incorrect.** The method is not declared to throw the broader Throwable type.
- **D: incorrect.** The AutoCloseable interface declaration includes `throws Exception`.

### Explanation

`AutoCloseable.close()` is declared as `void close() throws Exception`. Implementations may narrow or omit that checked exception declaration.

### Why this difficulty

Tests the signature that makes AutoCloseable broadly usable in try-with-resources.

### References

- [AutoCloseable.close() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/AutoCloseable.html#close())

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:5ab0f4c702acf4f07745dea13ba6aee30aa0aa83a65f39c3b264cca0aff86787"`, `"verified": null`

**Comments:**

&nbsp;

## 32. t04-catch-order-unreachable

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Why is placing `catch (FileNotFoundException e)` after `catch (IOException e)` for the same try statement invalid?

- **A** The later catch is unreachable because the superclass catch already handles that subtype.
- **B** Java permits only one catch clause per try statement.
- **C** Checked exceptions cannot be caught.
- **D** FileNotFoundException is unrelated to IOException.

### Answer key and reasons

- **A: correct.** The broader IOException catch subsumes FileNotFoundException.
- **B: incorrect.** A try statement may have multiple catch clauses.
- **C: incorrect.** Checked exceptions are routinely caught; the issue is the ordering and subtype relationship.
- **D: incorrect.** FileNotFoundException extends IOException.

### Explanation

`FileNotFoundException` is a subtype of `IOException`. The earlier catch for `IOException` already catches every FileNotFoundException, so the later subtype catch cannot be reached.

### Why this difficulty

Checks catch-clause reachability when exception types have an inheritance relationship.

### References

- [JLS 11.2.3 Exception Checking](https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html#jls-11.2.3)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:e3960611c7004121f66ad18889cfbca1a5397b083d8e94f24539f969cd9e7eda"`, `"verified": null`

**Comments:**

&nbsp;

## 33. t04-finally-abrupt-completion

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   static int value() {
>     try {
>       return 1;
>     } finally {
>       throw new IllegalStateException();
>     }
>   }
>
>   public static void main(String[] args) {
>     try {
>       System.out.println(value());
>     } catch (IllegalStateException ex) {
>       System.out.println("thrown");
>     }
>   }
> }
> ```

- **A** 1
- **B** thrown
- **C** 1thrown
- **D** Nothing; the exception is swallowed by finally.

### Answer key and reasons

- **A: incorrect.** The return does not complete because the finally block throws before control leaves the method.
- **B: correct.** The exception from finally replaces the pending return.
- **C: incorrect.** The integer is never printed because `value()` never returns normally.
- **D: incorrect.** The exception originates in finally and propagates outward.

### Explanation

The `return 1` in the try block is pending, but the finally block then throws `IllegalStateException`. Because finally completes abruptly, the pending return is discarded and the exception propagates to main, which prints `thrown`.

### Why this difficulty

Tests the rule that abrupt completion of finally replaces a pending return from the try block.

### References

- [JLS 14.20.2 Execution of try-finally and try-catch-finally](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.2)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
thrown
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:9dbca48fc750ec8264bdb1aa0f6e7ed476b1ecf903b1ebcf0065712cea2f859a"`, `"verified": "sha256:3c259ed3deb3e27cb83273ac37621df8abc76d6f73d00d32cfebb2d4da5cc35f"`

**Comments:**

&nbsp;

## 34. t04-finally-return

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> public class Main {
>   static int compute() {
>     try {
>       return 1;
>     } finally {
>       System.out.print("cleanup ");
>     }
>   }
>
>   public static void main(String[] args) {
>     System.out.println(compute());
>   }
> }
> ```

- **A** cleanup 1
- **B** 1 cleanup
- **C** 1
- **D** cleanup

### Answer key and reasons

- **A: correct.** finally runs while compute() is still executing, before its result reaches println in main, so cleanup appears first.
- **B: incorrect.** The value is printed by main only after compute() has returned, which is after the finally block has already printed.
- **C: incorrect.** The finally block runs even when the try block returns, so it does print its text.
- **D: incorrect.** The method still returns 1 and main prints it. Only an exception escaping the finally block or System.exit would prevent that.

### Explanation

The return statement evaluates its expression and then control is about to leave the method, but the finally block always runs first. So cleanup is printed by the finally block, the method then returns 1, and only afterwards does main print the returned value.

### Why this difficulty

A single try/finally with a return tests the basic ordering rule: the finally block runs before control leaves the method.

### References

- [JLS 14.20.2 Execution of try-finally and try-catch-finally](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.2)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
cleanup 1
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:b399a71cdc40ede1c57471984ea2bb491506700850485c6168a550358535e9fe"`, `"verified": "sha256:0b545567f105495ea805011bb88b61161211226535998fa3e77730d4036c2765"`

**Comments:**

&nbsp;

## 35. t04-multicatch-parameter-reassignment

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Inside `catch (IOException | SQLException ex)`, which statement about assigning a new value to `ex` is correct?

- **A** Reassignment is allowed because catch parameters are ordinary local variables.
- **B** Reassignment is a compile-time error because the multi-catch parameter is implicitly final.
- **C** Reassignment is allowed only to another IOException.
- **D** Reassignment is allowed only when the catch body rethrows ex.

### Answer key and reasons

- **A: incorrect.** Multi-catch parameters have the special rule that they are implicitly final.
- **B: correct.** That restriction is part of the multi-catch language rules.
- **C: incorrect.** The issue is finality, not which alternative type the replacement value belongs to.
- **D: incorrect.** Rethrowing does not change the implicit-final rule.

### Explanation

An exception parameter in a multi-catch clause is implicitly final. Assigning another value to that parameter is a compile-time error.

### Why this difficulty

Tests the special treatment of exception parameters in a multi-catch clause.

### References

- [JLS 14.20 The try statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:fa6d1845fdb457fa94622d83cf09f8eb88382f4efab0da5f5a5c9f875ae3d8d3"`, `"verified": null`

**Comments:**

&nbsp;

## 36. t04-multicatch-related-types

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statement about the alternatives in a multi-catch parameter such as `catch (A | B ex)` is correct?

- **A** One alternative may be a subclass of another as long as it appears first.
- **B** No alternative may be a subtype of another alternative.
- **C** All alternatives must have the same direct superclass.
- **D** Only unchecked exception types may be combined.

### Answer key and reasons

- **A: incorrect.** Ordering does not make subtype-related alternatives legal inside the same multi-catch parameter.
- **B: correct.** The language rejects subtype-related alternatives in the same multi-catch parameter.
- **C: incorrect.** There is no requirement that all alternatives share the same direct superclass.
- **D: incorrect.** Multi-catch may combine checked exception types as well, provided the other rules are satisfied.

### Explanation

It is a compile-time error if one alternative in a multi-catch is a subtype of another alternative. The alternatives must not be related by subclassing in that way.

### Why this difficulty

Tests a compile-time restriction specific to multi-catch alternatives that is easy to miss when reasoning only from normal catch ordering.

### References

- [JLS 14.20 The try statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:a1aeb4003a853b4838c8b30c803b2cabb36edad84a40cba6956339dfb850be01"`, `"verified": null`

**Comments:**

&nbsp;

## 37. t04-overriding-checked-exception

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A superclass method declares a checked exception in its `throws` clause. Which changes are allowed in a valid overriding method? Select all that apply.

- **A** Omit the checked exception entirely.
- **B** Declare a narrower checked exception subtype.
- **C** Declare a broader checked exception superclass not permitted by the overridden method.
- **D** Replace the checked exception with arbitrary unrelated checked exceptions.

### Answer key and reasons

- **A: correct.** An overriding method may declare fewer checked exceptions.
- **B: correct.** A compatible narrower checked exception is permitted.
- **C: incorrect.** That would widen the checked exception contract and is not allowed.
- **D: incorrect.** Unrelated checked exceptions must still satisfy the overriding throws-clause restrictions.

### Explanation

An overriding method may omit the checked exception or declare a narrower checked exception compatible with the overridden declaration. It may not broaden the checked exception contract.

### Why this difficulty

Checks how the throws clause may change during method overriding, especially for checked exceptions.

### References

- [JLS 8.4.8.3 Requirements in Overriding and Hiding](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.8.3)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:8df117237acec009efb84ecffeaf663a6797508f33efdffed8fbf57c920ce86f"`, `"verified": null`

**Comments:**

&nbsp;

## 38. t04-suppressed-exception

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> In a try-with-resources statement, the try body throws exception `E1`, and then closing the resource throws exception `E2`. What is the usual result defined by the language translation?

- **A** E2 replaces E1 completely.
- **B** E1 is propagated and E2 is added to E1 as a suppressed exception.
- **C** Both exceptions are discarded and execution continues normally.
- **D** The JVM wraps both exceptions in an Error.

### Answer key and reasons

- **A: incorrect.** The close exception does not normally replace the exception already thrown by the try body.
- **B: correct.** This preserves the primary failure while retaining the close failure for inspection.
- **C: incorrect.** The primary exception is still thrown.
- **D: incorrect.** Try-with-resources uses suppressed exceptions rather than an Error wrapper for this case.

### Explanation

The exception from the try body remains the primary exception. The exception thrown while closing the resource is recorded as a suppressed exception on the primary exception.

### Why this difficulty

Requires understanding the interaction between an exception from the try body and another exception thrown while an automatic resource is closed.

### References

- [JLS 14.20.3 try-with-resources](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:cd0599da3ec29c624c4da95798535333a9a8d079a228203e2eba8b0ec4920801"`, `"verified": null`

**Comments:**

&nbsp;

## 39. t04-try-with-resources-order

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> public class Main {
>   static class Res implements AutoCloseable {
>     private final String name;
>
>     Res(String name) {
>       this.name = name;
>       System.out.print("open-" + name + " ");
>     }
>
>     @Override
>     public void close() {
>       System.out.print("close-" + name + " ");
>     }
>   }
>
>   public static void main(String[] args) {
>     try (Res a = new Res("a");
>         Res b = new Res("b")) {
>       System.out.print("body ");
>     }
>   }
> }
> ```

- **A** open-a open-b body close-b close-a
- **B** open-a open-b body close-a close-b
- **C** open-b open-a body close-a close-b
- **D** open-a open-b close-b close-a body

### Answer key and reasons

- **A: correct.** Initialization follows declaration order and closing is the reverse, so b is closed before a.
- **B: incorrect.** Closing in declaration order would leave b open while a is already closed. The language closes in reverse order to respect dependencies between resources.
- **C: incorrect.** Resources are not reordered. They are initialized in the order in which they are declared.
- **D: incorrect.** Resources are closed after the body finishes, not before it.

### Explanation

Resources in a try-with-resources header are initialized from left to right, then the body runs, then the resources are closed in the opposite order. Resource b was opened last, so it is closed first.

### Why this difficulty

Requires remembering that resources are closed in the reverse order of their declaration, which is easy to confuse with the opening order.

### References

- [JLS 14.20.3.1 Basic try-with-resources](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3.1)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
open-a open-b body close-b close-a
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:6e4d63f790dc1427e9bb3b63f0be08e6c7e0c9ab7dc0e5802e047aff10c582da"`, `"verified": "sha256:58db8b1fbd426c4b73071e576d7c311f7135a102dc6cdbfe5f9219bfe400787a"`

**Comments:**

&nbsp;

## 40. t04-unchecked-exception-classes

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** multiple choice, select all that apply · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which exception categories are unchecked for Java compile-time exception checking? Select all that apply.

- **A** RuntimeException and its subclasses
- **B** Error and its subclasses
- **C** Every subclass of Exception
- **D** Every subclass of Throwable

### Answer key and reasons

- **A: correct.** RuntimeException is the root of one unchecked exception branch.
- **B: correct.** Error is the other unchecked exception branch.
- **C: incorrect.** Many Exception subclasses are checked; RuntimeException is the unchecked branch under Exception.
- **D: incorrect.** Throwable also includes checked exception classes.

### Explanation

Subclasses of `RuntimeException` and subclasses of `Error` are unchecked exception classes. Other subclasses of `Throwable` are checked unless they fall into those categories.

### Why this difficulty

Checks the exception-analysis distinction between checked exceptions and RuntimeException/Error subclasses.

### References

- [JLS 11.1.1 The Kinds and Causes of Exceptions](https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html#jls-11.1.1)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:f3298bb15abaf556983f5edaf62617f681d111db362c160d980d3ed043d895ca"`, `"verified": null`

**Comments:**

&nbsp;

## 41. t05-arrays-aslist-backed

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Given `String[] a = {"x", "y"}; List<String> list = Arrays.asList(a);`, which statements are correct? Select all that apply.

- **A** list.set(0, "z") changes a[0] to "z".
- **B** list.add("z") can grow the list and the original array.
- **C** Structural operations that change the size are unsupported.
- **D** The method always copies the array into an independent java.util.ArrayList.

### Answer key and reasons

- **A: correct.** The list and array are backed by the same elements.
- **B: incorrect.** The list is fixed-size and the underlying array cannot be grown this way.
- **C: correct.** The returned list has a fixed size equal to the array length.
- **D: incorrect.** The returned list is backed by the specified array.

### Explanation

The list returned by `Arrays.asList` is fixed-size and backed by the specified array. Replacing an element through `set` changes the corresponding array element, while structural size changes such as add/remove are unsupported.

### Why this difficulty

Requires knowing that Arrays.asList is fixed-size and backed by the original array, which differs from both an independent ArrayList and List.of.

### References

- [Arrays.asList(T...) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html#asList(T...))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:78ae48555284a939204e7fd0a0c9ec06a2868315ed215f48a0bead672ec7c70f"`, `"verified": null`

**Comments:**

&nbsp;

## 42. t05-immutable-and-fixed-size-lists

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> import java.util.Arrays;
> import java.util.List;
>
> public class Main {
>   public static void main(String[] args) {
>     List<String> fixed = List.of("x", "y");
>     try {
>       fixed.add("z");
>     } catch (UnsupportedOperationException e) {
>       System.out.print("immutable ");
>     }
>     List<String> view = Arrays.asList("x", "y");
>     view.set(0, "q");
>     try {
>       view.add("z");
>     } catch (UnsupportedOperationException e) {
>       System.out.print("fixed-size ");
>     }
>     System.out.println(view);
>   }
> }
> ```

- **A** immutable fixed-size [q, y]
- **B** immutable [q, y]
- **C** immutable fixed-size [x, y]
- **D** immutable fixed-size [q, y, z]

### Answer key and reasons

- **A: correct.** Both add calls throw UnsupportedOperationException, and the only successful change is the set call on the fixed-size list.
- **B: incorrect.** add on the Arrays.asList list also throws UnsupportedOperationException because its size is fixed, so fixed-size is printed as well.
- **C: incorrect.** set is permitted on a fixed-size list, so the first element does become q.
- **D: incorrect.** The add call threw an exception, so z was never added.

### Explanation

List.of returns an unmodifiable list, so add throws UnsupportedOperationException. Arrays.asList returns a fixed-size list backed by the array: set is allowed, but add and remove are not. The set call changed the first element to q, and the failed add left the list unchanged.

### Why this difficulty

Distinguishes three kinds of list: unmodifiable, fixed-size but writable, and ordinary. The candidate must know exactly which mutations each one allows.

### References

- [List (unmodifiable lists), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#unmodifiable)
- [Arrays.asList(T...), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html#asList(T...))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
immutable fixed-size [q, y]
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:fa5b94ce4a081fd1fc275bf77b3d633d5da2dfb89037ad27c7113e21e4a9c863"`, `"verified": "sha256:9c454ad3e5835e8aeed4ec6b0f9709168cd2334a87e36ddb98c78c4f5ff51178"`

**Comments:**

&nbsp;

## 43. t05-list-first-last

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this Java 21 program print?
>
> ```java
> import java.util.List;
>
> public class Main {
>   public static void main(String[] args) {
>     var values = List.of("a", "b", "c");
>     System.out.println(values.getFirst() + values.getLast());
>   }
> }
> ```

- **A** ab
- **B** ac
- **C** bc
- **D** It does not compile because List has no getFirst/getLast methods in Java 21.

### Answer key and reasons

- **A: incorrect.** The last element is c, not b.
- **B: correct.** getFirst returns a and getLast returns c.
- **C: incorrect.** getFirst does not skip the first element.
- **D: incorrect.** Those methods are available through the sequenced-collection API in Java 21.

### Explanation

`List` is a `SequencedCollection` in Java 21 and provides `getFirst()` and `getLast()`. For the list `a, b, c`, those elements are `a` and `c`.

### Why this difficulty

Checks Java 21's sequenced-collection additions as exposed through List.

### References

- [List (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html)
- [SequencedCollection (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/SequencedCollection.html)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
ac
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:5011a402c13171a198c9977bed4882dff5c0a452e5050bb1614346ba3b62488f"`, `"verified": "sha256:f45de51cdef30991551e41e882dd7b5404799648a0a00753f44fc966e6153fc1"`

**Comments:**

&nbsp;

## 44. t05-list-remove-overload

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> import java.util.ArrayList;
> import java.util.List;
>
> public class Main {
>   public static void main(String[] args) {
>     List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30, 1));
>     numbers.remove(1);
>     numbers.remove(Integer.valueOf(1));
>     System.out.println(numbers);
>   }
> }
> ```

- **A** [10, 30]
- **B** [10, 20, 30]
- **C** [10, 30, 1]
- **D** [20, 30]

### Answer key and reasons

- **A: correct.** The first call removes by index (20), the second removes by value (the trailing 1).
- **B: incorrect.** This would result if remove(1) removed the value 1. An int argument selects remove(int index), so the element at index 1 is removed instead.
- **C: incorrect.** This is the list after only the first call. The second call removes the element equal to 1.
- **D: incorrect.** Neither call removes the first element. One removes index 1 and the other removes the value 1.

### Explanation

remove(1) with an int argument calls remove(int index) and removes the element at index 1, which is 20, leaving [10, 30, 1]. remove(Integer.valueOf(1)) calls remove(Object) and removes the first element equal to 1, leaving [10, 30].

### Why this difficulty

List has two remove methods and the argument type decides which one runs. Mixing up removal by index with removal by element is a very common mistake.

### References

- [List.remove(int), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#remove(int))
- [List.remove(Object), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#remove(java.lang.Object))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
[10, 30]
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:aa3ad1790530cd56ef478623a373c5729f588f5b334bcac4079f0d3cc0ba5333"`, `"verified": "sha256:9262ba71a165a51ed187e6b9a3b70bb6683a0b56d0d090f75a83f2eece52fbcf"`

**Comments:**

&nbsp;

## 45. t05-map-of-null-rejection

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** multiple choice, select all that apply · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which statements are true of maps created by `Map.of(...)`? Select all that apply.

- **A** They reject null keys.
- **B** They reject null values.
- **C** They accept one null key as long as all values are non-null.
- **D** Null entries are silently omitted.

### Answer key and reasons

- **A: correct.** The factory contract disallows null keys.
- **B: correct.** The factory contract disallows null values.
- **C: incorrect.** No null key is permitted.
- **D: incorrect.** The factory throws rather than dropping null entries.

### Explanation

The unmodifiable maps created by `Map.of` disallow null keys and null values. Attempts to create them with either produce `NullPointerException`.

### Why this difficulty

Checks the null restrictions of the convenience factory methods for unmodifiable maps.

### References

- [Map (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:4f93455ea9bcd769eb8c704e4168711950095f2f6a3e4905e6c268c896433416"`, `"verified": null`

**Comments:**

&nbsp;

## 46. t05-sequenced-collection-reversed

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements describe the `reversed()` method of `SequencedCollection` in Java 21? Select all that apply.

- **A** It returns a reverse-ordered view of the collection.
- **B** The first element of the original is the last element of the reversed view.
- **C** It must copy every element into a new independent collection.
- **D** The reversed view has the same iteration order as the original.

### Answer key and reasons

- **A: correct.** The method is specified as producing a view with inverted encounter order.
- **B: correct.** First and last are inverted by the reverse-ordered view.
- **C: incorrect.** The API specifies a view, not a mandatory independent copy.
- **D: incorrect.** Its encounter order is the inverse of the original.

### Explanation

`reversed()` returns a reverse-ordered view. In that view the encounter order is inverted, so first and last are exchanged and iteration proceeds in the reverse encounter order.

### Why this difficulty

Tests the Java 21 SequencedCollection contract and the meaning of its reverse-ordered view.

### References

- [SequencedCollection (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/SequencedCollection.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:faaaa171a52a8b5880abdb3bbc8f081f454bfa669ddb3aa7c967090b8a40b1de"`, `"verified": null`

**Comments:**

&nbsp;

## 47. t05-set-of-duplicate-elements

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What happens when `Set.of("a", "a")` is evaluated?

- **A** It creates a set containing one element.
- **B** It creates a two-element set.
- **C** It throws IllegalArgumentException.
- **D** It throws UnsupportedOperationException during creation.

### Answer key and reasons

- **A: incorrect.** Unlike adding twice to many mutable Set implementations, `Set.of` rejects duplicate arguments instead of silently keeping one.
- **B: incorrect.** A Set cannot contain duplicate equal elements, and the factory does not preserve both arguments.
- **C: correct.** The `Set.of` contract specifies `IllegalArgumentException` for duplicate elements.
- **D: incorrect.** UnsupportedOperationException applies to mutation attempts on the created unmodifiable set, not duplicate arguments at creation time.

### Explanation

The unmodifiable sets created by `Set.of` reject duplicate elements at creation time. Passing duplicates causes `IllegalArgumentException`.

### Why this difficulty

Tests the documented creation-time contract of the immutable Set factory methods.

### References

- [Set (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Set.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:f55f5f7ac1729a0d85579fa56c110814d20e8aebdf3eb7efc1b2e91eb026df5d"`, `"verified": null`

**Comments:**

&nbsp;

## 48. t05-treeset-comparator-uniqueness

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> A `TreeSet` uses a comparator that returns `0` when comparing two distinct objects. What does the set do when the second object is added while the first is already present?

- **A** It always stores both because Object.equals is the only rule for Set uniqueness.
- **B** It treats the second object as a duplicate for set membership.
- **C** It throws ClassCastException even though a comparator was supplied.
- **D** It replaces the first object with the second automatically.

### Answer key and reasons

- **A: incorrect.** TreeSet membership is governed by its ordering comparison.
- **B: correct.** A comparison result of zero means the elements occupy the same ordering position.
- **C: incorrect.** A supplied comparator is precisely what the TreeSet uses to compare elements.
- **D: incorrect.** Set.add reports whether the set changed; it does not define replacement of the existing equal element.

### Explanation

A TreeSet uses its ordering to determine element equality for set membership. If the comparator reports zero, the second object is treated as equal for set purposes and is not added as a distinct element.

### Why this difficulty

Tests the SortedSet rule that ordering equality determines element uniqueness, which can diverge from equals.

### References

- [TreeSet (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeSet.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:bb2c3d99cea36775c4a9c9e4d3f64fab7b9f9d7d868385bb5ae7526d14aca3f8"`, `"verified": null`

**Comments:**

&nbsp;

## 49. t05-wildcard-extends-read

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Given `List<? extends Number> values`, which operation is guaranteed to be type-safe and compile?

- **A** Number n = values.get(0);
- **B** values.add(Integer.valueOf(1));
- **C** values.add(Double.valueOf(1.0));
- **D** values.add(new BigDecimal("1"));

### Answer key and reasons

- **A: correct.** Whatever the captured subtype is, every element is a Number.
- **B: incorrect.** The captured element type might not be Integer, so adding an Integer is not generally allowed.
- **C: incorrect.** The captured element type might not be Double.
- **D: incorrect.** The captured element type might be some other Number subtype.

### Explanation

The wildcard says the list contains elements of some unknown subtype of Number. Reading an element as Number is safe. Adding a specific Number subtype is not generally safe because the actual element type might be a different subtype.

### Why this difficulty

Tests the producer side of upper-bounded wildcards and why they do not safely accept arbitrary Number values.

### References

- [JLS 4.5.1 Type Arguments of Parameterized Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:8ec87ba3fc8e34ea91d56f057bcc827f26cd7422fab6d3dec176c257b1aa65cf"`, `"verified": null`

**Comments:**

&nbsp;

## 50. t05-wildcard-super-integer

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Given `List<? super Integer> values`, which operations are type-safe and compile? Select all that apply.

- **A** values.add(Integer.valueOf(1));
- **B** Object x = values.get(0);
- **C** Integer x = values.get(0);
- **D** values.add(Double.valueOf(1.0));

### Answer key and reasons

- **A: correct.** Integer can be stored in any List whose element type is Integer or a supertype of Integer.
- **B: correct.** Object is the universally safe static type for a value read from the lower-bounded wildcard.
- **C: incorrect.** The actual list could be a List<Object>, so the compiler cannot promise the retrieved value is an Integer.
- **D: incorrect.** The actual list could be List<Integer>, which cannot accept Double.

### Explanation

The captured element type is some unknown supertype of Integer, so adding an Integer is safe. Reading yields only Object without a cast because the actual supertype could be Integer, Number, or Object.

### Why this difficulty

Tests the consumer side of lower-bounded wildcards and the safe type available when reading from them.

### References

- [JLS 4.5.1 Type Arguments of Parameterized Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.5.1)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:649993028d41fe35da8524352275a5c01a381387399a0007ff09a0e6707b89fd"`, `"verified": null`

**Comments:**

&nbsp;

## 51. t06-findfirst-ordered-stream

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> For an ordered stream with elements `a`, `b`, `c`, what does `findFirst()` promise when the stream is non-empty?

- **A** It returns an Optional containing a.
- **B** It may return any element even though the stream is ordered.
- **C** It returns all three elements in a List.
- **D** It can be used only on sequential streams.

### Answer key and reasons

- **A: correct.** a is first in the stream's encounter order.
- **B: incorrect.** That freedom belongs to findAny; findFirst respects encounter order when one exists.
- **C: incorrect.** findFirst is a short-circuiting terminal operation returning one Optional.
- **D: incorrect.** findFirst also works on parallel streams while preserving first-element semantics for ordered streams.

### Explanation

`findFirst` returns an Optional describing the first element of the stream. On an ordered stream, that means the first element in encounter order.

### Why this difficulty

Requires connecting encounter order with the semantics of the short-circuiting findFirst terminal operation.

### References

- [Stream.findFirst() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html#findFirst())

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:260c1a2671e757cb81b0b5572abf5f7d6b6ed1c86c3e4b0d4c36ab357793803d"`, `"verified": null`

**Comments:**

&nbsp;

## 52. t06-flatmap-flatten

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is the defining effect of `Stream.flatMap` compared with `Stream.map`?

- **A** It maps each element to a stream and flattens the mapped streams into one stream.
- **B** It sorts the stream before applying the mapper.
- **C** It always executes the mapper in parallel.
- **D** It converts every element to Optional.

### Answer key and reasons

- **A: correct.** That is the core flatMap operation.
- **B: incorrect.** Sorting is unrelated to flatMap.
- **C: incorrect.** Parallelism is a property of the stream pipeline, not an unconditional effect of flatMap.
- **D: incorrect.** flatMap operates on streams returned by the mapper; Optional is not implicit.

### Explanation

`flatMap` maps each input element to a stream and then replaces each mapped stream with its contents in the resulting stream, effectively flattening one level.

### Why this difficulty

Requires distinguishing one-to-one mapping from one-to-many mapping followed by flattening.

### References

- [Stream.flatMap(Function) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html#flatMap(java.util.function.Function))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:81a1d82b3b182549e43a2d4d1a5c38735f05ee764f2aaa461e8faba802341afc"`, `"verified": null`

**Comments:**

&nbsp;

## 53. t06-intstream-average

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.stream.IntStream;
>
> public class Main {
>   public static void main(String[] args) {
>     double value = IntStream.of(1, 2, 3).average().orElse(-1);
>     System.out.println(value);
>   }
> }
> ```

- **A** 2.0
- **B** 2
- **C** -1.0
- **D** It throws NoSuchElementException.

### Answer key and reasons

- **A: correct.** The arithmetic mean is returned as a double value.
- **B: incorrect.** IntStream.average returns OptionalDouble, so the printed numeric representation is 2.0.
- **C: incorrect.** The fallback is used only when the stream is empty.
- **D: incorrect.** orElse supplies a fallback and does not throw.

### Explanation

The average of 1, 2, and 3 is 2.0. Because the stream is non-empty, `orElse(-1)` is not used.

### Why this difficulty

Checks the primitive-stream average terminal operation and OptionalDouble fallback behavior.

### References

- [IntStream.average() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/IntStream.html#average())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
2.0
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:1c43a1fd4bd129da4acc8db59e518230410c27b8053a2ff7838c43a0fd249f3e"`, `"verified": "sha256:d84bdb34d4eeef4034d77e5403f850e35bc4a51b1143e3a83510e1aaad839748"`

**Comments:**

&nbsp;

## 54. t06-lambda-effectively-final

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> A lambda expression captures a local variable declared in its enclosing method. What must be true of that local variable?

- **A** It must be declared static.
- **B** It must be final or effectively final.
- **C** It must have a primitive type.
- **D** It must be assigned inside the lambda before being read.

### Answer key and reasons

- **A: incorrect.** Local variables cannot be made static, and static status is not the capture rule.
- **B: correct.** This is the language rule for captured local variables and parameters.
- **C: incorrect.** Both primitive and reference-typed locals may be captured.
- **D: incorrect.** The capture rule is not satisfied by assigning the variable inside the lambda; captured locals are final or effectively final.

### Explanation

A local variable, method parameter, or exception parameter referenced from a lambda body must be final or effectively final, subject to the definite-assignment rules.

### Why this difficulty

Checks the capture rule for local variables used from a lambda body.

### References

- [JLS 15.27.2 Lambda Body](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.27.2)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:e5ebba5c9d6aeaef72da6498990ea36c3a1b80e5266da18c242d5fc478e7c75e"`, `"verified": null`

**Comments:**

&nbsp;

## 55. t06-reduce-empty-identity

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does `Stream.<Integer>empty().reduce(10, Integer::sum)` return?

- **A** 0
- **B** 10
- **C** Optional.empty()
- **D** It throws NoSuchElementException.

### Answer key and reasons

- **A: incorrect.** The identity supplied by the caller is 10, not the additive identity chosen implicitly by the API.
- **B: correct.** An empty stream returns the supplied identity for this overload.
- **C: incorrect.** The overload without an identity returns Optional; the identity overload returns a value directly.
- **D: incorrect.** The identity value defines the result even for an empty stream.

### Explanation

The two-argument `reduce(identity, accumulator)` form starts with the identity value. With no stream elements, there is nothing to accumulate, so the identity value is returned.

### Why this difficulty

Requires understanding the identity overload of reduce, especially its defined result for an empty stream.

### References

- [Stream.reduce(T, BinaryOperator) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html#reduce(T,java.util.function.BinaryOperator))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:ece7c2a1eb9fcf982e92b36c2c350fe2c7809be39feb1fe1e90504b91691d6e9"`, `"verified": null`

**Comments:**

&nbsp;

## 56. t06-stream-facts

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about Java streams are true? Select all that apply.

- **A** An intermediate operation such as `filter` does not process any element until a terminal operation is invoked.
- **B** The same `Stream` instance can be traversed a second time after its terminal operation has completed.
- **C** `sorted()` is a stateful intermediate operation.
- **D** `limit(n)` is a terminal operation.
- **E** `peek` exists mainly to support debugging, for example to see elements as they flow past a point in the pipeline.

### Answer key and reasons

- **A: correct.** Intermediate operations are lazy. Traversal of the source starts only when the terminal operation is executed.
- **B: incorrect.** A stream must be operated on only once. Reusing it throws IllegalStateException; a new stream must be created from the source.
- **C: correct.** Sorting needs to see all the elements before it can emit the first one in order, which is the definition of a stateful operation.
- **D: incorrect.** limit returns a stream, so it is an intermediate operation. It is short-circuiting because it can finish the traversal early.
- **E: correct.** The API documentation describes this as the main purpose of peek. It should not be relied on for side effects that matter.

### Explanation

A pipeline does no work until a terminal operation starts it, and a stream can be consumed only once. Operations such as sorted are stateful: they may need to see the whole input before producing output. limit is a short-circuiting intermediate operation, not a terminal one, and peek exists mainly to support debugging.

### Why this difficulty

Each statement checks a different fact about stream pipelines: laziness, single use, stateful operations, short-circuiting and the purpose of peek.

### References

- [java.util.stream package: stream operations and pipelines](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html)
- [Stream.peek(Consumer), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html#peek(java.util.function.Consumer))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:6aefbf857ab03ebf0639c5df18fdf73d11544b50be59c6ec9fa977deba8bc9da"`, `"verified": null`

**Comments:**

&nbsp;

## 57. t06-stream-laziness

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> import java.util.stream.Stream;
>
> public class Main {
>   public static void main(String[] args) {
>     Stream.of(1, 2, 3, 4)
>         .filter(
>             n -> {
>               System.out.print("f" + n + " ");
>               return n % 2 == 0;
>             })
>         .map(
>             n -> {
>               System.out.print("m" + n + " ");
>               return n * 10;
>             })
>         .findFirst();
>     System.out.println();
>   }
> }
> ```

- **A** f1 f2 m2
- **B** f1 f2 f3 f4 m2 m4
- **C** f1 f2 f3 f4 m2
- **D** f1 m1 f2 m2

### Answer key and reasons

- **A: correct.** f1 fails the filter, f2 passes and reaches map (m2), then findFirst has its result and traversal stops.
- **B: incorrect.** This describes each stage processing all elements before the next one starts. Streams process element by element through the pipeline and findFirst short-circuits.
- **C: incorrect.** The filter is not run ahead of the rest of the pipeline. After m2 the terminal operation is satisfied and f3 and f4 are never evaluated.
- **D: incorrect.** The map operation only receives elements that pass the filter, so m1 is never printed.

### Explanation

Intermediate operations are lazy and elements are pulled through the whole pipeline one at a time. Element 1 is rejected by the filter, element 2 passes the filter and is mapped, and findFirst, being short-circuiting, stops the traversal as soon as it has a result, so elements 3 and 4 are never examined.

### Why this difficulty

The output depends on elements flowing through the pipeline one at a time and on a short-circuiting terminal operation stopping the traversal, which contradicts the loop-by-loop intuition.

### References

- [java.util.stream package: stream operations and pipelines](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html)
- [Stream.findFirst(), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html#findFirst())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
f1 f2 m2
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:6bcb8ebb13ff8df307b70cee16d7a84159a68ad161012cde5bcef14fc6275d5e"`, `"verified": "sha256:a3a4003fed2b5863c030cddf99221c1de7bc8da864922df2bac1b7b3b1759749"`

**Comments:**

&nbsp;

## 58. t06-stream-single-use

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which statement best describes the intended reuse model of a Java `Stream`?

- **A** A Stream is a reusable container and can run terminal operations repeatedly.
- **B** A Stream should be consumed once; create a new stream to traverse the source again.
- **C** Only parallel streams are single-use.
- **D** Calling close() resets a Stream so it can be reused.

### Answer key and reasons

- **A: incorrect.** Streams are pipelines, not reusable data containers.
- **B: correct.** This matches the Stream contract and lifecycle.
- **C: incorrect.** The single-use rule applies to streams generally.
- **D: incorrect.** Closing a stream does not reset its pipeline for reuse.

### Explanation

A stream should be operated on only once. After a terminal operation, the same stream pipeline is not intended to be reused; attempting reuse may result in `IllegalStateException` when reuse is detected.

### Why this difficulty

Checks the fundamental lifecycle rule that distinguishes streams from reusable collections.

### References

- [Stream (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:80d54f91c7915d958a4f1c86e90cc2f3f3b7f5d9322012d1153d9047e0339099"`, `"verified": null`

**Comments:**

&nbsp;

## 59. t06-string-length-method-reference

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which functional-interface target is compatible with the method reference `String::length`?

- **A** ToIntFunction<String>
- **B** Supplier<String>
- **C** Consumer<Integer>
- **D** Predicate<String>

### Answer key and reasons

- **A: correct.** Its abstract method takes a String and returns int.
- **B: incorrect.** A Supplier takes no input and returns a String, which does not match.
- **C: incorrect.** A Consumer returns no value and its input type is wrong.
- **D: incorrect.** A Predicate<String> must return boolean, not int.

### Explanation

`String::length` is an unbound instance method reference. The function receives a String instance and returns its primitive int length, matching `ToIntFunction<String>`.

### Why this difficulty

Tests how an unbound instance method reference maps the receiver to the functional interface's input parameter.

### References

- [JLS 15.13 Method Reference Expressions](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.13)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:f37197deee9a5b4d33b7e31daae1b23fbcca2f567c2d568a722e28d001878169"`, `"verified": null`

**Comments:**

&nbsp;

## 60. t06-to-unmodifiable-list-null

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about `Collectors.toUnmodifiableList()` are correct? Select all that apply.

- **A** The resulting List is unmodifiable.
- **B** Null input elements are disallowed.
- **C** The resulting List is guaranteed to be an ArrayList.
- **D** The collector silently drops null elements.

### Answer key and reasons

- **A: correct.** Mutation operations are not supported on the result.
- **B: correct.** The collector rejects null values.
- **C: incorrect.** The API does not guarantee a specific implementation class.
- **D: incorrect.** Nulls are rejected rather than filtered out.

### Explanation

The collector accumulates elements into an unmodifiable List and disallows null values. A null input element causes `NullPointerException` during collection.

### Why this difficulty

Tests two documented guarantees of the unmodifiable-list collector, including its null rejection.

### References

- [Collectors.toUnmodifiableList() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html#toUnmodifiableList())

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:c91c23d786aa7a72f121ae51ced32639fbcecd5e76d108216ccc8578dfbc6940"`, `"verified": null`

**Comments:**

&nbsp;

## 61. t07-automatic-module-jar

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> An ordinary JAR has no `module-info.class` and is placed where the module system discovers modules. What kind of named module can it become?

- **A** An automatic module
- **B** The java.base module
- **C** An unnamed module only
- **D** A sealed module

### Answer key and reasons

- **A: correct.** Automatic modules support migration of non-modular JARs onto the module path.
- **B: incorrect.** java.base is the platform's fundamental module, not a designation for ordinary JARs.
- **C: incorrect.** An ordinary JAR on the class path is associated with an unnamed module; on the module path it can become automatic.
- **D: incorrect.** Sealed is a class/interface concept, not a JPMS module category.

### Explanation

A JAR without a module descriptor can be treated as an automatic module when discovered on the module path. Its module name is derived rather than declared by module-info.

### Why this difficulty

Tests the migration mechanism that lets an ordinary JAR participate on the module path without a module descriptor.

### References

- [ModuleDescriptor.isAutomatic() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/module/ModuleDescriptor.html#isAutomatic())

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:5a2b2389fc23b58486d0185fe3a0ac8f7c1ffcdd52c34c56051364a37bbc7a05"`, `"verified": null`

**Comments:**

&nbsp;

## 62. t07-exports-and-opens

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** multiple choice, select all that apply · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> A module declares directives for one of its packages, `p`. Which statements about `exports` and `opens` are true? Select all that apply.

- **A** `exports p;` makes the public types of `p` accessible to code in other modules at both compile time and run time.
- **B** `opens p;` allows code in other modules to use reflection at run time to access all types and members of `p`, including private ones.
- **C** `opens p;` also makes the public types of `p` accessible to other modules at compile time.
- **D** `exports p to m;` makes the package accessible only to module `m`.
- **E** If `p` is exported but not opened, another module can call `setAccessible(true)` on a private field of a class in `p`.

### Answer key and reasons

- **A: correct.** That is the purpose of exports: it defines the accessible API of the module.
- **B: correct.** An open package allows deep reflection, for example setAccessible(true) on a private field.
- **C: incorrect.** opens affects run time only. Without exports, other modules cannot compile against the package.
- **D: correct.** This is a qualified export, which restricts access to the named module or modules.
- **E: incorrect.** Reflective access to non-public members requires the package to be open. The call fails with InaccessibleObjectException.

### Explanation

exports controls compile-time and run-time access to the public and protected types of a package. opens controls run-time reflective access, including to private members, and does not grant compile-time access. A qualified form (to m) limits either directive to specific modules. Being exported alone does not allow deep reflection on private members.

### Why this difficulty

exports and opens look similar but differ in compile-time versus run-time access and in whether private members are reachable through reflection.

### References

- [JLS 7.7.2 Exported and Opened Packages](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.2)
- [AccessibleObject.setAccessible(boolean), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/reflect/AccessibleObject.html#setAccessible(boolean))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:7b83957989115dccf5b2081c11c63c36aa4f8871fa46d5fccf1db359adf23f38"`, `"verified": null`

**Comments:**

&nbsp;

## 63. t07-implicit-java-base

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> For a named module other than `java.base`, which dependency is implicitly present even when it is not written in `module-info.java`?

- **A** requires java.base;
- **B** requires java.desktop;
- **C** requires java.sql;
- **D** requires transitive java.base;

### Answer key and reasons

- **A: correct.** java.base is implicitly required by every other named module.
- **B: incorrect.** java.desktop is needed only when a module actually depends on its APIs.
- **C: incorrect.** java.sql is not implicitly required.
- **D: incorrect.** The implicit dependency is not an implicit transitive re-export.

### Explanation

Every module other than `java.base` implicitly depends on `java.base`, so ordinary module declarations do not need to write that requires directive.

### Why this difficulty

Checks the implicit readability foundation that module declarations usually do not spell out.

### References

- [JLS 7.7.1 Dependences](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.1)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:302368d054243688dbc08c428c3dc200a926535e51db483e40c9d6fd91e276cf"`, `"verified": null`

**Comments:**

&nbsp;

## 64. t07-java-module-launch

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which command form launches main class `p.Main` from named module `com.example.app` when the module is available under `mods`?

- **A** java --module-path mods --module com.example.app/p.Main
- **B** java --classpath mods --requires com.example.app p.Main
- **C** java --exports com.example.app p.Main
- **D** java module-info.java p.Main

### Answer key and reasons

- **A: correct.** This names both the module path and the module/main-class pair.
- **B: incorrect.** `--requires` is not a java launcher option for selecting a module this way.
- **C: incorrect.** Exports is a module declaration/access concept, not the normal launch syntax.
- **D: incorrect.** The launcher does not launch a named module by passing its module-info source file.

### Explanation

The `java` launcher uses `--module-path` (or `-p`) to locate modules and `--module module[/mainclass]` (or `-m`) to name the module and optionally its main class.

### Why this difficulty

Checks the command-line form for launching a main class from a named module on a module path.

### References

- [java Command (JDK 21)](https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:49013ae0d1abeadfc8b477eba0d80d6488f765c2be186e9f8cd4ca4602a5c4e2"`, `"verified": null`

**Comments:**

&nbsp;

## 65. t07-module-service-directives

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> In a module declaration using the Java service-loading mechanism, which directive pair is correct? Select all that apply.

- **A** A consumer uses `uses com.example.Service;`.
- **B** A provider uses `provides com.example.Service with com.example.ServiceImpl;`.
- **C** A consumer must declare `exports com.example.Service;` to discover providers.
- **D** A provider registers the implementation with `requires ServiceImpl;`.

### Answer key and reasons

- **A: correct.** The `uses` directive declares that the module discovers implementations of that service.
- **B: correct.** The `provides ... with ...` directive registers the implementation for the service.
- **C: incorrect.** Exports controls package access, not service consumption.
- **D: incorrect.** `requires` names a module dependency, not a service implementation.

### Explanation

A consuming module declares `uses ServiceType`. A provider module declares `provides ServiceType with ImplementationType` for one or more provider implementations.

### Why this difficulty

Requires mapping service consumption and service implementation to the correct module declaration directives.

### References

- [JLS 7.7 Module Declarations](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:7f5761fbe4cd0b6cf743e04adcb2c4f7049c728a375f09568660c3b724463518"`, `"verified": null`

**Comments:**

&nbsp;

## 66. t07-open-module-semantics

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** multiple choice, select all that apply · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Which statements about an `open module` declaration are correct? Select all that apply.

- **A** All packages in the module are open for deep reflection.
- **B** Every package is automatically exported for ordinary source-level access.
- **C** The module can still use exports directives to control ordinary API access.
- **D** An open module becomes an unnamed module.

### Answer key and reasons

- **A: correct.** That is the defining effect of declaring the whole module open.
- **B: incorrect.** Opening and exporting are separate JPMS concepts.
- **C: correct.** An open module may still export selected packages while all packages remain open reflectively.
- **D: incorrect.** It remains a named module; `open` changes reflective accessibility.

### Explanation

An open module opens all of its packages for deep reflective access by other modules. Openness is not the same as exporting packages for ordinary compile-time access.

### Why this difficulty

Requires separating reflective openness from compile-time export accessibility at module granularity.

### References

- [JLS 7.7.2 Exported and Opened Packages](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.2)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:6579987de80fa73f74e7d20f23bd56365d4b6057f436a33ce5a88b0b9ff4f9b7"`, `"verified": null`

**Comments:**

&nbsp;

## 67. t07-qualified-exports

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does `exports com.example.internal to client.one, client.two;` mean in a module declaration?

- **A** The package is exported only to client.one and client.two.
- **B** The package is exported to every module except client.one and client.two.
- **C** The package is opened for deep reflection to all modules.
- **D** The two client modules are automatically required as dependencies.

### Answer key and reasons

- **A: correct.** The `to` clause names the target modules of the qualified export.
- **B: incorrect.** The named modules are included targets, not exclusions.
- **C: incorrect.** Opening for reflection is controlled by `opens`, not `exports`.
- **D: incorrect.** Exports does not create requires directives.

### Explanation

A qualified exports directive makes the package accessible at compile time and run time only to the named target modules, rather than exporting it to every module that reads the exporting module.

### Why this difficulty

Tests the difference between an unqualified export and an export targeted to a fixed set of named modules.

### References

- [JLS 7.7.2 Exported and Opened Packages](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.2)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:61c6926e97278a450283d77df8269d74d9e6580ea7d6055efa728a5b69aabe92"`, `"verified": null`

**Comments:**

&nbsp;

## 68. t07-requires-static

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> What is the key effect of `requires static com.example.optional;` in a module declaration?

- **A** The dependency is optional at compile time but mandatory at run time.
- **B** The dependency is required at compile time but optional at run time.
- **C** The dependency is ignored at both compile time and run time.
- **D** The dependency is automatically re-exported to modules that require this module.

### Answer key and reasons

- **A: incorrect.** That reverses the purpose of `requires static`.
- **B: correct.** This is the special readability rule expressed by a static requires directive.
- **C: incorrect.** The dependency still matters to compilation.
- **D: incorrect.** Re-exporting readability is the role of `requires transitive`, not `requires static`.

### Explanation

A `requires static` dependency is required during compilation when the depending module is compiled, but it is optional during the run-time resolution of the depending module.

### Why this difficulty

Requires distinguishing ordinary module readability from the special compile-time/runtime meaning of a static requires modifier.

### References

- [JLS 7.7.1 Dependences](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.1)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:b14de1ffacaa6bd8ab128eb13c6a77b79fff103d9da421a9f142fc5bb8af828b"`, `"verified": null`

**Comments:**

&nbsp;

## 69. t07-requires-transitive

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Module `app` declares `requires lib;`. The public methods of module `lib` use types from module `util` in their signatures, and `app` calls those methods. `app` does not declare any dependency on `util`. Which directive in the `module-info.java` of `lib` lets `app` read `util` implicitly so that this compiles?

- **A** `requires transitive util;`
- **B** `exports util to app;`
- **C** `requires static util;`
- **D** `uses util;`

### Answer key and reasons

- **A: correct.** Implied readability: any module that reads lib also reads util, which is exactly what app needs.
- **B: incorrect.** exports makes a package of the declaring module available to other modules. It does not grant readability of another module, and util is a module, not a package of lib.
- **C: incorrect.** static makes the dependency mandatory at compile time but optional at run time. It does not make util readable to modules that require lib.
- **D: incorrect.** uses declares that the module consumes a service type through ServiceLoader. It names a service interface, not a module, and grants no readability.

### Explanation

requires transitive makes the required module readable by every module that requires the declaring module. It is the directive to use when the API of a module exposes types from its dependency, so clients do not have to repeat the dependency themselves.

### Why this difficulty

Requires distinguishing the four module directives that mention another module or package, each of which solves a different problem.

### References

- [JLS 7.7.1 Dependences](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.1)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
read implicitly
```

That program, across 6 files:

`modules/app/a/Main.java`:

```java
package a;

import l.Service;
import u.Box;

public class Main {

  public static void main(String[] args) {
    Box box = Service.make("read implicitly");
    System.out.println(box.value());
  }
}
```

`modules/app/module-info.java`:

```java
// app requires lib and nothing else. It never names util, yet it uses u.Box below.
module app {
  requires lib;
}
```

`modules/lib/l/Service.java`:

```java
package l;

import u.Box;

public class Service {

  private Service() {}

  /** Returns a type from another module, which is why lib has to pass util on to its readers. */
  public static Box make(String value) {
    return new Box(value);
  }
}
```

`modules/lib/module-info.java`:

```java
// requires transitive, not plain requires: every module that reads lib also reads util, which is
// what lets app compile without naming util itself.
module lib {
  requires transitive util;

  exports l;
}
```

`modules/util/module-info.java`:

```java
module util {
  exports u;
}
```

`modules/util/u/Box.java`:

```java
package u;

/** A type that appears in lib's public signatures, so app must be able to read it. */
public record Box(String value) {}
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A program has been written for it since that review. Nothing the reviewer read changed, and the claim now has a program behind it, so the verdict stands and is better supported than when it was given.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:af626b88c696999048debefb40bbe702accffa6ba8b6c839dfd0f6498351a9cb"`, `"verified": "sha256:967d9925394070035c9816174b90c4fc1ce5975e3240f24321c739f95a223f36"`

**Comments:**

&nbsp;

## 70. t07-unnamed-module-isnamed

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> The program is launched from the class path, not as a named module. What does it print?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     System.out.println(Main.class.getModule().isNamed());
>   }
> }
> ```

- **A** true
- **B** false
- **C** null
- **D** It throws IllegalStateException.

### Answer key and reasons

- **A: incorrect.** A class-path class is not in a named module merely because its class has a name.
- **B: correct.** The class belongs to an unnamed module when launched from the class path.
- **C: incorrect.** getModule returns a Module object, and isNamed returns primitive boolean.
- **D: incorrect.** Querying the module of a class-path class is supported.

### Explanation

Classes loaded from the ordinary class path belong to an unnamed module. `Module.isNamed()` therefore returns false.

### Why this difficulty

Connects class-path execution with the runtime Module API and the distinction between named and unnamed modules.

### References

- [Module.isNamed() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Module.html#isNamed())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
false
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:64c9d9597f36df9fb522b9a919b4e3e022e013fcdb9061ccd8c5c7dbd226f919"`, `"verified": "sha256:fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa"`

**Comments:**

&nbsp;

## 71. t08-atomicinteger-update-and-get

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.concurrent.atomic.AtomicInteger;
>
> public class Main {
>   public static void main(String[] args) {
>     var value = new AtomicInteger(3);
>     System.out.println(value.updateAndGet(x -> x * 2));
>   }
> }
> ```

- **A** 3
- **B** 6
- **C** 9
- **D** It does not compile because lambdas cannot be used with AtomicInteger.

### Answer key and reasons

- **A: incorrect.** That is the old value; updateAndGet returns the updated value.
- **B: correct.** The update function doubles 3 and the method returns the new value.
- **C: incorrect.** The function multiplies by 2, not by 3.
- **D: incorrect.** updateAndGet accepts an IntUnaryOperator, which a lambda can implement.

### Explanation

`updateAndGet` atomically applies the function to the current value, stores the result, and returns the updated value. Starting at 3 and doubling produces 6.

### Why this difficulty

Checks the value returned by an atomic read-modify-write operation rather than only its side effect.

### References

- [AtomicInteger.updateAndGet(IntUnaryOperator) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html#updateAndGet(java.util.function.IntUnaryOperator))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
6
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:aa0cb64474b787f8cd89175c40f0752e93b0e5036cc4223311386b4f0939438a"`, `"verified": "sha256:e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"`

**Comments:**

&nbsp;

## 72. t08-completablefuture-join-vs-get

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** multiple choice, select all that apply · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Which statements correctly distinguish `CompletableFuture.join()` from `Future.get()`? Select all that apply.

- **A** join() may throw CompletionException for exceptional completion.
- **B** get() declares checked exceptions including InterruptedException and ExecutionException.
- **C** join() always returns immediately and never waits.
- **D** get() can be called only on platform threads, not virtual threads.

### Answer key and reasons

- **A: correct.** CompletionException is the unchecked wrapper used by join.
- **B: correct.** Those checked exceptions are part of Future.get's contract.
- **C: incorrect.** join waits when necessary for completion.
- **D: incorrect.** The API is not restricted to platform threads.

### Explanation

`join()` returns the result like `get()`, but if the computation completed exceptionally it throws an unchecked `CompletionException`. `get()` exposes checked waiting/failure exceptions such as `InterruptedException` and `ExecutionException`.

### Why this difficulty

Tests the exception-surface difference between two common ways to wait for a CompletableFuture result.

### References

- [CompletableFuture.join() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html#join())
- [Future.get() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Future.html#get())

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:14321ec79b2165f614edf4f2d5ddc7317f2864917e3401e01dec22a22d28eec5"`, `"verified": null`

**Comments:**

&nbsp;

## 73. t08-concurrenthashmap-null

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** multiple choice, select all that apply · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which statements about `ConcurrentHashMap` are correct? Select all that apply.

- **A** Null keys are not allowed.
- **B** Null values are not allowed.
- **C** One null key is allowed, like HashMap.
- **D** Null values are stored but ignored by get().

### Answer key and reasons

- **A: correct.** ConcurrentHashMap rejects null keys.
- **B: correct.** ConcurrentHashMap rejects null values.
- **C: incorrect.** ConcurrentHashMap deliberately does not support null keys.
- **D: incorrect.** Null values cannot be inserted.

### Explanation

ConcurrentHashMap does not permit null keys or null values. This lets null from retrieval operations consistently represent the absence of a mapping.

### Why this difficulty

Checks a deliberate API restriction that affects how absence can be represented in concurrent maps.

### References

- [ConcurrentHashMap (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:b99d271cbeebe7c0b5f423208757f0a94ffa2ed5c743b121de4993d5ad04b15d"`, `"verified": null`

**Comments:**

&nbsp;

## 74. t08-executor-close

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program with Java 21?
>
> ```java
> import java.util.concurrent.Executors;
> import java.util.concurrent.atomic.AtomicInteger;
>
> public class Main {
>   public static void main(String[] args) {
>     AtomicInteger counter = new AtomicInteger();
>     try (var executor = Executors.newFixedThreadPool(4)) {
>       for (int i = 0; i < 100; i++) {
>         executor.submit(counter::incrementAndGet);
>       }
>     }
>     System.out.println(counter.get());
>   }
> }
> ```

- **A** 100
- **B** A value below 100 is possible, because tasks may still be running.
- **C** The code does not compile because ExecutorService is not AutoCloseable.
- **D** The program never ends because the pool threads are never shut down.

### Answer key and reasons

- **A: correct.** close() blocks until the submitted tasks are done, so every increment has happened before the value is read.
- **B: incorrect.** That would be true with an executor that is only shut down without waiting. Closing the executor waits for completion.
- **C: incorrect.** ExecutorService extends AutoCloseable from Java 19 onwards, so it can be a try-with-resources resource in Java 21.
- **D: incorrect.** Closing the executor shuts the pool down, so the pool threads terminate and the JVM can exit.

### Explanation

Since Java 19, ExecutorService implements AutoCloseable. Its close method initiates an orderly shutdown and waits until previously submitted tasks have completed. When the try block ends, all 100 tasks have therefore finished, and the counter holds 100.

### Why this difficulty

Relies on ExecutorService being AutoCloseable since Java 19 and on close() waiting for submitted tasks, a behavior many candidates do not know.

### References

- [ExecutorService.close(), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html#close())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
100
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:4a02b0bcaa676c452f8468022e676f0c2d5be448f8d239a884d8d4f3068d729b"`, `"verified": "sha256:ad57366865126e55649ecb23ae1d48887544976efea46a48eb5d85a6eeb4d306"`

**Comments:**

&nbsp;

## 75. t08-start-virtual-thread

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does `Thread.startVirtualThread(task)` do in Java 21?

- **A** It creates and starts a virtual thread, then returns that Thread.
- **B** It creates an unstarted platform thread.
- **C** It runs task synchronously on the calling thread.
- **D** It returns an ExecutorService rather than a Thread.

### Answer key and reasons

- **A: correct.** The convenience method both constructs and starts the virtual thread.
- **B: incorrect.** The method specifically creates a virtual thread and starts it.
- **C: incorrect.** The task is executed by the new virtual thread.
- **D: incorrect.** The return type is Thread.

### Explanation

The method creates a virtual thread to execute the supplied Runnable, schedules it to begin execution, and returns the started Thread object.

### Why this difficulty

Checks the Java 21 convenience API for starting a virtual thread and distinguishes starting from merely building one.

### References

- [Thread.startVirtualThread(Runnable) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html#startVirtualThread(java.lang.Runnable))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:1b132edc5296249a8b8757c486af2aee1fcc34c6da91c2d9b77ea394d5c79d4e"`, `"verified": null`

**Comments:**

&nbsp;

## 76. t08-synchronized-method-lock

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about `synchronized` methods are correct? Select all that apply.

- **A** A synchronized instance method locks the receiver object's monitor.
- **B** A synchronized static method locks the Class object for the class.
- **C** Every synchronized method locks the same JVM-wide global monitor.
- **D** A synchronized static method locks an arbitrary instance of the class.

### Answer key and reasons

- **A: correct.** The receiver is the monitor target for an instance synchronized method.
- **B: correct.** Static synchronized methods synchronize on the class's Class object.
- **C: incorrect.** Synchronization is associated with particular object monitors, not one universal monitor.
- **D: incorrect.** No instance receiver exists for a static method; the Class object is used.

### Explanation

A synchronized instance method locks the monitor associated with the receiver object. A synchronized static method locks the monitor associated with the Class object representing the declaring class.

### Why this difficulty

Requires knowing which monitor is acquired by synchronized instance and static methods.

### References

- [JLS 8.4.3.6 synchronized Methods](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.3.6)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:4f125eae41ebdaf5848763f381a655694e5136b0181abb22389d94b43b89ca9d"`, `"verified": null`

**Comments:**

&nbsp;

## 77. t08-synchronized-reentrant

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A thread already owns an object's intrinsic monitor and, before releasing it, enters another `synchronized` block guarded by the same object. What happens?

- **A** The thread deadlocks itself immediately.
- **B** The thread can enter because monitor locking is reentrant.
- **C** The second synchronized block is skipped.
- **D** The JVM throws IllegalMonitorStateException on entry.

### Answer key and reasons

- **A: incorrect.** Intrinsic monitors are reentrant, so self-deadlock does not occur merely from reacquiring the same monitor.
- **B: correct.** The same thread may acquire the monitor recursively.
- **C: incorrect.** The block executes normally after the reentrant acquisition.
- **D: incorrect.** Reentrant acquisition by the owner is legal.

### Explanation

Java intrinsic locks are reentrant. The owning thread can acquire the same monitor again and must perform the corresponding number of monitor exits before ownership is fully released.

### Why this difficulty

Tests a core monitor property that matters when synchronized methods call other synchronized code on the same object.

### References

- [JLS 17.1 Synchronization](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html#jls-17.1)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:296d4d4085ed01b5f051a28e6f727b6062e7a83d81afc293ab18ededcd02fe41"`, `"verified": null`

**Comments:**

&nbsp;

## 78. t08-thread-interrupted-clears

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does the static method `Thread.interrupted()` do with the current thread's interrupt status?

- **A** It returns the current status and clears that status.
- **B** It returns the current status without changing it.
- **C** It interrupts every live thread in the JVM.
- **D** It throws InterruptedException whenever the status is set.

### Answer key and reasons

- **A: correct.** The static method both reports and clears the current thread's interrupted status.
- **B: incorrect.** That behavior is associated with querying via `isInterrupted`; `Thread.interrupted()` clears the status.
- **C: incorrect.** The method only examines the current thread's status.
- **D: incorrect.** The method returns a boolean; it does not throw InterruptedException merely because the status is set.

### Explanation

`Thread.interrupted()` tests whether the current thread has been interrupted and clears its interrupted status as part of the operation.

### Why this difficulty

Tests the subtle difference between querying interruption with the static interrupted method and the instance isInterrupted method.

### References

- [Thread.interrupted() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html#interrupted())

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:71375a89cf8aabd9cc8856353444ff8243a365043d557c5cfe86115164150af9"`, `"verified": null`

**Comments:**

&nbsp;

## 79. t08-virtual-thread-daemon

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statement about virtual threads in Java 21 is true?

- **A** A virtual thread is always a daemon thread.
- **B** A virtual thread is a platform thread taken from a pool that the JVM recycles.
- **C** Calling `setDaemon(false)` on a virtual thread makes the JVM wait for it before exiting.
- **D** A virtual thread cannot execute code inside a `synchronized` block.

### Answer key and reasons

- **A: correct.** isDaemon() always returns true for a virtual thread, so the JVM does not wait for virtual threads to finish before exiting.
- **B: incorrect.** Virtual threads are lightweight threads scheduled by the JVM onto a small set of carrier threads. They are not pooled platform threads, and creating one per task is the intended usage.
- **C: incorrect.** Attempting to set a virtual thread to non-daemon throws IllegalArgumentException. It cannot be made to keep the JVM alive.
- **D: incorrect.** It can. The caveat is that blocking while holding a monitor can pin the carrier thread, which reduces scalability but is not forbidden.

### Explanation

A virtual thread is always a daemon thread, so it does not keep the JVM alive, and its daemon status cannot be changed to false. Virtual threads are not pooled platform threads: they are cheap threads managed by the JVM and mounted on carrier threads while they run. They can execute synchronized blocks, although blocking inside one may pin the carrier thread.

### Why this difficulty

Virtual threads are a Java 21 feature and several plausible statements about them are false, so the candidate must know their defining properties.

### References

- [JEP 444: Virtual Threads](https://openjdk.org/jeps/444)
- [Thread.isDaemon(), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html#isDaemon())

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
true true
false false
rejected
```

That program, in one file:

`Main.java`:

```java
public class Main {
  public static void main(String[] args) {
    Thread virtual = Thread.ofVirtual().unstarted(() -> {});
    System.out.println(virtual.isVirtual() + " " + virtual.isDaemon());

    Thread platform = Thread.ofPlatform().unstarted(() -> {});
    System.out.println(platform.isVirtual() + " " + platform.isDaemon());

    try {
      virtual.setDaemon(false);
      System.out.println("accepted");
    } catch (IllegalArgumentException e) {
      System.out.println("rejected");
    }
  }
}
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:1a524f8719b99f90a06295ef3391bf1d248e689b5dcfca3aef6edb780bbf0890"`, `"verified": "sha256:533a743b128d5f0045f659014c6ec7ad3ee4af485ae01d046d479edde0d2f0d1"`

**Comments:**

&nbsp;

## 80. t08-volatile-increment

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Suppose `count` is declared `volatile int count;` and multiple threads execute `count++`. Which statement is correct?

- **A** Every increment is atomic because count is volatile.
- **B** Updates are visible according to volatile semantics, but increments can still be lost.
- **C** The program cannot compile because volatile cannot be used with int.
- **D** Volatile makes count++ equivalent to synchronizing the whole statement.

### Answer key and reasons

- **A: incorrect.** Volatile does not turn a compound increment into one atomic action.
- **B: correct.** The field has volatile visibility semantics, while concurrent read-modify-write operations may race.
- **C: incorrect.** Primitive fields, including int, may be declared volatile.
- **D: incorrect.** No implicit monitor is acquired for the compound increment.

### Explanation

Volatile reads and writes have visibility and ordering guarantees, but `count++` is a compound read-modify-write operation and is not made atomic merely because the field is volatile.

### Why this difficulty

Separates volatile visibility guarantees from atomicity of a compound read-modify-write operation.

### References

- [JLS 17.4.5 Happens-before Order](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html#jls-17.4.5)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:8609867a28550ce1fee60fe3a3164645d2375d2866cb551f2cf9941d3d1edecb"`, `"verified": null`

**Comments:**

&nbsp;

## 81. t09-bufferedreader-readline

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** multiple choice, select all that apply · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which statements about `BufferedReader.readLine()` are correct? Select all that apply.

- **A** The returned string excludes the line-termination characters.
- **B** It returns null when the end of the stream has been reached and no line remains.
- **C** It always includes `\n` at the end of the returned string.
- **D** It returns an empty string instead of null for end of stream.

### Answer key and reasons

- **A: correct.** The terminator is not part of the returned line.
- **B: correct.** Null is the documented end-of-stream result.
- **C: incorrect.** Line-termination characters are excluded.
- **D: incorrect.** An empty line and end of stream are distinct; EOF is reported with null.

### Explanation

`readLine` returns a line of text without the line-termination characters. It returns null when the end of the stream has been reached without another line.

### Why this difficulty

Checks the exact return contract of one of the most common character-input methods.

### References

- [BufferedReader.readLine() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/BufferedReader.html#readLine())

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:fcb833284302075e88da9b405e83b435dcaf7c0b287cbc63a2d7137a9d743252"`, `"verified": null`

**Comments:**

&nbsp;

## 82. t09-files-copy-existing-target

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What normally happens when `Files.copy(source, target)` is called and `target` already exists, with no copy options supplied?

- **A** The target is silently overwritten.
- **B** The source and target are automatically merged.
- **C** FileAlreadyExistsException is thrown.
- **D** The target is renamed and the copy succeeds.

### Answer key and reasons

- **A: incorrect.** Replacement is not the default behavior.
- **B: incorrect.** Files.copy defines copying, not merging.
- **C: correct.** That is the documented default when the target exists.
- **D: incorrect.** The API does not automatically choose another target name.

### Explanation

By default an existing target is not replaced. The operation fails with `FileAlreadyExistsException`; replacing it requires an option such as `StandardCopyOption.REPLACE_EXISTING`.

### Why this difficulty

Checks the default replacement behavior of Files.copy, a common source of incorrect assumptions.

### References

- [Files.copy(Path, Path, CopyOption...) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html#copy(java.nio.file.Path,java.nio.file.Path,java.nio.file.CopyOption...))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:4c1181a937681c69dd6710c681116b68fcff0bd97b724641a787e081b9567d47"`, `"verified": null`

**Comments:**

&nbsp;

## 83. t09-files-lines-close

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is the recommended way to use the `Stream<String>` returned by `Files.lines(path)`?

- **A** Use it in try-with-resources so the stream, and therefore the file, is closed.
- **B** Never close it; terminal operations always close every stream automatically.
- **C** Call System.gc() after the terminal operation instead of closing it.
- **D** Convert the Path to File first; that removes the need to close the stream.

### Answer key and reasons

- **A: correct.** This follows the API contract for closing the file-backed stream.
- **B: incorrect.** Terminal stream operations do not generally close streams automatically.
- **C: incorrect.** Garbage collection is not a resource-management mechanism for an open file stream.
- **D: incorrect.** Changing the path representation does not change the lifecycle of the stream returned by `Files.lines`.

### Explanation

The returned stream is lazily populated and encapsulates an open file, so it should be closed promptly, typically by placing the stream itself in a try-with-resources statement.

### Why this difficulty

Checks the resource-lifecycle requirement of a lazily populated stream backed by an open file.

### References

- [Files.lines(Path) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html#lines(java.nio.file.Path))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:0a3e70e4bd494ec6327a81001e8de2d509ffd6dc8c903803e0369c34beffed0c"`, `"verified": null`

**Comments:**

&nbsp;

## 84. t09-path-normalize-namecount

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.nio.file.Path;
>
> public class Main {
>   public static void main(String[] args) {
>     Path path = Path.of("a", "b", "..", "c").normalize();
>     System.out.println(path.getNameCount());
>   }
> }
> ```

- **A** 1
- **B** 2
- **C** 3
- **D** 4

### Answer key and reasons

- **A: incorrect.** Two name elements remain after normalization.
- **B: correct.** The normalized path consists of `a` and `c`.
- **C: incorrect.** The `b/..` pair is eliminated by normalization.
- **D: incorrect.** The parent-reference pair does not remain as two separate name elements after normalization.

### Explanation

`normalize()` removes redundant name elements such as `b/..` without accessing the file system. The resulting path has the two name elements `a` and `c`.

### Why this difficulty

Tests lexical path normalization without relying on platform-specific separator rendering.

### References

- [Path.normalize() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Path.html#normalize())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
2
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:02a1596e2429d19d205c95aedfeee8ef892c44a5b32cdc2cf2a9ec0302a75c59"`, `"verified": "sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"`

**Comments:**

&nbsp;

## 85. t09-path-resolve-absolute

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> For `base.resolve(other)`, what happens when `other` is an absolute `Path`?

- **A** The absolute path is appended to base.
- **B** The method returns other.
- **C** The method always throws IllegalArgumentException.
- **D** The method converts both paths to relative paths before combining them.

### Answer key and reasons

- **A: incorrect.** An absolute `other` path is not appended to the base.
- **B: correct.** An absolute `other` path is already resolved independently of the base.
- **C: incorrect.** Being absolute is a documented case, not inherently an error.
- **D: incorrect.** The API defines no such conversion.

### Explanation

The `Path.resolve(Path)` contract says that if the other path is absolute, the method returns `other`; the base path is not prepended.

### Why this difficulty

Tests an API edge case of Path.resolve that differs from simply concatenating path components.

### References

- [Path.resolve(Path) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Path.html#resolve(java.nio.file.Path))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:318920b7b1473dca3a6026de7b1fa03ac05160f8b68f49f2121dad39c11c51d9"`, `"verified": null`

**Comments:**

&nbsp;

## 86. t09-randomaccessfile-seek

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is the purpose of `RandomAccessFile.seek(long pos)`?

- **A** It changes the file pointer to the specified byte offset from the beginning.
- **B** It scans forward until it finds the specified byte value.
- **C** It truncates the file to the specified length.
- **D** It changes the character encoding used by the file.

### Answer key and reasons

- **A: correct.** That is the documented purpose of seek.
- **B: incorrect.** The argument is a position, not a byte to search for.
- **C: incorrect.** Changing file length is handled by setLength, not seek.
- **D: incorrect.** seek controls position, not encoding.

### Explanation

`seek` sets the file-pointer offset, measured from the beginning of the file, so subsequent reads or writes occur at that position.

### Why this difficulty

Tests the capability that distinguishes RandomAccessFile from sequential stream abstractions.

### References

- [RandomAccessFile.seek(long) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/RandomAccessFile.html#seek(long))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:f913982a40f0b407c922cc322ea8b5b984ed485116675ddc040db21eb4bbde37"`, `"verified": null`

**Comments:**

&nbsp;

## 87. t09-read-all-lines

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> import java.io.IOException;
> import java.nio.file.Files;
> import java.nio.file.Path;
>
> public class Main {
>   public static void main(String[] args) throws IOException {
>     Path file = Files.createTempFile("lines", ".txt");
>     try {
>       Files.writeString(file, "alpha\nbeta\n");
>       System.out.println(Files.readAllLines(file).size());
>     } finally {
>       Files.delete(file);
>     }
>   }
> }
> ```

- **A** 2
- **B** 3
- **C** 1
- **D** It throws an exception because the file was not closed.

### Answer key and reasons

- **A: correct.** The trailing newline terminates the line beta and does not create a third, empty line.
- **B: incorrect.** A third element would appear only if there were text after the last line terminator, for example a blank line.
- **C: incorrect.** The method recognises every line terminator, not just the last one, so the two lines are returned separately.
- **D: incorrect.** readAllLines opens and closes the file itself. The code only needs to handle the IOException it may throw.

### Explanation

Files.readAllLines splits the content into lines using line terminators. A final terminator ends the last line; it does not start a new, empty one. The text alpha, newline, beta, newline therefore contains two lines.

### Why this difficulty

Checks how line terminators are handled by the NIO.2 convenience methods, in particular that a trailing newline does not produce an extra empty line.

### References

- [Files.readAllLines(Path), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html#readAllLines(java.nio.file.Path))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
2
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:4e5421d645083af9e41ed10336eef3972945a5b8d2f3ff9bf2521d33f7852d4c"`, `"verified": "sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"`

**Comments:**

&nbsp;

## 88. t09-reader-vs-inputstream

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** multiple choice, select all that apply · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which statements correctly distinguish `InputStream` and `Reader`? Select all that apply.

- **A** InputStream is byte-oriented.
- **B** Reader is character-oriented.
- **C** Reader is the required base type for arbitrary binary file data.
- **D** InputStream automatically decodes bytes with a character set.

### Answer key and reasons

- **A: correct.** Its read methods fundamentally operate on bytes represented as int values or byte arrays.
- **B: correct.** Reader is the base abstraction for character input.
- **C: incorrect.** Binary data is normally handled through byte streams such as InputStream.
- **D: incorrect.** Character decoding is performed by bridges such as InputStreamReader.

### Explanation

InputStream is the abstract base for reading bytes. Reader is the abstract base for reading character streams.

### Why this difficulty

Checks the fundamental byte-stream versus character-stream split in java.io.

### References

- [InputStream (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/InputStream.html)
- [Reader (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/Reader.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:084a77712d356fef2f848f7bb7c316bbc9fdad4acd90ec627496aee4e9baa40a"`, `"verified": null`

**Comments:**

&nbsp;

## 89. t09-serialization-facts

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** multiple choice, select all that apply · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Class `Item` implements `Serializable` and extends class `Base`, which does not implement `Serializable` and has an accessible no-argument constructor. `Item` has a `transient int cache = 5;` field and a constructor. An `Item` is serialized and then deserialized. Which statements are true? Select all that apply.

- **A** The no-argument constructor of `Base` runs, so the fields of `Base` get the values that constructor assigns.
- **B** The constructor of `Item` runs before its fields are restored from the stream.
- **C** The `transient` field `cache` is restored with its default value, `0`.
- **D** The fields of `Base` are read from the stream because `Item` is serializable.

### Answer key and reasons

- **A: correct.** Serialization does not save the state of a non-serializable superclass; it is re-initialized by running that class's accessible no-arg constructor.
- **B: incorrect.** Constructors of serializable classes are not invoked during deserialization. Their fields are restored directly from the stream.
- **C: correct.** Transient fields are not written, and because Item's constructor and initializers do not run, the field is left at the default value, not 5.
- **D: incorrect.** Only the state of serializable classes in the hierarchy is written. Making a subclass serializable does not cause the non-serializable superclass state to be saved.

### Explanation

During deserialization the no-argument constructor of the closest non-serializable superclass runs, so Base fields get their constructor-assigned values and their serialized state is not used. The constructors of serializable classes such as Item do not run, so a transient field ends up with its default value (0 here), not with the value from its initializer.

### Why this difficulty

Deserialization bypasses the constructors of serializable classes but not of the first non-serializable superclass, and transient fields get default values rather than initializer values.

### References

- [java.io.Serializable, Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/Serializable.html)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
7 0 42
```

That program, in one file:

`Main.java`:

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class Main {
  static class Base {
    int base = 1;

    Base() {
      base = 7;
    }
  }

  static class Item extends Base implements Serializable {
    private static final long serialVersionUID = 1L;
    transient int cache = 5;
    int value = 3;

    Item() {
      value = 9;
    }
  }

  public static void main(String[] args) throws Exception {
    Item original = new Item();
    original.base = 100;
    original.value = 42;
    original.cache = 55;

    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
      out.writeObject(original);
    }
    try (ObjectInputStream in =
        new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
      Item copy = (Item) in.readObject();
      System.out.println(copy.base + " " + copy.cache + " " + copy.value);
    }
  }
}
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:9879711d5575e507206e13321fa33849bdbfa5f5ca2e2634d6d4405616e76b84"`, `"verified": "sha256:9a4e10c986b981cac4b9fcc5f8f8e9c662955d1ee6dbc008d2313cb6267c7705"`

**Comments:**

&nbsp;

## 90. t09-serialization-transient-static

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Under default Java object serialization, which fields are not part of the default serialized instance state? Select all that apply.

- **A** static fields
- **B** transient fields
- **C** ordinary non-transient instance fields
- **D** every final instance field

### Answer key and reasons

- **A: correct.** Static fields are class state, not default serialized instance state.
- **B: correct.** The transient modifier excludes the field from default serialization.
- **C: incorrect.** These are the core fields included by default serialization when their values are serializable as required.
- **D: incorrect.** Final instance fields are not excluded merely because they are final.

### Explanation

Default serialization writes the non-static, non-transient fields of a serializable object. Static fields belong to the class rather than the individual object, and transient fields are explicitly excluded.

### Why this difficulty

Requires distinguishing persistent instance state from fields that default serialization does not save.

### References

- [Java Object Serialization Specification: Serializable Fields](https://docs.oracle.com/en/java/javase/21/docs/specs/serialization/serial-arch.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:8da42eededa956e63011fa2b3c1952447bd65e19649f6d9f4097914795f847ac"`, `"verified": null`

**Comments:**

&nbsp;

## 91. t10-collator-locale-sensitive

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which Java API is designed to compare strings according to locale-sensitive collation rules?

- **A** Collator
- **B** StringBuilder
- **C** Scanner
- **D** Formatter

### Answer key and reasons

- **A: correct.** Collator is the locale-sensitive comparison abstraction in java.text.
- **B: incorrect.** StringBuilder is for mutable character sequences, not localized comparison.
- **C: incorrect.** Scanner parses input; it is not the collation API.
- **D: incorrect.** Formatter produces formatted text but is not the dedicated locale-sensitive comparison API.

### Explanation

`Collator` performs locale-sensitive String comparison. An instance for a desired locale can be obtained with `Collator.getInstance(locale)`.

### Why this difficulty

Tests the API intended for locale-sensitive string comparison rather than code-unit or natural String ordering.

### References

- [Collator (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/Collator.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:45619c2f8059eccf95f19fb0add9ba36af084101691d1988b4fe746eccbc15a2"`, `"verified": null`

**Comments:**

&nbsp;

## 92. t10-datetimeformatter-locale-immutability

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about `DateTimeFormatter` are correct? Select all that apply.

- **A** DateTimeFormatter is immutable and thread-safe.
- **B** withLocale(locale) returns a formatter with the locale override.
- **C** withLocale(locale) mutates the original formatter in place.
- **D** A DateTimeFormatter may only be used by one thread.

### Answer key and reasons

- **A: correct.** The API explicitly documents these properties.
- **B: correct.** The method produces a formatter using the requested locale override.
- **C: incorrect.** The formatter is immutable; configuration methods return another formatter.
- **D: incorrect.** The class is thread-safe and can be shared.

### Explanation

`DateTimeFormatter` is immutable and thread-safe. Methods such as `withLocale` return a new formatter with an override rather than mutating the original formatter.

### Why this difficulty

Combines localization with the immutable, thread-safe design of DateTimeFormatter.

### References

- [DateTimeFormatter (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/format/DateTimeFormatter.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:a0f737bdcf04c1464c89dfaa58036be7287af8ec3bfde4b8b11bdd4e23d2013e"`, `"verified": null`

**Comments:**

&nbsp;

## 93. t10-locale-builder-language-tag

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.Locale;
>
> public class Main {
>   public static void main(String[] args) {
>     Locale locale = new Locale.Builder()
>         .setLanguage("pt")
>         .setRegion("BR")
>         .build();
>     System.out.println(locale.toLanguageTag());
>   }
> }
> ```

- **A** pt-BR
- **B** pt_BR
- **C** PT-br
- **D** Portuguese-Brazil

### Answer key and reasons

- **A: correct.** That is the normalized language-region tag.
- **B: incorrect.** Underscore formatting is associated with Locale.toString-style representation, not BCP 47 toLanguageTag output.
- **C: incorrect.** The language and region are normalized using their conventional casing.
- **D: incorrect.** toLanguageTag uses language and region subtags, not display names.

### Explanation

The builder creates a Locale with language `pt` and region `BR`. `toLanguageTag()` renders those components as the normalized BCP 47 tag `pt-BR`.

### Why this difficulty

Checks the builder API and normalized BCP 47 language-tag representation.

### References

- [Locale.Builder (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Locale.Builder.html)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
pt-BR
```

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:bbc010b1c5eafda18d1edd11cb4c80b2da043bccb3749905d34e1f383de7cbb6"`, `"verified": "sha256:2a67f1a4675ab88705c1a2bbe30bdd800f22c737e7f8c0328825cd247bd078ad"`

**Comments:**

&nbsp;

## 94. t10-locale-default-categories

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about `Locale.Category` are correct? Select all that apply.

- **A** Locale.Category.DISPLAY is associated with display-oriented locale data.
- **B** Locale.Category.FORMAT is associated with locale-sensitive formatting.
- **C** Java has only one default Locale and no category-specific defaults.
- **D** FORMAT controls module readability in JPMS.

### Answer key and reasons

- **A: correct.** It is the category for user-interface display information.
- **B: correct.** It is used by formatting-oriented APIs.
- **C: incorrect.** Category-specific defaults are part of the Locale API.
- **D: incorrect.** Locale categories are unrelated to the module system.

### Explanation

Java defines separate default-locale categories. `DISPLAY` is used for user-interface display information, while `FORMAT` is used for formatting dates, numbers, and similar locale-sensitive data.

### Why this difficulty

Requires knowing that Java maintains category-specific default locales for display text and formatting.

### References

- [Locale.Category (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Locale.Category.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:06751e113eaf965fe3b43914d465e9dfe6bb26f67944f8e145b6394f588181be"`, `"verified": null`

**Comments:**

&nbsp;

## 95. t10-locale-language-tag

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> After `Locale locale = Locale.forLanguageTag("pt-BR");`, what do `locale.getLanguage()` and `locale.getCountry()` return?

- **A** pt and BR
- **B** PT and br
- **C** pt-BR and an empty string
- **D** Portuguese and Brazil

### Answer key and reasons

- **A: correct.** The language subtag is `pt` and the region subtag is `BR`.
- **B: incorrect.** Locale language codes are normalized to lower case and country codes to upper case in these accessors.
- **C: incorrect.** The language and country are exposed as separate components.
- **D: incorrect.** The accessors return language and country codes, not localized display names.

### Explanation

`Locale.forLanguageTag` interprets the BCP 47 tag. For `pt-BR`, the language is `pt` and the country/region is `BR`.

### Why this difficulty

Checks how a standard BCP 47 language tag is represented by Locale.

### References

- [Locale (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Locale.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:705582ca1e729220da81dd8a18408652f0ed6793c10aeb1945635f40ef18b15f"`, `"verified": null`

**Comments:**

&nbsp;

## 96. t10-locale-to-string

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What is printed by this program?
>
> ```java
> import java.util.Locale;
>
> public class Main {
>   public static void main(String[] args) {
>     Locale locale = Locale.forLanguageTag("pt-BR");
>     System.out.println(locale.getLanguage() + " " + locale.getCountry() + " " + locale);
>   }
> }
> ```

- **A** pt BR pt_BR
- **B** pt BR pt-BR
- **C** Portuguese Brazil pt_BR
- **D** pt br pt_br

### Answer key and reasons

- **A: correct.** getLanguage returns pt, getCountry returns BR, and toString joins them with an underscore.
- **B: incorrect.** The hyphenated form is the language tag returned by toLanguageTag. toString uses an underscore.
- **C: incorrect.** getLanguage and getCountry return codes, not display names. Display names come from getDisplayLanguage and getDisplayCountry.
- **D: incorrect.** Locale normalises the country code to upper case, so it is BR, not br.

### Explanation

Locale.forLanguageTag parses an IETF BCP 47 tag. The language code is stored in lower case (pt) and the country in upper case (BR). Locale.toString uses an underscore between them, pt_BR, whereas toLanguageTag would give pt-BR.

### Why this difficulty

Checks the basic accessors of Locale and the difference between its toString form and the IETF language tag form.

### References

- [Locale.forLanguageTag(String), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Locale.html#forLanguageTag(java.lang.String))
- [Locale.toString(), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Locale.html#toString())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
pt BR pt_BR
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:52ba86a006fd5ca4762e840f473707568a5907be1fe1687faf96ba1e1b870759"`, `"verified": "sha256:a07fbea8a5a970f755712ae8eaa522a029de9a93355ec6bec967f4685ec97f6f"`

**Comments:**

&nbsp;

## 97. t10-messageformat-apostrophe

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> In a `MessageFormat` pattern, what is the role of a pair of single quotes surrounding text such as `'{0}'`?

- **A** They make {0} literal text rather than an argument placeholder.
- **B** They force argument 0 to be formatted as a String.
- **C** They are always emitted as visible quote characters.
- **D** They cause argument 0 to be omitted from the pattern completely.

### Answer key and reasons

- **A: correct.** Quoted pattern syntax is emitted literally.
- **B: incorrect.** Single quotes do not choose an argument formatter.
- **C: incorrect.** The quote characters serve pattern syntax and are not simply copied to the result.
- **D: incorrect.** The characters `{0}` remain as literal text when quoted.

### Explanation

Single quotes quote pattern syntax in MessageFormat. The braces inside the quoted section are treated as literal text instead of an argument placeholder.

### Why this difficulty

Tests MessageFormat's quoting syntax, which is easy to confuse with ordinary String quoting.

### References

- [MessageFormat (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/MessageFormat.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:c3d71e5fa72ad299941fb5f4367b7d6a405cdff775262054005453d31faa2437"`, `"verified": null`

**Comments:**

&nbsp;

## 98. t10-numberformat-currency-instance

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which factory method is intended to create a locale-sensitive formatter for monetary values?

- **A** NumberFormat.getCurrencyInstance(locale)
- **B** NumberFormat.getIntegerInstance(locale)
- **C** NumberFormat.getPercentInstance(locale)
- **D** Locale.getCurrencyFormatter()

### Answer key and reasons

- **A: correct.** This is the currency-specific NumberFormat factory.
- **B: incorrect.** That factory formats integers, not currency.
- **C: incorrect.** That factory formats percentages.
- **D: incorrect.** Locale does not provide such a factory method.

### Explanation

`NumberFormat.getCurrencyInstance(locale)` returns a number formatter configured for currency formatting according to the supplied locale.

### Why this difficulty

Tests selection of the locale-sensitive formatter intended specifically for monetary values.

### References

- [NumberFormat (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/NumberFormat.html)

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:44c22d1667f1a812f25e40ae1fe8e0c8a7d0ed0361877297873aa484084d9ba8"`, `"verified": null`

**Comments:**

&nbsp;

## 99. t10-resource-bundle-fallback

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> A class path contains three bundles for the base name `Msg`: the base bundle `Msg`, `Msg_en_US` and `Msg_de`. Each defines the key `who`, whose value is `base`, `en_US` and `de` respectively. What is printed by this program?
>
> ```java
> import java.util.Locale;
> import java.util.ResourceBundle;
>
> public class Main {
>   public static void main(String[] args) {
>     Locale.setDefault(Locale.US);
>     ResourceBundle bundle = ResourceBundle.getBundle("Msg", Locale.FRANCE);
>     System.out.println(bundle.getString("who"));
>   }
> }
> ```

- **A** en_US
- **B** base
- **C** de
- **D** It throws a MissingResourceException.

### Answer key and reasons

- **A: correct.** No French bundle exists, so the lookup falls back to the default locale before the base bundle, and Msg_en_US matches.
- **B: incorrect.** The base bundle is the last resort. A bundle for the default locale is preferred when the requested locale has none.
- **C: incorrect.** Msg_de is for German. Nothing relates the French locale to it.
- **D: incorrect.** A bundle is found (Msg_en_US), and it contains the key who, so no exception is thrown.

### Explanation

ResourceBundle.getBundle first looks for candidate bundles for the requested locale (fr_FR, then fr) and none exists. Only then does it try the candidates for the default locale, which is en_US here, and Msg_en_US is found. The base bundle is used only if neither the requested locale nor the default locale produces a bundle.

### Why this difficulty

The lookup order tries the default locale before falling back to the base bundle, which contradicts the common assumption that an unmatched locale goes straight to the base bundle.

### References

- [ResourceBundle.getBundle(String, Locale), Java SE 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ResourceBundle.html#getBundle(java.lang.String,java.util.Locale))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
en_US
```

### Review

**Approved** by vinicius-ssantos on 2026-10-02. The question has not changed since, so that verdict still applies.

A second reviewer is still worth having. To review it again, make the checks below and record your own verdict:

- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:faaf1a0cb99cf50d4449d2f3dd1ff0b185c6b3661dd9700b1d678b8e6278399e"`, `"verified": "sha256:674ac4b0bd40c5764a1ddf4e0119e9b4ee02f743211eefcf7b27c932a4831a4b"`

**Comments:**

&nbsp;

## 100. t10-resourcebundle-missing-key

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does `ResourceBundle.getString("missing")` do when the requested key cannot be found in the bundle or its parents?

- **A** It returns null.
- **B** It returns the key itself.
- **C** It throws MissingResourceException.
- **D** It returns an empty String.

### Answer key and reasons

- **A: incorrect.** The API reports a missing key with an exception rather than null.
- **B: incorrect.** There is no automatic key-as-value fallback in ResourceBundle.getString.
- **C: correct.** That is the documented failure for a missing resource key.
- **D: incorrect.** An absent key is not converted to an empty value.

### Explanation

ResourceBundle lookup throws `MissingResourceException` when the requested key cannot be resolved.

### Why this difficulty

Checks the failure contract of ResourceBundle lookup when a requested key is absent from the resolved bundle chain.

### References

- [ResourceBundle.getString(String) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ResourceBundle.html#getString(java.lang.String))

### Verified by the build

Conceptual question with no runnable code: **the build verified nothing here.** It rests on its references and on the human review, so read both with extra care.

### Review


- [ ] There is one defensible interpretation of the prompt.
- [ ] The answer is correct for Java 21, and any code compiles and behaves as stated.
- [ ] There is no hidden dependency on the environment or on unspecified behavior.
- [ ] The wrong options are plausible, and not tricks unrelated to the objective.
- [ ] Every explanation is complete and right, including the reasons for the wrong options.
- [ ] Code and prose are readable with assistive technology.
- [ ] The references let someone verify the answer independently.

**Verdict:** [ ] approve  [ ] request changes  [ ] do not publish

To record: `"digest": "sha256:75d80ee81a1b01cda2b9202a9e43bf4a84ebfc1d2021e4438722201546ae9803"`, `"verified": null`

**Comments:**

&nbsp;

## Summary of the review

| # | Question | Verdict | Reviewer | Date |
|---:|---|---|---|---|
| 1 | `t01-bigdecimal-equals-scale` |  |  |  |
| 2 | `t01-bigdecimal-nonterminating-divide` |  |  |  |
| 3 | `t01-boolean-parseboolean` |  |  |  |
| 4 | `t01-integer-boxing-guarantee` | approved | vinicius-ssantos | 2026-10-02 |
| 5 | `t01-localdate-plus-months` | approved | vinicius-ssantos | 2026-10-02 |
| 6 | `t01-localdate-plus-years-leap-day` |  |  |  |
| 7 | `t01-numeric-promotion-byte-addition` |  |  |  |
| 8 | `t01-period-vs-duration` |  |  |  |
| 9 | `t01-string-strip-vs-trim` |  |  |  |
| 10 | `t01-stringbuilder-reverse-chain` |  |  |  |
| 11 | `t02-case-null-pattern-switch` |  |  |  |
| 12 | `t02-continue-for-update` |  |  |  |
| 13 | `t02-do-while-first-execution` |  |  |  |
| 14 | `t02-enhanced-for-variable-assignment` |  |  |  |
| 15 | `t02-labeled-break-count` |  |  |  |
| 16 | `t02-pattern-switch-guard` | approved | vinicius-ssantos | 2026-10-02 |
| 17 | `t02-pattern-variable-and-scope` |  |  |  |
| 18 | `t02-switch-dominance` | approved | vinicius-ssantos | 2026-10-02 |
| 19 | `t02-switch-rule-no-fallthrough` |  |  |  |
| 20 | `t02-switch-yield-block` |  |  |  |
| 21 | `t03-covariant-return` |  |  |  |
| 22 | `t03-default-method-conflict` |  |  |  |
| 23 | `t03-enum-constructor-access` |  |  |  |
| 24 | `t03-overload-most-specific` |  |  |  |
| 25 | `t03-overload-null` | approved | vinicius-ssantos | 2026-10-02 |
| 26 | `t03-private-interface-method` |  |  |  |
| 27 | `t03-record-compact-normalization` |  |  |  |
| 28 | `t03-record-components-members` |  |  |  |
| 29 | `t03-record-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 30 | `t03-sealed-direct-subclass-modifier` |  |  |  |
| 31 | `t04-autocloseable-close-contract` |  |  |  |
| 32 | `t04-catch-order-unreachable` |  |  |  |
| 33 | `t04-finally-abrupt-completion` |  |  |  |
| 34 | `t04-finally-return` | approved | vinicius-ssantos | 2026-10-02 |
| 35 | `t04-multicatch-parameter-reassignment` |  |  |  |
| 36 | `t04-multicatch-related-types` |  |  |  |
| 37 | `t04-overriding-checked-exception` |  |  |  |
| 38 | `t04-suppressed-exception` |  |  |  |
| 39 | `t04-try-with-resources-order` | approved | vinicius-ssantos | 2026-10-02 |
| 40 | `t04-unchecked-exception-classes` |  |  |  |
| 41 | `t05-arrays-aslist-backed` |  |  |  |
| 42 | `t05-immutable-and-fixed-size-lists` | approved | vinicius-ssantos | 2026-10-02 |
| 43 | `t05-list-first-last` |  |  |  |
| 44 | `t05-list-remove-overload` | approved | vinicius-ssantos | 2026-10-02 |
| 45 | `t05-map-of-null-rejection` |  |  |  |
| 46 | `t05-sequenced-collection-reversed` |  |  |  |
| 47 | `t05-set-of-duplicate-elements` |  |  |  |
| 48 | `t05-treeset-comparator-uniqueness` |  |  |  |
| 49 | `t05-wildcard-extends-read` |  |  |  |
| 50 | `t05-wildcard-super-integer` |  |  |  |
| 51 | `t06-findfirst-ordered-stream` |  |  |  |
| 52 | `t06-flatmap-flatten` |  |  |  |
| 53 | `t06-intstream-average` |  |  |  |
| 54 | `t06-lambda-effectively-final` |  |  |  |
| 55 | `t06-reduce-empty-identity` |  |  |  |
| 56 | `t06-stream-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 57 | `t06-stream-laziness` | approved | vinicius-ssantos | 2026-10-02 |
| 58 | `t06-stream-single-use` |  |  |  |
| 59 | `t06-string-length-method-reference` |  |  |  |
| 60 | `t06-to-unmodifiable-list-null` |  |  |  |
| 61 | `t07-automatic-module-jar` |  |  |  |
| 62 | `t07-exports-and-opens` | approved | vinicius-ssantos | 2026-10-02 |
| 63 | `t07-implicit-java-base` |  |  |  |
| 64 | `t07-java-module-launch` |  |  |  |
| 65 | `t07-module-service-directives` |  |  |  |
| 66 | `t07-open-module-semantics` |  |  |  |
| 67 | `t07-qualified-exports` |  |  |  |
| 68 | `t07-requires-static` |  |  |  |
| 69 | `t07-requires-transitive` | approved | vinicius-ssantos | 2026-10-02 |
| 70 | `t07-unnamed-module-isnamed` |  |  |  |
| 71 | `t08-atomicinteger-update-and-get` |  |  |  |
| 72 | `t08-completablefuture-join-vs-get` |  |  |  |
| 73 | `t08-concurrenthashmap-null` |  |  |  |
| 74 | `t08-executor-close` | approved | vinicius-ssantos | 2026-10-02 |
| 75 | `t08-start-virtual-thread` |  |  |  |
| 76 | `t08-synchronized-method-lock` |  |  |  |
| 77 | `t08-synchronized-reentrant` |  |  |  |
| 78 | `t08-thread-interrupted-clears` |  |  |  |
| 79 | `t08-virtual-thread-daemon` | approved | vinicius-ssantos | 2026-10-02 |
| 80 | `t08-volatile-increment` |  |  |  |
| 81 | `t09-bufferedreader-readline` |  |  |  |
| 82 | `t09-files-copy-existing-target` |  |  |  |
| 83 | `t09-files-lines-close` |  |  |  |
| 84 | `t09-path-normalize-namecount` |  |  |  |
| 85 | `t09-path-resolve-absolute` |  |  |  |
| 86 | `t09-randomaccessfile-seek` |  |  |  |
| 87 | `t09-read-all-lines` | approved | vinicius-ssantos | 2026-10-02 |
| 88 | `t09-reader-vs-inputstream` |  |  |  |
| 89 | `t09-serialization-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 90 | `t09-serialization-transient-static` |  |  |  |
| 91 | `t10-collator-locale-sensitive` |  |  |  |
| 92 | `t10-datetimeformatter-locale-immutability` |  |  |  |
| 93 | `t10-locale-builder-language-tag` |  |  |  |
| 94 | `t10-locale-default-categories` |  |  |  |
| 95 | `t10-locale-language-tag` |  |  |  |
| 96 | `t10-locale-to-string` | approved | vinicius-ssantos | 2026-10-02 |
| 97 | `t10-messageformat-apostrophe` |  |  |  |
| 98 | `t10-numberformat-currency-instance` |  |  |  |
| 99 | `t10-resource-bundle-fallback` | approved | vinicius-ssantos | 2026-10-02 |
| 100 | `t10-resourcebundle-missing-key` |  |  |  |


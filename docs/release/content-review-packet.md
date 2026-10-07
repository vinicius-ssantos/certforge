# Content review packet

Generated from `content/java-se-21` by `content/build-review-packet.mjs`. **Do not edit by hand**: regenerate it, and make changes in the pack. Verdicts live in `content/java-se-21/review.json`.

**20 of 150 questions carry a current review** by vinicius-ssantos, recorded on 2026-10-02. 0 have been edited since being reviewed and need a new one; 130 have never been reviewed. Each is marked below.

The build checks that every code snippet compiles for Java 21 and prints what the question says (the "Verified by the build" lines), and that an option carrying that output is the one marked correct. It cannot judge wording, ambiguity, the quality of the explanations or whether the question tests the exam objective. That is what a human review is for.

## What this review does not establish

- The questions are AI-assisted drafts written in this repository, and the reviewer is the project owner rather than an independent third party. The content policy allows exactly this, but a second reviewer would be stronger evidence.
- The reviewer reported no errors rather than ticking each of the seven policy checks per question, so this record claims a verdict, not a per-check audit.
- A question with no runnable code rests entirely on this review and its references, because the build verifies nothing about it. The packet lists which ones those are, as it stands.
- The exam objective wording seeded in the catalog was not part of this review of the questions. It was checked separately against Oracle's page, in a browser on 2026-10-02, and matched.
- Every question in this pack now carries a program the build runs.

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
| 1 | [`t01-bigdecimal-equals-scale`](#1-t01-bigdecimal-equals-scale) | Date, time, text, numeric and boolean values | single | medium | yes, not shown | **not reviewed** |
| 2 | [`t01-bigdecimal-nonterminating-divide`](#2-t01-bigdecimal-nonterminating-divide) | Date, time, text, numeric and boolean values | single | medium | yes, not shown | **not reviewed** |
| 3 | [`t01-bigdecimal-striptrailingzeros-scale`](#3-t01-bigdecimal-striptrailingzeros-scale) | Date, time, text, numeric and boolean values | single | hard | yes, not shown | **not reviewed** |
| 4 | [`t01-boolean-parseboolean`](#4-t01-boolean-parseboolean) | Date, time, text, numeric and boolean values | multiple | easy | yes, not shown | **not reviewed** |
| 5 | [`t01-integer-boxing-guarantee`](#5-t01-integer-boxing-guarantee) | Date, time, text, numeric and boolean values | single | medium | yes, not shown | reviewed 2026-10-02 |
| 6 | [`t01-integer-division-assignment`](#6-t01-integer-division-assignment) | Date, time, text, numeric and boolean values | single | easy | yes, shown | **not reviewed** |
| 7 | [`t01-localdate-invalid-withday`](#7-t01-localdate-invalid-withday) | Date, time, text, numeric and boolean values | single | medium | yes, not shown | **not reviewed** |
| 8 | [`t01-localdate-plus-months`](#8-t01-localdate-plus-months) | Date, time, text, numeric and boolean values | single | medium | yes, shown | reviewed 2026-10-02 |
| 9 | [`t01-localdate-plus-years-leap-day`](#9-t01-localdate-plus-years-leap-day) | Date, time, text, numeric and boolean values | single | medium | yes, not shown | **not reviewed** |
| 10 | [`t01-math-round-negative`](#10-t01-math-round-negative) | Date, time, text, numeric and boolean values | single | medium | yes, not shown | **not reviewed** |
| 11 | [`t01-numeric-promotion-byte-addition`](#11-t01-numeric-promotion-byte-addition) | Date, time, text, numeric and boolean values | single | easy | yes, not shown | **not reviewed** |
| 12 | [`t01-period-vs-duration`](#12-t01-period-vs-duration) | Date, time, text, numeric and boolean values | multiple | medium | yes, not shown | **not reviewed** |
| 13 | [`t01-string-repeat`](#13-t01-string-repeat) | Date, time, text, numeric and boolean values | single | easy | yes, shown | **not reviewed** |
| 14 | [`t01-string-strip-vs-trim`](#14-t01-string-strip-vs-trim) | Date, time, text, numeric and boolean values | single | medium | yes, not shown | **not reviewed** |
| 15 | [`t01-stringbuilder-reverse-chain`](#15-t01-stringbuilder-reverse-chain) | Date, time, text, numeric and boolean values | single | easy | yes, shown | **not reviewed** |
| 16 | [`t02-case-null-pattern-switch`](#16-t02-case-null-pattern-switch) | Controlling program flow | single | medium | yes, not shown | **not reviewed** |
| 17 | [`t02-continue-for-update`](#17-t02-continue-for-update) | Controlling program flow | single | medium | yes, not shown | **not reviewed** |
| 18 | [`t02-dangling-else`](#18-t02-dangling-else) | Controlling program flow | single | easy | yes, not shown | **not reviewed** |
| 19 | [`t02-do-while-first-execution`](#19-t02-do-while-first-execution) | Controlling program flow | single | easy | yes, not shown | **not reviewed** |
| 20 | [`t02-enhanced-for-variable-assignment`](#20-t02-enhanced-for-variable-assignment) | Controlling program flow | single | medium | yes, not shown | **not reviewed** |
| 21 | [`t02-for-update-order`](#21-t02-for-update-order) | Controlling program flow | single | medium | yes, shown | **not reviewed** |
| 22 | [`t02-labeled-break-count`](#22-t02-labeled-break-count) | Controlling program flow | single | medium | yes, shown | **not reviewed** |
| 23 | [`t02-labeled-continue`](#23-t02-labeled-continue) | Controlling program flow | single | medium | yes, shown | **not reviewed** |
| 24 | [`t02-pattern-switch-guard`](#24-t02-pattern-switch-guard) | Controlling program flow | single | medium | yes, shown | reviewed 2026-10-02 |
| 25 | [`t02-pattern-variable-and-scope`](#25-t02-pattern-variable-and-scope) | Controlling program flow | single | hard | yes, not shown | **not reviewed** |
| 26 | [`t02-switch-dominance`](#26-t02-switch-dominance) | Controlling program flow | single | hard | yes, shown | reviewed 2026-10-02 |
| 27 | [`t02-switch-expression-exhaustive`](#27-t02-switch-expression-exhaustive) | Controlling program flow | single | medium | yes, not shown | **not reviewed** |
| 28 | [`t02-switch-null-default-combination`](#28-t02-switch-null-default-combination) | Controlling program flow | single | hard | yes, not shown | **not reviewed** |
| 29 | [`t02-switch-rule-no-fallthrough`](#29-t02-switch-rule-no-fallthrough) | Controlling program flow | single | easy | yes, not shown | **not reviewed** |
| 30 | [`t02-switch-yield-block`](#30-t02-switch-yield-block) | Controlling program flow | single | medium | yes, not shown | **not reviewed** |
| 31 | [`t03-class-method-beats-default`](#31-t03-class-method-beats-default) | Object-oriented concepts in Java | single | medium | yes, not shown | **not reviewed** |
| 32 | [`t03-constructor-order-super-first`](#32-t03-constructor-order-super-first) | Object-oriented concepts in Java | single | easy | yes, shown | **not reviewed** |
| 33 | [`t03-covariant-return`](#33-t03-covariant-return) | Object-oriented concepts in Java | single | medium | yes, not shown | **not reviewed** |
| 34 | [`t03-default-method-conflict`](#34-t03-default-method-conflict) | Object-oriented concepts in Java | single | hard | yes, not shown | **not reviewed** |
| 35 | [`t03-enum-constructor-access`](#35-t03-enum-constructor-access) | Object-oriented concepts in Java | single | easy | yes, not shown | **not reviewed** |
| 36 | [`t03-generic-erasure-overload`](#36-t03-generic-erasure-overload) | Object-oriented concepts in Java | single | hard | yes, not shown | **not reviewed** |
| 37 | [`t03-overload-most-specific`](#37-t03-overload-most-specific) | Object-oriented concepts in Java | single | medium | yes, not shown | **not reviewed** |
| 38 | [`t03-overload-null`](#38-t03-overload-null) | Object-oriented concepts in Java | single | medium | yes, shown | reviewed 2026-10-02 |
| 39 | [`t03-private-interface-method`](#39-t03-private-interface-method) | Object-oriented concepts in Java | multiple | medium | yes, not shown | **not reviewed** |
| 40 | [`t03-record-compact-normalization`](#40-t03-record-compact-normalization) | Object-oriented concepts in Java | single | medium | yes, shown | **not reviewed** |
| 41 | [`t03-record-components-members`](#41-t03-record-components-members) | Object-oriented concepts in Java | multiple | medium | yes, not shown | **not reviewed** |
| 42 | [`t03-record-facts`](#42-t03-record-facts) | Object-oriented concepts in Java | multiple | medium | yes, not shown | reviewed 2026-10-02 |
| 43 | [`t03-record-pattern-destructuring`](#43-t03-record-pattern-destructuring) | Object-oriented concepts in Java | single | medium | yes, shown | **not reviewed** |
| 44 | [`t03-sealed-direct-subclass-modifier`](#44-t03-sealed-direct-subclass-modifier) | Object-oriented concepts in Java | multiple | medium | yes, not shown | **not reviewed** |
| 45 | [`t03-static-method-hiding`](#45-t03-static-method-hiding) | Object-oriented concepts in Java | single | medium | yes, not shown | **not reviewed** |
| 46 | [`t04-autocloseable-close-contract`](#46-t04-autocloseable-close-contract) | Handling exceptions | single | medium | yes, not shown | **not reviewed** |
| 47 | [`t04-catch-order-unreachable`](#47-t04-catch-order-unreachable) | Handling exceptions | single | easy | yes, not shown | **not reviewed** |
| 48 | [`t04-finally-abrupt-completion`](#48-t04-finally-abrupt-completion) | Handling exceptions | single | medium | yes, shown | **not reviewed** |
| 49 | [`t04-finally-return`](#49-t04-finally-return) | Handling exceptions | single | easy | yes, shown | reviewed 2026-10-02 |
| 50 | [`t04-finally-return-overrides`](#50-t04-finally-return-overrides) | Handling exceptions | single | medium | yes, shown | **not reviewed** |
| 51 | [`t04-multicatch-parameter-reassignment`](#51-t04-multicatch-parameter-reassignment) | Handling exceptions | single | medium | yes, not shown | **not reviewed** |
| 52 | [`t04-multicatch-related-types`](#52-t04-multicatch-related-types) | Handling exceptions | single | medium | yes, not shown | **not reviewed** |
| 53 | [`t04-overriding-checked-exception`](#53-t04-overriding-checked-exception) | Handling exceptions | multiple | medium | yes, not shown | **not reviewed** |
| 54 | [`t04-precise-rethrow`](#54-t04-precise-rethrow) | Handling exceptions | single | hard | yes, not shown | **not reviewed** |
| 55 | [`t04-suppressed-exception`](#55-t04-suppressed-exception) | Handling exceptions | single | hard | yes, not shown | **not reviewed** |
| 56 | [`t04-suppressed-order-multiple-resources`](#56-t04-suppressed-order-multiple-resources) | Handling exceptions | single | hard | yes, shown | **not reviewed** |
| 57 | [`t04-throw-null`](#57-t04-throw-null) | Handling exceptions | single | hard | yes, not shown | **not reviewed** |
| 58 | [`t04-try-resource-effectively-final`](#58-t04-try-resource-effectively-final) | Handling exceptions | multiple | medium | yes, not shown | **not reviewed** |
| 59 | [`t04-try-with-resources-order`](#59-t04-try-with-resources-order) | Handling exceptions | single | medium | yes, shown | reviewed 2026-10-02 |
| 60 | [`t04-unchecked-exception-classes`](#60-t04-unchecked-exception-classes) | Handling exceptions | multiple | easy | yes, not shown | **not reviewed** |
| 61 | [`t05-arrays-aslist-backed`](#61-t05-arrays-aslist-backed) | Arrays and collections | multiple | medium | yes, not shown | **not reviewed** |
| 62 | [`t05-arrays-binarysearch-insertion-point`](#62-t05-arrays-binarysearch-insertion-point) | Arrays and collections | single | medium | yes, shown | **not reviewed** |
| 63 | [`t05-generic-invariance`](#63-t05-generic-invariance) | Arrays and collections | single | medium | yes, not shown | **not reviewed** |
| 64 | [`t05-immutable-and-fixed-size-lists`](#64-t05-immutable-and-fixed-size-lists) | Arrays and collections | single | medium | yes, shown | reviewed 2026-10-02 |
| 65 | [`t05-list-first-last`](#65-t05-list-first-last) | Arrays and collections | single | easy | yes, shown | **not reviewed** |
| 66 | [`t05-list-remove-overload`](#66-t05-list-remove-overload) | Arrays and collections | single | medium | yes, shown | reviewed 2026-10-02 |
| 67 | [`t05-map-merge-null-removes`](#67-t05-map-merge-null-removes) | Arrays and collections | single | medium | yes, shown | **not reviewed** |
| 68 | [`t05-map-of-null-rejection`](#68-t05-map-of-null-rejection) | Arrays and collections | multiple | easy | yes, not shown | **not reviewed** |
| 69 | [`t05-sequenced-collection-reversed`](#69-t05-sequenced-collection-reversed) | Arrays and collections | multiple | medium | yes, not shown | **not reviewed** |
| 70 | [`t05-sequencedmap-first-entry`](#70-t05-sequencedmap-first-entry) | Arrays and collections | single | medium | yes, not shown | **not reviewed** |
| 71 | [`t05-set-of-duplicate-elements`](#71-t05-set-of-duplicate-elements) | Arrays and collections | single | easy | yes, not shown | **not reviewed** |
| 72 | [`t05-treeset-comparator-uniqueness`](#72-t05-treeset-comparator-uniqueness) | Arrays and collections | single | hard | yes, not shown | **not reviewed** |
| 73 | [`t05-unmodifiable-list-view`](#73-t05-unmodifiable-list-view) | Arrays and collections | multiple | medium | yes, not shown | **not reviewed** |
| 74 | [`t05-wildcard-extends-read`](#74-t05-wildcard-extends-read) | Arrays and collections | single | medium | yes, not shown | **not reviewed** |
| 75 | [`t05-wildcard-super-integer`](#75-t05-wildcard-super-integer) | Arrays and collections | multiple | medium | yes, not shown | **not reviewed** |
| 76 | [`t06-collectors-tomap-duplicate-key`](#76-t06-collectors-tomap-duplicate-key) | Streams and lambda expressions | single | medium | yes, not shown | **not reviewed** |
| 77 | [`t06-findfirst-ordered-stream`](#77-t06-findfirst-ordered-stream) | Streams and lambda expressions | single | medium | yes, not shown | **not reviewed** |
| 78 | [`t06-flatmap-flatten`](#78-t06-flatmap-flatten) | Streams and lambda expressions | single | medium | yes, not shown | **not reviewed** |
| 79 | [`t06-functional-interface-extra-methods`](#79-t06-functional-interface-extra-methods) | Streams and lambda expressions | multiple | hard | yes, not shown | **not reviewed** |
| 80 | [`t06-generate-limit-count`](#80-t06-generate-limit-count) | Streams and lambda expressions | single | easy | yes, shown | **not reviewed** |
| 81 | [`t06-intstream-average`](#81-t06-intstream-average) | Streams and lambda expressions | single | easy | yes, shown | **not reviewed** |
| 82 | [`t06-lambda-effectively-final`](#82-t06-lambda-effectively-final) | Streams and lambda expressions | single | easy | yes, not shown | **not reviewed** |
| 83 | [`t06-lambda-this-enclosing-instance`](#83-t06-lambda-this-enclosing-instance) | Streams and lambda expressions | single | medium | yes, not shown | **not reviewed** |
| 84 | [`t06-parallel-foreachordered`](#84-t06-parallel-foreachordered) | Streams and lambda expressions | single | medium | yes, shown | **not reviewed** |
| 85 | [`t06-reduce-empty-identity`](#85-t06-reduce-empty-identity) | Streams and lambda expressions | single | medium | yes, not shown | **not reviewed** |
| 86 | [`t06-stream-facts`](#86-t06-stream-facts) | Streams and lambda expressions | multiple | medium | yes, not shown | reviewed 2026-10-02 |
| 87 | [`t06-stream-laziness`](#87-t06-stream-laziness) | Streams and lambda expressions | single | hard | yes, shown | reviewed 2026-10-02 |
| 88 | [`t06-stream-single-use`](#88-t06-stream-single-use) | Streams and lambda expressions | single | easy | yes, not shown | **not reviewed** |
| 89 | [`t06-string-length-method-reference`](#89-t06-string-length-method-reference) | Streams and lambda expressions | single | medium | yes, not shown | **not reviewed** |
| 90 | [`t06-to-unmodifiable-list-null`](#90-t06-to-unmodifiable-list-null) | Streams and lambda expressions | multiple | medium | yes, not shown | **not reviewed** |
| 91 | [`t07-automatic-module-jar`](#91-t07-automatic-module-jar) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | **not reviewed** |
| 92 | [`t07-export-does-not-make-type-public`](#92-t07-export-does-not-make-type-public) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | **not reviewed** |
| 93 | [`t07-exports-and-opens`](#93-t07-exports-and-opens) | Packaging, deploying and the Java Platform Module System | multiple | hard | yes, not shown | reviewed 2026-10-02 |
| 94 | [`t07-implicit-java-base`](#94-t07-implicit-java-base) | Packaging, deploying and the Java Platform Module System | single | easy | yes, not shown | **not reviewed** |
| 95 | [`t07-import-wildcard-no-subpackages`](#95-t07-import-wildcard-no-subpackages) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | **not reviewed** |
| 96 | [`t07-java-module-launch`](#96-t07-java-module-launch) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | **not reviewed** |
| 97 | [`t07-module-service-directives`](#97-t07-module-service-directives) | Packaging, deploying and the Java Platform Module System | multiple | medium | yes, not shown | **not reviewed** |
| 98 | [`t07-object-module-name`](#98-t07-object-module-name) | Packaging, deploying and the Java Platform Module System | single | easy | yes, shown | **not reviewed** |
| 99 | [`t07-open-module-semantics`](#99-t07-open-module-semantics) | Packaging, deploying and the Java Platform Module System | multiple | hard | yes, not shown | **not reviewed** |
| 100 | [`t07-qualified-exports`](#100-t07-qualified-exports) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | **not reviewed** |
| 101 | [`t07-requires-static`](#101-t07-requires-static) | Packaging, deploying and the Java Platform Module System | single | hard | yes, not shown | **not reviewed** |
| 102 | [`t07-requires-transitive`](#102-t07-requires-transitive) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | reviewed 2026-10-02 |
| 103 | [`t07-static-import-member`](#103-t07-static-import-member) | Packaging, deploying and the Java Platform Module System | single | easy | yes, shown | **not reviewed** |
| 104 | [`t07-unnamed-module-isnamed`](#104-t07-unnamed-module-isnamed) | Packaging, deploying and the Java Platform Module System | single | medium | yes, shown | **not reviewed** |
| 105 | [`t07-unnamed-package-import`](#105-t07-unnamed-package-import) | Packaging, deploying and the Java Platform Module System | single | hard | yes, not shown | **not reviewed** |
| 106 | [`t08-atomic-compare-and-set`](#106-t08-atomic-compare-and-set) | Managing concurrent code execution | single | medium | yes, shown | **not reviewed** |
| 107 | [`t08-atomicinteger-update-and-get`](#107-t08-atomicinteger-update-and-get) | Managing concurrent code execution | single | easy | yes, shown | **not reviewed** |
| 108 | [`t08-completablefuture-join-vs-get`](#108-t08-completablefuture-join-vs-get) | Managing concurrent code execution | multiple | hard | yes, not shown | **not reviewed** |
| 109 | [`t08-computeifabsent-null-result`](#109-t08-computeifabsent-null-result) | Managing concurrent code execution | single | medium | yes, not shown | **not reviewed** |
| 110 | [`t08-concurrenthashmap-null`](#110-t08-concurrenthashmap-null) | Managing concurrent code execution | multiple | easy | yes, not shown | **not reviewed** |
| 111 | [`t08-countdownlatch-count`](#111-t08-countdownlatch-count) | Managing concurrent code execution | single | easy | yes, shown | **not reviewed** |
| 112 | [`t08-executor-close`](#112-t08-executor-close) | Managing concurrent code execution | single | medium | yes, shown | reviewed 2026-10-02 |
| 113 | [`t08-reentrantlock-finally`](#113-t08-reentrantlock-finally) | Managing concurrent code execution | single | medium | yes, not shown | **not reviewed** |
| 114 | [`t08-start-virtual-thread`](#114-t08-start-virtual-thread) | Managing concurrent code execution | single | medium | yes, not shown | **not reviewed** |
| 115 | [`t08-synchronized-method-lock`](#115-t08-synchronized-method-lock) | Managing concurrent code execution | multiple | medium | yes, not shown | **not reviewed** |
| 116 | [`t08-synchronized-reentrant`](#116-t08-synchronized-reentrant) | Managing concurrent code execution | single | medium | yes, not shown | **not reviewed** |
| 117 | [`t08-thread-interrupted-clears`](#117-t08-thread-interrupted-clears) | Managing concurrent code execution | single | medium | yes, not shown | **not reviewed** |
| 118 | [`t08-virtual-thread-builder-unstarted`](#118-t08-virtual-thread-builder-unstarted) | Managing concurrent code execution | multiple | medium | yes, not shown | **not reviewed** |
| 119 | [`t08-virtual-thread-daemon`](#119-t08-virtual-thread-daemon) | Managing concurrent code execution | single | medium | yes, not shown | reviewed 2026-10-02 |
| 120 | [`t08-volatile-increment`](#120-t08-volatile-increment) | Managing concurrent code execution | single | medium | yes, not shown | **not reviewed** |
| 121 | [`t09-bufferedreader-readline`](#121-t09-bufferedreader-readline) | Java I/O API | multiple | easy | yes, not shown | **not reviewed** |
| 122 | [`t09-dataoutput-readutf`](#122-t09-dataoutput-readutf) | Java I/O API | single | medium | yes, shown | **not reviewed** |
| 123 | [`t09-files-copy-existing-target`](#123-t09-files-copy-existing-target) | Java I/O API | single | medium | yes, not shown | **not reviewed** |
| 124 | [`t09-files-lines-close`](#124-t09-files-lines-close) | Java I/O API | single | medium | yes, not shown | **not reviewed** |
| 125 | [`t09-files-readstring-utf8`](#125-t09-files-readstring-utf8) | Java I/O API | single | easy | yes, not shown | **not reviewed** |
| 126 | [`t09-files-walk-close`](#126-t09-files-walk-close) | Java I/O API | multiple | medium | yes, not shown | **not reviewed** |
| 127 | [`t09-path-normalize-namecount`](#127-t09-path-normalize-namecount) | Java I/O API | single | medium | yes, shown | **not reviewed** |
| 128 | [`t09-path-relativize`](#128-t09-path-relativize) | Java I/O API | single | medium | yes, shown | **not reviewed** |
| 129 | [`t09-path-resolve-absolute`](#129-t09-path-resolve-absolute) | Java I/O API | single | medium | yes, not shown | **not reviewed** |
| 130 | [`t09-randomaccessfile-seek`](#130-t09-randomaccessfile-seek) | Java I/O API | single | medium | yes, not shown | **not reviewed** |
| 131 | [`t09-read-all-lines`](#131-t09-read-all-lines) | Java I/O API | single | medium | yes, shown | reviewed 2026-10-02 |
| 132 | [`t09-reader-vs-inputstream`](#132-t09-reader-vs-inputstream) | Java I/O API | multiple | easy | yes, not shown | **not reviewed** |
| 133 | [`t09-serialization-facts`](#133-t09-serialization-facts) | Java I/O API | multiple | hard | yes, not shown | reviewed 2026-10-02 |
| 134 | [`t09-serialization-serialversionuid`](#134-t09-serialization-serialversionuid) | Java I/O API | single | medium | yes, not shown | **not reviewed** |
| 135 | [`t09-serialization-transient-static`](#135-t09-serialization-transient-static) | Java I/O API | multiple | medium | yes, not shown | **not reviewed** |
| 136 | [`t10-collator-locale-sensitive`](#136-t10-collator-locale-sensitive) | Implementing localization | single | medium | yes, not shown | **not reviewed** |
| 137 | [`t10-collator-primary-strength`](#137-t10-collator-primary-strength) | Implementing localization | single | hard | yes, not shown | **not reviewed** |
| 138 | [`t10-currency-us-code`](#138-t10-currency-us-code) | Implementing localization | single | easy | yes, shown | **not reviewed** |
| 139 | [`t10-datetimeformatter-locale-immutability`](#139-t10-datetimeformatter-locale-immutability) | Implementing localization | multiple | medium | yes, not shown | **not reviewed** |
| 140 | [`t10-locale-builder-language-tag`](#140-t10-locale-builder-language-tag) | Implementing localization | single | easy | yes, shown | **not reviewed** |
| 141 | [`t10-locale-default-categories`](#141-t10-locale-default-categories) | Implementing localization | multiple | medium | yes, not shown | **not reviewed** |
| 142 | [`t10-locale-language-tag`](#142-t10-locale-language-tag) | Implementing localization | single | easy | yes, not shown | **not reviewed** |
| 143 | [`t10-locale-root`](#143-t10-locale-root) | Implementing localization | multiple | medium | yes, not shown | **not reviewed** |
| 144 | [`t10-locale-to-string`](#144-t10-locale-to-string) | Implementing localization | single | easy | yes, shown | reviewed 2026-10-02 |
| 145 | [`t10-messageformat-apostrophe`](#145-t10-messageformat-apostrophe) | Implementing localization | single | hard | yes, not shown | **not reviewed** |
| 146 | [`t10-numberformat-currency-instance`](#146-t10-numberformat-currency-instance) | Implementing localization | single | easy | yes, not shown | **not reviewed** |
| 147 | [`t10-percent-format-us`](#147-t10-percent-format-us) | Implementing localization | single | easy | yes, shown | **not reviewed** |
| 148 | [`t10-resource-bundle-fallback`](#148-t10-resource-bundle-fallback) | Implementing localization | single | hard | yes, shown | reviewed 2026-10-02 |
| 149 | [`t10-resourcebundle-missing-key`](#149-t10-resourcebundle-missing-key) | Implementing localization | single | medium | yes, not shown | **not reviewed** |
| 150 | [`t10-resourcebundle-parent-lookup`](#150-t10-resourcebundle-parent-lookup) | Implementing localization | single | medium | yes, not shown | **not reviewed** |

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
equals=false
compareTo=0
```

That program, in one file:

`Main.java`:

```java
import java.math.BigDecimal;

public class Main {

  public static void main(String[] args) {
    BigDecimal a = new BigDecimal("1.0");
    BigDecimal b = new BigDecimal("1.00");
    System.out.println("equals=" + a.equals(b));
    System.out.println("compareTo=" + a.compareTo(b));
  }
}
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

To record: `"digest": "sha256:9ef4fd637d6c94153ba2213f7b71028a6ee0cdb9613b5ff5af8fee0aeb9eb69a"`, `"verified": "sha256:cb8918a0b255d75b7e746fff3d0527b997e5b67e2895c87b9f4180152ea66093"`

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
thrown=ArithmeticException
withScale=0.3333
```

That program, in one file:

`Main.java`:

```java
import java.math.BigDecimal;

public class Main {

  public static void main(String[] args) {
    try {
      new BigDecimal("1").divide(new BigDecimal("3"));
      System.out.println("thrown=none");
    } catch (ArithmeticException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
    // With a rounding mode there is a representable answer, so the exception is about the
    // non-terminating expansion rather than about division itself.
    System.out.println("withScale=" + new BigDecimal("1").divide(new BigDecimal("3"), 4, java.math.RoundingMode.HALF_UP));
  }
}
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

To record: `"digest": "sha256:fc689ebbf924f5d369c3ad37c59325b46029037e46d2cf05ddf1f167b4847ac8"`, `"verified": "sha256:b23b0fa047fe57d8726e0b481c7a1e79a60e6c1c6705391034558c4211615c87"`

**Comments:**

&nbsp;

## 3. t01-bigdecimal-striptrailingzeros-scale

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> What is the scale of `new BigDecimal("1000").stripTrailingZeros()`?

- **A** 0
- **B** 3
- **C** -3
- **D** The operation throws ArithmeticException.

### Answer key and reasons

- **A: incorrect.** The original value has scale 0, but stripping trailing zeroes can change the scale.
- **B: incorrect.** A positive scale would place digits to the right of the decimal point.
- **C: correct.** The stripped representation is numerically 1 × 10^3, represented with scale -3.
- **D: incorrect.** Removing trailing zeroes is defined for this value.

### Explanation

`stripTrailingZeros()` removes insignificant trailing zeroes while preserving numerical value. `1000` can be represented as `1E+3`, whose scale is `-3`.

### Why this difficulty

Tests the non-obvious fact that stripping trailing zeroes can produce a negative scale.

### References

- [BigDecimal.stripTrailingZeros() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html#stripTrailingZeros())

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
scale=-3
unscaled=1
value=1000
```

That program, in one file:

`Main.java`:

```java
import java.math.BigDecimal;

public class Main {

  public static void main(String[] args) {
    BigDecimal stripped = new BigDecimal("1000").stripTrailingZeros();
    // A negative scale means the unscaled value is multiplied by a power of ten.
    System.out.println("scale=" + stripped.scale());
    System.out.println("unscaled=" + stripped.unscaledValue());
    System.out.println("value=" + stripped.toPlainString());
  }
}
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

To record: `"digest": "sha256:d42b42ab33f68334c08037053831c48a49912aa790e2fddb5b9092ec1efb21da"`, `"verified": "sha256:ef2f9e6813c1d7a4d478bfd420e43a23447269c7e4f01f0a6eafe7972c09a08d"`

**Comments:**

&nbsp;

## 4. t01-boolean-parseboolean

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
lower=true
upper=true
mixed=true
yes=false
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    System.out.println("lower=" + Boolean.parseBoolean("true"));
    System.out.println("upper=" + Boolean.parseBoolean("TRUE"));
    System.out.println("mixed=" + Boolean.parseBoolean("TrUe"));
    System.out.println("yes=" + Boolean.parseBoolean("yes"));
  }
}
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

To record: `"digest": "sha256:0b1e7623275f6a34616baa9b67706d684411c852f8fda72205d1a0a30cae7b2e"`, `"verified": "sha256:9de0aefc79be65d37c2dc0f1da2f500fe90d67220bca1accb137bd89a8387321"`

**Comments:**

&nbsp;

## 5. t01-integer-boxing-guarantee

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
cached=true
uncachedSameObject=false
uncachedEquals=true
cacheEdge=true,false
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    // The specification requires boxing to cache -128..127, so two boxes of the same value in
    // that range are the same object. 100 is in the cache; 1000 is not, and == there compares
    // references, which is why only the cached case is guaranteed.
    Integer a = 100;
    Integer b = 100;
    System.out.println("cached=" + (a == b));

    Integer c = 1000;
    Integer d = 1000;
    System.out.println("uncachedSameObject=" + (c == d));
    System.out.println("uncachedEquals=" + c.equals(d));

    Integer low = -128;
    Integer alsoLow = -128;
    Integer belowLow = -129;
    Integer alsoBelowLow = -129;
    System.out.println("cacheEdge=" + (low == alsoLow) + "," + (belowLow == alsoBelowLow));
  }
}
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

To record: `"digest": "sha256:a2fbe740c9fa46fdb62cd9e5e9b5287d1abf6ebb534c3d4e67384a9757be5d0b"`, `"verified": "sha256:203fe5eefccde95240612ffe51e2db9fa4942270e8feeb4f180251194e1a61ba"`

**Comments:**

&nbsp;

## 6. t01-integer-division-assignment

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     double value = 5 / 2;
>     System.out.println(value);
>   }
> }
> ```

- **A** 2.5
- **B** 2.0
- **C** 2
- **D** It does not compile because int cannot be assigned to double.

### Answer key and reasons

- **A: incorrect.** A floating-point operand would be needed before division for the fractional part to be preserved.
- **B: correct.** Integer division produces 2, then assignment widens it to double.
- **C: incorrect.** The value is stored in a double and println uses its double representation.
- **D: incorrect.** Widening primitive conversion from int to double is allowed.

### Explanation

Both operands of `5 / 2` are `int`, so integer division happens first and produces `2`. Only then is the result widened to `double`, producing `2.0`.

### Why this difficulty

Tests whether arithmetic is performed before assignment conversion to a wider floating-point type.

### References

- [JLS 15.17.2 Division Operator /](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.17.2)

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

To record: `"digest": "sha256:4fca205d6666e3e341d125ac4a9890bc6db852fe884413562d746155476e139f"`, `"verified": "sha256:d84bdb34d4eeef4034d77e5403f850e35bc4a51b1143e3a83510e1aaad839748"`

**Comments:**

&nbsp;

## 7. t01-localdate-invalid-withday

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What happens when `LocalDate.of(2026, 4, 15).withDayOfMonth(31)` is evaluated?

- **A** It returns 2026-04-30.
- **B** It returns 2026-05-01.
- **C** It throws DateTimeException.
- **D** It returns the original date unchanged.

### Answer key and reasons

- **A: incorrect.** withDayOfMonth does not clamp an explicitly requested invalid day.
- **B: incorrect.** The operation does not overflow an invalid day into the next month.
- **C: correct.** Day 31 is invalid for April.
- **D: incorrect.** An invalid requested day is reported rather than ignored.

### Explanation

April has only 30 days. `withDayOfMonth` validates the requested day for the resulting year/month and throws `DateTimeException` when it is invalid.

### Why this difficulty

Distinguishes date-adjustment methods that clamp invalid dates from methods that reject an invalid requested day.

### References

- [LocalDate.withDayOfMonth(int) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html#withDayOfMonth(int))

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
thrown=DateTimeException
lastValidDay=2026-04-30
```

That program, in one file:

`Main.java`:

```java
import java.time.DateTimeException;
import java.time.LocalDate;

public class Main {

  public static void main(String[] args) {
    LocalDate april = LocalDate.of(2026, 4, 15);
    try {
      april.withDayOfMonth(31);
      System.out.println("thrown=none");
    } catch (DateTimeException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
    // Nothing is clamped and nothing rolls over into May.
    System.out.println("lastValidDay=" + april.withDayOfMonth(30));
  }
}
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

To record: `"digest": "sha256:53d34a71752f9abcc061cf58e769cb6cce68c3438e03778a47b7acf798d80baa"`, `"verified": "sha256:b1ffbccae796036180621badd4c4bec7f4ac2d361bb6d2db28f7193603116a10"`

**Comments:**

&nbsp;

## 8. t01-localdate-plus-months

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

## 9. t01-localdate-plus-years-leap-day

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
plusOneYear=2025-02-28
plusFourYears=2028-02-29
```

That program, in one file:

`Main.java`:

```java
import java.time.LocalDate;

public class Main {

  public static void main(String[] args) {
    LocalDate leapDay = LocalDate.of(2024, 2, 29);
    // A date unit adjusts to the last valid day rather than overflowing into March.
    System.out.println("plusOneYear=" + leapDay.plusYears(1));
    System.out.println("plusFourYears=" + leapDay.plusYears(4));
  }
}
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

To record: `"digest": "sha256:443fbe5186672dfe196388a78b2d33cb5a269f4d958d29769d30aae519dc2349"`, `"verified": "sha256:e4037b8c41d1c0a89127ea6eccb1c01d2c7feb763420f57e7425d2b1ffa7dd80"`

**Comments:**

&nbsp;

## 10. t01-math-round-negative

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What value is returned by `Math.round(-1.5d)`?

- **A** -2
- **B** -1
- **C** 0
- **D** It throws ArithmeticException.

### Answer key and reasons

- **A: incorrect.** Math.round does not round negative halves away from zero.
- **B: correct.** The specified calculation yields -1 for -1.5.
- **C: incorrect.** The value remains negative after rounding.
- **D: incorrect.** This finite input is valid for Math.round.

### Explanation

`Math.round(double)` is equivalent to taking the floor of `a + 0.5` and converting to long. For -1.5, that gives floor(-1.0), which is -1.

### Why this difficulty

Tests Math.round's exact definition for a negative half value, which is often confused with rounding away from zero.

### References

- [Math.round(double) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html#round(double))

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
negativeHalf=-1
positiveHalf=2
negativeBelowHalf=-2
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    // Math.round adds a half and floors, so a negative exact half rounds towards positive infinity.
    System.out.println("negativeHalf=" + Math.round(-1.5d));
    System.out.println("positiveHalf=" + Math.round(1.5d));
    System.out.println("negativeBelowHalf=" + Math.round(-1.6d));
  }
}
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

To record: `"digest": "sha256:4cd027741c337d773f7436876639d5351d5d46473767281087fa634d6166889d"`, `"verified": "sha256:1fac75f60eb4010872b7b076db3e876cdc3fee63e0dd47dc207ba22cc5fe2a2b"`

**Comments:**

&nbsp;

## 11. t01-numeric-promotion-byte-addition

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
inferred=Integer
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    byte a = 10;
    byte b = 20;
    var result = a + b;
    // Boxing reveals the compile-time type var inferred.
    System.out.println("inferred=" + ((Object) result).getClass().getSimpleName());
  }
}
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

To record: `"digest": "sha256:316807c7951d482af8c9258c8489c77a8b5155ec187a8d28e2970601f25f3ede"`, `"verified": "sha256:f9e1b01e6565a469b543626f1146b558d869260ba5536320df3040e8fca3c8e0"`

**Comments:**

&nbsp;

## 12. t01-period-vs-duration

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
periodUnits=[Years, Months, Days]
durationUnits=[Seconds, Nanos]
durationSeconds=90
durationNanos=500
```

That program, in one file:

`Main.java`:

```java
import java.time.Duration;
import java.time.Period;

public class Main {

  public static void main(String[] args) {
    // The units each type supports are the distinction, and each reports its own.
    System.out.println("periodUnits=" + Period.of(1, 2, 3).getUnits());
    System.out.println("durationUnits=" + Duration.ofSeconds(90, 500).getUnits());
    Duration duration = Duration.ofSeconds(90, 500);
    System.out.println("durationSeconds=" + duration.getSeconds());
    System.out.println("durationNanos=" + duration.getNano());
  }
}
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

To record: `"digest": "sha256:7664d4024c80d840583bbce6e1c0538a346fcc1221123c3f46f1858e97452c0f"`, `"verified": "sha256:5b00062cd21846f16baba295fd23d0decff43aeb756da933c14b97b99fe9b013"`

**Comments:**

&nbsp;

## 13. t01-string-repeat

**Topic:** Date, time, text, numeric and boolean values (exam objective: "Handling date, time, text, numeric and boolean values")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     System.out.println("ab".repeat(3));
>   }
> }
> ```

- **A** ab3
- **B** ababab
- **C** aaabbb
- **D** It throws IllegalArgumentException for counts greater than 1.

### Answer key and reasons

- **A: incorrect.** repeat does not append the count.
- **B: correct.** Three copies of `ab` are concatenated.
- **C: incorrect.** The entire string is repeated each time; characters are not grouped.
- **D: incorrect.** Positive repeat counts are valid.

### Explanation

`String.repeat(3)` concatenates three copies of the receiver string, so `ab` becomes `ababab`.

### Why this difficulty

Checks the exact behavior of String.repeat, including that it repeats the whole receiver.

### References

- [String.repeat(int) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html#repeat(int))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
ababab
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

To record: `"digest": "sha256:893373158293234ca3bf8d443a29fa1d83b63b1d4e9cdcec90b6746b02c8e1ed"`, `"verified": "sha256:36ff120f98d1ca85de299f65314b3b968d132cee69f8f8bb6a6d4e1058313355"`

**Comments:**

&nbsp;

## 14. t01-string-strip-vs-trim

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
stripRemovesEmSpace=true
trimRemovesEmSpace=false
trimRemovesAsciiSpace=true
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    // U+2003 EM SPACE is whitespace to Character.isWhitespace but is above U+0020.
    String padded = "\u2003hi\u2003";
    System.out.println("stripRemovesEmSpace=" + padded.strip().equals("hi"));
    System.out.println("trimRemovesEmSpace=" + padded.trim().equals("hi"));
    System.out.println("trimRemovesAsciiSpace=" + " hi ".trim().equals("hi"));
  }
}
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

To record: `"digest": "sha256:18beae388763468f5c0a8093db0a0a07798a3cb1b3ae7c63534d8059465f34ec"`, `"verified": "sha256:2a89805f07d11ccd0c9aa5deb96109c14d2ac21df4edfa4e6b73382aaa453758"`

**Comments:**

&nbsp;

## 15. t01-stringbuilder-reverse-chain

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

## 16. t02-case-null-pattern-switch

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
null
string:x
integer:7
other
noNullLabel=thrown:NullPointerException
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static String describe(Object value) {
    // Without a case null label a pattern switch throws NullPointerException on null. With it,
    // null is matched by that label and nothing else.
    return switch (value) {
      case null -> "null";
      case String s -> "string:" + s;
      case Integer i -> "integer:" + i;
      default -> "other";
    };
  }

  static String withoutNullLabel(Object value) {
    try {
      return switch (value) {
        case String s -> "string";
        default -> "other";
      };
    } catch (NullPointerException e) {
      return "thrown:" + e.getClass().getSimpleName();
    }
  }

  public static void main(String[] args) {
    System.out.println(describe(null));
    System.out.println(describe("x"));
    System.out.println(describe(7));
    System.out.println(describe(1.5));
    System.out.println("noNullLabel=" + withoutNullLabel(null));
  }
}
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

To record: `"digest": "sha256:dcfcf7cf389a01f97b7ed8330171a5309a501c0afc0d0288477f85119b250b76"`, `"verified": "sha256:a677a2ff1275e5a693a45e77f73d08b3d47a97db80a1a6a1bc5cc0ced9f9c1b2"`

**Comments:**

&nbsp;

## 17. t02-continue-for-update

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
visited=023
terminated=true
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    StringBuilder visited = new StringBuilder();
    for (int i = 0; i < 4; i++) {
      if (i == 1) {
        // If continue skipped the update, i would stay 1 and this would never end.
        continue;
      }
      visited.append(i);
    }
    System.out.println("visited=" + visited);
    System.out.println("terminated=true");
  }
}
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

To record: `"digest": "sha256:54629b7b4ee290d5f6db3807f98f71cd6ef7e8247d30cbacd8e325b424e9f295"`, `"verified": "sha256:1979c1a6a537e4523582fe1f63e298fc0ddbe8e44c6f8dcad5b60ddcad2d270d"`

**Comments:**

&nbsp;

## 18. t02-dangling-else

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> In nested `if` statements without braces, which `if` does an `else` associate with?

- **A** Always the outermost if.
- **B** The nearest unmatched if.
- **C** Whichever if has the longer condition.
- **D** It is always a compile-time ambiguity.

### Answer key and reasons

- **A: incorrect.** That would require braces or restructuring when the nearest if should not receive the else.
- **B: correct.** This is the standard dangling-else rule.
- **C: incorrect.** Condition length has no role in parsing.
- **D: incorrect.** The grammar resolves the association deterministically.

### Explanation

The Java grammar associates an `else` with the nearest preceding `if` that is allowed to receive it and does not already have an `else`.

### Why this difficulty

Tests the classic grammar rule for matching an else to the nearest unmatched if.

### References

- [JLS 14.5 Statements](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.5)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
outerTrueInnerFalse=else
outerFalse=none
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    System.out.println("outerTrueInnerFalse=" + describe(true, false));
    System.out.println("outerFalse=" + describe(false, true));
  }

  static String describe(boolean outer, boolean inner) {
    String result = "none";
    // The else belongs to the nearest unmatched if, which is the inner one. If it belonged to the
    // outer if, outerFalse would report "else" instead of "none".
    if (outer)
      if (inner) result = "inner";
      else result = "else";
    return result;
  }
}
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

To record: `"digest": "sha256:bd4ec731cc3036e485f0e5cdc8248786afd74c800fa033932d0ee6e9ff823865"`, `"verified": "sha256:fd9098efd29b9f3dc66f5211d20071d83f8adf8f3c88359d53a4d80188c30bdb"`

**Comments:**

&nbsp;

## 19. t02-do-while-first-execution

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
runsWithFalseCondition=1
whileRunsWithFalseCondition=0
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    int runs = 0;
    do {
      runs += 1;
    } while (false);
    // The condition was false from the start and the body still ran.
    System.out.println("runsWithFalseCondition=" + runs);

    int whileRuns = 0;
    while (false_()) {
      whileRuns += 1;
    }
    System.out.println("whileRunsWithFalseCondition=" + whileRuns);
  }

  // A method, because "while (false)" alone is unreachable code and will not compile.
  static boolean false_() {
    return false;
  }
}
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

To record: `"digest": "sha256:afd742e7cc3ab7537a7f2cff562ba7b7b9e5426307690adafa1f61f651ecba1d"`, `"verified": "sha256:32c03c3d699dd9171b6559b326ca8c2b0ac672ab956c76f7c5c1c56ceee53ae3"`

**Comments:**

&nbsp;

## 20. t02-enhanced-for-variable-assignment

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
afterLoopVariable=[1, 2, 3]
afterIndexWrite=[2, 3, 4]
```

That program, in one file:

`Main.java`:

```java
import java.util.Arrays;

public class Main {

  public static void main(String[] args) {
    int[] values = {1, 2, 3};
    for (int value : values) {
      value++;
    }
    // The loop variable is a fresh local holding a copy of the element, so incrementing it
    // cannot reach the array. Writing through the index does.
    System.out.println("afterLoopVariable=" + Arrays.toString(values));

    for (int i = 0; i < values.length; i++) {
      values[i]++;
    }
    System.out.println("afterIndexWrite=" + Arrays.toString(values));
  }
}
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

To record: `"digest": "sha256:dfe236fb2fbacc249157abb42b1791277c5cb0251fd49f850015a73f1216b490"`, `"verified": "sha256:545a279ad3d80ed5b3e5e35ebb7c5d61d18a56d99535735f937cae5c3cda4385"`

**Comments:**

&nbsp;

## 21. t02-for-update-order

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     for (int i = 0; i < 3; i++) {
>       System.out.print(i);
>     }
>   }
> }
> ```

- **A** 012
- **B** 123
- **C** 01
- **D** 0123

### Answer key and reasons

- **A: correct.** Each body executes before the corresponding update expression.
- **B: incorrect.** The update does not run before the first body execution.
- **C: incorrect.** The body still executes when i is 2.
- **D: incorrect.** The loop stops once i becomes 3 because `i < 3` is then false.

### Explanation

The body prints the current `i`, then the update expression increments it. The iterations therefore print 0, 1, and 2 before the condition fails at 3.

### Why this difficulty

Tests the execution order of a basic for loop by making the update expression observable.

### References

- [JLS 14.14.1 The basic for Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.14.1)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
012
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

To record: `"digest": "sha256:cc945c8da3c37608f079dc4449a615d6c1cae3f4dfafe94ae2cca0180f04ca19"`, `"verified": "sha256:bf6aaaab7c143ca12ae448c69fb72bb4cf1b29154b9086a927a0a91ae334cdf7"`

**Comments:**

&nbsp;

## 22. t02-labeled-break-count

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

## 23. t02-labeled-continue

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
>         if (j == 1) {
>           continue outer;
>         }
>         count++;
>       }
>     }
>     System.out.println(count);
>   }
> }
> ```

- **A** 3
- **B** 6
- **C** 9
- **D** 0

### Answer key and reasons

- **A: correct.** Exactly one increment occurs for each of the three outer-loop iterations.
- **B: incorrect.** The labeled continue prevents the `j == 1` and `j == 2` paths from incrementing.
- **C: incorrect.** Most inner-loop iterations are skipped by the labeled continue.
- **D: incorrect.** The increment at `j == 0` happens before the continue condition is reached.

### Explanation

For each outer iteration, `j == 0` increments `count` once. When `j == 1`, `continue outer` starts the next outer iteration immediately. That happens three times, so the count is 3.

### Why this difficulty

Requires tracing a labeled continue that skips the remainder of the inner loop and advances the outer loop.

### References

- [JLS 14.16 The continue Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.16)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
3
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

To record: `"digest": "sha256:01a4cf76956cb0fe57648df74044fc8e78e915186453bb32a42eb57094ecabdc"`, `"verified": "sha256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"`

**Comments:**

&nbsp;

## 24. t02-pattern-switch-guard

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

## 25. t02-pattern-variable-and-scope

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
string=true
empty=false
notAString=false
null=false
afterNegatedIf=true
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static boolean nonEmptyString(Object obj) {
    // && guarantees the left side matched before the right side runs, so s is in scope there.
    return obj instanceof String s && s.length() > 0;
  }

  static boolean reachableAfterIf(Object obj) {
    if (!(obj instanceof String s)) {
      return false;
    }
    // Negated-and-returned puts the rest of the method in the scope of s as well.
    return s.isBlank();
  }

  public static void main(String[] args) {
    System.out.println("string=" + nonEmptyString("abc"));
    System.out.println("empty=" + nonEmptyString(""));
    System.out.println("notAString=" + nonEmptyString(42));
    System.out.println("null=" + nonEmptyString(null));
    System.out.println("afterNegatedIf=" + reachableAfterIf("   "));
  }
}
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

To record: `"digest": "sha256:a22c81aba1df224d02f15fca5e50fd29f7d02134896da423c07ae6ffc54da33a"`, `"verified": "sha256:65b10cd598ed60f95aa930d4e201febc30499ac55e596444f886685a9249f37e"`

**Comments:**

&nbsp;

## 26. t02-switch-dominance

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

## 27. t02-switch-expression-exhaustive

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statement about a Java 21 `switch` expression is correct?

- **A** It may omit all unmatched values and implicitly return null.
- **B** It must be exhaustive.
- **C** It must always contain a default label, even when enum cases are exhaustive.
- **D** Only integer selectors can be used in switch expressions.

### Answer key and reasons

- **A: incorrect.** There is no implicit null result for unmatched selector values.
- **B: correct.** Every switch expression must cover all possible selector values.
- **C: incorrect.** A default label is not mandatory when exhaustiveness can be proven another way.
- **D: incorrect.** Other supported selector types include enum, String, and reference types with pattern matching.

### Explanation

A switch expression must be exhaustive: every possible selector value must be handled by a matching label or by a construct the compiler can prove exhaustive.

### Why this difficulty

Checks the compile-time exhaustiveness requirement of switch expressions.

### References

- [JLS 15.28 switch Expressions](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.28)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: not.exhaustive
```

That program, in one file:

`Main.java`:

```java
public class Main {

  sealed interface Shape permits Circle, Square {}

  record Circle() implements Shape {}

  record Square() implements Shape {}

  public static void main(String[] args) {
    Shape shape = new Circle();
    // A switch expression must be exhaustive. This one covers only one of the two permitted
    // subclasses and has no default, so it does not compile.
    String name =
        switch (shape) {
          case Circle c -> "circle";
        };
    System.out.println(name);
  }
}
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

To record: `"digest": "sha256:34d860bc322ca0879d9023b6fc43d36f9c1cb9f5f07cf9bf723b317b6469d2a9"`, `"verified": "sha256:a12709591235d81a9383e44c7cc0995db5ff4b9d69c440d771b01f1c72ad047c"`

**Comments:**

&nbsp;

## 28. t02-switch-null-default-combination

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Which switch label is valid Java 21 syntax for one arm that handles both a null selector and all otherwise-unmatched selector values?

- **A** case null, default ->
- **B** default, null ->
- **C** case default, null ->
- **D** case null || default ->

### Answer key and reasons

- **A: correct.** This combined label is supported.
- **B: incorrect.** The grammar uses the special `case null, default` form, not the reversed order.
- **C: incorrect.** `default` is not written as a constant after `case` in this form.
- **D: incorrect.** Boolean operators are not switch-label separators.

### Explanation

Java 21 permits `case null, default` as a combined label. This provides explicit null handling together with the catch-all default in one switch rule or statement group.

### Why this difficulty

Tests a Java 21 switch-label form that combines handling null with the catch-all default in one label.

### References

- [JLS 14.11.1 The Selector Expression](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.11.1)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
string
integer
nullOrOther
nullOrOther
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static String describe(Object value) {
    // case null, default is the one arm allowed to carry both, and it is the only combination
    // of null with another label that the language permits.
    return switch (value) {
      case String s -> "string";
      case Integer i -> "integer";
      case null, default -> "nullOrOther";
    };
  }

  public static void main(String[] args) {
    System.out.println(describe("x"));
    System.out.println(describe(7));
    System.out.println(describe(null));
    System.out.println(describe(1.5));
  }
}
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

To record: `"digest": "sha256:2ba5dac0053a90e357381ada001d6818ecaf5e7bd433883c11bcf2535404f95d"`, `"verified": "sha256:12703fca07ac192975f7ccfd923ea25cdef221eea0f4115b734fd4ad1a4fcaa0"`

**Comments:**

&nbsp;

## 29. t02-switch-rule-no-fallthrough

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
ran=one
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    StringBuilder ran = new StringBuilder();
    switch (1) {
      case 1 -> ran.append("one");
      // No break is written, and the next arm still does not run.
      case 2 -> ran.append("two");
      default -> ran.append("other");
    }
    System.out.println("ran=" + ran);
  }
}
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

To record: `"digest": "sha256:b242031edf316e072ac889f837b7727dbd545e65e888ef81931e0ee3d68ce33e"`, `"verified": "sha256:8833ddbfbebc9db9c534438480c06a1e43626ccd24ac5d41500b60178e0bbd50"`

**Comments:**

&nbsp;

## 30. t02-switch-yield-block

**Topic:** Controlling program flow (exam objective: "Controlling program flow")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A `case` in a switch expression uses a block and must produce a value for the switch expression. Which statement should be used inside the block to provide that value?

- **A** break value;
- **B** return value;
- **C** yield value;
- **D** continue value;

### Answer key and reasons

- **A: incorrect.** `break` does not provide a result value for a switch expression block.
- **B: incorrect.** `return` exits the enclosing method, not just the block within the switch expression.
- **C: correct.** `yield` transfers control out of the switch expression block while providing its value.
- **D: incorrect.** `continue` applies to loops and does not produce a switch expression result.

### Explanation

A block in a switch expression uses `yield` to produce the value of the switch expression. `break` exits a switch statement but does not yield a value for a switch expression block.

### Why this difficulty

Requires distinguishing statement-style control transfer from producing a value from a block in a switch expression.

### References

- [JLS 14.21 The yield Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.21)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
value=Wednesday
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    int day = 3;
    String name = switch (day) {
      case 3 -> {
        String computed = "Wednesday";
        yield computed;
      }
      default -> "other";
    };
    System.out.println("value=" + name);
  }
}
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

To record: `"digest": "sha256:0afae2a7218a5d3803639c7ee84cf3a310257d9d93ebae0f2d0af3c2ffd406ef"`, `"verified": "sha256:e4265b8eaa0d0e5c93ff5c0ee686a8732def082906a190c4e9a68ea776550879"`

**Comments:**

&nbsp;

## 31. t03-class-method-beats-default

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A superclass provides a concrete instance method `run()`, and an implemented interface provides a default `run()` with the same signature. Which implementation is inherited by the subclass if it declares no `run()`?

- **A** The interface default always wins.
- **B** The superclass method wins.
- **C** The subclass must always override run() or compilation fails.
- **D** Both implementations run in declaration order.

### Answer key and reasons

- **A: incorrect.** Defaults do not override an applicable concrete class method.
- **B: correct.** Class methods take precedence over interface defaults.
- **C: incorrect.** There is no conflict requiring an override when a concrete class method already resolves it.
- **D: incorrect.** Method invocation selects one implementation.

### Explanation

A concrete method inherited from a class takes precedence over an interface default method with the same signature. This is commonly summarized as 'class wins'.

### Why this difficulty

Tests the class-over-interface precedence rule for inherited concrete instance methods and interface defaults.

### References

- [JLS 8.4.8.4 Inheriting Methods with Override-Equivalent Signatures](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.8.4)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
inherited=superclass method
```

That program, in one file:

`Main.java`:

```java
public class Main {

  interface Greeter {
    default String run() {
      return "interface default";
    }
  }

  static class Base {
    public String run() {
      return "superclass method";
    }
  }

  // Declares no run() of its own, so the inherited one is the question.
  static class Subclass extends Base implements Greeter {}

  public static void main(String[] args) {
    System.out.println("inherited=" + new Subclass().run());
  }
}
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

To record: `"digest": "sha256:a09b6917beb7f093ff3abb555a96fabc70f9dd5ab7c0f222b21461173f92398f"`, `"verified": "sha256:e1baa8868cedc31f372697b54cfc24add3848fb1eca22f059db79a6468ea3660"`

**Comments:**

&nbsp;

## 32. t03-constructor-order-super-first

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> class A {
>   A() {
>     System.out.print("A");
>   }
> }
>
> class B extends A {
>   B() {
>     System.out.print("B");
>   }
> }
>
> public class Main {
>   public static void main(String[] args) {
>     new B();
>   }
> }
> ```

- **A** AB
- **B** BA
- **C** B
- **D** It does not compile because B does not explicitly call super().

### Answer key and reasons

- **A: correct.** The superclass constructor runs before the subclass constructor body.
- **B: incorrect.** The subclass body does not run before superclass construction.
- **C: incorrect.** The superclass constructor is still invoked.
- **D: incorrect.** The compiler inserts an implicit no-argument super() call when permitted.

### Explanation

A subclass constructor invokes a superclass constructor before executing its own body. Therefore constructing `B` prints `A` first and `B` second.

### Why this difficulty

Checks superclass-constructor invocation order during object construction.

### References

- [JLS 8.8.7 Constructor Body](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.8.7)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
AB
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

To record: `"digest": "sha256:215053665d7d437cf0e91cc9e9682017b2a9359da1f94b2a8cddcf0366837a4e"`, `"verified": "sha256:38164fbd17603d73f696b8b4d72664d735bb6a7c88577687fd2ae33fd6964153"`

**Comments:**

&nbsp;

## 33. t03-covariant-return

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
throughParent=2
declaredType=Integer
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static class Parent {
    Number value() {
      return 1;
    }
  }

  static class Child extends Parent {
    // A subtype of the overridden return type is allowed; this file compiling is the proof.
    @Override
    Integer value() {
      return 2;
    }
  }

  public static void main(String[] args) {
    Parent asParent = new Child();
    System.out.println("throughParent=" + asParent.value());
    System.out.println("declaredType=" + new Child().value().getClass().getSimpleName());
  }
}
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

To record: `"digest": "sha256:26eeff7f3509172605a9ff9dc38ed7baecbf83c9534bc1890e2f5059bd22b95c"`, `"verified": "sha256:5f8456bc6933e830d9bf618baaba6b4de30fb8f3a54565bafcb224ec005f12ac"`

**Comments:**

&nbsp;

## 34. t03-default-method-conflict

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: types.incompatible
```

That program, in one file:

`Main.java`:

```java
public class Main {

  interface Walks {
    default String move() {
      return "walk";
    }
  }

  interface Swims {
    default String move() {
      return "swim";
    }
  }

  // Two unrelated interfaces, neither default more specific than the other. Without an override
  // the class does not compile, which is what makes the override mandatory rather than merely
  // advisable.
  static class Amphibian implements Walks, Swims {}

  public static void main(String[] args) {
    System.out.println(new Amphibian().move());
  }
}
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

To record: `"digest": "sha256:eb4409af4125d56ff4a03527eb2e922dfd072622a1414b72cfc421f545166833"`, `"verified": "sha256:0407b514e56e15f8764cc85df455d3d942fb909dd51961cf2c1c01ebd06ba41c"`

**Comments:**

&nbsp;

## 35. t03-enum-constructor-access

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
declaredCount=1
isPrivate=true
isPublic=false
isProtected=false
sourceParameters=1,reflected=3
constants=1,2
```

That program, in one file:

`Main.java`:

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;

public class Main {

  enum Planet {
    EARTH(1),
    MARS(2);

    final int moons;

    // No access modifier is written here.
    Planet(int moons) {
      this.moons = moons;
    }
  }

  public static void main(String[] args) {
    System.out.println("declaredCount=" + Planet.class.getDeclaredConstructors().length);
    Constructor<?> only = Planet.class.getDeclaredConstructors()[0];
    System.out.println("isPrivate=" + Modifier.isPrivate(only.getModifiers()));
    System.out.println("isPublic=" + Modifier.isPublic(only.getModifiers()));
    System.out.println("isProtected=" + Modifier.isProtected(only.getModifiers()));
    // The compiler also prepends the name and ordinal parameters, which is why the reflected
    // constructor takes three where the source declares one.
    System.out.println("sourceParameters=1,reflected=" + only.getParameterCount());
    System.out.println("constants=" + Planet.EARTH.moons + "," + Planet.MARS.moons);
  }
}
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

To record: `"digest": "sha256:c116ca78accd40bbd6dbc8e897375631b0e7d4f7dceea2f4a44267192f53df2e"`, `"verified": "sha256:b042cec1c11c3c328da127cd9ddb6cad1550ae9c33c544c20be6419d643731eb"`

**Comments:**

&nbsp;

## 36. t03-generic-erasure-overload

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Can one class declare both `void process(List<String> x)` and `void process(List<Integer> x)`?

- **A** Yes, because String and Integer are unrelated types.
- **B** No, because both methods erase to the same signature.
- **C** Yes, but only if one method is static.
- **D** No, because Java forbids overloading methods named process.

### Answer key and reasons

- **A: incorrect.** Generic type arguments are erased for the method signature used here.
- **B: correct.** Both parameterized List types erase to raw List.
- **C: incorrect.** Static versus instance does not solve the erased-signature clash.
- **D: incorrect.** Java permits overloading; the issue is the identical erasure.

### Explanation

No. After type erasure, both parameter types erase to `List`, so the two methods have the same erased signature and cause a name clash.

### Why this difficulty

Tests type erasure and the resulting restriction on overloads that differ only in generic type arguments.

### References

- [JLS 4.6 Type Erasure](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.6)
- [JLS 8.4.9 Overloading](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.9)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: name.clash.same.erasure
```

That program, in one file:

`Main.java`:

```java
import java.util.List;

public class Main {

  // Both parameters erase to List, so the two declarations have the same erased signature and
  // cannot coexist in one class, however different the type arguments look.
  void process(List<String> x) {
    System.out.println("strings" + x);
  }

  void process(List<Integer> x) {
    System.out.println("integers" + x);
  }

  public static void main(String[] args) {
    new Main().process(List.of("a"));
  }
}
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

To record: `"digest": "sha256:af0d595ad57d2ddebe8eca2b73029cc48ba82e3ecded0f39b758852aaa5458be"`, `"verified": "sha256:55aa1567b680ce7e410119ca9009140233eafe54ddef78989af23a8cb21cf631"`

**Comments:**

&nbsp;

## 37. t03-overload-most-specific

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
chosen=String
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static String m(Object o) {
    return "Object";
  }

  static String m(String s) {
    return "String";
  }

  static String m(String... s) {
    return "varargs";
  }

  public static void main(String[] args) {
    System.out.println("chosen=" + m("x"));
  }
}
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

To record: `"digest": "sha256:1b6f352210c6837847f625af4e8baaaa292dfd33fe43182cc6ebd1bf46154355"`, `"verified": "sha256:89cee1eb5c2d6baba862eaf04eca4bb4e699f346aad4d4ac0db2bd1d9ff26829"`

**Comments:**

&nbsp;

## 38. t03-overload-null

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

## 39. t03-private-interface-method

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
Hello Ana!
declaredByClass=[]
punctuationInPublicApi=false
greetInPublicApi=true
```

That program, in one file:

`Main.java`:

```java
import java.lang.reflect.Method;
import java.util.Arrays;

public class Main {

  interface Greeter {
    private String punctuation() {
      return "!";
    }

    // A private interface method is callable from a default method of the same interface, which
    // is what makes it usable as an implementation helper.
    default String greet(String name) {
      return "Hello " + name + punctuation();
    }
  }

  static class English implements Greeter {}

  public static void main(String[] args) {
    System.out.println(new English().greet("Ana"));

    // It is not inherited into the implementing class's callable API: the class declares nothing,
    // and its public methods are the ones it inherited from Object plus greet.
    System.out.println(
        "declaredByClass=" + Arrays.toString(English.class.getDeclaredMethods()));
    boolean visible =
        Arrays.stream(English.class.getMethods()).map(Method::getName).anyMatch("punctuation"::equals);
    System.out.println("punctuationInPublicApi=" + visible);
    boolean greetVisible =
        Arrays.stream(English.class.getMethods()).map(Method::getName).anyMatch("greet"::equals);
    System.out.println("greetInPublicApi=" + greetVisible);
  }
}
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

To record: `"digest": "sha256:cb5b92dca6b5a7d30cff7a1bdb4f8c2824df319cd28332d32d1ead6e35f48ff9"`, `"verified": "sha256:83ddaf777dcb7396db7f0182d4c6fb69016d0021000b371a89680166dd9652f9"`

**Comments:**

&nbsp;

## 40. t03-record-compact-normalization

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

## 41. t03-record-components-members

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
fieldPrivate=true
fieldFinal=true
accessorNamedAfterComponent=x
accessorPublic=true
hasSetter=false
classFinal=true
```

That program, in one file:

`Main.java`:

```java
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

public class Main {

  record Point(int x) {}

  public static void main(String[] args) throws Exception {
    Field field = Point.class.getDeclaredField("x");
    System.out.println("fieldPrivate=" + Modifier.isPrivate(field.getModifiers()));
    System.out.println("fieldFinal=" + Modifier.isFinal(field.getModifiers()));

    Method accessor = Point.class.getDeclaredMethod("x");
    System.out.println("accessorNamedAfterComponent=" + accessor.getName());
    System.out.println("accessorPublic=" + Modifier.isPublic(accessor.getModifiers()));

    // No setter is generated, and the class itself is final.
    System.out.println("hasSetter=" + hasMethod("setX"));
    System.out.println("classFinal=" + Modifier.isFinal(Point.class.getModifiers()));
  }

  static boolean hasMethod(String name) {
    for (Method method : Point.class.getDeclaredMethods()) {
      if (method.getName().equals(name)) {
        return true;
      }
    }
    return false;
  }
}
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

To record: `"digest": "sha256:0ff6b907dc8f3ebd5c84b47981593c5acf73d18ad45fc74bbcd638d25717afb8"`, `"verified": "sha256:5d32b44ece875af3c57add5452b1ee090de3669abe1dcb83bfe132646b2efe2d"`

**Comments:**

&nbsp;

## 42. t03-record-facts

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

## 43. t03-record-pattern-destructuring

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this Java 21 program print?
>
> ```java
> record Point(int x, int y) {}
>
> public class Main {
>   public static void main(String[] args) {
>     Object value = new Point(2, 3);
>     if (value instanceof Point(int x, int y)) {
>       System.out.println(x + y);
>     }
>   }
> }
> ```

- **A** 2
- **B** 3
- **C** 5
- **D** It does not compile because record patterns are not final in Java 21.

### Answer key and reasons

- **A: incorrect.** Only the x component is 2; the program adds both components.
- **B: incorrect.** Only the y component is 3.
- **C: correct.** The record pattern binds x=2 and y=3, then adds them.
- **D: incorrect.** Record patterns are a final Java 21 language feature.

### Explanation

The record pattern matches the `Point` instance and destructures its two components into `x` and `y`. Their sum is 5.

### Why this difficulty

Exercises Java 21 record patterns by destructuring a record directly in instanceof.

### References

- [JLS 14.30.2 Record Patterns](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.30.2)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
5
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

To record: `"digest": "sha256:2d81362b7973114d78b82a45730f51fcc36af4f20570da3711a89060723ebca5"`, `"verified": "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"`

**Comments:**

&nbsp;

## 44. t03-sealed-direct-subclass-modifier

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
finalIsFinal=true
sealedIsSealed=true
nonSealedIsSealed=false
extendedNonSealed=true
permitted=3
```

That program, in one file:

`Main.java`:

```java
public class Main {

  sealed interface Shape permits Finally, Sealing, Opened {}

  // Each of the three modifiers satisfies a direct subclass's obligation to say how sealing
  // continues, and they say three different things.
  static final class Finally implements Shape {}

  static sealed class Sealing implements Shape permits Leaf {}

  static final class Leaf extends Sealing {}

  static non-sealed class Opened implements Shape {}

  // Permitted only because Opened is non-sealed: an unrelated subclass of a sealed hierarchy.
  static class Outsider extends Opened {}

  public static void main(String[] args) {
    System.out.println("finalIsFinal=" + java.lang.reflect.Modifier.isFinal(Finally.class.getModifiers()));
    System.out.println("sealedIsSealed=" + Sealing.class.isSealed());
    System.out.println("nonSealedIsSealed=" + Opened.class.isSealed());
    System.out.println("extendedNonSealed=" + (new Outsider() instanceof Shape));
    System.out.println("permitted=" + Shape.class.getPermittedSubclasses().length);
  }
}
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

To record: `"digest": "sha256:0589970f182f47e2dba49a322d5becd6a7e221066cebe87e959d38c6a866d48a"`, `"verified": "sha256:bbf56540e044771e3af895d10d58b2d50df37f7bb503cc622ffb703bef188de8"`

**Comments:**

&nbsp;

## 45. t03-static-method-hiding

**Topic:** Object-oriented concepts in Java (exam objective: "Using object-oriented concepts in Java")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A superclass and subclass declare static methods with the same signature. If a variable has the superclass type but holds a subclass instance, which declaration is selected by `variable.method()`?

- **A** The subclass method, because the object is a subclass instance.
- **B** The superclass method, because the variable's compile-time type controls static method selection.
- **C** Both methods are invoked.
- **D** The call is always ambiguous.

### Answer key and reasons

- **A: incorrect.** That dynamic dispatch rule applies to overridden instance methods, not hidden static methods.
- **B: correct.** Static methods are resolved from the qualifying type.
- **C: incorrect.** Only one method invocation occurs.
- **D: incorrect.** The compile-time type resolves the hidden static method.

### Explanation

Static methods are hidden, not overridden. Method selection is based on the compile-time type of the qualifying expression, so the superclass static method is selected.

### Why this difficulty

Distinguishes static method hiding from dynamic dispatch of overridden instance methods.

### References

- [JLS 8.4.8.2 Hiding (by Class Methods)](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.8.2)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
throughVariable=parent
throughType=child
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static class Parent {
    static String who() {
      return "parent";
    }
  }

  static class Child extends Parent {
    static String who() {
      return "child";
    }
  }

  public static void main(String[] args) {
    Parent variable = new Child();
    // The variable's compile-time type decides, so the instance being a Child changes nothing.
    System.out.println("throughVariable=" + variable.who());
    System.out.println("throughType=" + Child.who());
  }
}
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

To record: `"digest": "sha256:c69a40b4585bd500240ea0eadf5abac62bdb30a8917aed93a76b84165fb57f4b"`, `"verified": "sha256:145ac6a9fe5a81caccbfd546f5ad24e46b1783ad847662c871a6a36a7c2e43db"`

**Comments:**

&nbsp;

## 46. t04-autocloseable-close-contract

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
autoCloseable=[class java.lang.Exception]
closeable=[class java.io.IOException]
body=ran
caught=java.lang.Exception:from close
```

That program, in one file:

`Main.java`:

```java
import java.io.Closeable;
import java.util.Arrays;

public class Main {

  public static void main(String[] args) throws Exception {
    // AutoCloseable.close() is declared to throw Exception, which is why a resource may throw
    // any checked exception from close and try-with-resources has to allow for that.
    System.out.println(
        "autoCloseable=" + Arrays.toString(AutoCloseable.class.getMethod("close").getExceptionTypes()));
    // Closeable narrows it to IOException. The two are often confused.
    System.out.println(
        "closeable=" + Arrays.toString(Closeable.class.getMethod("close").getExceptionTypes()));

    class Resource implements AutoCloseable {
      @Override
      public void close() throws Exception {
        throw new Exception("from close");
      }
    }
    try (Resource r = new Resource()) {
      System.out.println("body=ran");
    } catch (Exception e) {
      System.out.println("caught=" + e.getClass().getName() + ":" + e.getMessage());
    }
  }
}
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

To record: `"digest": "sha256:5ab0f4c702acf4f07745dea13ba6aee30aa0aa83a65f39c3b264cca0aff86787"`, `"verified": "sha256:b2c7bd5525dbd1cea47cfb88d9b4cc8425ebd2be978b21abe97620971612593a"`

**Comments:**

&nbsp;

## 47. t04-catch-order-unreachable

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: except.already.caught
```

That program, in one file:

`Main.java`:

```java
import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

  public static void main(String[] args) {
    try {
      if (args.length == 0) {
        throw new FileNotFoundException("missing");
      }
      // The IOException catch already handles every FileNotFoundException, so the second catch
      // can never run and the compiler rejects it rather than accepting dead code.
    } catch (IOException e) {
      System.out.println("io");
    } catch (FileNotFoundException e) {
      System.out.println("notFound");
    }
  }
}
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

To record: `"digest": "sha256:e3960611c7004121f66ad18889cfbca1a5397b083d8e94f24539f969cd9e7eda"`, `"verified": "sha256:727f14af6460e6c58f3749f341b8c506133e786f9d6ff31be23bb0c95eab7a0e"`

**Comments:**

&nbsp;

## 48. t04-finally-abrupt-completion

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

## 49. t04-finally-return

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

## 50. t04-finally-return-overrides

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
>       return 2;
>     }
>   }
>
>   public static void main(String[] args) {
>     System.out.println(value());
>   }
> }
> ```

- **A** 1
- **B** 2
- **C** 12
- **D** It does not compile because finally cannot return.

### Answer key and reasons

- **A: incorrect.** The pending return from try is discarded when finally returns.
- **B: correct.** The return from finally determines the method result.
- **C: incorrect.** Only one value is returned from the method.
- **D: incorrect.** A return in finally is legal, though often discouraged because it replaces prior abrupt completion.

### Explanation

The try block prepares to return 1, but the finally block itself returns 2. Abrupt completion of finally replaces the pending return from try, so the method returns 2.

### Why this difficulty

Tests that abrupt completion of finally by return replaces a pending return from the try block.

### References

- [JLS 14.20.2 Execution of try-finally and try-catch-finally](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.2)

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

To record: `"digest": "sha256:a43c494c1b43844f14542816074a36c70d2ac84f89ff9c2b2643e31d1f3e0275"`, `"verified": "sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"`

**Comments:**

&nbsp;

## 51. t04-multicatch-parameter-reassignment

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: multicatch.parameter.may.not.be.assigned
```

That program, in one file:

`Main.java`:

```java
import java.io.IOException;
import java.sql.SQLException;

public class Main {

  static void readRow() throws IOException, SQLException {
    throw new IOException("boom");
  }

  public static void main(String[] args) {
    try {
      readRow();
    } catch (IOException | SQLException ex) {
      // A multi-catch parameter is implicitly final, so this assignment does not compile. A
      // single-type catch parameter is not, and the same line there would be allowed.
      ex = new IOException("replaced");
      System.out.println(ex.getMessage());
    }
  }
}
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

To record: `"digest": "sha256:fa6d1845fdb457fa94622d83cf09f8eb88382f4efab0da5f5a5c9f875ae3d8d3"`, `"verified": "sha256:fa47524547f6c4505c2fbe84550043626b9c940c3aa76937a6f46587fce1a202"`

**Comments:**

&nbsp;

## 52. t04-multicatch-related-types

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: multicatch.types.must.be.disjoint
```

That program, in one file:

`Main.java`:

```java
import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

  public static void main(String[] args) {
    try {
      throw new FileNotFoundException("missing");
      // FileNotFoundException is a subtype of IOException, so one alternative subsumes the
      // other and the multi-catch is rejected. Only disjoint alternatives are allowed.
    } catch (IOException | FileNotFoundException ex) {
      System.out.println(ex.getMessage());
    }
  }
}
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

To record: `"digest": "sha256:a1aeb4003a853b4838c8b30c803b2cabb36edad84a40cba6956339dfb850be01"`, `"verified": "sha256:a8ceb15f3a09eef6e07a6b0cede57f49eb476cb48385b3736f7db9c016317dbe"`

**Comments:**

&nbsp;

## 53. t04-overriding-checked-exception

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
quiet=saved
caughtAsIOException=FileNotFoundException
quietThrows=0
narrowThrows=FileNotFoundException
```

That program, in one file:

`Main.java`:

```java
import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

  static class Store {
    void save() throws IOException {
      throw new IOException("base");
    }
  }

  // Omitting the checked exception entirely is allowed: an override may throw less, never more.
  static class Quiet extends Store {
    @Override
    void save() {
      System.out.println("quiet=saved");
    }
  }

  // Narrowing to a subtype is allowed for the same reason.
  static class Narrow extends Store {
    @Override
    void save() throws FileNotFoundException {
      throw new FileNotFoundException("narrow");
    }
  }

  public static void main(String[] args) throws Exception {
    new Quiet().save();
    // Calling through the supertype still only has to handle what the supertype declares, which
    // is what the rule protects.
    Store asStore = new Narrow();
    try {
      asStore.save();
    } catch (IOException e) {
      System.out.println("caughtAsIOException=" + e.getClass().getSimpleName());
    }
    System.out.println("quietThrows=" + Quiet.class.getDeclaredMethod("save").getExceptionTypes().length);
    System.out.println(
        "narrowThrows=" + Narrow.class.getDeclaredMethod("save").getExceptionTypes()[0].getSimpleName());
  }
}
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

To record: `"digest": "sha256:8df117237acec009efb84ecffeaf663a6797508f33efdffed8fbf57c920ce86f"`, `"verified": "sha256:a4739b9c4c56133f90ab1b12450a5cfe2e23c3999b1dda25c4a4c883bb9705e1"`

**Comments:**

&nbsp;

## 54. t04-precise-rethrow

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> A try block can throw only `IOException` or `SQLException`. It is followed by `catch (Exception ex) { throw ex; }`, and `ex` is not reassigned. Which checked exceptions may the enclosing method need to declare?

- **A** Only Exception; narrower declarations are impossible.
- **B** IOException and SQLException.
- **C** No checked exceptions, because catch always handles them.
- **D** Throwable.

### Answer key and reasons

- **A: incorrect.** Precise rethrow can preserve the actual checked exception alternatives.
- **B: correct.** Those are the checked exception types that can actually be rethrown from the catch.
- **C: incorrect.** The catch immediately rethrows the exception.
- **D: incorrect.** The analysis does not broaden the requirement to Throwable.

### Explanation

Precise rethrow analysis can infer the checked exception types that can actually reach the catch clause when the catch parameter is final or effectively final. The method can declare `IOException` and `SQLException` rather than the broader `Exception`.

### Why this difficulty

Tests Java's precise rethrow analysis for an effectively final catch parameter typed more broadly than the exceptions that can actually reach it.

### References

- [JLS 11.2.2 Exception Analysis of Statements](https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html#jls-11.2.2)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
io=IOException
sql=SQLException
```

That program, in one file:

`Main.java`:

```java
import java.io.IOException;
import java.sql.SQLException;

public class Main {

  /**
   * Precise rethrow: the compiler knows ex can only be one of the two the body can throw, so the
   * method declares those rather than Exception. This file compiling is the proof.
   */
  static void run(boolean io) throws IOException, SQLException {
    try {
      if (io) {
        throw new IOException("io");
      }
      throw new SQLException("sql");
    } catch (Exception ex) {
      throw ex;
    }
  }

  public static void main(String[] args) {
    System.out.println("io=" + caught(true));
    System.out.println("sql=" + caught(false));
  }

  static String caught(boolean io) {
    try {
      run(io);
      return "none";
    } catch (Exception e) {
      return e.getClass().getSimpleName();
    }
  }
}
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

To record: `"digest": "sha256:fd973e7f0541b87083711dfba1ed50be57d516e0e9c863dfe0054f07e8530b3a"`, `"verified": "sha256:5b6c01404af159275127e5426fa81f74c45a7a073e30fc7858285bd2b6fbfca1"`

**Comments:**

&nbsp;

## 55. t04-suppressed-exception

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
primary=E1 from body
suppressedCount=1
suppressed=E2 from close
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static final class Resource implements AutoCloseable {
    @Override
    public void close() {
      throw new IllegalStateException("E2 from close");
    }
  }

  public static void main(String[] args) {
    try {
      try (Resource resource = new Resource()) {
        throw new RuntimeException("E1 from body");
      }
    } catch (Exception caught) {
      System.out.println("primary=" + caught.getMessage());
      System.out.println("suppressedCount=" + caught.getSuppressed().length);
      System.out.println("suppressed=" + caught.getSuppressed()[0].getMessage());
    }
  }
}
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

To record: `"digest": "sha256:cd0599da3ec29c624c4da95798535333a9a8d079a228203e2eba8b0ec4920801"`, `"verified": "sha256:6e35d6dc6d650b03717dd826fc3e47b5e6c1b09f89ee68447e9e1f97ffce32f1"`

**Comments:**

&nbsp;

## 56. t04-suppressed-order-multiple-resources

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   static class R implements AutoCloseable {
>     private final String name;
>     R(String name) { this.name = name; }
>     @Override public void close() throws Exception {
>       throw new Exception(name);
>     }
>   }
>
>   public static void main(String[] args) {
>     try (R a = new R("A"); R b = new R("B")) {
>       throw new Exception("body");
>     } catch (Exception ex) {
>       System.out.print(ex.getMessage());
>       for (Throwable suppressed : ex.getSuppressed()) {
>         System.out.print(" " + suppressed.getMessage());
>       }
>     }
>   }
> }
> ```

- **A** body A B
- **B** body B A
- **C** B A body
- **D** A B

### Answer key and reasons

- **A: incorrect.** Resources do not close in declaration order.
- **B: correct.** B closes first, then A, and their failures are suppressed on the body exception in that order.
- **C: incorrect.** The body exception remains primary; close exceptions are suppressed.
- **D: incorrect.** The primary body exception is still present and printed first.

### Explanation

The body exception remains primary. Resources close in reverse declaration order, so B closes before A. Their exceptions are attached as suppressed exceptions in that same close order, producing `body B A`.

### Why this difficulty

Requires tracing reverse resource-closing order and the order in which close failures become suppressed exceptions.

### References

- [JLS 14.20.3.1 Basic try-with-resources](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3.1)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
body B A
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

To record: `"digest": "sha256:e2afec415f841ba095bf49077be501f107cc048be213badd67d0f5b03c200d58"`, `"verified": "sha256:a5186120410130f105bfeefc2d996f16fdb4811641c073fb2282b43b72ca7c85"`

**Comments:**

&nbsp;

## 57. t04-throw-null

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> What happens at runtime when the statement `throw null;` is executed?

- **A** It throws a NullPointerException.
- **B** It silently returns from the method.
- **C** It throws a generic Exception instance created automatically.
- **D** It is always a compile-time error.

### Answer key and reasons

- **A: correct.** The JVM reports a null throwable reference with NullPointerException.
- **B: incorrect.** A throw statement never means normal return.
- **C: incorrect.** No replacement Exception object is created.
- **D: incorrect.** The null type is compatible with the reference-type requirement; the failure occurs at runtime.

### Explanation

The null reference is permitted by the type rules for a throw expression, but attempting to throw it causes a `NullPointerException` at runtime.

### Why this difficulty

Tests the special runtime behavior of a throw statement whose expression evaluates to null.

### References

- [JLS 14.18 The throw Statement](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.18)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
thrown=NullPointerException
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    try {
      throwNull();
      System.out.println("thrown=none");
    } catch (Throwable thrown) {
      System.out.println("thrown=" + thrown.getClass().getSimpleName());
    }
  }

  static void throwNull() {
    // The null literal needs no throws clause: its static type carries no checked exception,
    // which is why this compiles at all. The failure happens when it is thrown.
    throw null;
  }
}
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

To record: `"digest": "sha256:1b15e315ff179c1db4dd6dfea334a0d2857377ff88374ff1fc7d35b764902fea"`, `"verified": "sha256:f0ea31173b30fc8f6659dbb196761b5a87cba2a5599d8ef252b6549a90acfeca"`

**Comments:**

&nbsp;

## 58. t04-try-resource-effectively-final

**Topic:** Handling exceptions (exam objective: "Handling exceptions")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Suppose `BufferedReader reader` is declared before a try-with-resources statement. Which statements are correct if the code uses `try (reader) { ... }`? Select all that apply.

- **A** reader must be final or effectively final.
- **B** reader is closed automatically when the try-with-resources statement exits.
- **C** reader must be reassigned inside the try body.
- **D** Only variables declared inside the resource header can ever be resources.

### Answer key and reasons

- **A: correct.** That is required for an existing variable used as a resource.
- **B: correct.** The usual automatic closing semantics apply.
- **C: incorrect.** Reassignment would conflict with the effective-final requirement.
- **D: incorrect.** Java permits suitable existing final/effectively-final variables in the header.

### Explanation

An existing local variable can be used directly as a resource when it is final or effectively final and has an AutoCloseable-compatible type. The resource is closed automatically when the try-with-resources statement exits.

### Why this difficulty

Tests the Java language rule that an existing local variable can appear in a resource specification only when it is final or effectively final.

### References

- [JLS 14.20.3 try-with-resources](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
read=line
closed=true:IOException
```

That program, in one file:

`Main.java`:

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class Main {

  public static void main(String[] args) throws IOException {
    // Declared before the statement and never reassigned, so it is effectively final and may be
    // named directly in the resource list.
    BufferedReader reader = new BufferedReader(new StringReader("line"));
    try (reader) {
      System.out.println("read=" + reader.readLine());
    }

    // Leaving the statement closed it, even though the statement did not declare it. A closed
    // BufferedReader refuses further reads.
    try {
      reader.readLine();
      System.out.println("closed=false");
    } catch (IOException e) {
      System.out.println("closed=true:" + e.getClass().getSimpleName());
    }
  }
}
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

To record: `"digest": "sha256:db2ba98db1d5be314931368482ebace892c0c97439bf3e587e636a582557ee78"`, `"verified": "sha256:d602e4580e6ae67a48937fb08cfce2df19ea07e3d2480886e566c4275c11b0b4"`

**Comments:**

&nbsp;

## 59. t04-try-with-resources-order

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

## 60. t04-unchecked-exception-classes

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
runtimeNeedsNoThrows=IllegalStateException
errorNeedsNoThrows=StackOverflowError
ioIsRuntime=false
ioIsError=false
```

That program, in one file:

`Main.java`:

```java
import java.io.IOException;

public class Main {

  // No throws clause, and these compile: that is what unchecked means.
  static void throwsRuntime() {
    throw new IllegalStateException("unchecked");
  }

  static void throwsError() {
    throw new StackOverflowError("also unchecked");
  }

  public static void main(String[] args) {
    System.out.println("runtimeNeedsNoThrows=" + caught(Main::throwsRuntime));
    System.out.println("errorNeedsNoThrows=" + caught(Main::throwsError));
    // A checked exception is one that is neither, which is why IOException must be declared.
    System.out.println("ioIsRuntime=" + RuntimeException.class.isAssignableFrom(IOException.class));
    System.out.println("ioIsError=" + Error.class.isAssignableFrom(IOException.class));
  }

  static String caught(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (Throwable t) {
      return t.getClass().getSimpleName();
    }
  }
}
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

To record: `"digest": "sha256:f3298bb15abaf556983f5edaf62617f681d111db362c160d980d3ed043d895ca"`, `"verified": "sha256:5eee7a971bcbce1dd4d19b4a3b8a910fbf5e5498b4eb2ff756c052853dbc637a"`

**Comments:**

&nbsp;

## 61. t05-arrays-aslist-backed

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
writesThroughToArray=z
add=UnsupportedOperationException
remove=UnsupportedOperationException
```

That program, in one file:

`Main.java`:

```java
import java.util.Arrays;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    String[] array = {"x", "y"};
    List<String> list = Arrays.asList(array);

    list.set(0, "z");
    System.out.println("writesThroughToArray=" + array[0]);
    System.out.println("add=" + thrownBy(() -> list.add("z")));
    System.out.println("remove=" + thrownBy(() -> list.remove(0)));
  }

  static String thrownBy(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (RuntimeException e) {
      return e.getClass().getSimpleName();
    }
  }
}
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

To record: `"digest": "sha256:78ae48555284a939204e7fd0a0c9ec06a2868315ed215f48a0bead672ec7c70f"`, `"verified": "sha256:3ca8f77e3e8dda4129c5dab4327208a26a63ea9cfc6bc95ed7a7767e6cf9eb79"`

**Comments:**

&nbsp;

## 62. t05-arrays-binarysearch-insertion-point

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.Arrays;
>
> public class Main {
>   public static void main(String[] args) {
>     int[] values = {1, 3, 5, 7};
>     System.out.println(Arrays.binarySearch(values, 4));
>   }
> }
> ```

- **A** 2
- **B** -2
- **C** -3
- **D** 4

### Answer key and reasons

- **A: incorrect.** 2 is the insertion point, but an absent result is encoded as a negative value.
- **B: incorrect.** The return value is `-insertionPoint - 1`, not simply the negated insertion point.
- **C: correct.** With insertion point 2, the encoded result is -3.
- **D: incorrect.** The method returns an index or encoded insertion point, not the search key.

### Explanation

The missing value 4 would be inserted at index 2 to keep the array sorted. `binarySearch` encodes an absent key as `-(insertionPoint) - 1`, giving `-3`.

### Why this difficulty

Tests the negative return encoding of Arrays.binarySearch when a key is absent.

### References

- [Arrays.binarySearch(int[], int) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html#binarySearch(int%5B%5D,int))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
-3
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

To record: `"digest": "sha256:f1feb974278902e5ed8928de3bcd4122368551cda2963692a8fe1b3e88cca7ec"`, `"verified": "sha256:615bdd17c2556f82f384392ea8557f8cc88b03501c759e23093ab0b2a9b5cd48"`

**Comments:**

&nbsp;

## 63. t05-generic-invariance

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Given `List<Integer> integers = new ArrayList<>();`, can it be assigned directly to a variable of type `List<Number>`?

- **A** Yes, because Integer extends Number.
- **B** No, because generic types such as List are invariant in their type argument.
- **C** Yes, but only when the list is empty.
- **D** No, because ArrayList cannot be assigned to any List variable.

### Answer key and reasons

- **A: incorrect.** Subtype relationships between type arguments do not make the corresponding generic types covariant.
- **B: correct.** A wildcard is needed when variance is desired.
- **C: incorrect.** Generic assignment compatibility is compile-time and does not depend on runtime size.
- **D: incorrect.** ArrayList implements List; the issue is the incompatible generic argument.

### Explanation

No. Java generic types are invariant: even though `Integer` is a subtype of `Number`, `List<Integer>` is not a subtype of `List<Number>`.

### Why this difficulty

Tests generic invariance, a core rule behind wildcard use and many collection-assignment errors.

### References

- [JLS 4.10.2 Subtyping among Class and Interface Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.10.2)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: prob.found.req
```

That program, in one file:

`Main.java`:

```java
import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<Integer> integers = new ArrayList<>();
    // Generic types are invariant in their type argument: List<Integer> is not a List<Number>,
    // however much Integer is a Number. Allowing it would let a Double be added through the
    // second reference.
    List<Number> numbers = integers;
    numbers.add(Double.valueOf(1.5));
    System.out.println(integers.get(0));
  }
}
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

To record: `"digest": "sha256:094a1e2203407a95692132fcad51deac056d2c528ed0a4ba8b86d2bec730fa3b"`, `"verified": "sha256:8bf864e73cc334c2af3118db7fc68bd832eb0ceb1d626d5abd39c31e30e9e562"`

**Comments:**

&nbsp;

## 64. t05-immutable-and-fixed-size-lists

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

## 65. t05-list-first-last

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

## 66. t05-list-remove-overload

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

## 67. t05-map-merge-null-removes

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.HashMap;
>
> public class Main {
>   public static void main(String[] args) {
>     var map = new HashMap<String, Integer>();
>     map.put("x", 1);
>     map.merge("x", 2, (oldValue, newValue) -> null);
>     System.out.println(map.containsKey("x"));
>   }
> }
> ```

- **A** true
- **B** false
- **C** null
- **D** It throws NullPointerException because the remapping function returns null.

### Answer key and reasons

- **A: incorrect.** A null remapping result removes the existing mapping.
- **B: correct.** The mapping for x is removed by merge.
- **C: incorrect.** containsKey returns primitive boolean.
- **D: incorrect.** A null result is a defined signal to remove the mapping.

### Explanation

The key `x` already has a non-null value. `merge` invokes the remapping function; because that function returns null, the mapping is removed. `containsKey("x")` is therefore false.

### Why this difficulty

Tests Map.merge's removal rule when the remapping function returns null.

### References

- [Map.merge(K, V, BiFunction) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html#merge(K,V,java.util.function.BiFunction))

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

To record: `"digest": "sha256:671e2d9f69f61cf91749124ed9414c2e803642a10b949f01c198eb9cda795f33"`, `"verified": "sha256:fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa"`

**Comments:**

&nbsp;

## 68. t05-map-of-null-rejection

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
nullKey=NullPointerException
nullValue=NullPointerException
```

That program, in one file:

`Main.java`:

```java
import java.util.Map;

public class Main {

  public static void main(String[] args) {
    System.out.println("nullKey=" + thrownBy(() -> Map.<String, String>of(null, "v")));
    System.out.println("nullValue=" + thrownBy(() -> Map.<String, String>of("k", null)));
  }

  static String thrownBy(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (RuntimeException e) {
      return e.getClass().getSimpleName();
    }
  }
}
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

To record: `"digest": "sha256:4f93455ea9bcd769eb8c704e4168711950095f2f6a3e4905e6c268c896433416"`, `"verified": "sha256:24d06a1079ae59d80990aee990dd97f9d140a2e4ada58cd38d27c6482dfbb678"`

**Comments:**

&nbsp;

## 69. t05-sequenced-collection-reversed

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
reversedOrder=[3, 2, 1]
firstBecomesLast=true
isView=true
```

That program, in one file:

`Main.java`:

```java
import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3));
    List<Integer> reversed = numbers.reversed();
    System.out.println("reversedOrder=" + reversed);
    System.out.println("firstBecomesLast=" + reversed.getLast().equals(numbers.getFirst()));
    numbers.add(4);
    // A copy would not have noticed the addition.
    System.out.println("isView=" + reversed.getFirst().equals(4));
  }
}
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

To record: `"digest": "sha256:faaaa171a52a8b5880abdb3bbc8f081f454bfa669ddb3aa7c967090b8a40b1de"`, `"verified": "sha256:7696735281fbf9f939df0854bc39301470aa606bf2859372e5536b5349a5ee77"`

**Comments:**

&nbsp;

## 70. t05-sequencedmap-first-entry

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A `LinkedHashMap` receives mappings for keys `a`, `b`, and `c` in that order. What key is returned by `map.firstEntry().getKey()` in Java 21?

- **A** a
- **B** b
- **C** c
- **D** The result is unspecified because maps never have encounter order.

### Answer key and reasons

- **A: correct.** a is the first mapping in insertion encounter order.
- **B: incorrect.** b is the second inserted key.
- **C: incorrect.** c is the last inserted key.
- **D: incorrect.** LinkedHashMap is specifically encounter-ordered and implements SequencedMap.

### Explanation

LinkedHashMap has insertion encounter order by default and implements `SequencedMap`. `firstEntry()` returns the first mapping in that encounter order, whose key is `a`.

### Why this difficulty

Checks Java 21's SequencedMap encounter-order API using LinkedHashMap's insertion order.

### References

- [LinkedHashMap (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html)
- [SequencedMap (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/SequencedMap.html)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
first=a
last=c
reversed=[c, b, a]
```

That program, in one file:

`Main.java`:

```java
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class Main {

  public static void main(String[] args) {
    SequencedMap<String, Integer> map = new LinkedHashMap<>();
    map.put("a", 1);
    map.put("b", 2);
    map.put("c", 3);

    System.out.println("first=" + map.firstEntry().getKey());
    System.out.println("last=" + map.lastEntry().getKey());
    System.out.println("reversed=" + map.reversed().keySet());
  }
}
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

To record: `"digest": "sha256:5550cddfb25d8027408ced0a592c9595a6985d775b16064dd2f079c54ddda8c2"`, `"verified": "sha256:c0b7e7a0825025da1e9f8f5e580e6ed5fd3da72e05c6c98ac4c5784de05915b7"`

**Comments:**

&nbsp;

## 71. t05-set-of-duplicate-elements

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
thrown=IllegalArgumentException
```

That program, in one file:

`Main.java`:

```java
import java.util.Set;

public class Main {

  public static void main(String[] args) {
    try {
      Set.of("a", "a");
      System.out.println("thrown=none");
    } catch (RuntimeException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
  }
}
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

To record: `"digest": "sha256:f55f5f7ac1729a0d85579fa56c110814d20e8aebdf3eb7efc1b2e91eb026df5d"`, `"verified": "sha256:e583de920d973638cd9ab055a91a6a9a9d262173aac2ad0ce6cf7c002e935ff6"`

**Comments:**

&nbsp;

## 72. t05-treeset-comparator-uniqueness

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
areEqual=false
secondAdded=false
size=1
kept=first
```

That program, in one file:

`Main.java`:

```java
import java.util.TreeSet;

public class Main {

  record Item(String id) {}

  public static void main(String[] args) {
    // The comparator decides membership for a sorted set, not equals.
    TreeSet<Item> set = new TreeSet<>((a, b) -> 0);
    set.add(new Item("first"));
    Item second = new Item("second");

    System.out.println("areEqual=" + new Item("first").equals(second));
    System.out.println("secondAdded=" + set.add(second));
    System.out.println("size=" + set.size());
    System.out.println("kept=" + set.first().id());
  }
}
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

To record: `"digest": "sha256:bb2c3d99cea36775c4a9c9e4d3f64fab7b9f9d7d868385bb5ae7526d14aca3f8"`, `"verified": "sha256:f8d953b82ae460272c52275ab89e9cd2cc47daa9ff148d98ff34b92a4b041e23"`

**Comments:**

&nbsp;

## 73. t05-unmodifiable-list-view

**Topic:** Arrays and collections (exam objective: "Working with arrays and collections")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Suppose `view = Collections.unmodifiableList(backing)`. Which statements are correct? Select all that apply.

- **A** Calling view.add(...) throws UnsupportedOperationException.
- **B** Changes made directly to backing can be observed through view.
- **C** The method always makes a detached copy of backing.
- **D** The backing list itself becomes unmodifiable.

### Answer key and reasons

- **A: correct.** The view does not support mutating operations.
- **B: correct.** The wrapper is a view over the same backing list.
- **C: incorrect.** It wraps the supplied list rather than necessarily copying its contents.
- **D: incorrect.** Only access through the returned wrapper is restricted.

### Explanation

The returned list is an unmodifiable view of the specified backing list. Mutation through the view is blocked, but changes made directly to the backing list are visible through the view.

### Why this difficulty

Distinguishes an unmodifiable view from an immutable independent copy.

### References

- [Collections.unmodifiableList(List) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html#unmodifiableList(java.util.List))

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
addThroughView=UnsupportedOperationException
viewSeesBackingChange=2
backingStillModifiable=2
```

That program, in one file:

`Main.java`:

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<String> backing = new ArrayList<>(List.of("a"));
    List<String> view = Collections.unmodifiableList(backing);

    System.out.println("addThroughView=" + thrownBy(() -> view.add("b")));
    backing.add("b");
    // A copy would not have noticed, and the backing list is not itself frozen.
    System.out.println("viewSeesBackingChange=" + view.size());
    System.out.println("backingStillModifiable=" + backing.size());
  }

  static String thrownBy(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (RuntimeException e) {
      return e.getClass().getSimpleName();
    }
  }
}
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

To record: `"digest": "sha256:841c4f88777e1d2214370df5e28556c09978e2a01750b1529d8083e8279fddd9"`, `"verified": "sha256:dc4aa67860f06cad84df4161672a72a6f5156d93dd50d684671cacfd15b8f953"`

**Comments:**

&nbsp;

## 74. t05-wildcard-extends-read

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
read=1 class=Integer
size=1
read=2.5 class=Double
size=1
read=3 class=Long
size=1
```

That program, in one file:

`Main.java`:

```java
import java.util.List;

public class Main {

  static void readOnly(List<? extends Number> values) {
    // Every element is some Number, whatever the actual type argument is, so reading as Number
    // is always safe. Writing is not: the compiler has no element type it can accept, which is
    // why values.add(1) would not compile here.
    Number n = values.get(0);
    System.out.println("read=" + n + " class=" + n.getClass().getSimpleName());
    System.out.println("size=" + values.size());
  }

  public static void main(String[] args) {
    readOnly(List.of(Integer.valueOf(1)));
    readOnly(List.of(Double.valueOf(2.5)));
    readOnly(List.<Number>of(Long.valueOf(3)));
  }
}
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

To record: `"digest": "sha256:8ec87ba3fc8e34ea91d56f057bcc827f26cd7422fab6d3dec176c257b1aa65cf"`, `"verified": "sha256:1c925a9e7d83017dd65d5dfa43b5eaaa9051cc43f07acaea064a1b7df74cff7d"`

**Comments:**

&nbsp;

## 75. t05-wildcard-super-integer

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
listOfInteger added=1 readAsObject=Integer
listOfNumber added=1 readAsObject=Integer
listOfObject added=1 readAsObject=Integer
listOfComparable added=1 readAsObject=Integer
```

That program, in one file:

`Main.java`:

```java
import java.util.ArrayList;
import java.util.List;

public class Main {

  static void writeInteger(String label, List<? super Integer> values) {
    // The actual type argument is Integer or a supertype of it, so an Integer is always an
    // acceptable element: adding is safe. Reading gives back only Object, because the one type
    // every candidate type argument is known to share is Object.
    values.add(Integer.valueOf(1));
    Object x = values.get(0);
    System.out.println(label + " added=" + values.size() + " readAsObject=" + x.getClass().getSimpleName());
  }

  public static void main(String[] args) {
    writeInteger("listOfInteger", new ArrayList<Integer>());
    writeInteger("listOfNumber", new ArrayList<Number>());
    writeInteger("listOfObject", new ArrayList<Object>());
    writeInteger("listOfComparable", new ArrayList<Comparable<Integer>>());
  }
}
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

To record: `"digest": "sha256:649993028d41fe35da8524352275a5c01a381387399a0007ff09a0e6707b89fd"`, `"verified": "sha256:516fc32dc34e74ec943db82872a225750305ed8ef6bbe5726f309143772a216b"`

**Comments:**

&nbsp;

## 76. t06-collectors-tomap-duplicate-key

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What happens when `Collectors.toMap(keyMapper, valueMapper)` encounters two stream elements that map to the same key?

- **A** The later value silently replaces the earlier one.
- **B** The earlier value always wins silently.
- **C** IllegalStateException is thrown.
- **D** Both values are automatically stored in a List.

### Answer key and reasons

- **A: incorrect.** Replacement requires an explicit merge policy or a different collection strategy.
- **B: incorrect.** No silent first-wins policy is defined.
- **C: correct.** Duplicate mapped keys are an error for this overload.
- **D: incorrect.** toMap produces a Map value per key, not an automatic collection of duplicate values.

### Explanation

The overload without a merge function does not define how to combine duplicate values. It throws `IllegalStateException` when duplicate keys are encountered.

### Why this difficulty

Tests the duplicate-key behavior of the two-function toMap collector when no merge function is supplied.

### References

- [Collectors.toMap(Function, Function) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html#toMap(java.util.function.Function,java.util.function.Function))

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
thrown=IllegalStateException
withMergeFunction={a=ab}
```

That program, in one file:

`Main.java`:

```java
import java.util.List;
import java.util.stream.Collectors;

public class Main {

  public static void main(String[] args) {
    try {
      List.of("aa", "ab").stream().collect(Collectors.toMap(s -> s.charAt(0), s -> s));
      System.out.println("thrown=none");
    } catch (IllegalStateException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
    // The three-argument form is the way to say which value wins.
    System.out.println(
        "withMergeFunction="
            + List.of("aa", "ab").stream().collect(Collectors.toMap(s -> s.charAt(0), s -> s, (a, b) -> b)));
  }
}
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

To record: `"digest": "sha256:cdeedf8681b1d62f18cbfd46eb73ee2797a2999757d59964c3bfd20802cb253b"`, `"verified": "sha256:bc985617b6e5969c4dd2a4fbbf129eeece5a38f6d180e56723a04039a844b0a6"`

**Comments:**

&nbsp;

## 77. t06-findfirst-ordered-stream

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
sequential=a
parallel=a
```

That program, in one file:

`Main.java`:

```java
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<String> ordered = List.of("a", "b", "c");
    System.out.println("sequential=" + ordered.stream().findFirst().orElseThrow());
    // Ordered means first, even in parallel; findAny is the one that may return any element.
    System.out.println("parallel=" + ordered.stream().parallel().findFirst().orElseThrow());
  }
}
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

To record: `"digest": "sha256:260c1a2671e757cb81b0b5572abf5f7d6b6ed1c86c3e4b0d4c36ab357793803d"`, `"verified": "sha256:919b1feae12cce04d4be8a2db134dcc55918835923581f04b314f67827a1fd79"`

**Comments:**

&nbsp;

## 78. t06-flatmap-flatten

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
map=[2, 1]
flatMap=[1, 2, 3]
```

That program, in one file:

`Main.java`:

```java
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<List<Integer>> nested = List.of(List.of(1, 2), List.of(3));
    System.out.println("map=" + nested.stream().map(List::size).toList());
    System.out.println("flatMap=" + nested.stream().flatMap(List::stream).toList());
  }
}
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

To record: `"digest": "sha256:81a1d82b3b182549e43a2d4d1a5c38735f05ee764f2aaa461e8faba802341afc"`, `"verified": "sha256:2845c0bc29c91c151ba08de4543b3ea7bb5e4c5187727da74f7d9677b5c29a56"`

**Comments:**

&nbsp;

## 79. t06-functional-interface-extra-methods

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** multiple choice, select all that apply · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Which declarations can coexist with the single function method in a functional interface without preventing it from being functional? Select all that apply.

- **A** default methods
- **B** static methods
- **C** an abstract declaration matching a public method of Object, such as boolean equals(Object)
- **D** two unrelated abstract instance methods with different signatures

### Answer key and reasons

- **A: correct.** Default methods have implementations and do not add abstract function methods.
- **B: correct.** Static interface methods are not instance abstract methods.
- **C: correct.** Such declarations are excluded from the count used to determine the function method.
- **D: incorrect.** That generally leaves more than one abstract method and prevents functional-interface status.

### Explanation

A functional interface has one abstract method for the purpose of lambda conversion. It may also declare default methods and static methods, and certain methods corresponding to public methods of Object do not count as additional function methods.

### Why this difficulty

Tests the formal functional-interface definition rather than the oversimplified rule that an interface must contain exactly one method total.

### References

- [JLS 9.8 Functional Interfaces](https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html#jls-9.8)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
ana
BRUNO
declared=equals abstract=true static=false default=false
declared=hashCode abstract=true static=false default=false
declared=name abstract=true static=false default=false
declared=of abstract=false static=true default=false
declared=shout abstract=false static=false default=true
declared=toString abstract=true static=false default=false
```

That program, in one file:

`Main.java`:

```java
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.Comparator;

public class Main {

  // @FunctionalInterface is a compile-time assertion: this would not compile if the extra
  // declarations cost the interface its single abstract method. Default methods, static methods
  // and abstract redeclarations of public Object methods all leave it intact.
  @FunctionalInterface
  interface Named {
    String name();

    default String shout() {
      return name().toUpperCase();
    }

    static Named of(String value) {
      return () -> value;
    }

    @Override
    boolean equals(Object other);

    @Override
    int hashCode();

    @Override
    String toString();
  }

  public static void main(String[] args) {
    // A lambda is assignable, which is exactly what an interface loses when it stops being
    // functional. That this line compiles is the proof; the listing below only reports which
    // declarations the interface really has.
    Named named = () -> "ana";
    System.out.println(named.name());
    System.out.println(Named.of("bruno").shout());

    // Sorted by name and without the compiler's synthetic lambda body, because the order
    // getDeclaredMethods returns is unspecified and would make this output depend on the JVM.
    Arrays.stream(Named.class.getDeclaredMethods())
        .filter(m -> !m.isSynthetic())
        .sorted(Comparator.comparing(Method::getName))
        .forEach(
            m ->
                System.out.println(
                    "declared="
                        + m.getName()
                        + " abstract="
                        + Modifier.isAbstract(m.getModifiers())
                        + " static="
                        + Modifier.isStatic(m.getModifiers())
                        + " default="
                        + m.isDefault()));
  }
}
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

To record: `"digest": "sha256:a7c2eeed5b5430583895ba7bcc5741a85d8baa0e1d28600f8919a5197ec642dd"`, `"verified": "sha256:c9108b77def2326441479f5fd4ece664208fd0aa5bcf8cee5deb697426406e99"`

**Comments:**

&nbsp;

## 80. t06-generate-limit-count

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.stream.Stream;
>
> public class Main {
>   public static void main(String[] args) {
>     long count = Stream.generate(() -> "x").limit(3).count();
>     System.out.println(count);
>   }
> }
> ```

- **A** 0
- **B** 3
- **C** The program never terminates.
- **D** It throws IllegalStateException because generate is infinite.

### Answer key and reasons

- **A: incorrect.** The supplier can provide elements and limit allows three of them.
- **B: correct.** limit makes the stream finite with three elements.
- **C: incorrect.** limit bounds the otherwise infinite stream before count consumes it.
- **D: incorrect.** Infinite streams are valid when paired with a short-circuiting or bounding operation.

### Explanation

`Stream.generate` creates an unbounded stream, but `limit(3)` truncates it to at most three elements. `count()` therefore returns 3.

### Why this difficulty

Checks how a short-circuiting size bound makes an otherwise infinite generated stream finite.

### References

- [Stream.generate(Supplier) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html#generate(java.util.function.Supplier))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
3
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

To record: `"digest": "sha256:f091d17ace9ae04839d3867d74e1cc9d199443fff810a4fc40a970d374b8ab3f"`, `"verified": "sha256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"`

**Comments:**

&nbsp;

## 81. t06-intstream-average

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

## 82. t06-lambda-effectively-final

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: cant.ref.non.effectively.final.var
```

That program, in one file:

`Main.java`:

```java
import java.util.function.Supplier;

public class Main {

  public static void main(String[] args) {
    int counter = 0;
    Supplier<Integer> read = () -> counter;
    // The capture above requires counter to be effectively final. This reassignment takes that
    // away, so the lambda no longer compiles, and the error is reported at the capture.
    counter = 1;
    System.out.println(read.get());
  }
}
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

To record: `"digest": "sha256:e5ebba5c9d6aeaef72da6498990ea36c3a1b80e5266da18c242d5fc478e7c75e"`, `"verified": "sha256:8e39abccc00b372f3acc69f0e730030f8894bad24f80e7a38cc06d4296d0d575"`

**Comments:**

&nbsp;

## 83. t06-lambda-this-enclosing-instance

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Inside an instance method, what does `this` refer to within a lambda expression declared by that method?

- **A** A new hidden lambda object.
- **B** The enclosing instance.
- **C** The current Thread object.
- **D** this is forbidden inside lambdas.

### Answer key and reasons

- **A: incorrect.** A lambda does not introduce its own this binding.
- **B: correct.** Lambda expressions use lexical this semantics.
- **C: incorrect.** Thread identity is unrelated to the meaning of this.
- **D: incorrect.** It is allowed and refers to the enclosing context.

### Explanation

Lambda bodies are lexically scoped. They do not introduce a new `this`; `this` refers to the same enclosing instance as it does outside the lambda.

### Why this difficulty

Distinguishes lambda lexical scoping from anonymous-class scoping.

### References

- [JLS 15.27.2 Lambda Body](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.27.2)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
lambda=true:enclosing:enclosing
anonymous=false:true:enclosing
lambdaThisIsEnclosing=true
```

That program, in one file:

`Main.java`:

```java
import java.util.function.Supplier;

public class Main {

  final String label = "enclosing";

  String fromLambda() {
    // A lambda is not a new scope for this: it means the enclosing instance, so this, Main.this
    // and an unqualified field read all reach the same object.
    Supplier<String> supplier = () -> (this == Main.this) + ":" + this.label + ":" + label;
    return supplier.get();
  }

  String fromAnonymousClass() {
    // An anonymous class is a different object, so this there is the anonymous instance and
    // reaching the enclosing one needs Main.this.
    Supplier<String> supplier =
        new Supplier<>() {
          @Override
          public String get() {
            Object self = this;
            return (self == Main.this) + ":" + self.getClass().getSimpleName().isEmpty() + ":" + Main.this.label;
          }
        };
    return supplier.get();
  }

  String lambdaIdentity() {
    Supplier<Object> supplier = () -> this;
    return String.valueOf(supplier.get() == this);
  }

  public static void main(String[] args) {
    Main main = new Main();
    System.out.println("lambda=" + main.fromLambda());
    System.out.println("anonymous=" + main.fromAnonymousClass());
    System.out.println("lambdaThisIsEnclosing=" + main.lambdaIdentity());
  }
}
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

To record: `"digest": "sha256:1a0fa4c0cdeafcc273869919ee6d954b9b3f67ee60d3bc0a0bcb6930fdf7e600"`, `"verified": "sha256:301a76363ca57c469d680e15619185c4025b0e0a8de566564b8ca36a5f0531ed"`

**Comments:**

&nbsp;

## 84. t06-parallel-foreachordered

**Topic:** Streams and lambda expressions (exam objective: "Working with streams and lambda expressions")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.stream.IntStream;
>
> public class Main {
>   public static void main(String[] args) {
>     IntStream.range(0, 4).parallel().forEachOrdered(System.out::print);
>   }
> }
> ```

- **A** 0123
- **B** The order is necessarily random.
- **C** 3210
- **D** It does not compile because parallel streams cannot use forEachOrdered.

### Answer key and reasons

- **A: correct.** forEachOrdered preserves encounter order.
- **B: incorrect.** That would be a concern with forEach, not forEachOrdered on an ordered stream.
- **C: incorrect.** Parallel execution does not imply reverse encounter order.
- **D: incorrect.** forEachOrdered is specifically defined for streams, including parallel streams.

### Explanation

Although the stream is parallel, `forEachOrdered` performs the action in encounter order for an ordered stream. The range therefore prints 0, 1, 2, 3 in order.

### Why this difficulty

Distinguishes parallel execution from encounter-order guarantees of forEachOrdered.

### References

- [BaseStream and IntStream forEachOrdered (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/IntStream.html#forEachOrdered(java.util.function.IntConsumer))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
0123
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

To record: `"digest": "sha256:efd8e2428504e30d4d844daf0c730dc85c4d85b7720eb301d4ab5a639f6229bd"`, `"verified": "sha256:1be2e452b46d7a0d9656bbb1f768e8248eba1b75baed65f5d99eafa948899a6a"`

**Comments:**

&nbsp;

## 85. t06-reduce-empty-identity

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
empty=10
nonEmpty=13
```

That program, in one file:

`Main.java`:

```java
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) {
    System.out.println("empty=" + Stream.<Integer>empty().reduce(10, Integer::sum));
    System.out.println("nonEmpty=" + Stream.of(1, 2).reduce(10, Integer::sum));
  }
}
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

To record: `"digest": "sha256:ece7c2a1eb9fcf982e92b36c2c350fe2c7809be39feb1fe1e90504b91691d6e9"`, `"verified": "sha256:58be70435548b36e1ad6bfb817cb3a42f4dda0b4aea4a73051c28afc99e5fbd5"`

**Comments:**

&nbsp;

## 86. t06-stream-facts

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
beforeTerminal=[]
afterTerminal=[a, bb, ccc] result=[bb, ccc]
sortedOrder=[in3, in1, in2, out1, out2, out3] sorted=[1, 2, 3]
peekedWithLimit=[1, 2]
```

That program, in one file:

`Main.java`:

```java
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) {
    List<String> seen = new ArrayList<>();

    // An intermediate operation processes nothing until a terminal operation asks for elements.
    Stream<String> pipeline = Stream.of("a", "bb", "ccc").filter(s -> {
      seen.add(s);
      return s.length() > 1;
    });
    System.out.println("beforeTerminal=" + seen);
    List<String> result = pipeline.toList();
    System.out.println("afterTerminal=" + seen + " result=" + result);

    // sorted() is stateful: it cannot emit its first element until it has consumed every input,
    // which a peek before and after makes visible.
    List<String> order = new ArrayList<>();
    List<Integer> sorted =
        Stream.of(3, 1, 2)
            .peek(i -> order.add("in" + i))
            .sorted()
            .peek(i -> order.add("out" + i))
            .toList();
    System.out.println("sortedOrder=" + order + " sorted=" + sorted);

    // peek observes elements as they flow past a point, and only those the pipeline demands:
    // with a short-circuiting terminal operation it sees fewer than the source holds.
    List<Integer> peeked = new ArrayList<>();
    Stream.of(1, 2, 3, 4).peek(peeked::add).limit(2).toList();
    System.out.println("peekedWithLimit=" + peeked);
  }
}
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

To record: `"digest": "sha256:6aefbf857ab03ebf0639c5df18fdf73d11544b50be59c6ec9fa977deba8bc9da"`, `"verified": "sha256:d352f1eb2c0e9643c3a96e8c70bedd367afd3d70ad187e74e5cd3bc00ea7d862"`

**Comments:**

&nbsp;

## 87. t06-stream-laziness

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

## 88. t06-stream-single-use

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
first=3
second=IllegalStateException
```

That program, in one file:

`Main.java`:

```java
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) {
    Stream<Integer> once = Stream.of(1, 2, 3);
    System.out.println("first=" + once.count());
    try {
      once.count();
      System.out.println("second=none");
    } catch (IllegalStateException e) {
      System.out.println("second=" + e.getClass().getSimpleName());
    }
  }
}
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

To record: `"digest": "sha256:80d54f91c7915d958a4f1c86e90cc2f3f3b7f5d9322012d1153d9047e0339099"`, `"verified": "sha256:1aafff8ce370c21522f9bedb4d4f4b0009e26247f551996cadd949ac5dd98eef"`

**Comments:**

&nbsp;

## 89. t06-string-length-method-reference

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
applied=4
boxed=3
```

That program, in one file:

`Main.java`:

```java
import java.util.function.Function;
import java.util.function.ToIntFunction;

public class Main {

  public static void main(String[] args) {
    // The assignment compiling is the claim: an unbound reference to an instance method takes the
    // receiver as its argument, so it fits a function from String to int.
    ToIntFunction<String> length = String::length;
    System.out.println("applied=" + length.applyAsInt("abcd"));

    // The boxing form fits too, which is why the question asks for the primitive one.
    Function<String, Integer> boxed = String::length;
    System.out.println("boxed=" + boxed.apply("abc"));
  }
}
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

To record: `"digest": "sha256:f37197deee9a5b4d33b7e31daae1b23fbcca2f567c2d568a722e28d001878169"`, `"verified": "sha256:caa32181978516c56c61c0c4532df9864957e8394293a6fc04d39c32dea0d0f8"`

**Comments:**

&nbsp;

## 90. t06-to-unmodifiable-list-null

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
add=UnsupportedOperationException
withNullElement=NullPointerException
```

That program, in one file:

`Main.java`:

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Main {

  public static void main(String[] args) {
    List<String> collected = List.of("a").stream().collect(Collectors.toUnmodifiableList());
    System.out.println("add=" + thrownBy(() -> collected.add("b")));
    System.out.println(
        "withNullElement="
            + thrownBy(() -> Arrays.asList("a", null).stream().collect(Collectors.toUnmodifiableList())));
  }

  static String thrownBy(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (RuntimeException e) {
      return e.getClass().getSimpleName();
    }
  }
}
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

To record: `"digest": "sha256:c91c23d786aa7a72f121ae51ced32639fbcecd5e76d108216ccc8578dfbc6940"`, `"verified": "sha256:defc11ffa0d793417c6cfb30e889baaa84e03c2208ef85397506ffdac57ca5d9"`

**Comments:**

&nbsp;

## 91. t07-automatic-module-jar

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
hasModuleInfo=false
found=true
automatic=true
name=com.example.widgets
version=1.4
packages=[com.example.widgets]
requires=[mandated java.base]
```

That program, in one file:

`Main.java`:

```java
import java.lang.module.ModuleDescriptor;
import java.lang.module.ModuleFinder;
import java.lang.module.ModuleReference;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;

public class Main {

  public static void main(String[] args) throws Exception {
    // An ordinary JAR: no module-info.class anywhere in it.
    Path dir = Files.createTempDirectory("mods");
    Path jar = dir.resolve("com.example.widgets-1.4.jar");
    try (JarOutputStream out = new JarOutputStream(Files.newOutputStream(jar))) {
      out.putNextEntry(new JarEntry("com/example/widgets/Widget.class"));
      out.write(new byte[] {1, 2, 3});
      out.closeEntry();
    }
    System.out.println("hasModuleInfo=" + Files.exists(dir.resolve("module-info.class")));

    // Placed where the module system looks for modules, it becomes a named module all the same.
    ModuleFinder finder = ModuleFinder.of(dir);
    Optional<ModuleReference> found = finder.find("com.example.widgets");
    System.out.println("found=" + found.isPresent());
    ModuleDescriptor descriptor = found.orElseThrow().descriptor();
    System.out.println("automatic=" + descriptor.isAutomatic());
    // The name comes from the file name, with a trailing version dropped and read separately.
    System.out.println("name=" + descriptor.name());
    System.out.println("version=" + descriptor.version().map(Object::toString).orElse("none"));
    // An automatic module exports every package it contains and requires nothing but java.base.
    System.out.println("packages=" + descriptor.packages());
    System.out.println("requires=" + descriptor.requires());

    Files.delete(jar);
    Files.delete(dir);
  }
}
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

To record: `"digest": "sha256:5a2b2389fc23b58486d0185fe3a0ac8f7c1ffcdd52c34c56051364a37bbc7a05"`, `"verified": "sha256:5a84fc70b7f7fff49c4dcfeb32fd6b3433d2b2906de962db4eb6ff648b05285b"`

**Comments:**

&nbsp;

## 92. t07-export-does-not-make-type-public

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A named module exports package `p`, but class `p.Helper` has package-private access. Can code in another module access `Helper` merely because `p` is exported?

- **A** Yes; export makes every type in the package public.
- **B** No; Helper remains package-private.
- **C** Yes, but only through reflection.
- **D** No, because exported packages can never be accessed by another module.

### Answer key and reasons

- **A: incorrect.** Module export does not rewrite the class's access modifier.
- **B: correct.** Normal Java accessibility rules still apply inside an exported package.
- **C: incorrect.** An export by itself does not grant deep reflective access to non-public members.
- **D: incorrect.** Export exists precisely to expose accessible package API to reading modules.

### Explanation

No. Exporting a package makes its public and otherwise-accessible API available subject to module readability; it does not change Java access modifiers on individual declarations.

### Why this difficulty

Separates module-level package export from Java language access modifiers on individual types.

### References

- [JLS 7.7.2 Exported and Opened Packages](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.7.2)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: not.def.public.cant.access
```

That program, across 5 files:

`modules/app/a/Main.java`:

```java
package a;

import p.Api;

public class Main {

  public static void main(String[] args) {
    // The public type of the exported package is reachable.
    System.out.println("api=" + Api.value());
    // The package-private one is not, and the module being exported changes nothing about it.
    System.out.println("helper=" + p.Helper.value());
  }
}
```

`modules/app/module-info.java`:

```java
module app {
  requires lib;
}
```

`modules/lib/module-info.java`:

```java
// p is exported in full. Exporting controls which packages other modules may read; it does not
// change the access modifiers of the types inside.
module lib {
  exports p;
}
```

`modules/lib/p/Api.java`:

```java
package p;

/** Public, in the same exported package, and reachable from other modules. */
public final class Api {

  private Api() {}

  public static String value() {
    // Inside the package the package-private type is perfectly usable.
    return Helper.value();
  }
}
```

`modules/lib/p/Helper.java`:

```java
package p;

/** Package-private: no modifier. Exporting p does not widen this. */
class Helper {

  static String value() {
    return "helper";
  }
}
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

To record: `"digest": "sha256:50bcfb63b67b99ba3b18bba6c56b000d5fdcd7451a82a76cad5ce5a688a3fec2"`, `"verified": "sha256:a6a96d4dd098bc83278a738421356322f8fa69f3043dc81ff81abe57afb3bed0"`

**Comments:**

&nbsp;

## 93. t07-exports-and-opens

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
exportedPublicCall=exportedPublic
lExported=true
lOpen=false
qExported=true
qOpen=true
openedPrivateField=openedPrivate
openedPrivateMethod=openedPrivateMethod
exportedPrivateReflection=InaccessibleObjectException
```

That program, across 5 files:

`modules/app/a/Main.java`:

```java
package a;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import l.Api;

public class Main {

  public static void main(String[] args) throws Exception {
    Module lib = Api.class.getModule();
    Module app = Main.class.getModule();

    // exports: the public type compiled into this module and runs. That this file compiles at
    // all is the compile-time half; the call is the run-time half.
    System.out.println("exportedPublicCall=" + new Api().value());
    System.out.println("lExported=" + lib.isExported("l", app));
    System.out.println("lOpen=" + lib.isOpen("l", app));

    // opens: reflection reaches a private field and a private method of the opened package. Note
    // that isExported reports true for q as well: opening a package implies exporting it, which
    // Module.isExported documents, so the reverse of lExported/lOpen above is not symmetric.
    Class<?> hidden = Class.forName("q.Hidden");
    System.out.println("qExported=" + lib.isExported("q", app));
    System.out.println("qOpen=" + lib.isOpen("q", app));
    Field secret = hidden.getDeclaredField("secret");
    secret.setAccessible(true);
    Object instance = hidden.getDeclaredConstructor().newInstance();
    System.out.println("openedPrivateField=" + secret.get(instance));
    Method whisper = hidden.getDeclaredMethod("whisper");
    whisper.setAccessible(true);
    System.out.println("openedPrivateMethod=" + whisper.invoke(instance));

    // Exporting is not opening: the same reflection on the exported package is refused.
    Field exportedPrivate = Api.class.getDeclaredField("hidden");
    try {
      exportedPrivate.setAccessible(true);
      System.out.println("exportedPrivateReflection=allowed");
    } catch (RuntimeException e) {
      System.out.println("exportedPrivateReflection=" + e.getClass().getSimpleName());
    }
  }
}
```

`modules/app/module-info.java`:

```java
module app {
  requires lib;
}
```

`modules/lib/l/Api.java`:

```java
package l;

public final class Api {

  private final String hidden = "exportedPrivate";

  public String value() {
    return "exportedPublic";
  }
}
```

`modules/lib/module-info.java`:

```java
// Two directives for two different things: l is exported, so its public types are part of the
// API at compile time and at run time. q is opened, so reflection may reach every type and
// member in it, private ones included, but only at run time.
module lib {
  exports l;
  opens q;
}
```

`modules/lib/q/Hidden.java`:

```java
package q;

public final class Hidden {

  private final String secret = "openedPrivate";

  private String whisper() {
    return "openedPrivateMethod";
  }
}
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

To record: `"digest": "sha256:7b83957989115dccf5b2081c11c63c36aa4f8871fa46d5fccf1db359adf23f38"`, `"verified": "sha256:0f4d7c947becc32f648a881a59dd48347d812d240fff919d908671308c6d0a8c"`

**Comments:**

&nbsp;

## 94. t07-implicit-java-base

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
module=app
declaredRequires=0
requires=[java.base[MANDATED]]
readsJavaBase=true
javaBaseName=java.base
```

That program, across 2 files:

`modules/app/a/Main.java`:

```java
package a;

import java.lang.module.ModuleDescriptor;
import java.util.TreeSet;

public class Main {

  public static void main(String[] args) {
    // java.base is depended upon implicitly, which is why this module can use String and
    // System without declaring anything. The descriptor the compiler produced says so.
    ModuleDescriptor descriptor = Main.class.getModule().getDescriptor();
    System.out.println("module=" + descriptor.name());
    System.out.println("declaredRequires=0");

    // Names and modifiers only, not the recorded version of java.base, which depends on the
    // release the build compiles against rather than on anything the question claims.
    TreeSet<String> names = new TreeSet<>();
    descriptor.requires().forEach(r -> names.add(r.name() + r.modifiers()));
    System.out.println("requires=" + names);
    System.out.println("readsJavaBase=" + Main.class.getModule().canRead(Object.class.getModule()));
    System.out.println("javaBaseName=" + Object.class.getModule().getName());
  }
}
```

`modules/app/module-info.java`:

```java
// No requires directive is written at all.
module app {}
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

To record: `"digest": "sha256:302368d054243688dbc08c428c3dc200a926535e51db483e40c9d6fd91e276cf"`, `"verified": "sha256:b47db13ac12eca1af4818d70924422538ba95a7825ac3a80cdbbdc6d8e5cafb8"`

**Comments:**

&nbsp;

## 95. t07-import-wildcard-no-subpackages

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does `import java.util.*;` make available by simple name?

- **A** Accessible top-level types directly in java.util, but not types in java.util.concurrent.
- **B** Every type in java.util and all of its subpackages.
- **C** Only static members declared by classes in java.util.
- **D** Nothing; wildcard imports are not valid Java.

### Answer key and reasons

- **A: correct.** On-demand package imports are not recursive.
- **B: incorrect.** Subpackages are separate packages and are not imported recursively.
- **C: incorrect.** That would involve static imports, not a type-import-on-demand declaration.
- **D: incorrect.** Type-import-on-demand declarations using `*` are valid.

### Explanation

A type-import-on-demand declaration imports accessible top-level types declared directly in the named package. It does not recursively import types from subpackages such as `java.util.concurrent`.

### Why this difficulty

Tests the scope of on-demand type imports and the fact that packages are not recursively imported.

### References

- [JLS 7.5.2 Type-Import-on-Demand Declarations](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.2)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: cant.resolve.location
```

That program, in one file:

`Main.java`:

```java
import java.util.*;

public class Main {

  public static void main(String[] args) {
    // java.util.* brings in the accessible top-level types declared directly in java.util.
    List<String> list = new ArrayList<>();
    Map<String, Integer> map = new HashMap<>();
    list.add("ok");
    map.put("ok", 1);
    System.out.println(list + " " + map);

    // It does not reach java.util.concurrent, which is a different package rather than part of
    // java.util, so this simple name cannot be resolved.
    ConcurrentHashMap<String, Integer> concurrent = new ConcurrentHashMap<>();
    System.out.println(concurrent);
  }
}
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

To record: `"digest": "sha256:43060253989d0fe57642ffc88a5c42a62d5e7fb3e697178efb05a0c997cab6fa"`, `"verified": "sha256:4995b9e3e19ed548c6c6eddb276db6916442bafa2238a6e4f7e214864343441f"`

**Comments:**

&nbsp;

## 96. t07-java-module-launch

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
initialModule=com.example.app
mainClass=p.Main
modulePathWasGiven=true
named=true
module=com.example.app
class=p.Main
```

That program, across 2 files:

`modules/com.example.app/module-info.java`:

```java
module com.example.app {}
```

`modules/com.example.app/p/Main.java`:

```java
package p;

public class Main {

  public static void main(String[] args) {
    // This question is proved by how the build runs it. The harness launches a modular question
    // with exactly the form the question asks about -- java --module-path <dir> --module
    // <module>/<main class> -- and the launcher records what it was given in these properties.
    System.out.println("initialModule=" + System.getProperty("jdk.module.main"));
    System.out.println("mainClass=" + System.getProperty("jdk.module.main.class"));
    System.out.println("modulePathWasGiven=" + (System.getProperty("jdk.module.path") != null));
    System.out.println("named=" + Main.class.getModule().isNamed());
    System.out.println("module=" + Main.class.getModule().getName());
    System.out.println("class=" + Main.class.getName());
  }
}
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

To record: `"digest": "sha256:49013ae0d1abeadfc8b477eba0d80d6488f765c2be186e9f8cd4ca4602a5c4e2"`, `"verified": "sha256:89b9e6b7bd210be67a88f45bad724d8c67fcd44253131820512698704d2fc2b9"`

**Comments:**

&nbsp;

## 97. t07-module-service-directives

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
providerResolved=true
loaded=[LOUD from provider]
declaredUses=[s.Greeter]
providerProvides=[s.Greeter->[p.Loud]]
```

That program, across 6 files:

`modules/api/module-info.java`:

```java
module api {
  exports s;
}
```

`modules/api/s/Greeter.java`:

```java
package s;

/** The service type: an interface both the consumer and the provider name. */
public interface Greeter {

  String greet();
}
```

`modules/app/a/Main.java`:

```java
package a;

import java.util.ServiceLoader;
import java.util.TreeSet;
import s.Greeter;

public class Main {

  public static void main(String[] args) {
    // The provider module is not required by anything. It is in the graph because app declares
    // uses and the resolver binds providers of that service, which is what the pair is for.
    System.out.println("providerResolved=" + ModuleLayer.boot().findModule("provider").isPresent());

    TreeSet<String> greetings = new TreeSet<>();
    for (Greeter greeter : ServiceLoader.load(Greeter.class)) {
      greetings.add(greeter.greet() + " from " + greeter.getClass().getModule().getName());
    }
    System.out.println("loaded=" + greetings);

    System.out.println("declaredUses=" + Main.class.getModule().getDescriptor().uses());
    System.out.println(
        "providerProvides="
            + ModuleLayer.boot()
                .findModule("provider")
                .orElseThrow()
                .getDescriptor()
                .provides()
                .stream()
                .map(p -> p.service() + "->" + p.providers())
                .toList());
  }
}
```

`modules/app/module-info.java`:

```java
// A consumer declares the service type it loads. Without uses, ServiceLoader finds nothing from
// this module, and the provider module is not even pulled into the graph.
module app {
  requires api;
  uses s.Greeter;
}
```

`modules/provider/module-info.java`:

```java
// A provider declares what it implements and with which class. The directive names the service
// interface first and the implementation second, and the implementation must be in this module.
module provider {
  requires api;
  provides s.Greeter with p.Loud;
}
```

`modules/provider/p/Loud.java`:

```java
package p;

import s.Greeter;

/** Needs a public no-argument constructor for ServiceLoader to instantiate it. */
public final class Loud implements Greeter {

  public Loud() {}

  @Override
  public String greet() {
    return "LOUD";
  }
}
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

To record: `"digest": "sha256:7f5761fbe4cd0b6cf743e04adcb2c4f7049c728a375f09568660c3b724463518"`, `"verified": "sha256:02ba7787ad244576db685cfd89ffe6a07695123b62acb4205c55cd05d257d2ff"`

**Comments:**

&nbsp;

## 98. t07-object-module-name

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> public class Main {
>   public static void main(String[] args) {
>     System.out.println(Object.class.getModule().getName());
>   }
> }
> ```

- **A** java.base
- **B** java.lang
- **C** null
- **D** unnamed

### Answer key and reasons

- **A: correct.** Object belongs to the fundamental java.base module.
- **B: incorrect.** java.lang is Object's package, not its module name.
- **C: incorrect.** The module is named, so getName returns its name rather than null.
- **D: incorrect.** Platform classes such as Object are in named modules.

### Explanation

`Object` is defined in the `java.base` module. Its `Class` object therefore reports a named module whose name is `java.base`.

### Why this difficulty

Connects a core platform class with the named module that contains it.

### References

- [Module.getName() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Module.html#getName())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
java.base
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

To record: `"digest": "sha256:f2314933ad3a586df114dfd06231ac646b061a82ddc11f5db92da391129d46ac"`, `"verified": "sha256:15ddf5da1c7c9d5569e10556cc6458d01ca6143fea0a2289e698be96195a473e"`

**Comments:**

&nbsp;

## 99. t07-open-module-semantics

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
isOpen=true
opensDirectives=0
exportsDirectives=[l]
lOpenToApp=true
hOpenToApp=true
ordinaryCallIntoExported=exported
privateFieldOfUnexported=deeplyReflected
hInExports=false
```

That program, across 5 files:

`modules/app/a/Main.java`:

```java
package a;

import java.lang.module.ModuleDescriptor;
import java.lang.reflect.Field;
import java.util.TreeSet;

public class Main {

  public static void main(String[] args) throws Exception {
    Module lib = l.Api.class.getModule();
    Module app = Main.class.getModule();
    ModuleDescriptor descriptor = lib.getDescriptor();

    System.out.println("isOpen=" + descriptor.isOpen());
    // An open module declares no opens directives: being open covers every package it has.
    System.out.println("opensDirectives=" + descriptor.opens().size());
    TreeSet<String> exported = new TreeSet<>();
    descriptor.exports().forEach(e -> exported.add(e.source()));
    System.out.println("exportsDirectives=" + exported);

    System.out.println("lOpenToApp=" + lib.isOpen("l", app));
    System.out.println("hOpenToApp=" + lib.isOpen("h", app));
    System.out.println("ordinaryCallIntoExported=" + l.Api.value());

    // Deep reflection into the package that is *not* exported, which is what open grants.
    Class<?> internal = Class.forName("h.Internal");
    Field secret = internal.getDeclaredField("secret");
    secret.setAccessible(true);
    System.out.println("privateFieldOfUnexported=" + secret.get(internal.getDeclaredConstructor().newInstance()));

    // The compile-time half of this -- that a non-exported package still cannot be named in
    // source -- is proved by t07-export-does-not-make-type-public, which fails to compile for
    // exactly that reason. A program that runs cannot also be a program that does not compile.
    System.out.println("hInExports=" + exported.contains("h"));
  }
}
```

`modules/app/module-info.java`:

```java
module app {
  requires lib;
}
```

`modules/lib/h/Internal.java`:

```java
package h;

/** In a package the module never exports, so no other module can name this type in source. */
public final class Internal {

  private final String secret = "deeplyReflected";

  public Internal() {}
}
```

`modules/lib/l/Api.java`:

```java
package l;

public final class Api {

  private Api() {}

  public static String value() {
    return "exported";
  }
}
```

`modules/lib/module-info.java`:

```java
// An open module. Every package is open for deep reflection, including h, which is not exported.
// exports still names exactly one package, and that is what ordinary compile-time access goes by.
open module lib {
  exports l;
}
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

To record: `"digest": "sha256:6579987de80fa73f74e7d20f23bd56365d4b6057f436a33ce5a88b0b9ff4f9b7"`, `"verified": "sha256:37563b482716882d7df61eb7411262ab3dd09c36c4228e9d2d0df6b251aa72d7"`

**Comments:**

&nbsp;

## 100. t07-qualified-exports

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
toApp=true
toOther=true
toJavaBase=false
lUnqualified=false
qUnqualified=true
readFromOther=internal
readHere=internal
```

That program, across 7 files:

`modules/app/a/Main.java`:

```java
package a;

public class Main {

  public static void main(String[] args) {
    Module lib = l.Internal.class.getModule();
    Module app = Main.class.getModule();
    Module other = x.Named.class.getModule();
    Module javaBase = Object.class.getModule();

    // app and other are the two modules the qualified export names, so both may read l; and
    // both really do, which is what the compiled call below shows.
    System.out.println("toApp=" + lib.isExported("l", app));
    System.out.println("toOther=" + lib.isExported("l", other));
    System.out.println("toJavaBase=" + lib.isExported("l", javaBase));
    // Unqualified means exported to every module, which the qualified one is not.
    System.out.println("lUnqualified=" + lib.isExported("l"));
    System.out.println("qUnqualified=" + lib.isExported("q"));
    System.out.println("readFromOther=" + x.Named.read());
    System.out.println("readHere=" + l.Internal.secret());
  }
}
```

`modules/app/module-info.java`:

```java
module app {
  requires lib;
  requires other;
}
```

`modules/lib/l/Internal.java`:

```java
package l;

/** Public, in a package exported only to the named modules. */
public final class Internal {

  private Internal() {}

  public static String secret() {
    return "internal";
  }
}
```

`modules/lib/module-info.java`:

```java
// A qualified export: the package is available to the two named modules and to nobody else.
module lib {
  exports l to app, other;
  exports q;
}
```

`modules/lib/q/Open.java`:

```java
package q;

/** Public, in a package exported to everyone. */
public final class Open {

  private Open() {}

  public static String value() {
    return "open";
  }
}
```

`modules/other/module-info.java`:

```java
// Named in the qualified export, so it may read l.
module other {
  requires lib;
  exports x;
}
```

`modules/other/x/Named.java`:

```java
package x;

import l.Internal;

public final class Named {

  private Named() {}

  public static String read() {
    return Internal.secret();
  }
}
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

To record: `"digest": "sha256:61c6926e97278a450283d77df8269d74d9e6580ea7d6055efa728a5b69aabe92"`, `"verified": "sha256:cb2fec7270c07e63bcab6f4b4cb4c3a2f73d005558f81f8c73b4c95bebd4f00e"`

**Comments:**

&nbsp;

## 101. t07-requires-static

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
modifiers=[STATIC]
isStatic=true
appResolved=true
optionalResolved=false
classLoaded=false
```

That program, across 4 files:

`modules/app/a/Main.java`:

```java
package a;

import java.lang.module.ModuleDescriptor;

public class Main {

  public static void main(String[] args) {
    ModuleDescriptor descriptor = Main.class.getModule().getDescriptor();
    ModuleDescriptor.Requires optional =
        descriptor.requires().stream()
            .filter(r -> r.name().equals("optional"))
            .findFirst()
            .orElseThrow();
    // Compile time: the dependency is declared, and the STATIC modifier is what makes it
    // optional later. The whole graph compiled, which is the compile-time half of the claim.
    System.out.println("modifiers=" + optional.modifiers());
    System.out.println(
        "isStatic=" + optional.modifiers().contains(ModuleDescriptor.Requires.Modifier.STATIC));

    // Run time: optional sits on the module path next to app and still was not resolved, because
    // a static dependency on its own does not pull a module into the graph.
    System.out.println("appResolved=" + ModuleLayer.boot().findModule("app").isPresent());
    System.out.println("optionalResolved=" + ModuleLayer.boot().findModule("optional").isPresent());
    try {
      Class.forName("o.Flag");
      System.out.println("classLoaded=true");
    } catch (ClassNotFoundException e) {
      System.out.println("classLoaded=false");
    }
  }
}
```

`modules/app/module-info.java`:

```java
// requires static: app compiles against optional, but at run time the module system does not
// resolve it unless something else pulls it in.
module app {
  requires static optional;
}
```

`modules/optional/module-info.java`:

```java
module optional {
  exports o;
}
```

`modules/optional/o/Flag.java`:

```java
package o;

public final class Flag {

  private Flag() {}

  public static String name() {
    return "optional";
  }
}
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

To record: `"digest": "sha256:b14de1ffacaa6bd8ab128eb13c6a77b79fff103d9da421a9f142fc5bb8af828b"`, `"verified": "sha256:b7021ceb205085071e10e567e045853ae1c06478b100a69c657120a42b2d8629"`

**Comments:**

&nbsp;

## 102. t07-requires-transitive

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

## 103. t07-static-import-member

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import static java.lang.Math.max;
>
> public class Main {
>   public static void main(String[] args) {
>     System.out.println(max(4, 5));
>   }
> }
> ```

- **A** 4
- **B** 5
- **C** Math.max
- **D** It does not compile because static methods cannot be imported.

### Answer key and reasons

- **A: incorrect.** Math.max returns the larger argument.
- **B: correct.** The imported static method returns the larger value.
- **C: incorrect.** The method is invoked; its name is not printed.
- **D: incorrect.** Single-static-import declarations are part of Java's import syntax.

### Explanation

The single-static-import declaration imports `Math.max`, so the method can be called by simple name. `max(4, 5)` returns 5.

### Why this difficulty

Checks static import syntax and how it lets a static member be referenced by simple name.

### References

- [JLS 7.5.3 Single-Static-Import Declarations](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.3)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
5
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

To record: `"digest": "sha256:2b5edd88a0ea0ace6a570e0f0b3b200abb61bdedba4943bdc4493ebff7ff00cb"`, `"verified": "sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"`

**Comments:**

&nbsp;

## 104. t07-unnamed-module-isnamed

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

## 105. t07-unnamed-package-import

**Topic:** Packaging, deploying and the Java Platform Module System (exam objective: "Packaging and deploying Java code and using the Java Platform Module System")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> Can a type declared in a named package import a top-level type from the unnamed package?

- **A** Yes, using import TypeName;
- **B** Yes, using import unnamed.TypeName;
- **C** No.
- **D** Only if the type is public and final.

### Answer key and reasons

- **A: incorrect.** Import declarations name types through packages or canonical names; unnamed-package types cannot be imported into named packages.
- **B: incorrect.** There is no package named `unnamed` representing the unnamed package.
- **C: correct.** Named-package code cannot import a type from the unnamed package.
- **D: incorrect.** Access modifiers do not remove the unnamed-package import restriction.

### Explanation

No. A type in the unnamed package cannot be imported by code in a named package. Unnamed-package use is therefore unsuitable for code intended to participate in ordinary packaged applications.

### Why this difficulty

Tests the special visibility limitation of types declared in the unnamed package.

### References

- [JLS 7.4.2 Unnamed Packages](https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.4.2)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
COMPILE_ERROR: cant.resolve.location
```

That program, across 2 files:

`Helper.java`:

```java
/** A top-level type in the unnamed package: the file declares no package. */
public class Helper {

  public static String name() {
    return "helper";
  }
}
```

`Main.java`:

```java
package p;

// There is no way to write the import either: `import Helper;` is not even grammatical, because
// an import needs a qualified name and the unnamed package has no name to qualify with. So the
// reference below is the honest test, and it fails to resolve: a type in a named package cannot
// reach a top-level type of the unnamed package at all.
public class Main {

  public static void main(String[] args) {
    System.out.println(Helper.name());
  }
}
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

To record: `"digest": "sha256:0727e44c54bbedc2d6825377f9e8089b2b944c749a243cccb7dec735e3280fb1"`, `"verified": "sha256:4995b9e3e19ed548c6c6eddb276db6916442bafa2238a6e4f7e214864343441f"`

**Comments:**

&nbsp;

## 106. t08-atomic-compare-and-set

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.concurrent.atomic.AtomicInteger;
>
> public class Main {
>   public static void main(String[] args) {
>     var value = new AtomicInteger(10);
>     boolean changed = value.compareAndSet(10, 20);
>     System.out.println(changed + " " + value.get());
>   }
> }
> ```

- **A** true 20
- **B** false 10
- **C** true 10
- **D** false 20

### Answer key and reasons

- **A: correct.** The expected value matches, so the update succeeds and the new value is 20.
- **B: incorrect.** That would happen if the expected value did not match.
- **C: incorrect.** A successful compareAndSet also updates the stored value.
- **D: incorrect.** A false result means the update did not occur.

### Explanation

The AtomicInteger starts at 10. `compareAndSet(10, 20)` observes the expected value, updates it to 20, and returns true.

### Why this difficulty

Tests both the success condition and side effect of an atomic compare-and-set operation.

### References

- [AtomicInteger.compareAndSet(int, int) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html#compareAndSet(int,int))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
true 20
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

To record: `"digest": "sha256:17c17ce269af9930b241c1e49b43b7fb7bb4bd4a09ac2928284c564c1045516e"`, `"verified": "sha256:e6740d09a48abfcf5cb7342913a1e15938b5b57cac05bd201367c4ea63a84dea"`

**Comments:**

&nbsp;

## 107. t08-atomicinteger-update-and-get

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

## 108. t08-completablefuture-join-vs-get

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
join=CompletionException
get=ExecutionException
bothWrapTheSameCause=ok
```

That program, in one file:

`Main.java`:

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Main {

  public static void main(String[] args) throws Exception {
    CompletableFuture<String> failed = CompletableFuture.failedFuture(new IllegalStateException("boom"));

    try {
      failed.join();
      System.out.println("join=none");
    } catch (RuntimeException e) {
      // Unchecked, so join needs no catch at all to compile.
      System.out.println("join=" + e.getClass().getSimpleName());
    }

    try {
      failed.get();
      System.out.println("get=none");
    } catch (ExecutionException e) {
      // Checked, which is why this one has to be caught or declared.
      System.out.println("get=" + e.getClass().getSimpleName());
    }

    System.out.println("bothWrapTheSameCause=" + CompletableFuture.completedFuture("ok").join());
  }
}
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

To record: `"digest": "sha256:14321ec79b2165f614edf4f2d5ddc7317f2864917e3401e01dec22a22d28eec5"`, `"verified": "sha256:21123a300fcabd121ce8203fdc72ccb7b295b4fe526f7ee7d5280c92b1cb3d67"`

**Comments:**

&nbsp;

## 109. t08-computeifabsent-null-result

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> For a `ConcurrentHashMap<String, Integer> map` with no mapping for `x`, what is the result if `map.computeIfAbsent("x", k -> null)` is called?

- **A** The key x is mapped to null.
- **B** No mapping is added and the method returns null.
- **C** The key is mapped to 0 automatically.
- **D** The map is cleared.

### Answer key and reasons

- **A: incorrect.** ConcurrentHashMap does not permit null values, and a null computed result means no mapping is recorded.
- **B: correct.** A null mapping-function result leaves the key absent.
- **C: incorrect.** No default numeric value is synthesized.
- **D: incorrect.** The operation concerns only the requested key.

### Explanation

If the mapping function returns null, no mapping is established for the key and the method returns null.

### Why this difficulty

Tests ConcurrentHashMap.computeIfAbsent semantics when the mapping function declines to create a value by returning null.

### References

- [ConcurrentHashMap.computeIfAbsent(K, Function) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html#computeIfAbsent(K,java.util.function.Function))

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
returned=null
containsKey=false
size=0
```

That program, in one file:

`Main.java`:

```java
import java.util.concurrent.ConcurrentHashMap;

public class Main {

  public static void main(String[] args) {
    ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
    Integer returned = map.computeIfAbsent("x", key -> null);

    System.out.println("returned=" + returned);
    // No mapping is recorded, which is what lets null from get() mean absence.
    System.out.println("containsKey=" + map.containsKey("x"));
    System.out.println("size=" + map.size());
  }
}
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

To record: `"digest": "sha256:4ec4df65caf132089ec1c6672a5803d2b3dcd57f36cc94d43940eee60f68750f"`, `"verified": "sha256:add2dc8e9babb3791c67936bbfe5048020ba1ce96cefef971defb3434283a662"`

**Comments:**

&nbsp;

## 110. t08-concurrenthashmap-null

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
nullKey=NullPointerException
nullValue=NullPointerException
```

That program, in one file:

`Main.java`:

```java
import java.util.concurrent.ConcurrentHashMap;

public class Main {

  public static void main(String[] args) {
    ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
    System.out.println("nullKey=" + thrownBy(() -> map.put(null, "v")));
    System.out.println("nullValue=" + thrownBy(() -> map.put("k", null)));
  }

  static String thrownBy(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (RuntimeException e) {
      return e.getClass().getSimpleName();
    }
  }
}
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

To record: `"digest": "sha256:b99d271cbeebe7c0b5f423208757f0a94ffa2ed5c743b121de4993d5ad04b15d"`, `"verified": "sha256:24d06a1079ae59d80990aee990dd97f9d140a2e4ada58cd38d27c6482dfbb678"`

**Comments:**

&nbsp;

## 111. t08-countdownlatch-count

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.concurrent.CountDownLatch;
>
> public class Main {
>   public static void main(String[] args) {
>     var latch = new CountDownLatch(2);
>     latch.countDown();
>     latch.countDown();
>     System.out.println(latch.getCount());
>   }
> }
> ```

- **A** 0
- **B** 1
- **C** 2
- **D** -1

### Answer key and reasons

- **A: correct.** Two countdowns reduce the initial count of 2 to zero.
- **B: incorrect.** That would be the value after only one countDown call.
- **C: incorrect.** The count changes when countDown is invoked.
- **D: incorrect.** A CountDownLatch count does not become negative.

### Explanation

The latch starts at 2. Each `countDown()` decrements the count until it reaches zero. After two calls, `getCount()` returns 0.

### Why this difficulty

Checks CountDownLatch's one-way count semantics without introducing nondeterministic thread scheduling.

### References

- [CountDownLatch (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CountDownLatch.html)

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
0
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

To record: `"digest": "sha256:67e34440e89aaf31b59c484b5398a1595ad7febd0a1db59916e5938583dee299"`, `"verified": "sha256:5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9"`

**Comments:**

&nbsp;

## 112. t08-executor-close

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

## 113. t08-reentrantlock-finally

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> After successfully calling `lock.lock()`, where should `lock.unlock()` normally be placed so the lock is released even when protected code throws?

- **A** In a finally block.
- **B** Only after the try block on the normal path.
- **C** Inside a catch block only.
- **D** Nowhere; ReentrantLock releases itself automatically at method exit.

### Answer key and reasons

- **A: correct.** finally executes when control leaves the protected region, including exceptional exits.
- **B: incorrect.** An exception could skip that unlock and leave the lock held.
- **C: incorrect.** That would miss normal completion and possibly other abrupt paths.
- **D: incorrect.** Explicit Lock implementations require explicit unlock calls.

### Explanation

The recommended structure acquires the lock before a try block and invokes `unlock()` in the corresponding finally block. This ensures release on both normal and abrupt completion.

### Why this difficulty

Checks the standard lock/unlock structure needed because Lock does not have synchronized's automatic monitor release.

### References

- [Lock (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/Lock.html)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
threw=boom
lockedAfterFinally=false
holdCountAfterFinally=0
holdCountAfterTwoLocks=2
holdCountAfterOneUnlock=1
stillLocked=true
holdCountAtEnd=0
catchVariantAlsoReleases=true
unlockWithoutLock=IllegalMonitorStateException
```

That program, in one file:

`Main.java`:

```java
import java.util.concurrent.locks.ReentrantLock;

public class Main {

  static final ReentrantLock LOCK = new ReentrantLock();

  static void protectedWork() {
    LOCK.lock();
    try {
      throw new IllegalStateException("boom");
    } finally {
      // finally runs whether the body returns or throws, which is the only placement that
      // releases the lock on both paths.
      LOCK.unlock();
    }
  }

  static void withoutFinally() {
    LOCK.lock();
    try {
      throw new IllegalStateException("boom");
    } catch (IllegalStateException e) {
      // The unlock here is skipped by the throw above in the common shape of this mistake:
      // placing it after the protected code, inside the try, instead of in a finally.
      LOCK.unlock();
      throw e;
    }
  }

  public static void main(String[] args) {
    try {
      protectedWork();
    } catch (IllegalStateException e) {
      System.out.println("threw=" + e.getMessage());
    }
    System.out.println("lockedAfterFinally=" + LOCK.isLocked());
    System.out.println("holdCountAfterFinally=" + LOCK.getHoldCount());

    // Reentrant: the same thread may lock repeatedly, and owes one unlock for each lock, which
    // is why the hold count and not a boolean is what finally has to bring back to zero.
    LOCK.lock();
    LOCK.lock();
    System.out.println("holdCountAfterTwoLocks=" + LOCK.getHoldCount());
    LOCK.unlock();
    System.out.println("holdCountAfterOneUnlock=" + LOCK.getHoldCount());
    System.out.println("stillLocked=" + LOCK.isLocked());
    LOCK.unlock();
    System.out.println("holdCountAtEnd=" + LOCK.getHoldCount());

    try {
      withoutFinally();
    } catch (IllegalStateException e) {
      System.out.println("catchVariantAlsoReleases=" + !LOCK.isLocked());
    }
    // Unlocking a lock this thread does not hold is itself an error, so an unbalanced finally
    // cannot be patched by unlocking twice.
    try {
      LOCK.unlock();
      System.out.println("unlockWithoutLock=allowed");
    } catch (IllegalMonitorStateException e) {
      System.out.println("unlockWithoutLock=" + e.getClass().getSimpleName());
    }
  }
}
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

To record: `"digest": "sha256:b9324efa5ffec39661e998a15d4eedcb57ba539a569f18e95f125b302e7429e5"`, `"verified": "sha256:9b8a0b697e5b54cbe9f4885e4c58cc9a2c128e4e32959150c59a7f1c4ad5aa70"`

**Comments:**

&nbsp;

## 114. t08-start-virtual-thread

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
returnsAThread=true
isVirtual=true
ran=true
ranOnCallingThread=false
```

That program, in one file:

`Main.java`:

```java
import java.util.concurrent.atomic.AtomicBoolean;

public class Main {

  public static void main(String[] args) throws InterruptedException {
    AtomicBoolean ran = new AtomicBoolean(false);
    AtomicBoolean onCaller = new AtomicBoolean(false);
    Thread caller = Thread.currentThread();

    Thread started = Thread.startVirtualThread(
        () -> {
          ran.set(true);
          onCaller.set(Thread.currentThread() == caller);
        });

    System.out.println("returnsAThread=" + (started instanceof Thread));
    System.out.println("isVirtual=" + started.isVirtual());
    started.join();
    System.out.println("ran=" + ran.get());
    // Already started, and not run on the caller.
    System.out.println("ranOnCallingThread=" + onCaller.get());
  }
}
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

To record: `"digest": "sha256:1b132edc5296249a8b8757c486af2aee1fcc34c6da91c2d9b77ea394d5c79d4e"`, `"verified": "sha256:e251b62af39c798917a2f2404b2b180ba9dcab8b31c11c057bc4d2cbadc6e7c8"`

**Comments:**

&nbsp;

## 115. t08-synchronized-method-lock

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
beforeAnyLock=false,false
instanceHoldsReceiver=true
instanceHoldsClass=false
staticHoldsClass=true
staticHoldsInstance=false
blockOnThisHoldsReceiver=true
afterAllLocks=false,false
```

That program, in one file:

`Main.java`:

```java
public class Main {

  // A synchronized instance method acquires the receiver's monitor: the same lock as
  // synchronized (this).
  synchronized void instanceMethod() {
    System.out.println("instanceHoldsReceiver=" + Thread.holdsLock(this));
    System.out.println("instanceHoldsClass=" + Thread.holdsLock(Main.class));
  }

  // A synchronized static method acquires the monitor of the Class object, because there is no
  // receiver. The two therefore do not exclude each other.
  static synchronized void staticMethod(Main instance) {
    System.out.println("staticHoldsClass=" + Thread.holdsLock(Main.class));
    System.out.println("staticHoldsInstance=" + Thread.holdsLock(instance));
  }

  void explicitBlock() {
    synchronized (this) {
      System.out.println("blockOnThisHoldsReceiver=" + Thread.holdsLock(this));
    }
  }

  public static void main(String[] args) {
    Main instance = new Main();
    System.out.println("beforeAnyLock=" + Thread.holdsLock(instance) + "," + Thread.holdsLock(Main.class));
    instance.instanceMethod();
    staticMethod(instance);
    instance.explicitBlock();
    System.out.println("afterAllLocks=" + Thread.holdsLock(instance) + "," + Thread.holdsLock(Main.class));
  }
}
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

To record: `"digest": "sha256:4f125eae41ebdaf5848763f381a655694e5136b0181abb22389d94b43b89ca9d"`, `"verified": "sha256:f4472e283f026d84223166eeb17f09bebf26af1daf55d2417f5a1b368195d246"`

**Comments:**

&nbsp;

## 116. t08-synchronized-reentrant

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
outer=entered
inner=entered
deadlocked=false
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static final Object LOCK = new Object();

  public static void main(String[] args) {
    synchronized (LOCK) {
      System.out.println("outer=entered");
      // A non-reentrant lock would block here forever.
      synchronized (LOCK) {
        System.out.println("inner=entered");
      }
    }
    System.out.println("deadlocked=false");
  }
}
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

To record: `"digest": "sha256:296d4d4085ed01b5f051a28e6f727b6062e7a83d81afc293ab18ededcd02fe41"`, `"verified": "sha256:645463869f8424eb28594ad097d8c9eba4befd80ff341e5933cd47c335b3fbf1"`

**Comments:**

&nbsp;

## 117. t08-thread-interrupted-clears

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
first=true
second=false
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) {
    Thread.currentThread().interrupt();
    System.out.println("first=" + Thread.interrupted());
    // The first call cleared it.
    System.out.println("second=" + Thread.interrupted());
  }
}
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

To record: `"digest": "sha256:71375a89cf8aabd9cc8856353444ff8243a365043d557c5cfe86115164150af9"`, `"verified": "sha256:ae1048f9f18946800e804ffade294d987bcd9e2d0788343733dc04ad53d75908"`

**Comments:**

&nbsp;

## 118. t08-virtual-thread-builder-unstarted

**Topic:** Managing concurrent code execution (exam objective: "Managing concurrent code execution")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about `Thread.ofVirtual().unstarted(task)` are correct in Java 21? Select all that apply.

- **A** It returns a virtual Thread.
- **B** The returned thread has not been started yet.
- **C** The task runs synchronously before unstarted returns.
- **D** The returned value is an ExecutorService.

### Answer key and reasons

- **A: correct.** The builder is specifically the virtual-thread builder.
- **B: correct.** The `unstarted` method creates without starting.
- **C: incorrect.** The thread has not begun execution.
- **D: incorrect.** The builder returns a Thread object.

### Explanation

The builder creates a new virtual Thread in the unstarted state. Calling `start()` later schedules it to execute its task.

### Why this difficulty

Tests the distinction between constructing and starting a virtual thread with the Thread builder API.

### References

- [Thread.Builder.OfVirtual (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.Builder.OfVirtual.html)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
isVirtual=true
state=NEW
alive=false
daemon=true
stateAfterJoin=TERMINATED
aliveAfterJoin=false
restarted=IllegalThreadStateException
startVirtualThreadIsNew=false
```

That program, in one file:

`Main.java`:

```java
public class Main {

  public static void main(String[] args) throws InterruptedException {
    Runnable task = () -> {};
    Thread thread = Thread.ofVirtual().unstarted(task);

    // unstarted builds the thread and hands it back without running it, which is the whole
    // difference from start() and from Thread.startVirtualThread.
    System.out.println("isVirtual=" + thread.isVirtual());
    System.out.println("state=" + thread.getState());
    System.out.println("alive=" + thread.isAlive());
    // A virtual thread is always a daemon and always has normal priority.
    System.out.println("daemon=" + thread.isDaemon());

    thread.start();
    thread.join();
    System.out.println("stateAfterJoin=" + thread.getState());
    System.out.println("aliveAfterJoin=" + thread.isAlive());

    // Starting it a second time is refused, so unstarted hands out a one-shot thread.
    try {
      thread.start();
      System.out.println("restarted=allowed");
    } catch (IllegalThreadStateException e) {
      System.out.println("restarted=" + e.getClass().getSimpleName());
    }

    // For contrast, the thread Thread.startVirtualThread returns is already running or finished.
    Thread started = Thread.startVirtualThread(task);
    System.out.println("startVirtualThreadIsNew=" + (started.getState() == Thread.State.NEW));
    started.join();
  }
}
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

To record: `"digest": "sha256:53730eb4d45aa175cd1613c46fbc597f2b457294e8837b3a2d9fa9c5736826a7"`, `"verified": "sha256:343e0e1342de3a34bdf2df42d3acf889d593391dfe164e715bfb11b78b832d64"`

**Comments:**

&nbsp;

## 119. t08-virtual-thread-daemon

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

## 120. t08-volatile-increment

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
volatileWriteBecameVisible=true
incrementsPerformed=200000
neverExceedsExpected=true
atLeastOne=true
```

That program, in one file:

`Main.java`:

```java
public class Main {

  static volatile boolean flag = false;
  static volatile int count = 0;

  public static void main(String[] args) throws InterruptedException {
    // The visibility half of the claim, deterministically: this spin ends only because a
    // volatile write by another thread is guaranteed to become visible to this one.
    Thread writer = new Thread(() -> flag = true);
    writer.start();
    while (!flag) {
      Thread.onSpinWait();
    }
    System.out.println("volatileWriteBecameVisible=" + flag);
    writer.join();

    // The lost-update half cannot be made deterministic. count++ is a read, an add and a write,
    // so two threads can read the same value and one increment can vanish -- but whether that
    // happens in any given run is up to the scheduler. Asserting that a loss was observed would
    // be a test that passes most of the time, which is worse than not asserting it. What is
    // always true, and is what this prints, is that increments are never gained: the total can
    // come out below the number of increments performed and never above it.
    int threads = 4;
    int perThread = 50_000;
    Thread[] workers = new Thread[threads];
    for (int i = 0; i < threads; i++) {
      workers[i] =
          new Thread(
              () -> {
                for (int n = 0; n < perThread; n++) {
                  count++;
                }
              });
      workers[i].start();
    }
    for (Thread worker : workers) {
      worker.join();
    }
    int expected = threads * perThread;
    System.out.println("incrementsPerformed=" + expected);
    System.out.println("neverExceedsExpected=" + (count <= expected));
    System.out.println("atLeastOne=" + (count > 0));
  }
}
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

To record: `"digest": "sha256:8609867a28550ce1fee60fe3a3164645d2375d2866cb551f2cf9941d3d1edecb"`, `"verified": "sha256:f54950daca7e5deae007690cf5e471c9ebb80c8b0a62386a786f615f5964384c"`

**Comments:**

&nbsp;

## 121. t09-bufferedreader-readline

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
line1=one
line2=two
end=null
```

That program, in one file:

`Main.java`:

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class Main {

  public static void main(String[] args) throws IOException {
    BufferedReader reader = new BufferedReader(new StringReader("one\ntwo\n"));
    System.out.println("line1=" + reader.readLine());
    System.out.println("line2=" + reader.readLine());
    System.out.println("end=" + reader.readLine());
  }
}
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

To record: `"digest": "sha256:fcb833284302075e88da9b405e83b435dcaf7c0b287cbc63a2d7137a9d743252"`, `"verified": "sha256:f01dd0ea238839691f2b05311ec5e8c0c43124091f9ba9c33ac4f7f75150160f"`

**Comments:**

&nbsp;

## 122. t09-dataoutput-readutf

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.io.ByteArrayInputStream;
> import java.io.ByteArrayOutputStream;
> import java.io.DataInputStream;
> import java.io.DataOutputStream;
>
> public class Main {
>   public static void main(String[] args) throws Exception {
>     var bytes = new ByteArrayOutputStream();
>     try (var out = new DataOutputStream(bytes)) {
>       out.writeUTF("Java");
>     }
>     try (var in = new DataInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
>       System.out.println(in.readUTF());
>     }
>   }
> }
> ```

- **A** Java
- **B** 4
- **C** J
- **D** It throws EOFException.

### Answer key and reasons

- **A: correct.** readUTF decodes the value written by writeUTF.
- **B: incorrect.** The program prints the decoded string, not its length.
- **C: incorrect.** readUTF reads the complete encoded string.
- **D: incorrect.** The byte array contains the complete output of writeUTF.

### Explanation

`writeUTF` writes a length-prefixed modified UTF-8 representation that `readUTF` understands. Reading the bytes back reproduces the original string `Java`.

### Why this difficulty

Checks the paired DataOutputStream/DataInputStream UTF methods using an in-memory deterministic stream.

### References

- [DataOutputStream.writeUTF(String) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/DataOutputStream.html#writeUTF(java.lang.String))
- [DataInputStream.readUTF() (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/DataInputStream.html#readUTF())

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
Java
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

To record: `"digest": "sha256:3e2c82dfb7891e2b7d70aa7bf82b7ae32d26eacc904ce5e2210eb1e7aae4be1d"`, `"verified": "sha256:c1ba60ce13586503a21a05e9ef0bb959f1ba74a1d37bcfcbf5fc6bfb548f684d"`

**Comments:**

&nbsp;

## 123. t09-files-copy-existing-target

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
thrown=FileAlreadyExistsException
afterReplaceExisting=from the source
```

That program, in one file:

`Main.java`:

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class Main {

  public static void main(String[] args) throws IOException {
    Path source = Files.createTempFile("certforge-source", ".txt");
    Path target = Files.createTempFile("certforge-target", ".txt");
    Files.writeString(source, "from the source");
    try {
      try {
        Files.copy(source, target);
        System.out.println("thrown=none");
      } catch (IOException e) {
        System.out.println("thrown=" + e.getClass().getSimpleName());
      }
      // Overwriting is opt-in rather than the default.
      Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
      System.out.println("afterReplaceExisting=" + Files.readString(target));
    } finally {
      Files.deleteIfExists(source);
      Files.deleteIfExists(target);
    }
  }
}
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

To record: `"digest": "sha256:4c1181a937681c69dd6710c681116b68fcff0bd97b724641a787e081b9567d47"`, `"verified": "sha256:81107834f27d0803fc4d530c928a5e15cc7129e72e362b9263b49b918ff9cfd5"`

**Comments:**

&nbsp;

## 124. t09-files-lines-close

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
streamIsAutoCloseable=true
read=[one, two, three]
afterClose=IllegalStateException
firstOnly=one
```

That program, in one file:

`Main.java`:

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) throws Exception {
    Path file = Files.createTempFile("lines", ".txt");
    Files.writeString(file, "one\ntwo\nthree\n", StandardCharsets.UTF_8);

    // The stream a Files method returns is closeable, which is what makes try-with-resources
    // applicable to it at all. An ordinary Stream from a collection has nothing to release.
    System.out.println("streamIsAutoCloseable=" + AutoCloseable.class.isAssignableFrom(Stream.class));

    try (Stream<String> lines = Files.lines(file)) {
      List<String> read = lines.toList();
      System.out.println("read=" + read);
    }

    // Leaving the block closed the stream, and a closed stream refuses further use. That is the
    // observable half; that closing is also what releases the file handle is what the javadoc
    // states and is the reason the resource block matters rather than being tidy.
    Stream<String> leaked = Files.lines(file);
    leaked.close();
    try {
      leaked.findFirst();
      System.out.println("afterClose=usable");
    } catch (IllegalStateException e) {
      System.out.println("afterClose=" + e.getClass().getSimpleName());
    }

    // It is lazy: a short-circuiting terminal operation reads the first line and stops, so the
    // whole file is never held in memory and never fully read.
    try (Stream<String> lines = Files.lines(file)) {
      System.out.println("firstOnly=" + lines.findFirst().orElseThrow());
    }

    Files.delete(file);
  }
}
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

To record: `"digest": "sha256:0a3e70e4bd494ec6327a81001e8de2d509ffd6dc8c903803e0369c34beffed0c"`, `"verified": "sha256:6375607bfe48fdf99823980353f91b7ad971d1d7a92cd17ac447476b8de6886b"`

**Comments:**

&nbsp;

## 125. t09-files-readstring-utf8

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> Which charset does `Files.readString(path)` use when no charset argument is supplied?

- **A** The platform default charset.
- **B** UTF-8.
- **C** UTF-16.
- **D** US-ASCII.

### Answer key and reasons

- **A: incorrect.** This convenience overload specifies UTF-8 rather than delegating to the platform default.
- **B: correct.** UTF-8 is the documented charset for the one-argument overload.
- **C: incorrect.** UTF-16 is not the default for this method.
- **D: incorrect.** The method is specified to use UTF-8.

### Explanation

The one-argument `Files.readString(Path)` method decodes the file using UTF-8.

### Why this difficulty

Tests the default charset specified by the convenience overload of Files.readString.

### References

- [Files.readString(Path) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html#readString(java.nio.file.Path))

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
defaultMatchesUtf8=true
explicitUtf8Matches=true
latin1Matches=false
```

That program, in one file:

`Main.java`:

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

  public static void main(String[] args) throws Exception {
    // U+00E7 is one character that UTF-8 stores in two bytes, so the charset is observable.
    String text = "a\u00e7a\u00ed";
    Path file = Files.createTempFile("certforge-charset", ".txt");
    try {
      Files.write(file, text.getBytes(StandardCharsets.UTF_8));

      System.out.println("defaultMatchesUtf8=" + Files.readString(file).equals(text));
      System.out.println("explicitUtf8Matches=" + Files.readString(file, StandardCharsets.UTF_8).equals(text));
      // Reading the same bytes as Latin-1 does not, which is what makes the default meaningful.
      System.out.println("latin1Matches=" + Files.readString(file, StandardCharsets.ISO_8859_1).equals(text));
    } finally {
      Files.deleteIfExists(file);
    }
  }
}
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

To record: `"digest": "sha256:e9a22d566e7a8783558af0b1a6bcea1fceabc6d10bd22fd202c2a7e9a1b0766a"`, `"verified": "sha256:d8788c76d115b7dbc997048a434dcb9bb54287ea39df1de52d0a856e2d781237"`

**Comments:**

&nbsp;

## 126. t09-files-walk-close

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about the `Stream<Path>` returned by `Files.walk(path)` are correct? Select all that apply.

- **A** It should normally be used in try-with-resources.
- **B** The stream is populated lazily.
- **C** A terminal operation always closes the stream automatically.
- **D** It eagerly loads the entire tree before returning.

### Answer key and reasons

- **A: correct.** Closing the stream releases open directory resources.
- **B: correct.** Traversal occurs as the stream is consumed.
- **C: incorrect.** Terminal operations do not generally close a stream resource.
- **D: incorrect.** The traversal is lazy.

### Explanation

The stream is lazily populated and holds open directory resources while traversing. It should be closed promptly, typically with try-with-resources.

### Why this difficulty

Tests resource management for lazily populated directory-tree streams.

### References

- [Files.walk(Path, FileVisitOption...) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html#walk(java.nio.file.Path,java.nio.file.FileVisitOption...))

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
streamIsAutoCloseable=true
totalEntries=12
visitedWhenThreeTaken=3 taken=3
depthOneEntries=7
afterClose=IllegalStateException
cleanedUp=true
```

That program, in one file:

`Main.java`:

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) throws Exception {
    Path root = Files.createTempDirectory("walk");
    Path nested = Files.createDirectory(root.resolve("nested"));
    for (int i = 0; i < 5; i++) {
      Files.createFile(root.resolve("file" + i + ".txt"));
      Files.createFile(nested.resolve("deep" + i + ".txt"));
    }

    // Closeable, so try-with-resources applies: the walk holds directory handles open as it
    // descends, and closing is what releases them.
    System.out.println("streamIsAutoCloseable=" + AutoCloseable.class.isAssignableFrom(Stream.class));

    try (Stream<Path> walk = Files.walk(root)) {
      // The start directory, nested, and ten files.
      System.out.println("totalEntries=" + walk.count());
    }

    // Populated lazily: with a limit the walk visits only as many entries as the pipeline asks
    // for, rather than building the whole tree first. Counting visits rather than naming them,
    // because the order a directory is iterated in is not specified.
    List<Path> visited = new ArrayList<>();
    try (Stream<Path> walk = Files.walk(root)) {
      List<Path> taken = walk.peek(visited::add).limit(3).toList();
      System.out.println("visitedWhenThreeTaken=" + visited.size() + " taken=" + taken.size());
    }

    // maxDepth bounds the descent, so the nested files are never visited at depth 1.
    try (Stream<Path> walk = Files.walk(root, 1)) {
      System.out.println("depthOneEntries=" + walk.count());
    }

    Stream<Path> leaked = Files.walk(root);
    leaked.close();
    try {
      leaked.findFirst();
      System.out.println("afterClose=usable");
    } catch (IllegalStateException e) {
      System.out.println("afterClose=" + e.getClass().getSimpleName());
    }

    try (Stream<Path> walk = Files.walk(root)) {
      walk.sorted(java.util.Comparator.reverseOrder()).forEach(p -> {
        try {
          Files.delete(p);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });
    }
    System.out.println("cleanedUp=" + !Files.exists(root));
  }
}
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

To record: `"digest": "sha256:5e9695c9a3bc4c5ec4a87ae43692aef4cf9a8088ddc8a26a4943108ac92139f9"`, `"verified": "sha256:8353460381256744b9d2aadd5057dd4efcfcc9c3ba259c8fbb1d7ed1a61458d1"`

**Comments:**

&nbsp;

## 127. t09-path-normalize-namecount

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

## 128. t09-path-relativize

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
>     Path from = Path.of("a", "b");
>     Path to = Path.of("a", "c", "d");
>     System.out.println(from.relativize(to).getNameCount());
>   }
> }
> ```

- **A** 2
- **B** 3
- **C** 4
- **D** It throws IllegalArgumentException because the paths differ.

### Answer key and reasons

- **A: incorrect.** The result also contains the parent element `..`, so it has three name elements.
- **B: correct.** The relative result contains `..`, `c`, and `d`.
- **C: incorrect.** The shared prefix `a` is not part of the relativized result.
- **D: incorrect.** Relativize is defined for compatible path kinds such as these two relative paths.

### Explanation

Both paths are relative and share the prefix `a`. To get from `a/b` to `a/c/d`, move up once from `b`, then descend through `c/d`, producing `../c/d`. The program prints the name count of that relative path, which is 3.

### Why this difficulty

Tests lexical path relativization without depending on the host file system.

### References

- [Path.relativize(Path) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Path.html#relativize(java.nio.file.Path))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
3
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

To record: `"digest": "sha256:47f4978490c788ecb3e77fb477ea5f6cecc077cf483abdfe0a81a92053a09e1d"`, `"verified": "sha256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"`

**Comments:**

&nbsp;

## 129. t09-path-resolve-absolute

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
isAbsolute=true
resolveReturnsOther=true
resolveRelativeAppends=true
```

That program, in one file:

`Main.java`:

```java
import java.nio.file.Path;

public class Main {

  public static void main(String[] args) {
    Path base = Path.of("base");
    // Derived rather than written as a literal, so it is absolute on every platform.
    Path absolute = Path.of("x").toAbsolutePath();
    System.out.println("isAbsolute=" + absolute.isAbsolute());
    System.out.println("resolveReturnsOther=" + base.resolve(absolute).equals(absolute));
    System.out.println("resolveRelativeAppends=" + base.resolve(Path.of("leaf")).equals(Path.of("base", "leaf")));
  }
}
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

To record: `"digest": "sha256:318920b7b1473dca3a6026de7b1fa03ac05160f8b68f49f2121dad39c11c51d9"`, `"verified": "sha256:3f08f4afba8ebce4952768900268c6703b9b0160dc1fd3a8d248def1125a0433"`

**Comments:**

&nbsp;

## 130. t09-randomaccessfile-seek

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
pointerAfterSeek=3
readAt3=D
pointerAfterRead=4
readAt3Again=D
readAt0=A
content=AxCDEFGH
lengthAfterSeekPastEnd=8
readPastEnd=-1
```

That program, in one file:

`Main.java`:

```java
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

  public static void main(String[] args) throws Exception {
    Path file = Files.createTempFile("seek", ".bin");
    try (RandomAccessFile raf = new RandomAccessFile(file.toFile(), "rw")) {
      raf.write("ABCDEFGH".getBytes("US-ASCII"));

      // seek moves the file pointer to an absolute byte offset counted from the beginning of
      // the file, not relative to where the pointer happens to be.
      raf.seek(3);
      System.out.println("pointerAfterSeek=" + raf.getFilePointer());
      System.out.println("readAt3=" + (char) raf.read());
      System.out.println("pointerAfterRead=" + raf.getFilePointer());

      // Absolute, not relative: seeking to 3 again returns to the same byte.
      raf.seek(3);
      System.out.println("readAt3Again=" + (char) raf.read());

      raf.seek(0);
      System.out.println("readAt0=" + (char) raf.read());

      // Writing is positional too, so a seek plus a write replaces bytes in place.
      raf.seek(1);
      raf.write('x');
      raf.seek(0);
      byte[] all = new byte[8];
      raf.readFully(all);
      System.out.println("content=" + new String(all, "US-ASCII"));

      // Seeking past the end is allowed and does not extend the file until something is
      // written there; a read at that position reports end of file.
      raf.seek(100);
      System.out.println("lengthAfterSeekPastEnd=" + raf.length());
      System.out.println("readPastEnd=" + raf.read());
    }
    Files.delete(file);
  }
}
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

To record: `"digest": "sha256:f913982a40f0b407c922cc322ea8b5b984ed485116675ddc040db21eb4bbde37"`, `"verified": "sha256:74518199e6d506170aaa15e747d4bd2a0ed7d49e2f2e5732363ed542cc8ff78b"`

**Comments:**

&nbsp;

## 131. t09-read-all-lines

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

## 132. t09-reader-vs-inputstream

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
chars=2 bytes=3
inputStreamRead=[97, 195, 169]
readerRead=[97, 233]
decodedMatchesSource=true
byteCountDiffersFromCharCount=true
```

That program, in one file:

`Main.java`:

```java
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) throws Exception {
    // One character that is not ASCII, written as an escape so this source file stays ASCII:
    // U+00E9, which UTF-8 encodes as two bytes.
    String text = "aé";
    byte[] utf8 = text.getBytes(StandardCharsets.UTF_8);
    System.out.println("chars=" + text.length() + " bytes=" + utf8.length);

    // An InputStream is byte-oriented: read() returns one byte at a time, so the single
    // character arrives as two separate values and neither is the character.
    List<Integer> bytes = new ArrayList<>();
    try (InputStream in = new ByteArrayInputStream(utf8)) {
      for (int b = in.read(); b != -1; b = in.read()) {
        bytes.add(b);
      }
    }
    System.out.println("inputStreamRead=" + bytes);

    // A Reader is character-oriented: it decodes bytes with a charset and returns code units,
    // so the same input arrives as two characters, the second being the one byte pair decoded.
    List<Integer> chars = new ArrayList<>();
    try (Reader reader =
        new InputStreamReader(new ByteArrayInputStream(utf8), StandardCharsets.UTF_8)) {
      for (int c = reader.read(); c != -1; c = reader.read()) {
        chars.add(c);
      }
    }
    System.out.println("readerRead=" + chars);
    System.out.println("decodedMatchesSource=" + (chars.get(1) == (int) text.charAt(1)));
    System.out.println("byteCountDiffersFromCharCount=" + (bytes.size() != chars.size()));
  }
}
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

To record: `"digest": "sha256:084a77712d356fef2f848f7bb7c316bbc9fdad4acd90ec627496aee4e9baa40a"`, `"verified": "sha256:e6ed654adf7c0254cd594ba503ac3fbf64c92d2f38eccb98503776569369df19"`

**Comments:**

&nbsp;

## 133. t09-serialization-facts

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

## 134. t09-serialization-serialversionuid

**Topic:** Java I/O API (exam objective: "Using Java I/O API")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> What is the main role of a declared `serialVersionUID` in a `Serializable` class?

- **A** It uniquely identifies each individual object instance.
- **B** It participates in checking serialized-class version compatibility.
- **C** It encrypts the serialized byte stream.
- **D** It forces every field to be serialized, including static fields.

### Answer key and reasons

- **A: incorrect.** All instances of a class share the class's serial version UID.
- **B: correct.** A mismatched UID can cause InvalidClassException during deserialization.
- **C: incorrect.** serialVersionUID provides no encryption.
- **D: incorrect.** It does not change the default field-selection rules.

### Explanation

The serialization runtime associates a serial version UID with each serializable class and uses it during deserialization to verify compatibility between the sender's and receiver's class versions.

### Why this difficulty

Tests the purpose of serialVersionUID in Java's built-in serialization compatibility mechanism.

### References

- [Serializable (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/Serializable.html)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
declared=102030405060708
computedIsNonZero=true
roundTrip=kept
identifierFoundInStream=true
mismatch=InvalidClassException
mentionsIncompatible=true
```

That program, in one file:

`Main.java`:

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InvalidClassException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.ObjectStreamClass;
import java.io.Serializable;

public class Main {

  /** Declares its own version identifier, with a recognisable value. */
  static class Versioned implements Serializable {
    private static final long serialVersionUID = 0x0102030405060708L;

    final String value = "kept";
  }

  /** Declares none, so the runtime computes one from the class structure. */
  static class Unversioned implements Serializable {
    final String value = "computed";
  }

  public static void main(String[] args) throws Exception {
    long declared = ObjectStreamClass.lookup(Versioned.class).getSerialVersionUID();
    System.out.println("declared=" + Long.toHexString(declared));
    System.out.println("computedIsNonZero=" + (ObjectStreamClass.lookup(Unversioned.class).getSerialVersionUID() != 0));

    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    try (ObjectOutputStream out = new ObjectOutputStream(buffer)) {
      out.writeObject(new Versioned());
    }
    byte[] stream = buffer.toByteArray();

    // A round trip with the identifier intact succeeds.
    try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(stream))) {
      System.out.println("roundTrip=" + ((Versioned) in.readObject()).value);
    }

    // The identifier is written into the stream, so it can be found there and altered. Changing
    // it is what a class whose version moved on would look like to a reader holding old bytes.
    int at = indexOfVersion(stream, declared);
    System.out.println("identifierFoundInStream=" + (at >= 0));
    stream[at + 7] ^= 0x01;

    // Deserializing now fails, and it fails on the version check rather than on the data, which
    // is what the identifier participates in.
    try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(stream))) {
      in.readObject();
      System.out.println("mismatch=accepted");
    } catch (InvalidClassException e) {
      System.out.println("mismatch=" + e.getClass().getSimpleName());
      System.out.println("mentionsIncompatible=" + e.getMessage().contains("incompatible"));
    }
  }

  /** Where the eight big-endian bytes of the identifier sit in the stream. */
  private static int indexOfVersion(byte[] stream, long version) {
    byte[] wanted = new byte[8];
    for (int i = 0; i < 8; i++) {
      wanted[i] = (byte) (version >>> (56 - 8 * i));
    }
    outer:
    for (int start = 0; start + 8 <= stream.length; start++) {
      for (int i = 0; i < 8; i++) {
        if (stream[start + i] != wanted[i]) {
          continue outer;
        }
      }
      return start;
    }
    return -1;
  }
}
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

To record: `"digest": "sha256:eabf60d3125103fadc932759a076d195daad85172c0fd13df63e97e4d435d660"`, `"verified": "sha256:4b93b8dec6265fd8f14bf5c9d1158f3bb0ef9461909916abfb52167d0c3bc689"`

**Comments:**

&nbsp;

## 135. t09-serialization-transient-static

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
kept=kept-original
transient=null
static=static-changed
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

  static final class Holder implements Serializable {
    private static final long serialVersionUID = 1L;
    static String shared = "static-original";
    transient String cached = "transient-original";
    String kept = "kept-original";
  }

  public static void main(String[] args) throws Exception {
    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
      out.writeObject(new Holder());
    }
    // Proves the static was never part of the instance state: changing it afterwards survives.
    Holder.shared = "static-changed";
    Holder after;
    try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
      after = (Holder) in.readObject();
    }
    System.out.println("kept=" + after.kept);
    System.out.println("transient=" + after.cached);
    System.out.println("static=" + Holder.shared);
  }
}
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

To record: `"digest": "sha256:8da42eededa956e63011fa2b3c1952447bd65e19649f6d9f4097914795f847ac"`, `"verified": "sha256:157a6f47144a48e9fb2fb9af3836d4a85cea2049e8a4f01a86e23a720e93540c"`

**Comments:**

&nbsp;

## 136. t10-collator-locale-sensitive

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
stringCompareTo_a_B=after
collator_a_B=before
theyDisagree=true
german_umlautA_z=before
swedish_umlautA_z=after
sameInputDifferentOrder=true
```

That program, in one file:

`Main.java`:

```java
import java.text.Collator;
import java.util.Locale;

public class Main {

  /** Only the sign matters for an ordering, and only the sign is stable to print. */
  static String sign(int value) {
    return value < 0 ? "before" : value > 0 ? "after" : "equal";
  }

  public static void main(String[] args) {
    // String.compareTo compares UTF-16 code units, so every uppercase letter comes before every
    // lowercase one and "a" lands after "B". That is an encoding order, not an alphabetical one.
    System.out.println("stringCompareTo_a_B=" + sign("a".compareTo("B")));

    // A Collator compares by collation rules, so "a" comes before "B" the way a reader of a
    // dictionary expects. Same two strings, opposite answer.
    Collator english = Collator.getInstance(Locale.ENGLISH);
    System.out.println("collator_a_B=" + sign(english.compare("a", "B")));
    System.out.println("theyDisagree="
        + (Integer.signum("a".compareTo("B")) != Integer.signum(english.compare("a", "B"))));

    // And the rules are locale-sensitive: German treats a-umlaut as a variant of a, so it sorts
    // before z, while Swedish treats it as a letter of its own that follows z.
    Collator german = Collator.getInstance(Locale.GERMAN);
    Collator swedish = Collator.getInstance(Locale.of("sv", "SE"));
    System.out.println("german_umlautA_z=" + sign(german.compare("ä", "z")));
    System.out.println("swedish_umlautA_z=" + sign(swedish.compare("ä", "z")));
    System.out.println("sameInputDifferentOrder="
        + (Integer.signum(german.compare("ä", "z")) != Integer.signum(swedish.compare("ä", "z"))));
  }
}
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

To record: `"digest": "sha256:45619c2f8059eccf95f19fb0add9ba36af084101691d1988b4fe746eccbc15a2"`, `"verified": "sha256:96478308144957575b0e3a31315fca8385a7e3c55c1732ce34c8193b4af27582"`

**Comments:**

&nbsp;

## 137. t10-collator-primary-strength

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** hard · **Java release:** 21

### As the learner sees it

> What does setting a `Collator` to `Collator.PRIMARY` generally mean for comparison significance?

- **A** Only primary collation differences are considered.
- **B** All possible differences, including case and variants, must be considered.
- **C** Strings are compared only by Java UTF-16 code-unit values.
- **D** The Collator stops being locale-sensitive.

### Answer key and reasons

- **A: correct.** That is the definition of PRIMARY strength.
- **B: incorrect.** That describes stronger comparison levels, not PRIMARY.
- **C: incorrect.** Collator applies locale-sensitive collation rules.
- **D: incorrect.** Strength changes which collation differences matter; it does not disable locale-sensitive collation.

### Explanation

PRIMARY strength compares only primary differences. Secondary and tertiary differences, such as many accent and case distinctions depending on the collation rules, are not considered at that strength.

### Why this difficulty

Tests the meaning of Collator strength levels rather than only basic locale selection.

### References

- [Collator.PRIMARY (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/Collator.html#PRIMARY)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
primaryStrength=true
primaryIgnoresCase=true
primaryIgnoresAccent=true
primarySeesBaseLetters=false
secondarySeesAccent=true
secondaryIgnoresCase=true
tertiarySeesCase=true
primaryCompareZero=true
```

That program, in one file:

`Main.java`:

```java
import java.text.Collator;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    Collator collator = Collator.getInstance(Locale.ENGLISH);

    // At PRIMARY strength only base-letter differences count. Case is a tertiary difference and
    // an accent is a secondary one, so both are ignored and the strings compare as equal.
    collator.setStrength(Collator.PRIMARY);
    System.out.println("primaryStrength=" + (collator.getStrength() == Collator.PRIMARY));
    System.out.println("primaryIgnoresCase=" + collator.equals("abc", "ABC"));
    System.out.println("primaryIgnoresAccent=" + collator.equals("resume", "résume"));
    System.out.println("primarySeesBaseLetters=" + collator.equals("abc", "abd"));

    // Raising the strength makes the finer differences count again.
    collator.setStrength(Collator.SECONDARY);
    System.out.println("secondarySeesAccent=" + !collator.equals("resume", "résume"));
    System.out.println("secondaryIgnoresCase=" + collator.equals("abc", "ABC"));

    collator.setStrength(Collator.TERTIARY);
    System.out.println("tertiarySeesCase=" + !collator.equals("abc", "ABC"));

    // equals is defined as compare returning zero, so the same holds for ordering.
    collator.setStrength(Collator.PRIMARY);
    System.out.println("primaryCompareZero=" + (collator.compare("abc", "ABC") == 0));
  }
}
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

To record: `"digest": "sha256:c64cc569041156e77b870213d24024126a210ca760a421b41c24a5a0d33c3e1c"`, `"verified": "sha256:fd1fca3ad0ca08f90bcc5c51e7051ae1a8fd4021c3a9f511df4097d181a50b09"`

**Comments:**

&nbsp;

## 138. t10-currency-us-code

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.util.Currency;
> import java.util.Locale;
>
> public class Main {
>   public static void main(String[] args) {
>     System.out.println(Currency.getInstance(Locale.US).getCurrencyCode());
>   }
> }
> ```

- **A** US
- **B** USD
- **C** $
- **D** Dollar

### Answer key and reasons

- **A: incorrect.** US is the region code, not the currency code.
- **B: correct.** USD is the ISO currency code for the United States dollar.
- **C: incorrect.** That is a symbol, not the value returned by getCurrencyCode().
- **D: incorrect.** getCurrencyCode returns the ISO code rather than a display name.

### Explanation

`Currency.getInstance(Locale.US)` resolves the currency used by the United States locale. Its ISO 4217 currency code is `USD`.

### Why this difficulty

Checks locale-to-currency lookup using a stable ISO currency code.

### References

- [Currency.getInstance(Locale) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Currency.html#getInstance(java.util.Locale))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
USD
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

To record: `"digest": "sha256:a3689e4003c1638ba7b4cb620463c619e58bd8cedda3f07fe8a17bbb999f8bcb"`, `"verified": "sha256:a26cdf3a6e709124385d4d7eb9bff6b897a58ed5597fbab779b89849dbe81b21"`

**Comments:**

&nbsp;

## 139. t10-datetimeformatter-locale-immutability

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
sameInstance=false
baseLocale=en-US
frenchLocale=fr-FR
```

That program, in one file:

`Main.java`:

```java
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    DateTimeFormatter base = DateTimeFormatter.ofPattern("d MMMM").withLocale(Locale.US);
    DateTimeFormatter french = base.withLocale(Locale.FRANCE);
    System.out.println("sameInstance=" + (base == french));
    System.out.println("baseLocale=" + base.getLocale().toLanguageTag());
    System.out.println("frenchLocale=" + french.getLocale().toLanguageTag());
  }
}
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

To record: `"digest": "sha256:a0f737bdcf04c1464c89dfaa58036be7287af8ec3bfde4b8b11bdd4e23d2013e"`, `"verified": "sha256:ad797b0b8f709714b4b0819414a0f279ed8511ec63e035275db74f2c4df20c50"`

**Comments:**

&nbsp;

## 140. t10-locale-builder-language-tag

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

## 141. t10-locale-default-categories

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
categories=[DISPLAY, FORMAT]
displayAfterSet=fr_FR
formatAfterSet=ja_JP
categoriesDiffer=true
bothAfterPlainSet=de_DE,de_DE
plainGetDefault=de_DE
```

That program, in one file:

`Main.java`:

```java
import java.util.Arrays;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // Two categories, so the locale used to *show* things can differ from the one used to
    // *format* them.
    System.out.println("categories=" + Arrays.toString(Locale.Category.values()));

    Locale plain = Locale.getDefault();
    Locale display = Locale.getDefault(Locale.Category.DISPLAY);
    Locale format = Locale.getDefault(Locale.Category.FORMAT);
    try {
      Locale.setDefault(Locale.Category.DISPLAY, Locale.FRANCE);
      Locale.setDefault(Locale.Category.FORMAT, Locale.JAPAN);

      // Setting one category leaves the other alone, which is the point of having two.
      System.out.println("displayAfterSet=" + Locale.getDefault(Locale.Category.DISPLAY));
      System.out.println("formatAfterSet=" + Locale.getDefault(Locale.Category.FORMAT));
      System.out.println(
          "categoriesDiffer="
              + !Locale.getDefault(Locale.Category.DISPLAY)
                  .equals(Locale.getDefault(Locale.Category.FORMAT)));

      // The no-argument setDefault sets both, and it is the one that moves getDefault().
      Locale.setDefault(Locale.GERMANY);
      System.out.println("bothAfterPlainSet=" + Locale.getDefault(Locale.Category.DISPLAY) + "," + Locale.getDefault(Locale.Category.FORMAT));
      System.out.println("plainGetDefault=" + Locale.getDefault());
    } finally {
      // Restored, because these are process-wide. setDefault(Category, ...) does not put back the
      // plain default that setDefault(Locale) moved, so that one is restored first and then the
      // two categories on top of it.
      Locale.setDefault(plain);
      Locale.setDefault(Locale.Category.DISPLAY, display);
      Locale.setDefault(Locale.Category.FORMAT, format);
    }
  }
}
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

To record: `"digest": "sha256:06751e113eaf965fe3b43914d465e9dfe6bb26f67944f8e145b6394f588181be"`, `"verified": "sha256:57b3deaa6b51167f7c9c17fd1298b65c1a53d8ded9085082a23072bc86af00de"`

**Comments:**

&nbsp;

## 142. t10-locale-language-tag

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
language=pt
country=BR
```

That program, in one file:

`Main.java`:

```java
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    Locale locale = Locale.forLanguageTag("pt-BR");
    System.out.println("language=" + locale.getLanguage());
    System.out.println("country=" + locale.getCountry());
  }
}
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

To record: `"digest": "sha256:705582ca1e729220da81dd8a18408652f0ed6793c10aeb1945635f40ef18b15f"`, `"verified": "sha256:f9255f4fedfc0efc4ff828d92ffd36d2f7a8a0bcde2e97a5b6f6c290955a8e2f"`

**Comments:**

&nbsp;

## 143. t10-locale-root

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** multiple choice, select all that apply · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> Which statements about `Locale.ROOT` are correct? Select all that apply.

- **A** It is the language-neutral root locale.
- **B** It has no language or country component.
- **C** It always equals Locale.getDefault().
- **D** It represents the United States locale.

### Answer key and reasons

- **A: correct.** ROOT represents the root of the locale hierarchy.
- **B: correct.** It is not tied to a particular language or region.
- **C: incorrect.** The system/user default locale is independent of Locale.ROOT.
- **D: incorrect.** Locale.US is the United States locale; ROOT is neutral.

### Explanation

`Locale.ROOT` is the language-neutral, country-neutral root locale. It is useful as a base locale for locale-sensitive operations that should not depend on a user's language or region.

### Why this difficulty

Tests the purpose of the root locale as a locale-neutral base rather than a user's regional preference.

### References

- [Locale.ROOT (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Locale.html#ROOT)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
language=[]
country=[]
variant=[]
toString=[]
toLanguageTag=und
equalsEnglish=false
sameAsEmptyBuilt=true
```

That program, in one file:

`Main.java`:

```java
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // Locale.ROOT is the language-neutral locale: it names no language and no country, which is
    // what makes it the base every other locale falls back to.
    System.out.println("language=[" + Locale.ROOT.getLanguage() + "]");
    System.out.println("country=[" + Locale.ROOT.getCountry() + "]");
    System.out.println("variant=[" + Locale.ROOT.getVariant() + "]");
    System.out.println("toString=[" + Locale.ROOT + "]");
    System.out.println("toLanguageTag=" + Locale.ROOT.toLanguageTag());

    // It is not the same thing as the English locale, and not the same as the JVM default.
    System.out.println("equalsEnglish=" + Locale.ROOT.equals(Locale.ENGLISH));
    System.out.println("sameAsEmptyBuilt=" + Locale.ROOT.equals(Locale.of("", "")));
  }
}
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

To record: `"digest": "sha256:32ecd121d71971fa44f34099eebf69463ab775ae14f4870332d5b50e2113fda3"`, `"verified": "sha256:92026d263d35c3acfce8d5516c4f006533d4ec28ad295be0e46e64a45d6181f1"`

**Comments:**

&nbsp;

## 144. t10-locale-to-string

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

## 145. t10-messageformat-apostrophe

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
placeholder=value is x
quoted=value is {0}
doubled=it's x
loneQuote=its {0}
```

That program, in one file:

`Main.java`:

```java
import java.text.MessageFormat;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // An explicit locale throughout, so none of this depends on the machine's default.
    // Without quotes, {0} is an argument placeholder and is substituted.
    System.out.println("placeholder=" + new MessageFormat("value is {0}", Locale.ROOT).format(new Object[] {"x"}));

    // A pair of single quotes around it makes the braces literal text: the argument is not
    // substituted, and the quotes themselves do not appear in the output.
    System.out.println("quoted=" + new MessageFormat("value is '{0}'", Locale.ROOT).format(new Object[] {"x"}));

    // Which is why a real apostrophe has to be doubled, and a lone one quotes what follows.
    System.out.println("doubled=" + new MessageFormat("it''s {0}", Locale.ROOT).format(new Object[] {"x"}));
    System.out.println("loneQuote=" + new MessageFormat("it's {0}", Locale.ROOT).format(new Object[] {"x"}));
  }
}
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

To record: `"digest": "sha256:c3d71e5fa72ad299941fb5f4367b7d6a405cdff775262054005453d31faa2437"`, `"verified": "sha256:b9f7156261b46d9435dbb860deb5393b0e12af4ffc52d2006a670d167b2a3cb5"`

**Comments:**

&nbsp;

## 146. t10-numberformat-currency-instance

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
usCurrency=USD
usFractionDigits=2
usSymbolPresent=true
japanCurrency=JPY
japanFractionDigits=0
currenciesDiffer=true
formatsDiffer=true
```

That program, in one file:

`Main.java`:

```java
import java.text.NumberFormat;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // getCurrencyInstance returns a formatter configured for money in the given locale: the
    // currency of that locale, its symbol, and its conventional number of fraction digits.
    NumberFormat us = NumberFormat.getCurrencyInstance(Locale.US);
    System.out.println("usCurrency=" + us.getCurrency().getCurrencyCode());
    System.out.println("usFractionDigits=" + us.getMaximumFractionDigits());
    System.out.println("usSymbolPresent=" + us.format(1).contains("$"));

    NumberFormat japan = NumberFormat.getCurrencyInstance(Locale.JAPAN);
    System.out.println("japanCurrency=" + japan.getCurrency().getCurrencyCode());
    // The yen has no minor unit, which the formatter knows without being told.
    System.out.println("japanFractionDigits=" + japan.getMaximumFractionDigits());

    // The locale decides, so the same amount formats differently and the currency differs.
    System.out.println("currenciesDiffer=" + !us.getCurrency().equals(japan.getCurrency()));
    System.out.println("formatsDiffer=" + !us.format(1234.5).equals(japan.format(1234.5)));
  }
}
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

To record: `"digest": "sha256:44c22d1667f1a812f25e40ae1fe8e0c8a7d0ed0361877297873aa484084d9ba8"`, `"verified": "sha256:7faae9f5d63a20a372562eab6417ef6b3cf33adb324ca361868946da2432e932"`

**Comments:**

&nbsp;

## 147. t10-percent-format-us

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** easy · **Java release:** 21

### As the learner sees it

> What does this program print?
>
> ```java
> import java.text.NumberFormat;
> import java.util.Locale;
>
> public class Main {
>   public static void main(String[] args) {
>     System.out.println(NumberFormat.getPercentInstance(Locale.US).format(0.25));
>   }
> }
> ```

- **A** 0.25%
- **B** 25%
- **C** 2500%
- **D** 25

### Answer key and reasons

- **A: incorrect.** Percent formatting scales the numeric value by 100.
- **B: correct.** 0.25 represents twenty-five percent.
- **C: incorrect.** The value is multiplied by 100 once, not by 10,000.
- **D: incorrect.** The percent formatter includes the percent symbol.

### Explanation

The US percent formatter multiplies the numeric value by 100 and appends the percent sign using locale conventions. Formatting 0.25 produces `25%`.

### Why this difficulty

Tests a locale-explicit percentage formatter with an exact simple value.

### References

- [NumberFormat.getPercentInstance(Locale) (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/text/NumberFormat.html#getPercentInstance(java.util.Locale))

### Verified by the build

The code in the question compiles for Java 21 and prints:

```text
25%
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

To record: `"digest": "sha256:ccc0d3d7e6cf41fcabc6526ff72e3731a61acdec7a23047da01ce3e390792a64"`, `"verified": "sha256:72da55d317fd997b93138b8646a2238e806a4c4566d1e854277b5a583d8aef23"`

**Comments:**

&nbsp;

## 148. t10-resource-bundle-fallback

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

## 149. t10-resourcebundle-missing-key

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

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
present=a value
missing=MissingResourceException
containsKey=false
```

That program, in one file:

`Main.java`:

```java
import java.util.ListResourceBundle;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

public class Main {

  public static class Messages extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
      return new Object[][] {{"present", "a value"}};
    }
  }

  public static void main(String[] args) {
    ResourceBundle bundle = new Messages();
    System.out.println("present=" + bundle.getString("present"));
    try {
      bundle.getString("missing");
      System.out.println("missing=none");
    } catch (MissingResourceException e) {
      System.out.println("missing=" + e.getClass().getSimpleName());
    }
    // containsKey is the way to ask without the exception.
    System.out.println("containsKey=" + bundle.containsKey("missing"));
  }
}
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

To record: `"digest": "sha256:75d80ee81a1b01cda2b9202a9e43bf4a84ebfc1d2021e4438722201546ae9803"`, `"verified": "sha256:917956b3fc18810b8cbe30669a2be82ff1b3ef85d7b17c9107191f833464560c"`

**Comments:**

&nbsp;

## 150. t10-resourcebundle-parent-lookup

**Topic:** Implementing localization (exam objective: "Implementing localization")  
**Type:** single choice · **Difficulty:** medium · **Java release:** 21

### As the learner sees it

> A resolved `ResourceBundle` does not define key `title` itself, but its parent bundle does. What does `bundle.getString("title")` do?

- **A** It returns the parent's value for title.
- **B** It always throws MissingResourceException immediately.
- **C** It returns null without checking the parent.
- **D** It creates the key in the child bundle.

### Answer key and reasons

- **A: correct.** Missing keys are looked up through the parent chain.
- **B: incorrect.** The exception occurs only after the key cannot be found through the relevant bundle chain.
- **C: incorrect.** ResourceBundle lookup supports parent fallback.
- **D: incorrect.** Lookup does not mutate resource bundles.

### Explanation

ResourceBundle lookup checks the bundle and, when necessary, its parent chain. If the parent defines the key, that value is returned.

### Why this difficulty

Tests hierarchical ResourceBundle lookup rather than assuming only the most specific bundle is consulted.

### References

- [ResourceBundle (Java SE 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ResourceBundle.html)

### Verified by the build

A program the learner does not see backs this question. It compiles for Java 21 and prints:

```text
fromParent=from the parent
childOverrides=child value
keySetIncludesParent=true
```

That program, in one file:

`Main.java`:

```java
import java.util.ListResourceBundle;
import java.util.ResourceBundle;

public class Main {

  public static class Parent extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
      return new Object[][] {{"title", "from the parent"}, {"shared", "parent value"}};
    }
  }

  public static class Child extends ListResourceBundle {
    Child(ResourceBundle parent) {
      setParent(parent);
    }

    @Override
    protected Object[][] getContents() {
      return new Object[][] {{"shared", "child value"}};
    }
  }

  public static void main(String[] args) {
    ResourceBundle bundle = new Child(new Parent());
    // Not defined here, so the lookup continues into the parent.
    System.out.println("fromParent=" + bundle.getString("title"));
    // Defined here, so the child wins.
    System.out.println("childOverrides=" + bundle.getString("shared"));
    System.out.println("keySetIncludesParent=" + bundle.keySet().contains("title"));
  }
}
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

To record: `"digest": "sha256:9183a5dace306d729fbeabaef26c1f80a4aa02ef2b777fdc6a573de6bbbdb78b"`, `"verified": "sha256:0513944940b00223f5575658b8c97c1507f199a59a7d312b0eeee8d3198951e8"`

**Comments:**

&nbsp;

## Summary of the review

| # | Question | Verdict | Reviewer | Date |
|---:|---|---|---|---|
| 1 | `t01-bigdecimal-equals-scale` |  |  |  |
| 2 | `t01-bigdecimal-nonterminating-divide` |  |  |  |
| 3 | `t01-bigdecimal-striptrailingzeros-scale` |  |  |  |
| 4 | `t01-boolean-parseboolean` |  |  |  |
| 5 | `t01-integer-boxing-guarantee` | approved | vinicius-ssantos | 2026-10-02 |
| 6 | `t01-integer-division-assignment` |  |  |  |
| 7 | `t01-localdate-invalid-withday` |  |  |  |
| 8 | `t01-localdate-plus-months` | approved | vinicius-ssantos | 2026-10-02 |
| 9 | `t01-localdate-plus-years-leap-day` |  |  |  |
| 10 | `t01-math-round-negative` |  |  |  |
| 11 | `t01-numeric-promotion-byte-addition` |  |  |  |
| 12 | `t01-period-vs-duration` |  |  |  |
| 13 | `t01-string-repeat` |  |  |  |
| 14 | `t01-string-strip-vs-trim` |  |  |  |
| 15 | `t01-stringbuilder-reverse-chain` |  |  |  |
| 16 | `t02-case-null-pattern-switch` |  |  |  |
| 17 | `t02-continue-for-update` |  |  |  |
| 18 | `t02-dangling-else` |  |  |  |
| 19 | `t02-do-while-first-execution` |  |  |  |
| 20 | `t02-enhanced-for-variable-assignment` |  |  |  |
| 21 | `t02-for-update-order` |  |  |  |
| 22 | `t02-labeled-break-count` |  |  |  |
| 23 | `t02-labeled-continue` |  |  |  |
| 24 | `t02-pattern-switch-guard` | approved | vinicius-ssantos | 2026-10-02 |
| 25 | `t02-pattern-variable-and-scope` |  |  |  |
| 26 | `t02-switch-dominance` | approved | vinicius-ssantos | 2026-10-02 |
| 27 | `t02-switch-expression-exhaustive` |  |  |  |
| 28 | `t02-switch-null-default-combination` |  |  |  |
| 29 | `t02-switch-rule-no-fallthrough` |  |  |  |
| 30 | `t02-switch-yield-block` |  |  |  |
| 31 | `t03-class-method-beats-default` |  |  |  |
| 32 | `t03-constructor-order-super-first` |  |  |  |
| 33 | `t03-covariant-return` |  |  |  |
| 34 | `t03-default-method-conflict` |  |  |  |
| 35 | `t03-enum-constructor-access` |  |  |  |
| 36 | `t03-generic-erasure-overload` |  |  |  |
| 37 | `t03-overload-most-specific` |  |  |  |
| 38 | `t03-overload-null` | approved | vinicius-ssantos | 2026-10-02 |
| 39 | `t03-private-interface-method` |  |  |  |
| 40 | `t03-record-compact-normalization` |  |  |  |
| 41 | `t03-record-components-members` |  |  |  |
| 42 | `t03-record-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 43 | `t03-record-pattern-destructuring` |  |  |  |
| 44 | `t03-sealed-direct-subclass-modifier` |  |  |  |
| 45 | `t03-static-method-hiding` |  |  |  |
| 46 | `t04-autocloseable-close-contract` |  |  |  |
| 47 | `t04-catch-order-unreachable` |  |  |  |
| 48 | `t04-finally-abrupt-completion` |  |  |  |
| 49 | `t04-finally-return` | approved | vinicius-ssantos | 2026-10-02 |
| 50 | `t04-finally-return-overrides` |  |  |  |
| 51 | `t04-multicatch-parameter-reassignment` |  |  |  |
| 52 | `t04-multicatch-related-types` |  |  |  |
| 53 | `t04-overriding-checked-exception` |  |  |  |
| 54 | `t04-precise-rethrow` |  |  |  |
| 55 | `t04-suppressed-exception` |  |  |  |
| 56 | `t04-suppressed-order-multiple-resources` |  |  |  |
| 57 | `t04-throw-null` |  |  |  |
| 58 | `t04-try-resource-effectively-final` |  |  |  |
| 59 | `t04-try-with-resources-order` | approved | vinicius-ssantos | 2026-10-02 |
| 60 | `t04-unchecked-exception-classes` |  |  |  |
| 61 | `t05-arrays-aslist-backed` |  |  |  |
| 62 | `t05-arrays-binarysearch-insertion-point` |  |  |  |
| 63 | `t05-generic-invariance` |  |  |  |
| 64 | `t05-immutable-and-fixed-size-lists` | approved | vinicius-ssantos | 2026-10-02 |
| 65 | `t05-list-first-last` |  |  |  |
| 66 | `t05-list-remove-overload` | approved | vinicius-ssantos | 2026-10-02 |
| 67 | `t05-map-merge-null-removes` |  |  |  |
| 68 | `t05-map-of-null-rejection` |  |  |  |
| 69 | `t05-sequenced-collection-reversed` |  |  |  |
| 70 | `t05-sequencedmap-first-entry` |  |  |  |
| 71 | `t05-set-of-duplicate-elements` |  |  |  |
| 72 | `t05-treeset-comparator-uniqueness` |  |  |  |
| 73 | `t05-unmodifiable-list-view` |  |  |  |
| 74 | `t05-wildcard-extends-read` |  |  |  |
| 75 | `t05-wildcard-super-integer` |  |  |  |
| 76 | `t06-collectors-tomap-duplicate-key` |  |  |  |
| 77 | `t06-findfirst-ordered-stream` |  |  |  |
| 78 | `t06-flatmap-flatten` |  |  |  |
| 79 | `t06-functional-interface-extra-methods` |  |  |  |
| 80 | `t06-generate-limit-count` |  |  |  |
| 81 | `t06-intstream-average` |  |  |  |
| 82 | `t06-lambda-effectively-final` |  |  |  |
| 83 | `t06-lambda-this-enclosing-instance` |  |  |  |
| 84 | `t06-parallel-foreachordered` |  |  |  |
| 85 | `t06-reduce-empty-identity` |  |  |  |
| 86 | `t06-stream-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 87 | `t06-stream-laziness` | approved | vinicius-ssantos | 2026-10-02 |
| 88 | `t06-stream-single-use` |  |  |  |
| 89 | `t06-string-length-method-reference` |  |  |  |
| 90 | `t06-to-unmodifiable-list-null` |  |  |  |
| 91 | `t07-automatic-module-jar` |  |  |  |
| 92 | `t07-export-does-not-make-type-public` |  |  |  |
| 93 | `t07-exports-and-opens` | approved | vinicius-ssantos | 2026-10-02 |
| 94 | `t07-implicit-java-base` |  |  |  |
| 95 | `t07-import-wildcard-no-subpackages` |  |  |  |
| 96 | `t07-java-module-launch` |  |  |  |
| 97 | `t07-module-service-directives` |  |  |  |
| 98 | `t07-object-module-name` |  |  |  |
| 99 | `t07-open-module-semantics` |  |  |  |
| 100 | `t07-qualified-exports` |  |  |  |
| 101 | `t07-requires-static` |  |  |  |
| 102 | `t07-requires-transitive` | approved | vinicius-ssantos | 2026-10-02 |
| 103 | `t07-static-import-member` |  |  |  |
| 104 | `t07-unnamed-module-isnamed` |  |  |  |
| 105 | `t07-unnamed-package-import` |  |  |  |
| 106 | `t08-atomic-compare-and-set` |  |  |  |
| 107 | `t08-atomicinteger-update-and-get` |  |  |  |
| 108 | `t08-completablefuture-join-vs-get` |  |  |  |
| 109 | `t08-computeifabsent-null-result` |  |  |  |
| 110 | `t08-concurrenthashmap-null` |  |  |  |
| 111 | `t08-countdownlatch-count` |  |  |  |
| 112 | `t08-executor-close` | approved | vinicius-ssantos | 2026-10-02 |
| 113 | `t08-reentrantlock-finally` |  |  |  |
| 114 | `t08-start-virtual-thread` |  |  |  |
| 115 | `t08-synchronized-method-lock` |  |  |  |
| 116 | `t08-synchronized-reentrant` |  |  |  |
| 117 | `t08-thread-interrupted-clears` |  |  |  |
| 118 | `t08-virtual-thread-builder-unstarted` |  |  |  |
| 119 | `t08-virtual-thread-daemon` | approved | vinicius-ssantos | 2026-10-02 |
| 120 | `t08-volatile-increment` |  |  |  |
| 121 | `t09-bufferedreader-readline` |  |  |  |
| 122 | `t09-dataoutput-readutf` |  |  |  |
| 123 | `t09-files-copy-existing-target` |  |  |  |
| 124 | `t09-files-lines-close` |  |  |  |
| 125 | `t09-files-readstring-utf8` |  |  |  |
| 126 | `t09-files-walk-close` |  |  |  |
| 127 | `t09-path-normalize-namecount` |  |  |  |
| 128 | `t09-path-relativize` |  |  |  |
| 129 | `t09-path-resolve-absolute` |  |  |  |
| 130 | `t09-randomaccessfile-seek` |  |  |  |
| 131 | `t09-read-all-lines` | approved | vinicius-ssantos | 2026-10-02 |
| 132 | `t09-reader-vs-inputstream` |  |  |  |
| 133 | `t09-serialization-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 134 | `t09-serialization-serialversionuid` |  |  |  |
| 135 | `t09-serialization-transient-static` |  |  |  |
| 136 | `t10-collator-locale-sensitive` |  |  |  |
| 137 | `t10-collator-primary-strength` |  |  |  |
| 138 | `t10-currency-us-code` |  |  |  |
| 139 | `t10-datetimeformatter-locale-immutability` |  |  |  |
| 140 | `t10-locale-builder-language-tag` |  |  |  |
| 141 | `t10-locale-default-categories` |  |  |  |
| 142 | `t10-locale-language-tag` |  |  |  |
| 143 | `t10-locale-root` |  |  |  |
| 144 | `t10-locale-to-string` | approved | vinicius-ssantos | 2026-10-02 |
| 145 | `t10-messageformat-apostrophe` |  |  |  |
| 146 | `t10-numberformat-currency-instance` |  |  |  |
| 147 | `t10-percent-format-us` |  |  |  |
| 148 | `t10-resource-bundle-fallback` | approved | vinicius-ssantos | 2026-10-02 |
| 149 | `t10-resourcebundle-missing-key` |  |  |  |
| 150 | `t10-resourcebundle-parent-lookup` |  |  |  |


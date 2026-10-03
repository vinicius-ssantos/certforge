# AI technical review — Java SE 21 question pack

Date: 2026-10-02

Scope: the 130 Java SE 21 / 1Z0-830 questions that do not yet carry a human technical-review verdict in `content/java-se-21/review.json`.

## Result

**AI technical review result: PASS for all 130 questions after one non-semantic reference cleanup.**

No blocking defect was found in the reviewed prompts, marked answers, distractor explanations, Java 21 semantics, or cited API/specification claims. The only change made during this pass was to strengthen the references for `t03-generic-erasure-overload` by pointing directly to JLS 4.6 (Type Erasure) and JLS 8.4.9 (Overloading).

This document is evidence of an AI-assisted technical audit only. It **does not** constitute the human approval required by the CertForge content policy, and it intentionally does not modify `content/java-se-21/review.json` or mark the issue checklist as human-reviewed.

## What was checked

- one defensible interpretation of each prompt;
- answer correctness for Java 21;
- compilation/runtime behavior where code-backed questions are involved;
- no reliance on unspecified behavior in the question claim;
- plausible distractors and correct per-option explanations;
- consistency between the top-level explanation and marked answers;
- authoritative Java SE 21 / JLS / JDK references;
- coverage-sensitive cases including records, record patterns, sealed types, pattern switch, generics/erasure, streams, concurrency, JPMS, I/O, serialization, date/time, BigDecimal, and localization.

## Human-review handoff

A human reviewer should still read the generated review packet and record approved digests in `content/java-se-21/review.json`. This AI pass can be used to reduce the review burden: there are no known blocking technical defects left from this audit.

## Reviewed questions

### T01 — 13 questions

- `t01-bigdecimal-equals-scale` — AI_PASS
- `t01-bigdecimal-nonterminating-divide` — AI_PASS
- `t01-bigdecimal-striptrailingzeros-scale` — AI_PASS
- `t01-boolean-parseboolean` — AI_PASS
- `t01-integer-division-assignment` — AI_PASS
- `t01-localdate-invalid-withday` — AI_PASS
- `t01-localdate-plus-years-leap-day` — AI_PASS
- `t01-math-round-negative` — AI_PASS
- `t01-numeric-promotion-byte-addition` — AI_PASS
- `t01-period-vs-duration` — AI_PASS
- `t01-string-repeat` — AI_PASS
- `t01-string-strip-vs-trim` — AI_PASS
- `t01-stringbuilder-reverse-chain` — AI_PASS

### T02 — 13 questions

- `t02-case-null-pattern-switch` — AI_PASS
- `t02-continue-for-update` — AI_PASS
- `t02-dangling-else` — AI_PASS
- `t02-do-while-first-execution` — AI_PASS
- `t02-enhanced-for-variable-assignment` — AI_PASS
- `t02-for-update-order` — AI_PASS
- `t02-labeled-break-count` — AI_PASS
- `t02-labeled-continue` — AI_PASS
- `t02-pattern-variable-and-scope` — AI_PASS
- `t02-switch-expression-exhaustive` — AI_PASS
- `t02-switch-null-default-combination` — AI_PASS
- `t02-switch-rule-no-fallthrough` — AI_PASS
- `t02-switch-yield-block` — AI_PASS

### T03 — 13 questions

- `t03-class-method-beats-default` — AI_PASS
- `t03-constructor-order-super-first` — AI_PASS
- `t03-covariant-return` — AI_PASS
- `t03-default-method-conflict` — AI_PASS
- `t03-enum-constructor-access` — AI_PASS
- `t03-generic-erasure-overload` — AI_PASS
- `t03-overload-most-specific` — AI_PASS
- `t03-private-interface-method` — AI_PASS
- `t03-record-compact-normalization` — AI_PASS
- `t03-record-components-members` — AI_PASS
- `t03-record-pattern-destructuring` — AI_PASS
- `t03-sealed-direct-subclass-modifier` — AI_PASS
- `t03-static-method-hiding` — AI_PASS

### T04 — 13 questions

- `t04-autocloseable-close-contract` — AI_PASS
- `t04-catch-order-unreachable` — AI_PASS
- `t04-finally-abrupt-completion` — AI_PASS
- `t04-finally-return-overrides` — AI_PASS
- `t04-multicatch-parameter-reassignment` — AI_PASS
- `t04-multicatch-related-types` — AI_PASS
- `t04-overriding-checked-exception` — AI_PASS
- `t04-precise-rethrow` — AI_PASS
- `t04-suppressed-exception` — AI_PASS
- `t04-suppressed-order-multiple-resources` — AI_PASS
- `t04-throw-null` — AI_PASS
- `t04-try-resource-effectively-final` — AI_PASS
- `t04-unchecked-exception-classes` — AI_PASS

### T05 — 13 questions

- `t05-arrays-aslist-backed` — AI_PASS
- `t05-arrays-binarysearch-insertion-point` — AI_PASS
- `t05-generic-invariance` — AI_PASS
- `t05-list-first-last` — AI_PASS
- `t05-map-merge-null-removes` — AI_PASS
- `t05-map-of-null-rejection` — AI_PASS
- `t05-sequenced-collection-reversed` — AI_PASS
- `t05-sequencedmap-first-entry` — AI_PASS
- `t05-set-of-duplicate-elements` — AI_PASS
- `t05-treeset-comparator-uniqueness` — AI_PASS
- `t05-unmodifiable-list-view` — AI_PASS
- `t05-wildcard-extends-read` — AI_PASS
- `t05-wildcard-super-integer` — AI_PASS

### T06 — 13 questions

- `t06-collectors-tomap-duplicate-key` — AI_PASS
- `t06-findfirst-ordered-stream` — AI_PASS
- `t06-flatmap-flatten` — AI_PASS
- `t06-functional-interface-extra-methods` — AI_PASS
- `t06-generate-limit-count` — AI_PASS
- `t06-intstream-average` — AI_PASS
- `t06-lambda-effectively-final` — AI_PASS
- `t06-lambda-this-enclosing-instance` — AI_PASS
- `t06-parallel-foreachordered` — AI_PASS
- `t06-reduce-empty-identity` — AI_PASS
- `t06-stream-single-use` — AI_PASS
- `t06-string-length-method-reference` — AI_PASS
- `t06-to-unmodifiable-list-null` — AI_PASS

### T07 — 13 questions

- `t07-automatic-module-jar` — AI_PASS
- `t07-export-does-not-make-type-public` — AI_PASS
- `t07-implicit-java-base` — AI_PASS
- `t07-import-wildcard-no-subpackages` — AI_PASS
- `t07-java-module-launch` — AI_PASS
- `t07-module-service-directives` — AI_PASS
- `t07-object-module-name` — AI_PASS
- `t07-open-module-semantics` — AI_PASS
- `t07-qualified-exports` — AI_PASS
- `t07-requires-static` — AI_PASS
- `t07-static-import-member` — AI_PASS
- `t07-unnamed-module-isnamed` — AI_PASS
- `t07-unnamed-package-import` — AI_PASS

### T08 — 13 questions

- `t08-atomic-compare-and-set` — AI_PASS
- `t08-atomicinteger-update-and-get` — AI_PASS
- `t08-completablefuture-join-vs-get` — AI_PASS
- `t08-computeifabsent-null-result` — AI_PASS
- `t08-concurrenthashmap-null` — AI_PASS
- `t08-countdownlatch-count` — AI_PASS
- `t08-reentrantlock-finally` — AI_PASS
- `t08-start-virtual-thread` — AI_PASS
- `t08-synchronized-method-lock` — AI_PASS
- `t08-synchronized-reentrant` — AI_PASS
- `t08-thread-interrupted-clears` — AI_PASS
- `t08-virtual-thread-builder-unstarted` — AI_PASS
- `t08-volatile-increment` — AI_PASS

### T09 — 13 questions

- `t09-bufferedreader-readline` — AI_PASS
- `t09-dataoutput-readutf` — AI_PASS
- `t09-files-copy-existing-target` — AI_PASS
- `t09-files-lines-close` — AI_PASS
- `t09-files-readstring-utf8` — AI_PASS
- `t09-files-walk-close` — AI_PASS
- `t09-path-normalize-namecount` — AI_PASS
- `t09-path-relativize` — AI_PASS
- `t09-path-resolve-absolute` — AI_PASS
- `t09-randomaccessfile-seek` — AI_PASS
- `t09-reader-vs-inputstream` — AI_PASS
- `t09-serialization-serialversionuid` — AI_PASS
- `t09-serialization-transient-static` — AI_PASS

### T10 — 13 questions

- `t10-collator-locale-sensitive` — AI_PASS
- `t10-collator-primary-strength` — AI_PASS
- `t10-currency-us-code` — AI_PASS
- `t10-datetimeformatter-locale-immutability` — AI_PASS
- `t10-locale-builder-language-tag` — AI_PASS
- `t10-locale-default-categories` — AI_PASS
- `t10-locale-language-tag` — AI_PASS
- `t10-locale-root` — AI_PASS
- `t10-messageformat-apostrophe` — AI_PASS
- `t10-numberformat-currency-instance` — AI_PASS
- `t10-percent-format-us` — AI_PASS
- `t10-resourcebundle-missing-key` — AI_PASS
- `t10-resourcebundle-parent-lookup` — AI_PASS


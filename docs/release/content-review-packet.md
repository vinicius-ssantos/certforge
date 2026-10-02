# Content review packet

Generated from `content/java-se-21` by `content/build-review-packet.mjs`. **Do not edit by hand**: regenerate it, and make changes in the pack. Verdicts live in `content/java-se-21/review.json`.

**All 20 questions were reviewed by vinicius-ssantos (project owner and maintainer) on 2026-10-02, and none has been edited since.** The reviewer read the generated packet question by question — prompt with its code, options, answer key, the reason given for each option, the explanation, the difficulty rationale and the references — and reported no technical errors in any of the twenty.

The build checks that every code snippet compiles for Java 21 and prints what the question says (the "Verified by the build" lines), and that an option carrying that output is the one marked correct. It cannot judge wording, ambiguity, the quality of the explanations or whether the question tests the exam objective. That is what a human review is for.

## What this review does not establish

- The questions are AI-assisted drafts written in this repository, and the reviewer is the project owner rather than an independent third party. The content policy allows exactly this, but a second reviewer would be stronger evidence.
- The reviewer reported no errors rather than ticking each of the seven policy checks per question, so this record claims a verdict, not a per-check audit.
- A question with no runnable code rests entirely on this review and its references, because the build verifies nothing about it. The packet lists which ones those are, as it stands.
- The exam objective wording seeded in the catalog was not part of this review of the questions. It was checked separately against Oracle's page, in a browser on 2026-10-02, and matched.
- Nothing is verified by the build in 3 of the 20 questions: `t01-integer-boxing-guarantee`, `t06-stream-facts`, `t07-exports-and-opens`.

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
| 1 | [`t01-integer-boxing-guarantee`](#1-t01-integer-boxing-guarantee) | Date, time, text, numeric and boolean values | single | medium | no (conceptual) | reviewed 2026-10-02 |
| 2 | [`t01-localdate-plus-months`](#2-t01-localdate-plus-months) | Date, time, text, numeric and boolean values | single | medium | yes, shown | reviewed 2026-10-02 |
| 3 | [`t02-pattern-switch-guard`](#3-t02-pattern-switch-guard) | Controlling program flow | single | medium | yes, shown | reviewed 2026-10-02 |
| 4 | [`t02-switch-dominance`](#4-t02-switch-dominance) | Controlling program flow | single | hard | yes, shown | reviewed 2026-10-02 |
| 5 | [`t03-overload-null`](#5-t03-overload-null) | Object-oriented concepts in Java | single | medium | yes, shown | reviewed 2026-10-02 |
| 6 | [`t03-record-facts`](#6-t03-record-facts) | Object-oriented concepts in Java | multiple | medium | yes, not shown | reviewed 2026-10-02 |
| 7 | [`t04-finally-return`](#7-t04-finally-return) | Handling exceptions | single | easy | yes, shown | reviewed 2026-10-02 |
| 8 | [`t04-try-with-resources-order`](#8-t04-try-with-resources-order) | Handling exceptions | single | medium | yes, shown | reviewed 2026-10-02 |
| 9 | [`t05-immutable-and-fixed-size-lists`](#9-t05-immutable-and-fixed-size-lists) | Arrays and collections | single | medium | yes, shown | reviewed 2026-10-02 |
| 10 | [`t05-list-remove-overload`](#10-t05-list-remove-overload) | Arrays and collections | single | medium | yes, shown | reviewed 2026-10-02 |
| 11 | [`t06-stream-facts`](#11-t06-stream-facts) | Streams and lambda expressions | multiple | medium | no (conceptual) | reviewed 2026-10-02 |
| 12 | [`t06-stream-laziness`](#12-t06-stream-laziness) | Streams and lambda expressions | single | hard | yes, shown | reviewed 2026-10-02 |
| 13 | [`t07-exports-and-opens`](#13-t07-exports-and-opens) | Packaging, deploying and the Java Platform Module System | multiple | hard | no (conceptual) | reviewed 2026-10-02 |
| 14 | [`t07-requires-transitive`](#14-t07-requires-transitive) | Packaging, deploying and the Java Platform Module System | single | medium | yes, not shown | reviewed 2026-10-02 |
| 15 | [`t08-executor-close`](#15-t08-executor-close) | Managing concurrent code execution | single | medium | yes, shown | reviewed 2026-10-02 |
| 16 | [`t08-virtual-thread-daemon`](#16-t08-virtual-thread-daemon) | Managing concurrent code execution | single | medium | yes, not shown | reviewed 2026-10-02 |
| 17 | [`t09-read-all-lines`](#17-t09-read-all-lines) | Java I/O API | single | medium | yes, shown | reviewed 2026-10-02 |
| 18 | [`t09-serialization-facts`](#18-t09-serialization-facts) | Java I/O API | multiple | hard | yes, not shown | reviewed 2026-10-02 |
| 19 | [`t10-locale-to-string`](#19-t10-locale-to-string) | Implementing localization | single | easy | yes, shown | reviewed 2026-10-02 |
| 20 | [`t10-resource-bundle-fallback`](#20-t10-resource-bundle-fallback) | Implementing localization | single | hard | yes, shown | reviewed 2026-10-02 |

## 1. t01-integer-boxing-guarantee

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

## 2. t01-localdate-plus-months

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

## 3. t02-pattern-switch-guard

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

## 4. t02-switch-dominance

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

## 5. t03-overload-null

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

## 6. t03-record-facts

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

## 7. t04-finally-return

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

## 8. t04-try-with-resources-order

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

## 9. t05-immutable-and-fixed-size-lists

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

## 10. t05-list-remove-overload

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

## 11. t06-stream-facts

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

## 12. t06-stream-laziness

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

## 13. t07-exports-and-opens

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

## 14. t07-requires-transitive

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

## 15. t08-executor-close

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

## 16. t08-virtual-thread-daemon

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

## 17. t09-read-all-lines

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

## 18. t09-serialization-facts

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

## 19. t10-locale-to-string

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

## 20. t10-resource-bundle-fallback

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

## Summary of the review

| # | Question | Verdict | Reviewer | Date |
|---:|---|---|---|---|
| 1 | `t01-integer-boxing-guarantee` | approved | vinicius-ssantos | 2026-10-02 |
| 2 | `t01-localdate-plus-months` | approved | vinicius-ssantos | 2026-10-02 |
| 3 | `t02-pattern-switch-guard` | approved | vinicius-ssantos | 2026-10-02 |
| 4 | `t02-switch-dominance` | approved | vinicius-ssantos | 2026-10-02 |
| 5 | `t03-overload-null` | approved | vinicius-ssantos | 2026-10-02 |
| 6 | `t03-record-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 7 | `t04-finally-return` | approved | vinicius-ssantos | 2026-10-02 |
| 8 | `t04-try-with-resources-order` | approved | vinicius-ssantos | 2026-10-02 |
| 9 | `t05-immutable-and-fixed-size-lists` | approved | vinicius-ssantos | 2026-10-02 |
| 10 | `t05-list-remove-overload` | approved | vinicius-ssantos | 2026-10-02 |
| 11 | `t06-stream-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 12 | `t06-stream-laziness` | approved | vinicius-ssantos | 2026-10-02 |
| 13 | `t07-exports-and-opens` | approved | vinicius-ssantos | 2026-10-02 |
| 14 | `t07-requires-transitive` | approved | vinicius-ssantos | 2026-10-02 |
| 15 | `t08-executor-close` | approved | vinicius-ssantos | 2026-10-02 |
| 16 | `t08-virtual-thread-daemon` | approved | vinicius-ssantos | 2026-10-02 |
| 17 | `t09-read-all-lines` | approved | vinicius-ssantos | 2026-10-02 |
| 18 | `t09-serialization-facts` | approved | vinicius-ssantos | 2026-10-02 |
| 19 | `t10-locale-to-string` | approved | vinicius-ssantos | 2026-10-02 |
| 20 | `t10-resource-bundle-fallback` | approved | vinicius-ssantos | 2026-10-02 |


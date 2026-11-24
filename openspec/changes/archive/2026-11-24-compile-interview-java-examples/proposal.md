## Why

During genuine editorial review for #392, two existing Java backend interview questions presented statements at the top level after class definitions, preventing the code fences from compiling as complete Java 21 programs even though the intended conceptual outputs are right.

## What Changes

Turn `iv150-class-vs-object` and `iv150-overriding-vs-overloading` into complete compilable Java 21 programs by adding main methods. Preserve correct answers C and A and all conceptual explanations.

## Impact

Two question prompts and this OpenSpec change. Neither question receives an AI review record until genuine verification after the source corrections. `java-backend-interview` stays DRAFT, without deploy.

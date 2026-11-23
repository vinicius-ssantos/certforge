## Source correction

- `Counter.java`: move per-instance increment operations and output into `public static void main(String[] args)` inside `Counter`.
- `OverloadDemo.java`: put invocation statements in a public main class; leave Printer/SpecialPrinter and override/overload behavior intact.
- Verify with `javac --release 21` and `java`: expected outputs `2 1` and `Special: hello`. The original snippets produced compilation errors as ordinary compilation units.
- Preserve one correct answer per question, existing distractors, explanations and references.
- Keep `review.json` and pack DRAFT untouched pending a subsequent truthful V2 digest-matched review.

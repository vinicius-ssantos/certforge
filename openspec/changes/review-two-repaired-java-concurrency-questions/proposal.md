## Why

Issue #392 tracks individual source-bound reviews of the 208-question Java backend interview pack. Two questions were found to have ambiguous scenarios and corrected in PR #448, which passed eight CI/CodeQL checks and was integrated as `4b59aa97`. Those source corrections deliberately recorded no editorial verdict. The exact repaired sources are now independently ready for technical AI reviewer decisions.

## What Changes

- Review `iv286-mutable-key-breaks-hashmap-lookup` against first-party Oracle Java SE 21 `Map`, `HashMap` and `Object.hashCode` APIs; answer **C**. The corrected prompt specifies that mutating the key selects a different hash bucket with no table resize.
- Review `iv286-double-checked-locking-without-volatile` against the Oracle JLS §17.4/§17.5 and JSR-133 expert group declaration; answer **C**. The corrected prompt fixes Helper to an ordinary non-final field assigned in the constructor, so unsafe publication may expose a default value.
- Record **two** new source-bound V2-digest `AI_APPROVED` entries with truthful `ai-reviewer` attribution. Preserve every existing decision and leave the package DRAFT.

## Impact

Only `content/java-backend-interview/review.json` and this OpenSpec change. If merged, recorded review count increases from **38 to 40** of 208 (168 pending). No question source edits, automatic publication, fabricated human sign-off or deploy.

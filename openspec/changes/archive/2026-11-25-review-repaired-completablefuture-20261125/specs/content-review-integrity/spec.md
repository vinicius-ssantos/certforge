## ADDED Requirements

### Requirement: CompletableFuture source repair receives an independent correct-version review

An interview question with a corrected Java concurrency explanation SHALL receive a review verdict only after its exact merged source, all distractors and primary reference are rechecked. The review SHALL use a V2 source-bound digest and the actual `ai-reviewer` identity, and SHALL NOT approve a separate still-ambiguous question merely because that question received an earlier correction.

#### Scenario: Review repaired CompletableFuture without approving ambiguous Mockito spy
- **WHEN** `iv286-completablefuture-async-thread` receives an independently verified AI verdict after PR #457
- **THEN** its uniquely correct answer remains D and its V2 digest matches the exact corrected source
- **AND** all 53 existing review entries remain unchanged and the new reviewer is `ai-reviewer`
- **AND** `iv155-mock-stub-fake-spy` remains without a review verdict pending a new source correction
- **AND** issue #392 remains open and the interview pack stays DRAFT, without human acceptance, deployment or publication.

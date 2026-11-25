## ADDED Requirements

### Requirement: Post-correction Java concurrency and Mockito reviews bind verdicts to exact merged sources

A Java interview question whose answer/explanations required repair SHALL receive no editorial approval from the repair PR. An AI-reviewer approval SHALL independently check the exact merged question source, four alternatives, distractor explanations, rationale and authoritative reference, with current V2 SHA-256 digest and truthful `ai-reviewer` attribution. Incomplete interview packs SHALL remain DRAFT.

#### Scenario: Independently review corrected CompletableFuture and Mockito questions
- **WHEN** `iv286-completablefuture-async-thread` and `iv155-mock-stub-fake-spy` receive separate post-repair source-bound AI review verdicts
- **THEN** both unique correct answer keys remain D and D, respectively
- **AND** the two digests match the exact merged `question.json` sources after PRs #457 and #458
- **AND** all 53 prior review entries remain unchanged, with `ai-reviewer` recorded for the two new decisions
- **AND** issue #392 remains open and `editorialStatus` remains DRAFT, without deployment, publication or fabricated human sign-off.

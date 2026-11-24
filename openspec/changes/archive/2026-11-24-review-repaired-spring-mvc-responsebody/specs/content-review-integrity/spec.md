## ADDED Requirements

### Requirement: Corrected Spring MVC response-body questions receive independent source-bound review
A Spring MVC interview question corrected after an inaccurate Jackson annotation
explanation SHALL receive a fresh technical review of the complete corrected
source before recording an AI-approved V2 digest. A reviewer SHALL distinguish
Spring MVC response-body routing from JSON property metadata and SHALL disclose
ai-reviewer as the actual reviewer, not imply owner/human acceptance.

#### Scenario: Review the corrected @Controller DTO question
- **WHEN** `iv288-restcontroller-vs-controller-responsebody` is independently reviewed after its source correction is merged
- **THEN** the uniquely correct key remains A: applying `@ResponseBody` writes the DTO via a message converter
- **AND** wrong-option B accurately explains why `@JsonProperty` cannot enable Spring MVC response-body handling
- **AND** the recorded V2 SHA-256 digest matches the complete current post-repair question source
- **AND** all earlier 46 review decisions stay unchanged and the interview pack remains DRAFT without publication.

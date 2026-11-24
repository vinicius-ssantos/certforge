## ADDED Requirements

### Requirement: Spring MVC distractors distinguish Jackson metadata from response-body routing
An interview question that diagnoses a controller's unresolved view SHALL
distinguish the effect of Spring MVC `@ResponseBody` from Jackson
`@JsonProperty` property metadata. Wrong-option explanations SHALL not
falsely claim `@JsonProperty` only renames JSON fields; instead they SHALL
accurately describe its property-discovery/access uses and explain why
Jackson annotations do not enable HTTP response-body handling.

#### Scenario: Explain an @Controller method returning a DTO
- **WHEN** a `@Controller` handler without `@ResponseBody` returns a DTO and view resolution fails
- **THEN** the correct solution remains to add `@ResponseBody` (answer A)
- **AND** option B's rationale explains that `@JsonProperty` cannot select Spring MVC response-body handling
- **AND** authoritative versioned Jackson and official Spring MVC references support the corrected claim
- **AND** the repaired question remains unapproved until its new exact source digest receives separate review.

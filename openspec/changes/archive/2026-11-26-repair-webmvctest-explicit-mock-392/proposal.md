## Why

`iv288-springboottest-vs-webmvctest-slice` correctly recommends a web-slice test, but it implies that required service/repository collaborators are automatically mocked by `@WebMvcTest`. Official Spring Boot documentation says `@WebMvcTest` is commonly combined with explicitly declared `@MockitoBean` mocks for controller collaborators.

## What changes

Preserve answer D and the `@WebMvcTest(MyController.class)` selection. Make explicit that `@WebMvcTest` provides selected Spring MVC components and `MockMvc`, while required collaborator beans must be supplied by the test (for example `@MockitoBean`), not auto-mocked by the slice. Reference official Spring Boot and Spring Framework test documentation.

## Impact

One source correction, no V2 editorial verdict. `review.json` and `pack.json` must remain unchanged; package stays `DRAFT`. No deploy or publication. After source merge, evaluate exact merged question in a separate V2 review PR.

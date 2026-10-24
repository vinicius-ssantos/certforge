package dev.certforge.study.internal;

import dev.certforge.study.internal.BlueprintViews.BlueprintView;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Job-description blueprints: a learner's own reading of a role, weighing the canonical taxonomy
 * without changing it.
 */
@RestController
@RequestMapping("/api/study/interviews/blueprints")
@PreAuthorize("hasAuthority('STUDY')")
class BlueprintController {

  private final BlueprintService service;

  BlueprintController(BlueprintService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  BlueprintView create(@Valid @RequestBody CreateRequest request) {
    return service.create(
        request.trackSlug(),
        request.jobTitle(),
        request.sourceText(),
        request.requirements(),
        request.weights());
  }

  @GetMapping
  List<BlueprintView> list() {
    return service.list();
  }

  @GetMapping("/{blueprintId}")
  BlueprintView get(@PathVariable UUID blueprintId) {
    return service.get(blueprintId);
  }

  /**
   * {@code sourceText} is the advert as pasted, kept verbatim. {@code requirements} is the list a
   * learner confirmed or typed themselves, and anything in it the dictionary does not recognise
   * comes back named rather than dropped. {@code weights} is the learner overriding a topic, which
   * is recorded as theirs and never attributed to the description.
   */
  record CreateRequest(
      @NotBlank @Size(max = 100) String trackSlug,
      @Size(max = 200) String jobTitle,
      @Size(max = 20000) String sourceText,
      @Size(max = 50) List<@NotBlank @Size(max = 300) String> requirements,
      @Size(max = 30) Map<UUID, Integer> weights) {}
}

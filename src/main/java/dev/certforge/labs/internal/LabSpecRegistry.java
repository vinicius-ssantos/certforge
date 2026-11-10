package dev.certforge.labs.internal;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.certforge.labs.LabCatalog;
import dev.certforge.labs.LabSpec;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

/**
 * The shipped lab catalog, loaded and validated once, eagerly, at construction.
 *
 * <p>A {@link LabSpec} that fails {@link LabSpecValidator} must not load silently -- "the lab does
 * not ship" (ADR 0027) means failing here, at boot, not merely in a test someone might forget to
 * run. {@code new LabSpecRegistry()} needs no Spring context, so the same code path is exercised by
 * a plain unit test and by every real application boot.
 */
@Component
class LabSpecRegistry implements LabCatalog {

  private static final String DEFAULT_PATTERN = "classpath*:labs/specs/*.json";

  private final Map<String, LabSpec> byLabId;

  LabSpecRegistry() {
    this(DEFAULT_PATTERN, new FixtureBundles());
  }

  LabSpecRegistry(String classpathPattern, FixtureBundles fixtureBundles) {
    List<String> problems = new ArrayList<>();
    Map<String, LabSpec> loaded = new LinkedHashMap<>();
    ObjectMapper mapper = new ObjectMapper();

    for (Resource resource : readResources(classpathPattern, problems)) {
      LabSpec spec = readSpec(resource, mapper, problems);
      if (spec == null) {
        continue;
      }
      List<String> violations = LabSpecValidator.violations(spec, fixtureBundles::exists);
      if (!violations.isEmpty()) {
        problems.add(describe(resource, spec) + ": " + violations);
        continue;
      }
      if (loaded.containsKey(spec.labId())) {
        problems.add("duplicate lab_id across specs: " + spec.labId());
        continue;
      }
      loaded.put(spec.labId(), spec);
    }

    if (loaded.isEmpty() && problems.isEmpty()) {
      problems.add("no lab specs found matching " + classpathPattern);
    }
    if (!problems.isEmpty()) {
      throw new IllegalStateException("Invalid lab catalog: " + problems);
    }
    this.byLabId = new TreeMap<>(loaded);
  }

  @Override
  public List<LabSpec> all() {
    return List.copyOf(byLabId.values());
  }

  @Override
  public Optional<LabSpec> findByLabId(String labId) {
    return Optional.ofNullable(byLabId.get(labId));
  }

  private static Resource[] readResources(String pattern, List<String> problems) {
    try {
      return new PathMatchingResourcePatternResolver().getResources(pattern);
    } catch (IOException e) {
      problems.add("could not list lab specs at " + pattern + ": " + e.getMessage());
      return new Resource[0];
    }
  }

  private static LabSpec readSpec(Resource resource, ObjectMapper mapper, List<String> problems) {
    try (InputStream stream = resource.getInputStream()) {
      return mapper.readValue(stream, LabSpec.class);
    } catch (IOException e) {
      problems.add("unreadable lab spec " + describe(resource) + ": " + e.getMessage());
      return null;
    }
  }

  private static String describe(Resource resource, LabSpec spec) {
    return describe(resource) + " (labId=" + spec.labId() + ")";
  }

  private static String describe(Resource resource) {
    return resource.getFilename() != null ? resource.getFilename() : resource.toString();
  }
}

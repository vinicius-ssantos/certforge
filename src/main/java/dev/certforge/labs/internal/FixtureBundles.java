package dev.certforge.labs.internal;

import java.io.IOException;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

/**
 * Whether a named fixture bundle exists on the classpath under {@code labs/fixtures/}. Works
 * identically whether the classpath is exploded (tests, {@code spring-boot:run}) or packaged into a
 * jar, which a bare directory-resource check would not.
 */
final class FixtureBundles {

  private final PathMatchingResourcePatternResolver resolver;

  FixtureBundles() {
    this(new PathMatchingResourcePatternResolver());
  }

  FixtureBundles(PathMatchingResourcePatternResolver resolver) {
    this.resolver = resolver;
  }

  boolean exists(String bundleName) {
    try {
      return resolver.getResources("classpath*:labs/fixtures/" + bundleName + "/*").length > 0;
    } catch (IOException e) {
      return false;
    }
  }
}

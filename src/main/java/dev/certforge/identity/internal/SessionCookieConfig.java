package dev.certforge.identity.internal;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

/** Session cookie hardening: HttpOnly, SameSite=Lax, and Secure whenever HTTPS is in use. */
@Configuration
class SessionCookieConfig {

  static final String COOKIE_NAME = "CERTFORGE_SESSION";

  /**
   * When {@code certforge.identity.secure-cookie} is unset the cookie is marked Secure for requests
   * received over HTTPS; set it to {@code true} behind a TLS-terminating proxy.
   */
  @Bean
  CookieSerializer cookieSerializer(IdentityProperties properties) {
    DefaultCookieSerializer serializer = new DefaultCookieSerializer();
    serializer.setCookieName(COOKIE_NAME);
    serializer.setCookiePath("/");
    serializer.setUseHttpOnlyCookie(true);
    serializer.setSameSite("Lax");
    if (properties.secureCookie() != null) {
      serializer.setUseSecureCookie(properties.secureCookie());
    }
    return serializer;
  }
}

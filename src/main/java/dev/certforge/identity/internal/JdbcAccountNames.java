package dev.certforge.identity.internal;

import dev.certforge.identity.AccountNames;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

@Component
class JdbcAccountNames implements AccountNames {

  private final JdbcClient jdbc;

  JdbcAccountNames(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  @Override
  public Map<UUID, String> of(Collection<UUID> ids) {
    Map<UUID, String> names = new HashMap<>();
    if (ids.isEmpty()) {
      return names;
    }
    jdbc.sql("select id, email from certforge.identity_account where id in (:ids)")
        .param("ids", ids)
        .query((rs, n) -> Map.entry(rs.getObject("id", UUID.class), rs.getString("email")))
        .list()
        .forEach(entry -> names.put(entry.getKey(), entry.getValue()));
    return names;
  }
}

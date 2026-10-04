package l;

/** Public, in a package exported only to the named modules. */
public final class Internal {

  private Internal() {}

  public static String secret() {
    return "internal";
  }
}

package h;

/** In a package the module never exports, so no other module can name this type in source. */
public final class Internal {

  private final String secret = "deeplyReflected";

  public Internal() {}
}

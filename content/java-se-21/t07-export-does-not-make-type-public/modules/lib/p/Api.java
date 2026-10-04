package p;

/** Public, in the same exported package, and reachable from other modules. */
public final class Api {

  private Api() {}

  public static String value() {
    // Inside the package the package-private type is perfectly usable.
    return Helper.value();
  }
}

package x;

import l.Internal;

public final class Named {

  private Named() {}

  public static String read() {
    return Internal.secret();
  }
}

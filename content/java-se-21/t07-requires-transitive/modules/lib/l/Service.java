package l;

import u.Box;

public class Service {

  private Service() {}

  /** Returns a type from another module, which is why lib has to pass util on to its readers. */
  public static Box make(String value) {
    return new Box(value);
  }
}

package p;

import s.Greeter;

/** Needs a public no-argument constructor for ServiceLoader to instantiate it. */
public final class Loud implements Greeter {

  public Loud() {}

  @Override
  public String greet() {
    return "LOUD";
  }
}

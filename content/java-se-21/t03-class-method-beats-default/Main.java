public class Main {

  interface Greeter {
    default String run() {
      return "interface default";
    }
  }

  static class Base {
    public String run() {
      return "superclass method";
    }
  }

  // Declares no run() of its own, so the inherited one is the question.
  static class Subclass extends Base implements Greeter {}

  public static void main(String[] args) {
    System.out.println("inherited=" + new Subclass().run());
  }
}

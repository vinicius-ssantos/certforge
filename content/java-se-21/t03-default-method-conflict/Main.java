public class Main {

  interface Walks {
    default String move() {
      return "walk";
    }
  }

  interface Swims {
    default String move() {
      return "swim";
    }
  }

  // Two unrelated interfaces, neither default more specific than the other. Without an override
  // the class does not compile, which is what makes the override mandatory rather than merely
  // advisable.
  static class Amphibian implements Walks, Swims {}

  public static void main(String[] args) {
    System.out.println(new Amphibian().move());
  }
}

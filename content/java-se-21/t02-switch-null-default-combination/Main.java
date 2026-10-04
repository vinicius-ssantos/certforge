public class Main {

  static String describe(Object value) {
    // case null, default is the one arm allowed to carry both, and it is the only combination
    // of null with another label that the language permits.
    return switch (value) {
      case String s -> "string";
      case Integer i -> "integer";
      case null, default -> "nullOrOther";
    };
  }

  public static void main(String[] args) {
    System.out.println(describe("x"));
    System.out.println(describe(7));
    System.out.println(describe(null));
    System.out.println(describe(1.5));
  }
}

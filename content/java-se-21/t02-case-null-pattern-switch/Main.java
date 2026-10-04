public class Main {

  static String describe(Object value) {
    // Without a case null label a pattern switch throws NullPointerException on null. With it,
    // null is matched by that label and nothing else.
    return switch (value) {
      case null -> "null";
      case String s -> "string:" + s;
      case Integer i -> "integer:" + i;
      default -> "other";
    };
  }

  static String withoutNullLabel(Object value) {
    try {
      return switch (value) {
        case String s -> "string";
        default -> "other";
      };
    } catch (NullPointerException e) {
      return "thrown:" + e.getClass().getSimpleName();
    }
  }

  public static void main(String[] args) {
    System.out.println(describe(null));
    System.out.println(describe("x"));
    System.out.println(describe(7));
    System.out.println(describe(1.5));
    System.out.println("noNullLabel=" + withoutNullLabel(null));
  }
}

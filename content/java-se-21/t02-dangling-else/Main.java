public class Main {

  public static void main(String[] args) {
    System.out.println("outerTrueInnerFalse=" + describe(true, false));
    System.out.println("outerFalse=" + describe(false, true));
  }

  static String describe(boolean outer, boolean inner) {
    String result = "none";
    // The else belongs to the nearest unmatched if, which is the inner one. If it belonged to the
    // outer if, outerFalse would report "else" instead of "none".
    if (outer)
      if (inner) result = "inner";
      else result = "else";
    return result;
  }
}

public class Main {

  static boolean nonEmptyString(Object obj) {
    // && guarantees the left side matched before the right side runs, so s is in scope there.
    return obj instanceof String s && s.length() > 0;
  }

  static boolean reachableAfterIf(Object obj) {
    if (!(obj instanceof String s)) {
      return false;
    }
    // Negated-and-returned puts the rest of the method in the scope of s as well.
    return s.isBlank();
  }

  public static void main(String[] args) {
    System.out.println("string=" + nonEmptyString("abc"));
    System.out.println("empty=" + nonEmptyString(""));
    System.out.println("notAString=" + nonEmptyString(42));
    System.out.println("null=" + nonEmptyString(null));
    System.out.println("afterNegatedIf=" + reachableAfterIf("   "));
  }
}

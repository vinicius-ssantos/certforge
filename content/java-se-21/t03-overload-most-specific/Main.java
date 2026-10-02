public class Main {

  static String m(Object o) {
    return "Object";
  }

  static String m(String s) {
    return "String";
  }

  static String m(String... s) {
    return "varargs";
  }

  public static void main(String[] args) {
    System.out.println("chosen=" + m("x"));
  }
}

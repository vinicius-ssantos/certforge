public class Main {
  static void show(Object o) {
    System.out.print("Object ");
  }

  static void show(String s) {
    System.out.print("String ");
  }

  public static void main(String[] args) {
    Object text = "hello";
    show(text);
    show("hello");
    show(null);
  }
}

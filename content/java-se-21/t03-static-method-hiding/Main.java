public class Main {

  static class Parent {
    static String who() {
      return "parent";
    }
  }

  static class Child extends Parent {
    static String who() {
      return "child";
    }
  }

  public static void main(String[] args) {
    Parent variable = new Child();
    // The variable's compile-time type decides, so the instance being a Child changes nothing.
    System.out.println("throughVariable=" + variable.who());
    System.out.println("throughType=" + Child.who());
  }
}

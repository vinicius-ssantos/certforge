public class Main {

  static class Parent {
    Number value() {
      return 1;
    }
  }

  static class Child extends Parent {
    // A subtype of the overridden return type is allowed; this file compiling is the proof.
    @Override
    Integer value() {
      return 2;
    }
  }

  public static void main(String[] args) {
    Parent asParent = new Child();
    System.out.println("throughParent=" + asParent.value());
    System.out.println("declaredType=" + new Child().value().getClass().getSimpleName());
  }
}

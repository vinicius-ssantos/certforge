class A {
  A() {
    System.out.print("A");
  }
}

class B extends A {
  B() {
    System.out.print("B");
  }
}

public class Main {
  public static void main(String[] args) {
    new B();
  }
}

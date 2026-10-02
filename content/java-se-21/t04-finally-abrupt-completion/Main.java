public class Main {
  static int value() {
    try {
      return 1;
    } finally {
      throw new IllegalStateException();
    }
  }

  public static void main(String[] args) {
    try {
      System.out.println(value());
    } catch (IllegalStateException ex) {
      System.out.println("thrown");
    }
  }
}

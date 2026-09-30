public class Main {
  static int compute() {
    try {
      return 1;
    } finally {
      System.out.print("cleanup ");
    }
  }

  public static void main(String[] args) {
    System.out.println(compute());
  }
}

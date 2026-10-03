public class Main {

  public static void main(String[] args) {
    StringBuilder ran = new StringBuilder();
    switch (1) {
      case 1 -> ran.append("one");
      // No break is written, and the next arm still does not run.
      case 2 -> ran.append("two");
      default -> ran.append("other");
    }
    System.out.println("ran=" + ran);
  }
}

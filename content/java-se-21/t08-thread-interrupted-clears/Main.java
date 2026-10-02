public class Main {

  public static void main(String[] args) {
    Thread.currentThread().interrupt();
    System.out.println("first=" + Thread.interrupted());
    // The first call cleared it.
    System.out.println("second=" + Thread.interrupted());
  }
}

public class Main {

  public static void main(String[] args) {
    try {
      throwNull();
      System.out.println("thrown=none");
    } catch (Throwable thrown) {
      System.out.println("thrown=" + thrown.getClass().getSimpleName());
    }
  }

  static void throwNull() {
    // The null literal needs no throws clause: its static type carries no checked exception,
    // which is why this compiles at all. The failure happens when it is thrown.
    throw null;
  }
}

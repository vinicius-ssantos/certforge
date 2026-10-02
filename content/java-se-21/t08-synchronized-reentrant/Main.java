public class Main {

  static final Object LOCK = new Object();

  public static void main(String[] args) {
    synchronized (LOCK) {
      System.out.println("outer=entered");
      // A non-reentrant lock would block here forever.
      synchronized (LOCK) {
        System.out.println("inner=entered");
      }
    }
    System.out.println("deadlocked=false");
  }
}

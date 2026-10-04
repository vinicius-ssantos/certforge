public class Main {

  // A synchronized instance method acquires the receiver's monitor: the same lock as
  // synchronized (this).
  synchronized void instanceMethod() {
    System.out.println("instanceHoldsReceiver=" + Thread.holdsLock(this));
    System.out.println("instanceHoldsClass=" + Thread.holdsLock(Main.class));
  }

  // A synchronized static method acquires the monitor of the Class object, because there is no
  // receiver. The two therefore do not exclude each other.
  static synchronized void staticMethod(Main instance) {
    System.out.println("staticHoldsClass=" + Thread.holdsLock(Main.class));
    System.out.println("staticHoldsInstance=" + Thread.holdsLock(instance));
  }

  void explicitBlock() {
    synchronized (this) {
      System.out.println("blockOnThisHoldsReceiver=" + Thread.holdsLock(this));
    }
  }

  public static void main(String[] args) {
    Main instance = new Main();
    System.out.println("beforeAnyLock=" + Thread.holdsLock(instance) + "," + Thread.holdsLock(Main.class));
    instance.instanceMethod();
    staticMethod(instance);
    instance.explicitBlock();
    System.out.println("afterAllLocks=" + Thread.holdsLock(instance) + "," + Thread.holdsLock(Main.class));
  }
}

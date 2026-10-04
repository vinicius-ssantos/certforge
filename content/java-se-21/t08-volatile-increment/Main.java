public class Main {

  static volatile boolean flag = false;
  static volatile int count = 0;

  public static void main(String[] args) throws InterruptedException {
    // The visibility half of the claim, deterministically: this spin ends only because a
    // volatile write by another thread is guaranteed to become visible to this one.
    Thread writer = new Thread(() -> flag = true);
    writer.start();
    while (!flag) {
      Thread.onSpinWait();
    }
    System.out.println("volatileWriteBecameVisible=" + flag);
    writer.join();

    // The lost-update half cannot be made deterministic. count++ is a read, an add and a write,
    // so two threads can read the same value and one increment can vanish -- but whether that
    // happens in any given run is up to the scheduler. Asserting that a loss was observed would
    // be a test that passes most of the time, which is worse than not asserting it. What is
    // always true, and is what this prints, is that increments are never gained: the total can
    // come out below the number of increments performed and never above it.
    int threads = 4;
    int perThread = 50_000;
    Thread[] workers = new Thread[threads];
    for (int i = 0; i < threads; i++) {
      workers[i] =
          new Thread(
              () -> {
                for (int n = 0; n < perThread; n++) {
                  count++;
                }
              });
      workers[i].start();
    }
    for (Thread worker : workers) {
      worker.join();
    }
    int expected = threads * perThread;
    System.out.println("incrementsPerformed=" + expected);
    System.out.println("neverExceedsExpected=" + (count <= expected));
    System.out.println("atLeastOne=" + (count > 0));
  }
}

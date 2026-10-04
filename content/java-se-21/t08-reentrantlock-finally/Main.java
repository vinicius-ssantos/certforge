import java.util.concurrent.locks.ReentrantLock;

public class Main {

  static final ReentrantLock LOCK = new ReentrantLock();

  static void protectedWork() {
    LOCK.lock();
    try {
      throw new IllegalStateException("boom");
    } finally {
      // finally runs whether the body returns or throws, which is the only placement that
      // releases the lock on both paths.
      LOCK.unlock();
    }
  }

  static void withoutFinally() {
    LOCK.lock();
    try {
      throw new IllegalStateException("boom");
    } catch (IllegalStateException e) {
      // The unlock here is skipped by the throw above in the common shape of this mistake:
      // placing it after the protected code, inside the try, instead of in a finally.
      LOCK.unlock();
      throw e;
    }
  }

  public static void main(String[] args) {
    try {
      protectedWork();
    } catch (IllegalStateException e) {
      System.out.println("threw=" + e.getMessage());
    }
    System.out.println("lockedAfterFinally=" + LOCK.isLocked());
    System.out.println("holdCountAfterFinally=" + LOCK.getHoldCount());

    // Reentrant: the same thread may lock repeatedly, and owes one unlock for each lock, which
    // is why the hold count and not a boolean is what finally has to bring back to zero.
    LOCK.lock();
    LOCK.lock();
    System.out.println("holdCountAfterTwoLocks=" + LOCK.getHoldCount());
    LOCK.unlock();
    System.out.println("holdCountAfterOneUnlock=" + LOCK.getHoldCount());
    System.out.println("stillLocked=" + LOCK.isLocked());
    LOCK.unlock();
    System.out.println("holdCountAtEnd=" + LOCK.getHoldCount());

    try {
      withoutFinally();
    } catch (IllegalStateException e) {
      System.out.println("catchVariantAlsoReleases=" + !LOCK.isLocked());
    }
    // Unlocking a lock this thread does not hold is itself an error, so an unbalanced finally
    // cannot be patched by unlocking twice.
    try {
      LOCK.unlock();
      System.out.println("unlockWithoutLock=allowed");
    } catch (IllegalMonitorStateException e) {
      System.out.println("unlockWithoutLock=" + e.getClass().getSimpleName());
    }
  }
}

import java.util.concurrent.atomic.AtomicBoolean;

public class Main {

  public static void main(String[] args) throws InterruptedException {
    AtomicBoolean ran = new AtomicBoolean(false);
    AtomicBoolean onCaller = new AtomicBoolean(false);
    Thread caller = Thread.currentThread();

    Thread started = Thread.startVirtualThread(
        () -> {
          ran.set(true);
          onCaller.set(Thread.currentThread() == caller);
        });

    System.out.println("returnsAThread=" + (started instanceof Thread));
    System.out.println("isVirtual=" + started.isVirtual());
    started.join();
    System.out.println("ran=" + ran.get());
    // Already started, and not run on the caller.
    System.out.println("ranOnCallingThread=" + onCaller.get());
  }
}

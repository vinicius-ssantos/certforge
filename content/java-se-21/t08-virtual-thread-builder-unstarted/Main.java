public class Main {

  public static void main(String[] args) throws InterruptedException {
    Runnable task = () -> {};
    Thread thread = Thread.ofVirtual().unstarted(task);

    // unstarted builds the thread and hands it back without running it, which is the whole
    // difference from start() and from Thread.startVirtualThread.
    System.out.println("isVirtual=" + thread.isVirtual());
    System.out.println("state=" + thread.getState());
    System.out.println("alive=" + thread.isAlive());
    // A virtual thread is always a daemon and always has normal priority.
    System.out.println("daemon=" + thread.isDaemon());

    thread.start();
    thread.join();
    System.out.println("stateAfterJoin=" + thread.getState());
    System.out.println("aliveAfterJoin=" + thread.isAlive());

    // Starting it a second time is refused, so unstarted hands out a one-shot thread.
    try {
      thread.start();
      System.out.println("restarted=allowed");
    } catch (IllegalThreadStateException e) {
      System.out.println("restarted=" + e.getClass().getSimpleName());
    }

    // For contrast, the thread Thread.startVirtualThread returns is already running or finished.
    Thread started = Thread.startVirtualThread(task);
    System.out.println("startVirtualThreadIsNew=" + (started.getState() == Thread.State.NEW));
    started.join();
  }
}

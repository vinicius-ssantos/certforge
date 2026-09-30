import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class Main {
  public static void main(String[] args) {
    AtomicInteger counter = new AtomicInteger();
    try (var executor = Executors.newFixedThreadPool(4)) {
      for (int i = 0; i < 100; i++) {
        executor.submit(counter::incrementAndGet);
      }
    }
    System.out.println(counter.get());
  }
}

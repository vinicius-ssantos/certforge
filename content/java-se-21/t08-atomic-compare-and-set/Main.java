import java.util.concurrent.atomic.AtomicInteger;

public class Main {
  public static void main(String[] args) {
    var value = new AtomicInteger(10);
    boolean changed = value.compareAndSet(10, 20);
    System.out.println(changed + " " + value.get());
  }
}

import java.util.concurrent.atomic.AtomicInteger;

public class Main {
  public static void main(String[] args) {
    var value = new AtomicInteger(3);
    System.out.println(value.updateAndGet(x -> x * 2));
  }
}

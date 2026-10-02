import java.util.concurrent.CountDownLatch;

public class Main {
  public static void main(String[] args) {
    var latch = new CountDownLatch(2);
    latch.countDown();
    latch.countDown();
    System.out.println(latch.getCount());
  }
}

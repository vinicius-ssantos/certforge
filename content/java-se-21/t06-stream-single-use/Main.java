import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) {
    Stream<Integer> once = Stream.of(1, 2, 3);
    System.out.println("first=" + once.count());
    try {
      once.count();
      System.out.println("second=none");
    } catch (IllegalStateException e) {
      System.out.println("second=" + e.getClass().getSimpleName());
    }
  }
}

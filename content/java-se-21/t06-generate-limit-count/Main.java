import java.util.stream.Stream;

public class Main {
  public static void main(String[] args) {
    long count = Stream.generate(() -> "x").limit(3).count();
    System.out.println(count);
  }
}

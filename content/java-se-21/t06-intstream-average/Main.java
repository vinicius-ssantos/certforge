import java.util.stream.IntStream;

public class Main {
  public static void main(String[] args) {
    double value = IntStream.of(1, 2, 3).average().orElse(-1);
    System.out.println(value);
  }
}

import java.util.stream.IntStream;

public class Main {
  public static void main(String[] args) {
    IntStream.range(0, 4).parallel().forEachOrdered(System.out::print);
  }
}

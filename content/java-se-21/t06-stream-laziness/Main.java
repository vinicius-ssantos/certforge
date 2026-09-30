import java.util.stream.Stream;

public class Main {
  public static void main(String[] args) {
    Stream.of(1, 2, 3, 4)
        .filter(
            n -> {
              System.out.print("f" + n + " ");
              return n % 2 == 0;
            })
        .map(
            n -> {
              System.out.print("m" + n + " ");
              return n * 10;
            })
        .findFirst();
    System.out.println();
  }
}

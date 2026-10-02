import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) {
    System.out.println("empty=" + Stream.<Integer>empty().reduce(10, Integer::sum));
    System.out.println("nonEmpty=" + Stream.of(1, 2).reduce(10, Integer::sum));
  }
}

import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<String> ordered = List.of("a", "b", "c");
    System.out.println("sequential=" + ordered.stream().findFirst().orElseThrow());
    // Ordered means first, even in parallel; findAny is the one that may return any element.
    System.out.println("parallel=" + ordered.stream().parallel().findFirst().orElseThrow());
  }
}

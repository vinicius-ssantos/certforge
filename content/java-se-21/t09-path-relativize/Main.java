import java.nio.file.Path;

public class Main {
  public static void main(String[] args) {
    Path from = Path.of("a", "b");
    Path to = Path.of("a", "c", "d");
    System.out.println(from.relativize(to).getNameCount());
  }
}

import java.nio.file.Path;

public class Main {
  public static void main(String[] args) {
    Path path = Path.of("a", "b", "..", "c").normalize();
    System.out.println(path.getNameCount());
  }
}

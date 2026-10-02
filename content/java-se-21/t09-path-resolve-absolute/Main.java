import java.nio.file.Path;

public class Main {

  public static void main(String[] args) {
    Path base = Path.of("base");
    // Derived rather than written as a literal, so it is absolute on every platform.
    Path absolute = Path.of("x").toAbsolutePath();
    System.out.println("isAbsolute=" + absolute.isAbsolute());
    System.out.println("resolveReturnsOther=" + base.resolve(absolute).equals(absolute));
    System.out.println("resolveRelativeAppends=" + base.resolve(Path.of("leaf")).equals(Path.of("base", "leaf")));
  }
}

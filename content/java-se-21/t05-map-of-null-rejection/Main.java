import java.util.Map;

public class Main {

  public static void main(String[] args) {
    System.out.println("nullKey=" + thrownBy(() -> Map.<String, String>of(null, "v")));
    System.out.println("nullValue=" + thrownBy(() -> Map.<String, String>of("k", null)));
  }

  static String thrownBy(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (RuntimeException e) {
      return e.getClass().getSimpleName();
    }
  }
}

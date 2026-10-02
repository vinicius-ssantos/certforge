import java.util.concurrent.ConcurrentHashMap;

public class Main {

  public static void main(String[] args) {
    ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
    System.out.println("nullKey=" + thrownBy(() -> map.put(null, "v")));
    System.out.println("nullValue=" + thrownBy(() -> map.put("k", null)));
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

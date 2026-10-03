import java.util.HashMap;

public class Main {
  public static void main(String[] args) {
    var map = new HashMap<String, Integer>();
    map.put("x", 1);
    map.merge("x", 2, (oldValue, newValue) -> null);
    System.out.println(map.containsKey("x"));
  }
}

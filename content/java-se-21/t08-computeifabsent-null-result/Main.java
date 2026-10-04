import java.util.concurrent.ConcurrentHashMap;

public class Main {

  public static void main(String[] args) {
    ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
    Integer returned = map.computeIfAbsent("x", key -> null);

    System.out.println("returned=" + returned);
    // No mapping is recorded, which is what lets null from get() mean absence.
    System.out.println("containsKey=" + map.containsKey("x"));
    System.out.println("size=" + map.size());
  }
}

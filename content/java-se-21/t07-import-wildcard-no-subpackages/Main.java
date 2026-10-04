import java.util.*;

public class Main {

  public static void main(String[] args) {
    // java.util.* brings in the accessible top-level types declared directly in java.util.
    List<String> list = new ArrayList<>();
    Map<String, Integer> map = new HashMap<>();
    list.add("ok");
    map.put("ok", 1);
    System.out.println(list + " " + map);

    // It does not reach java.util.concurrent, which is a different package rather than part of
    // java.util, so this simple name cannot be resolved.
    ConcurrentHashMap<String, Integer> concurrent = new ConcurrentHashMap<>();
    System.out.println(concurrent);
  }
}

import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class Main {

  public static void main(String[] args) {
    SequencedMap<String, Integer> map = new LinkedHashMap<>();
    map.put("a", 1);
    map.put("b", 2);
    map.put("c", 3);

    System.out.println("first=" + map.firstEntry().getKey());
    System.out.println("last=" + map.lastEntry().getKey());
    System.out.println("reversed=" + map.reversed().keySet());
  }
}

import java.util.List;

public class Main {
  public static void main(String[] args) {
    var values = List.of("a", "b", "c");
    System.out.println(values.getFirst() + values.getLast());
  }
}

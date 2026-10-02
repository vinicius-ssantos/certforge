import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<List<Integer>> nested = List.of(List.of(1, 2), List.of(3));
    System.out.println("map=" + nested.stream().map(List::size).toList());
    System.out.println("flatMap=" + nested.stream().flatMap(List::stream).toList());
  }
}

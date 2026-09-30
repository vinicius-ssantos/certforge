import java.util.Arrays;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    List<String> fixed = List.of("x", "y");
    try {
      fixed.add("z");
    } catch (UnsupportedOperationException e) {
      System.out.print("immutable ");
    }
    List<String> view = Arrays.asList("x", "y");
    view.set(0, "q");
    try {
      view.add("z");
    } catch (UnsupportedOperationException e) {
      System.out.print("fixed-size ");
    }
    System.out.println(view);
  }
}

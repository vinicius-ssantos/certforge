import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Main {

  public static void main(String[] args) {
    List<String> collected = List.of("a").stream().collect(Collectors.toUnmodifiableList());
    System.out.println("add=" + thrownBy(() -> collected.add("b")));
    System.out.println(
        "withNullElement="
            + thrownBy(() -> Arrays.asList("a", null).stream().collect(Collectors.toUnmodifiableList())));
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

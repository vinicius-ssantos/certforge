import java.util.Arrays;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    String[] array = {"x", "y"};
    List<String> list = Arrays.asList(array);

    list.set(0, "z");
    System.out.println("writesThroughToArray=" + array[0]);
    System.out.println("add=" + thrownBy(() -> list.add("z")));
    System.out.println("remove=" + thrownBy(() -> list.remove(0)));
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

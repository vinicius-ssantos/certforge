import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<String> backing = new ArrayList<>(List.of("a"));
    List<String> view = Collections.unmodifiableList(backing);

    System.out.println("addThroughView=" + thrownBy(() -> view.add("b")));
    backing.add("b");
    // A copy would not have noticed, and the backing list is not itself frozen.
    System.out.println("viewSeesBackingChange=" + view.size());
    System.out.println("backingStillModifiable=" + backing.size());
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

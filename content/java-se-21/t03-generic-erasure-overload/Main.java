import java.util.List;

public class Main {

  // Both parameters erase to List, so the two declarations have the same erased signature and
  // cannot coexist in one class, however different the type arguments look.
  void process(List<String> x) {
    System.out.println("strings" + x);
  }

  void process(List<Integer> x) {
    System.out.println("integers" + x);
  }

  public static void main(String[] args) {
    new Main().process(List.of("a"));
  }
}

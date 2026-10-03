import java.util.List;
import java.util.stream.Collectors;

public class Main {

  public static void main(String[] args) {
    try {
      List.of("aa", "ab").stream().collect(Collectors.toMap(s -> s.charAt(0), s -> s));
      System.out.println("thrown=none");
    } catch (IllegalStateException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
    // The three-argument form is the way to say which value wins.
    System.out.println(
        "withMergeFunction="
            + List.of("aa", "ab").stream().collect(Collectors.toMap(s -> s.charAt(0), s -> s, (a, b) -> b)));
  }
}

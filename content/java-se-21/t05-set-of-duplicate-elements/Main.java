import java.util.Set;

public class Main {

  public static void main(String[] args) {
    try {
      Set.of("a", "a");
      System.out.println("thrown=none");
    } catch (RuntimeException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
  }
}

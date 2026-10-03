import java.time.DateTimeException;
import java.time.LocalDate;

public class Main {

  public static void main(String[] args) {
    LocalDate april = LocalDate.of(2026, 4, 15);
    try {
      april.withDayOfMonth(31);
      System.out.println("thrown=none");
    } catch (DateTimeException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
    // Nothing is clamped and nothing rolls over into May.
    System.out.println("lastValidDay=" + april.withDayOfMonth(30));
  }
}

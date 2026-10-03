import java.time.LocalDate;

public class Main {

  public static void main(String[] args) {
    LocalDate leapDay = LocalDate.of(2024, 2, 29);
    // A date unit adjusts to the last valid day rather than overflowing into March.
    System.out.println("plusOneYear=" + leapDay.plusYears(1));
    System.out.println("plusFourYears=" + leapDay.plusYears(4));
  }
}

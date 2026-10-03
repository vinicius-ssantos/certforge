import java.math.BigDecimal;

public class Main {

  public static void main(String[] args) {
    try {
      new BigDecimal("1").divide(new BigDecimal("3"));
      System.out.println("thrown=none");
    } catch (ArithmeticException e) {
      System.out.println("thrown=" + e.getClass().getSimpleName());
    }
    // With a rounding mode there is a representable answer, so the exception is about the
    // non-terminating expansion rather than about division itself.
    System.out.println("withScale=" + new BigDecimal("1").divide(new BigDecimal("3"), 4, java.math.RoundingMode.HALF_UP));
  }
}

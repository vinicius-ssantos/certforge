import java.math.BigDecimal;

public class Main {

  public static void main(String[] args) {
    BigDecimal a = new BigDecimal("1.0");
    BigDecimal b = new BigDecimal("1.00");
    System.out.println("equals=" + a.equals(b));
    System.out.println("compareTo=" + a.compareTo(b));
  }
}

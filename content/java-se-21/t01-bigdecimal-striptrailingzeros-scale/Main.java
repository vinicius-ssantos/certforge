import java.math.BigDecimal;

public class Main {

  public static void main(String[] args) {
    BigDecimal stripped = new BigDecimal("1000").stripTrailingZeros();
    // A negative scale means the unscaled value is multiplied by a power of ten.
    System.out.println("scale=" + stripped.scale());
    System.out.println("unscaled=" + stripped.unscaledValue());
    System.out.println("value=" + stripped.toPlainString());
  }
}

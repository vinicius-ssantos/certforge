import java.util.Currency;
import java.util.Locale;

public class Main {
  public static void main(String[] args) {
    System.out.println(Currency.getInstance(Locale.US).getCurrencyCode());
  }
}

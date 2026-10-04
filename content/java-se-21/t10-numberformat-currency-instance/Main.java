import java.text.NumberFormat;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // getCurrencyInstance returns a formatter configured for money in the given locale: the
    // currency of that locale, its symbol, and its conventional number of fraction digits.
    NumberFormat us = NumberFormat.getCurrencyInstance(Locale.US);
    System.out.println("usCurrency=" + us.getCurrency().getCurrencyCode());
    System.out.println("usFractionDigits=" + us.getMaximumFractionDigits());
    System.out.println("usSymbolPresent=" + us.format(1).contains("$"));

    NumberFormat japan = NumberFormat.getCurrencyInstance(Locale.JAPAN);
    System.out.println("japanCurrency=" + japan.getCurrency().getCurrencyCode());
    // The yen has no minor unit, which the formatter knows without being told.
    System.out.println("japanFractionDigits=" + japan.getMaximumFractionDigits());

    // The locale decides, so the same amount formats differently and the currency differs.
    System.out.println("currenciesDiffer=" + !us.getCurrency().equals(japan.getCurrency()));
    System.out.println("formatsDiffer=" + !us.format(1234.5).equals(japan.format(1234.5)));
  }
}

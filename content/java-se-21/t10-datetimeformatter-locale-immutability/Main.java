import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    DateTimeFormatter base = DateTimeFormatter.ofPattern("d MMMM").withLocale(Locale.US);
    DateTimeFormatter french = base.withLocale(Locale.FRANCE);
    System.out.println("sameInstance=" + (base == french));
    System.out.println("baseLocale=" + base.getLocale().toLanguageTag());
    System.out.println("frenchLocale=" + french.getLocale().toLanguageTag());
  }
}

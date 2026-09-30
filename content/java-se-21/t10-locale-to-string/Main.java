import java.util.Locale;

public class Main {
  public static void main(String[] args) {
    Locale locale = Locale.forLanguageTag("pt-BR");
    System.out.println(locale.getLanguage() + " " + locale.getCountry() + " " + locale);
  }
}

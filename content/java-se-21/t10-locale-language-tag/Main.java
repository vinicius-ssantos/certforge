import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    Locale locale = Locale.forLanguageTag("pt-BR");
    System.out.println("language=" + locale.getLanguage());
    System.out.println("country=" + locale.getCountry());
  }
}

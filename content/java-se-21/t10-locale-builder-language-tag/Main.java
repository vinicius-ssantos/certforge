import java.util.Locale;

public class Main {
  public static void main(String[] args) {
    Locale locale = new Locale.Builder()
        .setLanguage("pt")
        .setRegion("BR")
        .build();
    System.out.println(locale.toLanguageTag());
  }
}

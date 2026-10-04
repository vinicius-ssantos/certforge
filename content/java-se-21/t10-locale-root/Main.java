import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // Locale.ROOT is the language-neutral locale: it names no language and no country, which is
    // what makes it the base every other locale falls back to.
    System.out.println("language=[" + Locale.ROOT.getLanguage() + "]");
    System.out.println("country=[" + Locale.ROOT.getCountry() + "]");
    System.out.println("variant=[" + Locale.ROOT.getVariant() + "]");
    System.out.println("toString=[" + Locale.ROOT + "]");
    System.out.println("toLanguageTag=" + Locale.ROOT.toLanguageTag());

    // It is not the same thing as the English locale, and not the same as the JVM default.
    System.out.println("equalsEnglish=" + Locale.ROOT.equals(Locale.ENGLISH));
    System.out.println("sameAsEmptyBuilt=" + Locale.ROOT.equals(Locale.of("", "")));
  }
}

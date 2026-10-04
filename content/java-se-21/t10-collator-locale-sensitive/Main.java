import java.text.Collator;
import java.util.Locale;

public class Main {

  /** Only the sign matters for an ordering, and only the sign is stable to print. */
  static String sign(int value) {
    return value < 0 ? "before" : value > 0 ? "after" : "equal";
  }

  public static void main(String[] args) {
    // String.compareTo compares UTF-16 code units, so every uppercase letter comes before every
    // lowercase one and "a" lands after "B". That is an encoding order, not an alphabetical one.
    System.out.println("stringCompareTo_a_B=" + sign("a".compareTo("B")));

    // A Collator compares by collation rules, so "a" comes before "B" the way a reader of a
    // dictionary expects. Same two strings, opposite answer.
    Collator english = Collator.getInstance(Locale.ENGLISH);
    System.out.println("collator_a_B=" + sign(english.compare("a", "B")));
    System.out.println("theyDisagree="
        + (Integer.signum("a".compareTo("B")) != Integer.signum(english.compare("a", "B"))));

    // And the rules are locale-sensitive: German treats a-umlaut as a variant of a, so it sorts
    // before z, while Swedish treats it as a letter of its own that follows z.
    Collator german = Collator.getInstance(Locale.GERMAN);
    Collator swedish = Collator.getInstance(Locale.of("sv", "SE"));
    System.out.println("german_umlautA_z=" + sign(german.compare("ä", "z")));
    System.out.println("swedish_umlautA_z=" + sign(swedish.compare("ä", "z")));
    System.out.println("sameInputDifferentOrder="
        + (Integer.signum(german.compare("ä", "z")) != Integer.signum(swedish.compare("ä", "z"))));
  }
}

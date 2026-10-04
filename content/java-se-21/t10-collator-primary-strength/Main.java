import java.text.Collator;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    Collator collator = Collator.getInstance(Locale.ENGLISH);

    // At PRIMARY strength only base-letter differences count. Case is a tertiary difference and
    // an accent is a secondary one, so both are ignored and the strings compare as equal.
    collator.setStrength(Collator.PRIMARY);
    System.out.println("primaryStrength=" + (collator.getStrength() == Collator.PRIMARY));
    System.out.println("primaryIgnoresCase=" + collator.equals("abc", "ABC"));
    System.out.println("primaryIgnoresAccent=" + collator.equals("resume", "résume"));
    System.out.println("primarySeesBaseLetters=" + collator.equals("abc", "abd"));

    // Raising the strength makes the finer differences count again.
    collator.setStrength(Collator.SECONDARY);
    System.out.println("secondarySeesAccent=" + !collator.equals("resume", "résume"));
    System.out.println("secondaryIgnoresCase=" + collator.equals("abc", "ABC"));

    collator.setStrength(Collator.TERTIARY);
    System.out.println("tertiarySeesCase=" + !collator.equals("abc", "ABC"));

    // equals is defined as compare returning zero, so the same holds for ordering.
    collator.setStrength(Collator.PRIMARY);
    System.out.println("primaryCompareZero=" + (collator.compare("abc", "ABC") == 0));
  }
}

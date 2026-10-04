import java.util.Arrays;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // Two categories, so the locale used to *show* things can differ from the one used to
    // *format* them.
    System.out.println("categories=" + Arrays.toString(Locale.Category.values()));

    Locale plain = Locale.getDefault();
    Locale display = Locale.getDefault(Locale.Category.DISPLAY);
    Locale format = Locale.getDefault(Locale.Category.FORMAT);
    try {
      Locale.setDefault(Locale.Category.DISPLAY, Locale.FRANCE);
      Locale.setDefault(Locale.Category.FORMAT, Locale.JAPAN);

      // Setting one category leaves the other alone, which is the point of having two.
      System.out.println("displayAfterSet=" + Locale.getDefault(Locale.Category.DISPLAY));
      System.out.println("formatAfterSet=" + Locale.getDefault(Locale.Category.FORMAT));
      System.out.println(
          "categoriesDiffer="
              + !Locale.getDefault(Locale.Category.DISPLAY)
                  .equals(Locale.getDefault(Locale.Category.FORMAT)));

      // The no-argument setDefault sets both, and it is the one that moves getDefault().
      Locale.setDefault(Locale.GERMANY);
      System.out.println("bothAfterPlainSet=" + Locale.getDefault(Locale.Category.DISPLAY) + "," + Locale.getDefault(Locale.Category.FORMAT));
      System.out.println("plainGetDefault=" + Locale.getDefault());
    } finally {
      // Restored, because these are process-wide. setDefault(Category, ...) does not put back the
      // plain default that setDefault(Locale) moved, so that one is restored first and then the
      // two categories on top of it.
      Locale.setDefault(plain);
      Locale.setDefault(Locale.Category.DISPLAY, display);
      Locale.setDefault(Locale.Category.FORMAT, format);
    }
  }
}

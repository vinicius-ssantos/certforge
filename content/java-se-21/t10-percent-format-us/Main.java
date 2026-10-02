import java.text.NumberFormat;
import java.util.Locale;

public class Main {
  public static void main(String[] args) {
    System.out.println(NumberFormat.getPercentInstance(Locale.US).format(0.25));
  }
}

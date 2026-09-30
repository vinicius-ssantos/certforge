import java.util.Locale;
import java.util.ResourceBundle;

public class Main {
  public static void main(String[] args) {
    Locale.setDefault(Locale.US);
    ResourceBundle bundle = ResourceBundle.getBundle("Msg", Locale.FRANCE);
    System.out.println(bundle.getString("who"));
  }
}

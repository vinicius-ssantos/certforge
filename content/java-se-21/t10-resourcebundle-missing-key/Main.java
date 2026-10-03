import java.util.ListResourceBundle;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

public class Main {

  public static class Messages extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
      return new Object[][] {{"present", "a value"}};
    }
  }

  public static void main(String[] args) {
    ResourceBundle bundle = new Messages();
    System.out.println("present=" + bundle.getString("present"));
    try {
      bundle.getString("missing");
      System.out.println("missing=none");
    } catch (MissingResourceException e) {
      System.out.println("missing=" + e.getClass().getSimpleName());
    }
    // containsKey is the way to ask without the exception.
    System.out.println("containsKey=" + bundle.containsKey("missing"));
  }
}

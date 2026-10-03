import java.util.ListResourceBundle;
import java.util.ResourceBundle;

public class Main {

  public static class Parent extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
      return new Object[][] {{"title", "from the parent"}, {"shared", "parent value"}};
    }
  }

  public static class Child extends ListResourceBundle {
    Child(ResourceBundle parent) {
      setParent(parent);
    }

    @Override
    protected Object[][] getContents() {
      return new Object[][] {{"shared", "child value"}};
    }
  }

  public static void main(String[] args) {
    ResourceBundle bundle = new Child(new Parent());
    // Not defined here, so the lookup continues into the parent.
    System.out.println("fromParent=" + bundle.getString("title"));
    // Defined here, so the child wins.
    System.out.println("childOverrides=" + bundle.getString("shared"));
    System.out.println("keySetIncludesParent=" + bundle.keySet().contains("title"));
  }
}

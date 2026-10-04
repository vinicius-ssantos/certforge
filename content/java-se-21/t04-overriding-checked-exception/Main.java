import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

  static class Store {
    void save() throws IOException {
      throw new IOException("base");
    }
  }

  // Omitting the checked exception entirely is allowed: an override may throw less, never more.
  static class Quiet extends Store {
    @Override
    void save() {
      System.out.println("quiet=saved");
    }
  }

  // Narrowing to a subtype is allowed for the same reason.
  static class Narrow extends Store {
    @Override
    void save() throws FileNotFoundException {
      throw new FileNotFoundException("narrow");
    }
  }

  public static void main(String[] args) throws Exception {
    new Quiet().save();
    // Calling through the supertype still only has to handle what the supertype declares, which
    // is what the rule protects.
    Store asStore = new Narrow();
    try {
      asStore.save();
    } catch (IOException e) {
      System.out.println("caughtAsIOException=" + e.getClass().getSimpleName());
    }
    System.out.println("quietThrows=" + Quiet.class.getDeclaredMethod("save").getExceptionTypes().length);
    System.out.println(
        "narrowThrows=" + Narrow.class.getDeclaredMethod("save").getExceptionTypes()[0].getSimpleName());
  }
}

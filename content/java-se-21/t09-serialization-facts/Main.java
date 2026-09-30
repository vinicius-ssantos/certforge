import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class Main {
  static class Base {
    int base = 1;

    Base() {
      base = 7;
    }
  }

  static class Item extends Base implements Serializable {
    private static final long serialVersionUID = 1L;
    transient int cache = 5;
    int value = 3;

    Item() {
      value = 9;
    }
  }

  public static void main(String[] args) throws Exception {
    Item original = new Item();
    original.base = 100;
    original.value = 42;
    original.cache = 55;

    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
      out.writeObject(original);
    }
    try (ObjectInputStream in =
        new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
      Item copy = (Item) in.readObject();
      System.out.println(copy.base + " " + copy.cache + " " + copy.value);
    }
  }
}

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public class Main {

  static final class Holder implements Serializable {
    private static final long serialVersionUID = 1L;
    static String shared = "static-original";
    transient String cached = "transient-original";
    String kept = "kept-original";
  }

  public static void main(String[] args) throws Exception {
    ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
      out.writeObject(new Holder());
    }
    // Proves the static was never part of the instance state: changing it afterwards survives.
    Holder.shared = "static-changed";
    Holder after;
    try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
      after = (Holder) in.readObject();
    }
    System.out.println("kept=" + after.kept);
    System.out.println("transient=" + after.cached);
    System.out.println("static=" + Holder.shared);
  }
}

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;

public class Main {
  public static void main(String[] args) throws Exception {
    var bytes = new ByteArrayOutputStream();
    try (var out = new DataOutputStream(bytes)) {
      out.writeUTF("Java");
    }
    try (var in = new DataInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
      System.out.println(in.readUTF());
    }
  }
}

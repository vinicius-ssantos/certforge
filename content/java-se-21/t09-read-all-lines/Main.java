import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
  public static void main(String[] args) throws IOException {
    Path file = Files.createTempFile("lines", ".txt");
    try {
      Files.writeString(file, "alpha\nbeta\n");
      System.out.println(Files.readAllLines(file).size());
    } finally {
      Files.delete(file);
    }
  }
}

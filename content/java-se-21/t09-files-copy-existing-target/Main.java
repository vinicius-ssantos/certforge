import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class Main {

  public static void main(String[] args) throws IOException {
    Path source = Files.createTempFile("certforge-source", ".txt");
    Path target = Files.createTempFile("certforge-target", ".txt");
    Files.writeString(source, "from the source");
    try {
      try {
        Files.copy(source, target);
        System.out.println("thrown=none");
      } catch (IOException e) {
        System.out.println("thrown=" + e.getClass().getSimpleName());
      }
      // Overwriting is opt-in rather than the default.
      Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
      System.out.println("afterReplaceExisting=" + Files.readString(target));
    } finally {
      Files.deleteIfExists(source);
      Files.deleteIfExists(target);
    }
  }
}

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

  public static void main(String[] args) throws Exception {
    // U+00E7 is one character that UTF-8 stores in two bytes, so the charset is observable.
    String text = "a\u00e7a\u00ed";
    Path file = Files.createTempFile("certforge-charset", ".txt");
    try {
      Files.write(file, text.getBytes(StandardCharsets.UTF_8));

      System.out.println("defaultMatchesUtf8=" + Files.readString(file).equals(text));
      System.out.println("explicitUtf8Matches=" + Files.readString(file, StandardCharsets.UTF_8).equals(text));
      // Reading the same bytes as Latin-1 does not, which is what makes the default meaningful.
      System.out.println("latin1Matches=" + Files.readString(file, StandardCharsets.ISO_8859_1).equals(text));
    } finally {
      Files.deleteIfExists(file);
    }
  }
}

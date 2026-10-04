import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) throws Exception {
    // One character that is not ASCII, written as an escape so this source file stays ASCII:
    // U+00E9, which UTF-8 encodes as two bytes.
    String text = "aé";
    byte[] utf8 = text.getBytes(StandardCharsets.UTF_8);
    System.out.println("chars=" + text.length() + " bytes=" + utf8.length);

    // An InputStream is byte-oriented: read() returns one byte at a time, so the single
    // character arrives as two separate values and neither is the character.
    List<Integer> bytes = new ArrayList<>();
    try (InputStream in = new ByteArrayInputStream(utf8)) {
      for (int b = in.read(); b != -1; b = in.read()) {
        bytes.add(b);
      }
    }
    System.out.println("inputStreamRead=" + bytes);

    // A Reader is character-oriented: it decodes bytes with a charset and returns code units,
    // so the same input arrives as two characters, the second being the one byte pair decoded.
    List<Integer> chars = new ArrayList<>();
    try (Reader reader =
        new InputStreamReader(new ByteArrayInputStream(utf8), StandardCharsets.UTF_8)) {
      for (int c = reader.read(); c != -1; c = reader.read()) {
        chars.add(c);
      }
    }
    System.out.println("readerRead=" + chars);
    System.out.println("decodedMatchesSource=" + (chars.get(1) == (int) text.charAt(1)));
    System.out.println("byteCountDiffersFromCharCount=" + (bytes.size() != chars.size()));
  }
}

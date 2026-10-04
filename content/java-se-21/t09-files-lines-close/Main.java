import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) throws Exception {
    Path file = Files.createTempFile("lines", ".txt");
    Files.writeString(file, "one\ntwo\nthree\n", StandardCharsets.UTF_8);

    // The stream a Files method returns is closeable, which is what makes try-with-resources
    // applicable to it at all. An ordinary Stream from a collection has nothing to release.
    System.out.println("streamIsAutoCloseable=" + AutoCloseable.class.isAssignableFrom(Stream.class));

    try (Stream<String> lines = Files.lines(file)) {
      List<String> read = lines.toList();
      System.out.println("read=" + read);
    }

    // Leaving the block closed the stream, and a closed stream refuses further use. That is the
    // observable half; that closing is also what releases the file handle is what the javadoc
    // states and is the reason the resource block matters rather than being tidy.
    Stream<String> leaked = Files.lines(file);
    leaked.close();
    try {
      leaked.findFirst();
      System.out.println("afterClose=usable");
    } catch (IllegalStateException e) {
      System.out.println("afterClose=" + e.getClass().getSimpleName());
    }

    // It is lazy: a short-circuiting terminal operation reads the first line and stops, so the
    // whole file is never held in memory and never fully read.
    try (Stream<String> lines = Files.lines(file)) {
      System.out.println("firstOnly=" + lines.findFirst().orElseThrow());
    }

    Files.delete(file);
  }
}

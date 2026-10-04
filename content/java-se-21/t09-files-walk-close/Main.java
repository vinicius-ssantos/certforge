import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) throws Exception {
    Path root = Files.createTempDirectory("walk");
    Path nested = Files.createDirectory(root.resolve("nested"));
    for (int i = 0; i < 5; i++) {
      Files.createFile(root.resolve("file" + i + ".txt"));
      Files.createFile(nested.resolve("deep" + i + ".txt"));
    }

    // Closeable, so try-with-resources applies: the walk holds directory handles open as it
    // descends, and closing is what releases them.
    System.out.println("streamIsAutoCloseable=" + AutoCloseable.class.isAssignableFrom(Stream.class));

    try (Stream<Path> walk = Files.walk(root)) {
      // The start directory, nested, and ten files.
      System.out.println("totalEntries=" + walk.count());
    }

    // Populated lazily: with a limit the walk visits only as many entries as the pipeline asks
    // for, rather than building the whole tree first. Counting visits rather than naming them,
    // because the order a directory is iterated in is not specified.
    List<Path> visited = new ArrayList<>();
    try (Stream<Path> walk = Files.walk(root)) {
      List<Path> taken = walk.peek(visited::add).limit(3).toList();
      System.out.println("visitedWhenThreeTaken=" + visited.size() + " taken=" + taken.size());
    }

    // maxDepth bounds the descent, so the nested files are never visited at depth 1.
    try (Stream<Path> walk = Files.walk(root, 1)) {
      System.out.println("depthOneEntries=" + walk.count());
    }

    Stream<Path> leaked = Files.walk(root);
    leaked.close();
    try {
      leaked.findFirst();
      System.out.println("afterClose=usable");
    } catch (IllegalStateException e) {
      System.out.println("afterClose=" + e.getClass().getSimpleName());
    }

    try (Stream<Path> walk = Files.walk(root)) {
      walk.sorted(java.util.Comparator.reverseOrder()).forEach(p -> {
        try {
          Files.delete(p);
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
      });
    }
    System.out.println("cleanedUp=" + !Files.exists(root));
  }
}

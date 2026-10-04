import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class Main {

  public static void main(String[] args) throws IOException {
    // Declared before the statement and never reassigned, so it is effectively final and may be
    // named directly in the resource list.
    BufferedReader reader = new BufferedReader(new StringReader("line"));
    try (reader) {
      System.out.println("read=" + reader.readLine());
    }

    // Leaving the statement closed it, even though the statement did not declare it. A closed
    // BufferedReader refuses further reads.
    try {
      reader.readLine();
      System.out.println("closed=false");
    } catch (IOException e) {
      System.out.println("closed=true:" + e.getClass().getSimpleName());
    }
  }
}

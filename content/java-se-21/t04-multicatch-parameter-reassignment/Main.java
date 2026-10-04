import java.io.IOException;
import java.sql.SQLException;

public class Main {

  static void readRow() throws IOException, SQLException {
    throw new IOException("boom");
  }

  public static void main(String[] args) {
    try {
      readRow();
    } catch (IOException | SQLException ex) {
      // A multi-catch parameter is implicitly final, so this assignment does not compile. A
      // single-type catch parameter is not, and the same line there would be allowed.
      ex = new IOException("replaced");
      System.out.println(ex.getMessage());
    }
  }
}

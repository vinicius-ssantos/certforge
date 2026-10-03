import java.io.IOException;
import java.sql.SQLException;

public class Main {

  /**
   * Precise rethrow: the compiler knows ex can only be one of the two the body can throw, so the
   * method declares those rather than Exception. This file compiling is the proof.
   */
  static void run(boolean io) throws IOException, SQLException {
    try {
      if (io) {
        throw new IOException("io");
      }
      throw new SQLException("sql");
    } catch (Exception ex) {
      throw ex;
    }
  }

  public static void main(String[] args) {
    System.out.println("io=" + caught(true));
    System.out.println("sql=" + caught(false));
  }

  static String caught(boolean io) {
    try {
      run(io);
      return "none";
    } catch (Exception e) {
      return e.getClass().getSimpleName();
    }
  }
}

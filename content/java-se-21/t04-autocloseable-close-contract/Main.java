import java.io.Closeable;
import java.util.Arrays;

public class Main {

  public static void main(String[] args) throws Exception {
    // AutoCloseable.close() is declared to throw Exception, which is why a resource may throw
    // any checked exception from close and try-with-resources has to allow for that.
    System.out.println(
        "autoCloseable=" + Arrays.toString(AutoCloseable.class.getMethod("close").getExceptionTypes()));
    // Closeable narrows it to IOException. The two are often confused.
    System.out.println(
        "closeable=" + Arrays.toString(Closeable.class.getMethod("close").getExceptionTypes()));

    class Resource implements AutoCloseable {
      @Override
      public void close() throws Exception {
        throw new Exception("from close");
      }
    }
    try (Resource r = new Resource()) {
      System.out.println("body=ran");
    } catch (Exception e) {
      System.out.println("caught=" + e.getClass().getName() + ":" + e.getMessage());
    }
  }
}

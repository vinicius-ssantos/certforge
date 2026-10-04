import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

  public static void main(String[] args) {
    try {
      if (args.length == 0) {
        throw new FileNotFoundException("missing");
      }
      // The IOException catch already handles every FileNotFoundException, so the second catch
      // can never run and the compiler rejects it rather than accepting dead code.
    } catch (IOException e) {
      System.out.println("io");
    } catch (FileNotFoundException e) {
      System.out.println("notFound");
    }
  }
}

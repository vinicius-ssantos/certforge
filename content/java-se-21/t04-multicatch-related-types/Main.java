import java.io.FileNotFoundException;
import java.io.IOException;

public class Main {

  public static void main(String[] args) {
    try {
      throw new FileNotFoundException("missing");
      // FileNotFoundException is a subtype of IOException, so one alternative subsumes the
      // other and the multi-catch is rejected. Only disjoint alternatives are allowed.
    } catch (IOException | FileNotFoundException ex) {
      System.out.println(ex.getMessage());
    }
  }
}

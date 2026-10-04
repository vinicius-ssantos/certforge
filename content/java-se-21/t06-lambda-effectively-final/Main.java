import java.util.function.Supplier;

public class Main {

  public static void main(String[] args) {
    int counter = 0;
    Supplier<Integer> read = () -> counter;
    // The capture above requires counter to be effectively final. This reassignment takes that
    // away, so the lambda no longer compiles, and the error is reported at the capture.
    counter = 1;
    System.out.println(read.get());
  }
}

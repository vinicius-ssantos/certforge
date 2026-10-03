import java.util.function.Function;
import java.util.function.ToIntFunction;

public class Main {

  public static void main(String[] args) {
    // The assignment compiling is the claim: an unbound reference to an instance method takes the
    // receiver as its argument, so it fits a function from String to int.
    ToIntFunction<String> length = String::length;
    System.out.println("applied=" + length.applyAsInt("abcd"));

    // The boxing form fits too, which is why the question asks for the primitive one.
    Function<String, Integer> boxed = String::length;
    System.out.println("boxed=" + boxed.apply("abc"));
  }
}

import java.lang.reflect.Method;
import java.util.Arrays;

public class Main {

  interface Greeter {
    private String punctuation() {
      return "!";
    }

    // A private interface method is callable from a default method of the same interface, which
    // is what makes it usable as an implementation helper.
    default String greet(String name) {
      return "Hello " + name + punctuation();
    }
  }

  static class English implements Greeter {}

  public static void main(String[] args) {
    System.out.println(new English().greet("Ana"));

    // It is not inherited into the implementing class's callable API: the class declares nothing,
    // and its public methods are the ones it inherited from Object plus greet.
    System.out.println(
        "declaredByClass=" + Arrays.toString(English.class.getDeclaredMethods()));
    boolean visible =
        Arrays.stream(English.class.getMethods()).map(Method::getName).anyMatch("punctuation"::equals);
    System.out.println("punctuationInPublicApi=" + visible);
    boolean greetVisible =
        Arrays.stream(English.class.getMethods()).map(Method::getName).anyMatch("greet"::equals);
    System.out.println("greetInPublicApi=" + greetVisible);
  }
}

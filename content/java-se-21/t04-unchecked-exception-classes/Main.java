import java.io.IOException;

public class Main {

  // No throws clause, and these compile: that is what unchecked means.
  static void throwsRuntime() {
    throw new IllegalStateException("unchecked");
  }

  static void throwsError() {
    throw new StackOverflowError("also unchecked");
  }

  public static void main(String[] args) {
    System.out.println("runtimeNeedsNoThrows=" + caught(Main::throwsRuntime));
    System.out.println("errorNeedsNoThrows=" + caught(Main::throwsError));
    // A checked exception is one that is neither, which is why IOException must be declared.
    System.out.println("ioIsRuntime=" + RuntimeException.class.isAssignableFrom(IOException.class));
    System.out.println("ioIsError=" + Error.class.isAssignableFrom(IOException.class));
  }

  static String caught(Runnable action) {
    try {
      action.run();
      return "none";
    } catch (Throwable t) {
      return t.getClass().getSimpleName();
    }
  }
}

public class Main {

  static final class Resource implements AutoCloseable {
    @Override
    public void close() {
      throw new IllegalStateException("E2 from close");
    }
  }

  public static void main(String[] args) {
    try {
      try (Resource resource = new Resource()) {
        throw new RuntimeException("E1 from body");
      }
    } catch (Exception caught) {
      System.out.println("primary=" + caught.getMessage());
      System.out.println("suppressedCount=" + caught.getSuppressed().length);
      System.out.println("suppressed=" + caught.getSuppressed()[0].getMessage());
    }
  }
}

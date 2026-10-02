public class Main {
  static class R implements AutoCloseable {
    private final String name;
    R(String name) { this.name = name; }
    @Override public void close() throws Exception {
      throw new Exception(name);
    }
  }

  public static void main(String[] args) {
    try (R a = new R("A"); R b = new R("B")) {
      throw new Exception("body");
    } catch (Exception ex) {
      System.out.print(ex.getMessage());
      for (Throwable suppressed : ex.getSuppressed()) {
        System.out.print(" " + suppressed.getMessage());
      }
    }
  }
}

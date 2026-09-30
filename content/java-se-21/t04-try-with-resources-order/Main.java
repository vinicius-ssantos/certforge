public class Main {
  static class Res implements AutoCloseable {
    private final String name;

    Res(String name) {
      this.name = name;
      System.out.print("open-" + name + " ");
    }

    @Override
    public void close() {
      System.out.print("close-" + name + " ");
    }
  }

  public static void main(String[] args) {
    try (Res a = new Res("a");
        Res b = new Res("b")) {
      System.out.print("body ");
    }
  }
}

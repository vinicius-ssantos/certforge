public class Main {
  public static void main(String[] args) {
    Object value = 42;
    String result =
        switch (value) {
          case Integer i when i > 40 -> "large";
          case Integer i -> "small";
          case String s -> "text";
          default -> "other";
        };
    System.out.println(result);
  }
}

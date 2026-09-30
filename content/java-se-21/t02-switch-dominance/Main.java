public class Main {
  public static void main(String[] args) {
    Object value = 42;
    String result =
        switch (value) {
          case Number n -> "number";
          case Integer i -> "integer";
          default -> "other";
        };
    System.out.println(result);
  }
}

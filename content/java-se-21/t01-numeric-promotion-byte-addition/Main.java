public class Main {

  public static void main(String[] args) {
    byte a = 10;
    byte b = 20;
    var result = a + b;
    // Boxing reveals the compile-time type var inferred.
    System.out.println("inferred=" + ((Object) result).getClass().getSimpleName());
  }
}

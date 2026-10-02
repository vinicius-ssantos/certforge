public class Main {
  public static void main(String[] args) {
    var builder = new StringBuilder("ab");
    builder.append(12).reverse();
    System.out.println(builder);
  }
}

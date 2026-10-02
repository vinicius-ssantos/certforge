public class Main {

  public static void main(String[] args) {
    System.out.println("lower=" + Boolean.parseBoolean("true"));
    System.out.println("upper=" + Boolean.parseBoolean("TRUE"));
    System.out.println("mixed=" + Boolean.parseBoolean("TrUe"));
    System.out.println("yes=" + Boolean.parseBoolean("yes"));
  }
}

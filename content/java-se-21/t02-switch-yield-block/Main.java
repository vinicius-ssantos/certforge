public class Main {

  public static void main(String[] args) {
    int day = 3;
    String name = switch (day) {
      case 3 -> {
        String computed = "Wednesday";
        yield computed;
      }
      default -> "other";
    };
    System.out.println("value=" + name);
  }
}

record Positive(int value) {
  Positive {
    value = Math.abs(value);
  }
}

public class Main {
  public static void main(String[] args) {
    System.out.println(new Positive(-7).value());
  }
}

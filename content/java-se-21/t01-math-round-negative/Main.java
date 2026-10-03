public class Main {

  public static void main(String[] args) {
    // Math.round adds a half and floors, so a negative exact half rounds towards positive infinity.
    System.out.println("negativeHalf=" + Math.round(-1.5d));
    System.out.println("positiveHalf=" + Math.round(1.5d));
    System.out.println("negativeBelowHalf=" + Math.round(-1.6d));
  }
}

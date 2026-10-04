public class Main {

  sealed interface Shape permits Circle, Square {}

  record Circle() implements Shape {}

  record Square() implements Shape {}

  public static void main(String[] args) {
    Shape shape = new Circle();
    // A switch expression must be exhaustive. This one covers only one of the two permitted
    // subclasses and has no default, so it does not compile.
    String name =
        switch (shape) {
          case Circle c -> "circle";
        };
    System.out.println(name);
  }
}

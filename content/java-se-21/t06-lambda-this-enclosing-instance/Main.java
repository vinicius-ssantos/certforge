import java.util.function.Supplier;

public class Main {

  final String label = "enclosing";

  String fromLambda() {
    // A lambda is not a new scope for this: it means the enclosing instance, so this, Main.this
    // and an unqualified field read all reach the same object.
    Supplier<String> supplier = () -> (this == Main.this) + ":" + this.label + ":" + label;
    return supplier.get();
  }

  String fromAnonymousClass() {
    // An anonymous class is a different object, so this there is the anonymous instance and
    // reaching the enclosing one needs Main.this.
    Supplier<String> supplier =
        new Supplier<>() {
          @Override
          public String get() {
            Object self = this;
            return (self == Main.this) + ":" + self.getClass().getSimpleName().isEmpty() + ":" + Main.this.label;
          }
        };
    return supplier.get();
  }

  String lambdaIdentity() {
    Supplier<Object> supplier = () -> this;
    return String.valueOf(supplier.get() == this);
  }

  public static void main(String[] args) {
    Main main = new Main();
    System.out.println("lambda=" + main.fromLambda());
    System.out.println("anonymous=" + main.fromAnonymousClass());
    System.out.println("lambdaThisIsEnclosing=" + main.lambdaIdentity());
  }
}

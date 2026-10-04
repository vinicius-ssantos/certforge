import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.Comparator;

public class Main {

  // @FunctionalInterface is a compile-time assertion: this would not compile if the extra
  // declarations cost the interface its single abstract method. Default methods, static methods
  // and abstract redeclarations of public Object methods all leave it intact.
  @FunctionalInterface
  interface Named {
    String name();

    default String shout() {
      return name().toUpperCase();
    }

    static Named of(String value) {
      return () -> value;
    }

    @Override
    boolean equals(Object other);

    @Override
    int hashCode();

    @Override
    String toString();
  }

  public static void main(String[] args) {
    // A lambda is assignable, which is exactly what an interface loses when it stops being
    // functional. That this line compiles is the proof; the listing below only reports which
    // declarations the interface really has.
    Named named = () -> "ana";
    System.out.println(named.name());
    System.out.println(Named.of("bruno").shout());

    // Sorted by name and without the compiler's synthetic lambda body, because the order
    // getDeclaredMethods returns is unspecified and would make this output depend on the JVM.
    Arrays.stream(Named.class.getDeclaredMethods())
        .filter(m -> !m.isSynthetic())
        .sorted(Comparator.comparing(Method::getName))
        .forEach(
            m ->
                System.out.println(
                    "declared="
                        + m.getName()
                        + " abstract="
                        + Modifier.isAbstract(m.getModifiers())
                        + " static="
                        + Modifier.isStatic(m.getModifiers())
                        + " default="
                        + m.isDefault()));
  }
}

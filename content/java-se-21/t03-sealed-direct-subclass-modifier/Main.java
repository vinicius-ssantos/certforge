public class Main {

  sealed interface Shape permits Finally, Sealing, Opened {}

  // Each of the three modifiers satisfies a direct subclass's obligation to say how sealing
  // continues, and they say three different things.
  static final class Finally implements Shape {}

  static sealed class Sealing implements Shape permits Leaf {}

  static final class Leaf extends Sealing {}

  static non-sealed class Opened implements Shape {}

  // Permitted only because Opened is non-sealed: an unrelated subclass of a sealed hierarchy.
  static class Outsider extends Opened {}

  public static void main(String[] args) {
    System.out.println("finalIsFinal=" + java.lang.reflect.Modifier.isFinal(Finally.class.getModifiers()));
    System.out.println("sealedIsSealed=" + Sealing.class.isSealed());
    System.out.println("nonSealedIsSealed=" + Opened.class.isSealed());
    System.out.println("extendedNonSealed=" + (new Outsider() instanceof Shape));
    System.out.println("permitted=" + Shape.class.getPermittedSubclasses().length);
  }
}

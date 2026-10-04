import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;

public class Main {

  enum Planet {
    EARTH(1),
    MARS(2);

    final int moons;

    // No access modifier is written here.
    Planet(int moons) {
      this.moons = moons;
    }
  }

  public static void main(String[] args) {
    System.out.println("declaredCount=" + Planet.class.getDeclaredConstructors().length);
    Constructor<?> only = Planet.class.getDeclaredConstructors()[0];
    System.out.println("isPrivate=" + Modifier.isPrivate(only.getModifiers()));
    System.out.println("isPublic=" + Modifier.isPublic(only.getModifiers()));
    System.out.println("isProtected=" + Modifier.isProtected(only.getModifiers()));
    // The compiler also prepends the name and ordinal parameters, which is why the reflected
    // constructor takes three where the source declares one.
    System.out.println("sourceParameters=1,reflected=" + only.getParameterCount());
    System.out.println("constants=" + Planet.EARTH.moons + "," + Planet.MARS.moons);
  }
}

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

public class Main {

  record Point(int x) {}

  public static void main(String[] args) throws Exception {
    Field field = Point.class.getDeclaredField("x");
    System.out.println("fieldPrivate=" + Modifier.isPrivate(field.getModifiers()));
    System.out.println("fieldFinal=" + Modifier.isFinal(field.getModifiers()));

    Method accessor = Point.class.getDeclaredMethod("x");
    System.out.println("accessorNamedAfterComponent=" + accessor.getName());
    System.out.println("accessorPublic=" + Modifier.isPublic(accessor.getModifiers()));

    // No setter is generated, and the class itself is final.
    System.out.println("hasSetter=" + hasMethod("setX"));
    System.out.println("classFinal=" + Modifier.isFinal(Point.class.getModifiers()));
  }

  static boolean hasMethod(String name) {
    for (Method method : Point.class.getDeclaredMethods()) {
      if (method.getName().equals(name)) {
        return true;
      }
    }
    return false;
  }
}

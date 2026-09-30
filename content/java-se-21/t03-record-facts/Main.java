import java.lang.reflect.Field;
import java.lang.reflect.Modifier;

public class Main {
  record Point(int x, int y) implements Comparable<Point> {
    public int compareTo(Point other) {
      return Integer.compare(x, other.x);
    }
  }

  public static void main(String[] args) throws Exception {
    Class<?> type = Point.class;
    Field x = type.getDeclaredField("x");
    System.out.println(Modifier.isFinal(type.getModifiers()));
    System.out.println(type.getSuperclass().getName());
    System.out.println(Modifier.isPrivate(x.getModifiers()) && Modifier.isFinal(x.getModifiers()));
    System.out.println(Comparable.class.isAssignableFrom(type));
    System.out.println(type.getDeclaredFields().length);
  }
}

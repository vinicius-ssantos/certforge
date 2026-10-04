import java.util.ArrayList;
import java.util.List;

public class Main {

  static void writeInteger(String label, List<? super Integer> values) {
    // The actual type argument is Integer or a supertype of it, so an Integer is always an
    // acceptable element: adding is safe. Reading gives back only Object, because the one type
    // every candidate type argument is known to share is Object.
    values.add(Integer.valueOf(1));
    Object x = values.get(0);
    System.out.println(label + " added=" + values.size() + " readAsObject=" + x.getClass().getSimpleName());
  }

  public static void main(String[] args) {
    writeInteger("listOfInteger", new ArrayList<Integer>());
    writeInteger("listOfNumber", new ArrayList<Number>());
    writeInteger("listOfObject", new ArrayList<Object>());
    writeInteger("listOfComparable", new ArrayList<Comparable<Integer>>());
  }
}

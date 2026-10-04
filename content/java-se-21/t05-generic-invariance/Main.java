import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<Integer> integers = new ArrayList<>();
    // Generic types are invariant in their type argument: List<Integer> is not a List<Number>,
    // however much Integer is a Number. Allowing it would let a Double be added through the
    // second reference.
    List<Number> numbers = integers;
    numbers.add(Double.valueOf(1.5));
    System.out.println(integers.get(0));
  }
}

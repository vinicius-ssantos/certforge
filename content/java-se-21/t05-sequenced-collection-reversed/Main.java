import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) {
    List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3));
    List<Integer> reversed = numbers.reversed();
    System.out.println("reversedOrder=" + reversed);
    System.out.println("firstBecomesLast=" + reversed.getLast().equals(numbers.getFirst()));
    numbers.add(4);
    // A copy would not have noticed the addition.
    System.out.println("isView=" + reversed.getFirst().equals(4));
  }
}

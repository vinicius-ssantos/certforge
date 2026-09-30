import java.util.ArrayList;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30, 1));
    numbers.remove(1);
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers);
  }
}

import java.util.Arrays;

public class Main {

  public static void main(String[] args) {
    int[] values = {1, 2, 3};
    for (int value : values) {
      value++;
    }
    // The loop variable is a fresh local holding a copy of the element, so incrementing it
    // cannot reach the array. Writing through the index does.
    System.out.println("afterLoopVariable=" + Arrays.toString(values));

    for (int i = 0; i < values.length; i++) {
      values[i]++;
    }
    System.out.println("afterIndexWrite=" + Arrays.toString(values));
  }
}

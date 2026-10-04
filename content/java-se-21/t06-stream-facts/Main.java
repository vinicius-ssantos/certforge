import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class Main {

  public static void main(String[] args) {
    List<String> seen = new ArrayList<>();

    // An intermediate operation processes nothing until a terminal operation asks for elements.
    Stream<String> pipeline = Stream.of("a", "bb", "ccc").filter(s -> {
      seen.add(s);
      return s.length() > 1;
    });
    System.out.println("beforeTerminal=" + seen);
    List<String> result = pipeline.toList();
    System.out.println("afterTerminal=" + seen + " result=" + result);

    // sorted() is stateful: it cannot emit its first element until it has consumed every input,
    // which a peek before and after makes visible.
    List<String> order = new ArrayList<>();
    List<Integer> sorted =
        Stream.of(3, 1, 2)
            .peek(i -> order.add("in" + i))
            .sorted()
            .peek(i -> order.add("out" + i))
            .toList();
    System.out.println("sortedOrder=" + order + " sorted=" + sorted);

    // peek observes elements as they flow past a point, and only those the pipeline demands:
    // with a short-circuiting terminal operation it sees fewer than the source holds.
    List<Integer> peeked = new ArrayList<>();
    Stream.of(1, 2, 3, 4).peek(peeked::add).limit(2).toList();
    System.out.println("peekedWithLimit=" + peeked);
  }
}

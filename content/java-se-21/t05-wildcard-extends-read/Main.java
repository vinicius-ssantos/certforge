import java.util.List;

public class Main {

  static void readOnly(List<? extends Number> values) {
    // Every element is some Number, whatever the actual type argument is, so reading as Number
    // is always safe. Writing is not: the compiler has no element type it can accept, which is
    // why values.add(1) would not compile here.
    Number n = values.get(0);
    System.out.println("read=" + n + " class=" + n.getClass().getSimpleName());
    System.out.println("size=" + values.size());
  }

  public static void main(String[] args) {
    readOnly(List.of(Integer.valueOf(1)));
    readOnly(List.of(Double.valueOf(2.5)));
    readOnly(List.<Number>of(Long.valueOf(3)));
  }
}

import java.util.TreeSet;

public class Main {

  record Item(String id) {}

  public static void main(String[] args) {
    // The comparator decides membership for a sorted set, not equals.
    TreeSet<Item> set = new TreeSet<>((a, b) -> 0);
    set.add(new Item("first"));
    Item second = new Item("second");

    System.out.println("areEqual=" + new Item("first").equals(second));
    System.out.println("secondAdded=" + set.add(second));
    System.out.println("size=" + set.size());
    System.out.println("kept=" + set.first().id());
  }
}

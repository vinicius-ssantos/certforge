public class Main {

  public static void main(String[] args) {
    // The specification requires boxing to cache -128..127, so two boxes of the same value in
    // that range are the same object. 100 is in the cache; 1000 is not, and == there compares
    // references, which is why only the cached case is guaranteed.
    Integer a = 100;
    Integer b = 100;
    System.out.println("cached=" + (a == b));

    Integer c = 1000;
    Integer d = 1000;
    System.out.println("uncachedSameObject=" + (c == d));
    System.out.println("uncachedEquals=" + c.equals(d));

    Integer low = -128;
    Integer alsoLow = -128;
    Integer belowLow = -129;
    Integer alsoBelowLow = -129;
    System.out.println("cacheEdge=" + (low == alsoLow) + "," + (belowLow == alsoBelowLow));
  }
}

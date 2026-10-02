public class Main {

  public static void main(String[] args) {
    StringBuilder visited = new StringBuilder();
    for (int i = 0; i < 4; i++) {
      if (i == 1) {
        // If continue skipped the update, i would stay 1 and this would never end.
        continue;
      }
      visited.append(i);
    }
    System.out.println("visited=" + visited);
    System.out.println("terminated=true");
  }
}

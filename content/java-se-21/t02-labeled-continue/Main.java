public class Main {
  public static void main(String[] args) {
    int count = 0;
    outer:
    for (int i = 0; i < 3; i++) {
      for (int j = 0; j < 3; j++) {
        if (j == 1) {
          continue outer;
        }
        count++;
      }
    }
    System.out.println(count);
  }
}

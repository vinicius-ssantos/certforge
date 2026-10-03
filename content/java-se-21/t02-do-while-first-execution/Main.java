public class Main {

  public static void main(String[] args) {
    int runs = 0;
    do {
      runs += 1;
    } while (false);
    // The condition was false from the start and the body still ran.
    System.out.println("runsWithFalseCondition=" + runs);

    int whileRuns = 0;
    while (false_()) {
      whileRuns += 1;
    }
    System.out.println("whileRunsWithFalseCondition=" + whileRuns);
  }

  // A method, because "while (false)" alone is unreachable code and will not compile.
  static boolean false_() {
    return false;
  }
}

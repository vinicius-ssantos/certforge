import java.time.Duration;
import java.time.Period;

public class Main {

  public static void main(String[] args) {
    // The units each type supports are the distinction, and each reports its own.
    System.out.println("periodUnits=" + Period.of(1, 2, 3).getUnits());
    System.out.println("durationUnits=" + Duration.ofSeconds(90, 500).getUnits());
    Duration duration = Duration.ofSeconds(90, 500);
    System.out.println("durationSeconds=" + duration.getSeconds());
    System.out.println("durationNanos=" + duration.getNano());
  }
}

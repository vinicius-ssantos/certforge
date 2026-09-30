import java.time.LocalDate;

public class Main {
  public static void main(String[] args) {
    LocalDate date = LocalDate.of(2024, 1, 31);
    System.out.println(date.plusMonths(1));
  }
}

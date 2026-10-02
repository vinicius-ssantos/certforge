import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class Main {

  public static void main(String[] args) throws IOException {
    BufferedReader reader = new BufferedReader(new StringReader("one\ntwo\n"));
    System.out.println("line1=" + reader.readLine());
    System.out.println("line2=" + reader.readLine());
    System.out.println("end=" + reader.readLine());
  }
}

package a;

import l.Service;
import u.Box;

public class Main {

  public static void main(String[] args) {
    Box box = Service.make("read implicitly");
    System.out.println(box.value());
  }
}

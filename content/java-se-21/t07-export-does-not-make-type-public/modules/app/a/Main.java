package a;

import p.Api;

public class Main {

  public static void main(String[] args) {
    // The public type of the exported package is reachable.
    System.out.println("api=" + Api.value());
    // The package-private one is not, and the module being exported changes nothing about it.
    System.out.println("helper=" + p.Helper.value());
  }
}

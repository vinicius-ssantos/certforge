public class Main {

  public static void main(String[] args) {
    // U+2003 EM SPACE is whitespace to Character.isWhitespace but is above U+0020.
    String padded = "\u2003hi\u2003";
    System.out.println("stripRemovesEmSpace=" + padded.strip().equals("hi"));
    System.out.println("trimRemovesEmSpace=" + padded.trim().equals("hi"));
    System.out.println("trimRemovesAsciiSpace=" + " hi ".trim().equals("hi"));
  }
}

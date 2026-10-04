package p;

// There is no way to write the import either: `import Helper;` is not even grammatical, because
// an import needs a qualified name and the unnamed package has no name to qualify with. So the
// reference below is the honest test, and it fails to resolve: a type in a named package cannot
// reach a top-level type of the unnamed package at all.
public class Main {

  public static void main(String[] args) {
    System.out.println(Helper.name());
  }
}

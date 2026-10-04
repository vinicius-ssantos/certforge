package p;

public class Main {

  public static void main(String[] args) {
    // This question is proved by how the build runs it. The harness launches a modular question
    // with exactly the form the question asks about -- java --module-path <dir> --module
    // <module>/<main class> -- and the launcher records what it was given in these properties.
    System.out.println("initialModule=" + System.getProperty("jdk.module.main"));
    System.out.println("mainClass=" + System.getProperty("jdk.module.main.class"));
    System.out.println("modulePathWasGiven=" + (System.getProperty("jdk.module.path") != null));
    System.out.println("named=" + Main.class.getModule().isNamed());
    System.out.println("module=" + Main.class.getModule().getName());
    System.out.println("class=" + Main.class.getName());
  }
}

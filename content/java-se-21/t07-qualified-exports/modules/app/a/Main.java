package a;

public class Main {

  public static void main(String[] args) {
    Module lib = l.Internal.class.getModule();
    Module app = Main.class.getModule();
    Module other = x.Named.class.getModule();
    Module javaBase = Object.class.getModule();

    // app and other are the two modules the qualified export names, so both may read l; and
    // both really do, which is what the compiled call below shows.
    System.out.println("toApp=" + lib.isExported("l", app));
    System.out.println("toOther=" + lib.isExported("l", other));
    System.out.println("toJavaBase=" + lib.isExported("l", javaBase));
    // Unqualified means exported to every module, which the qualified one is not.
    System.out.println("lUnqualified=" + lib.isExported("l"));
    System.out.println("qUnqualified=" + lib.isExported("q"));
    System.out.println("readFromOther=" + x.Named.read());
    System.out.println("readHere=" + l.Internal.secret());
  }
}

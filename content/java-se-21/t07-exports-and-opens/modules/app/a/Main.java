package a;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import l.Api;

public class Main {

  public static void main(String[] args) throws Exception {
    Module lib = Api.class.getModule();
    Module app = Main.class.getModule();

    // exports: the public type compiled into this module and runs. That this file compiles at
    // all is the compile-time half; the call is the run-time half.
    System.out.println("exportedPublicCall=" + new Api().value());
    System.out.println("lExported=" + lib.isExported("l", app));
    System.out.println("lOpen=" + lib.isOpen("l", app));

    // opens: reflection reaches a private field and a private method of the opened package. Note
    // that isExported reports true for q as well: opening a package implies exporting it, which
    // Module.isExported documents, so the reverse of lExported/lOpen above is not symmetric.
    Class<?> hidden = Class.forName("q.Hidden");
    System.out.println("qExported=" + lib.isExported("q", app));
    System.out.println("qOpen=" + lib.isOpen("q", app));
    Field secret = hidden.getDeclaredField("secret");
    secret.setAccessible(true);
    Object instance = hidden.getDeclaredConstructor().newInstance();
    System.out.println("openedPrivateField=" + secret.get(instance));
    Method whisper = hidden.getDeclaredMethod("whisper");
    whisper.setAccessible(true);
    System.out.println("openedPrivateMethod=" + whisper.invoke(instance));

    // Exporting is not opening: the same reflection on the exported package is refused.
    Field exportedPrivate = Api.class.getDeclaredField("hidden");
    try {
      exportedPrivate.setAccessible(true);
      System.out.println("exportedPrivateReflection=allowed");
    } catch (RuntimeException e) {
      System.out.println("exportedPrivateReflection=" + e.getClass().getSimpleName());
    }
  }
}

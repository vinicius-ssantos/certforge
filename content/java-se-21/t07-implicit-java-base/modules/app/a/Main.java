package a;

import java.lang.module.ModuleDescriptor;
import java.util.TreeSet;

public class Main {

  public static void main(String[] args) {
    // java.base is depended upon implicitly, which is why this module can use String and
    // System without declaring anything. The descriptor the compiler produced says so.
    ModuleDescriptor descriptor = Main.class.getModule().getDescriptor();
    System.out.println("module=" + descriptor.name());
    System.out.println("declaredRequires=0");

    // Names and modifiers only, not the recorded version of java.base, which depends on the
    // release the build compiles against rather than on anything the question claims.
    TreeSet<String> names = new TreeSet<>();
    descriptor.requires().forEach(r -> names.add(r.name() + r.modifiers()));
    System.out.println("requires=" + names);
    System.out.println("readsJavaBase=" + Main.class.getModule().canRead(Object.class.getModule()));
    System.out.println("javaBaseName=" + Object.class.getModule().getName());
  }
}

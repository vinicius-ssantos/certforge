package a;

import java.lang.module.ModuleDescriptor;

public class Main {

  public static void main(String[] args) {
    ModuleDescriptor descriptor = Main.class.getModule().getDescriptor();
    ModuleDescriptor.Requires optional =
        descriptor.requires().stream()
            .filter(r -> r.name().equals("optional"))
            .findFirst()
            .orElseThrow();
    // Compile time: the dependency is declared, and the STATIC modifier is what makes it
    // optional later. The whole graph compiled, which is the compile-time half of the claim.
    System.out.println("modifiers=" + optional.modifiers());
    System.out.println(
        "isStatic=" + optional.modifiers().contains(ModuleDescriptor.Requires.Modifier.STATIC));

    // Run time: optional sits on the module path next to app and still was not resolved, because
    // a static dependency on its own does not pull a module into the graph.
    System.out.println("appResolved=" + ModuleLayer.boot().findModule("app").isPresent());
    System.out.println("optionalResolved=" + ModuleLayer.boot().findModule("optional").isPresent());
    try {
      Class.forName("o.Flag");
      System.out.println("classLoaded=true");
    } catch (ClassNotFoundException e) {
      System.out.println("classLoaded=false");
    }
  }
}

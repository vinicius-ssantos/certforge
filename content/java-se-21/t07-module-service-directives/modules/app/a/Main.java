package a;

import java.util.ServiceLoader;
import java.util.TreeSet;
import s.Greeter;

public class Main {

  public static void main(String[] args) {
    // The provider module is not required by anything. It is in the graph because app declares
    // uses and the resolver binds providers of that service, which is what the pair is for.
    System.out.println("providerResolved=" + ModuleLayer.boot().findModule("provider").isPresent());

    TreeSet<String> greetings = new TreeSet<>();
    for (Greeter greeter : ServiceLoader.load(Greeter.class)) {
      greetings.add(greeter.greet() + " from " + greeter.getClass().getModule().getName());
    }
    System.out.println("loaded=" + greetings);

    System.out.println("declaredUses=" + Main.class.getModule().getDescriptor().uses());
    System.out.println(
        "providerProvides="
            + ModuleLayer.boot()
                .findModule("provider")
                .orElseThrow()
                .getDescriptor()
                .provides()
                .stream()
                .map(p -> p.service() + "->" + p.providers())
                .toList());
  }
}

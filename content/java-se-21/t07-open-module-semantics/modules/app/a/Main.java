package a;

import java.lang.module.ModuleDescriptor;
import java.lang.reflect.Field;
import java.util.TreeSet;

public class Main {

  public static void main(String[] args) throws Exception {
    Module lib = l.Api.class.getModule();
    Module app = Main.class.getModule();
    ModuleDescriptor descriptor = lib.getDescriptor();

    System.out.println("isOpen=" + descriptor.isOpen());
    // An open module declares no opens directives: being open covers every package it has.
    System.out.println("opensDirectives=" + descriptor.opens().size());
    TreeSet<String> exported = new TreeSet<>();
    descriptor.exports().forEach(e -> exported.add(e.source()));
    System.out.println("exportsDirectives=" + exported);

    System.out.println("lOpenToApp=" + lib.isOpen("l", app));
    System.out.println("hOpenToApp=" + lib.isOpen("h", app));
    System.out.println("ordinaryCallIntoExported=" + l.Api.value());

    // Deep reflection into the package that is *not* exported, which is what open grants.
    Class<?> internal = Class.forName("h.Internal");
    Field secret = internal.getDeclaredField("secret");
    secret.setAccessible(true);
    System.out.println("privateFieldOfUnexported=" + secret.get(internal.getDeclaredConstructor().newInstance()));

    // The compile-time half of this -- that a non-exported package still cannot be named in
    // source -- is proved by t07-export-does-not-make-type-public, which fails to compile for
    // exactly that reason. A program that runs cannot also be a program that does not compile.
    System.out.println("hInExports=" + exported.contains("h"));
  }
}

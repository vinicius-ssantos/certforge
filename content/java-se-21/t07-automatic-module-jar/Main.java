import java.lang.module.ModuleDescriptor;
import java.lang.module.ModuleFinder;
import java.lang.module.ModuleReference;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;

public class Main {

  public static void main(String[] args) throws Exception {
    // An ordinary JAR: no module-info.class anywhere in it.
    Path dir = Files.createTempDirectory("mods");
    Path jar = dir.resolve("com.example.widgets-1.4.jar");
    try (JarOutputStream out = new JarOutputStream(Files.newOutputStream(jar))) {
      out.putNextEntry(new JarEntry("com/example/widgets/Widget.class"));
      out.write(new byte[] {1, 2, 3});
      out.closeEntry();
    }
    System.out.println("hasModuleInfo=" + Files.exists(dir.resolve("module-info.class")));

    // Placed where the module system looks for modules, it becomes a named module all the same.
    ModuleFinder finder = ModuleFinder.of(dir);
    Optional<ModuleReference> found = finder.find("com.example.widgets");
    System.out.println("found=" + found.isPresent());
    ModuleDescriptor descriptor = found.orElseThrow().descriptor();
    System.out.println("automatic=" + descriptor.isAutomatic());
    // The name comes from the file name, with a trailing version dropped and read separately.
    System.out.println("name=" + descriptor.name());
    System.out.println("version=" + descriptor.version().map(Object::toString).orElse("none"));
    // An automatic module exports every package it contains and requires nothing but java.base.
    System.out.println("packages=" + descriptor.packages());
    System.out.println("requires=" + descriptor.requires());

    Files.delete(jar);
    Files.delete(dir);
  }
}

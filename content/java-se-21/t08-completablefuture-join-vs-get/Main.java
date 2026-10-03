import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Main {

  public static void main(String[] args) throws Exception {
    CompletableFuture<String> failed = CompletableFuture.failedFuture(new IllegalStateException("boom"));

    try {
      failed.join();
      System.out.println("join=none");
    } catch (RuntimeException e) {
      // Unchecked, so join needs no catch at all to compile.
      System.out.println("join=" + e.getClass().getSimpleName());
    }

    try {
      failed.get();
      System.out.println("get=none");
    } catch (ExecutionException e) {
      // Checked, which is why this one has to be caught or declared.
      System.out.println("get=" + e.getClass().getSimpleName());
    }

    System.out.println("bothWrapTheSameCause=" + CompletableFuture.completedFuture("ok").join());
  }
}

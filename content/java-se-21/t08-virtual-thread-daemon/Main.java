public class Main {
  public static void main(String[] args) {
    Thread virtual = Thread.ofVirtual().unstarted(() -> {});
    System.out.println(virtual.isVirtual() + " " + virtual.isDaemon());

    Thread platform = Thread.ofPlatform().unstarted(() -> {});
    System.out.println(platform.isVirtual() + " " + platform.isDaemon());

    try {
      virtual.setDaemon(false);
      System.out.println("accepted");
    } catch (IllegalArgumentException e) {
      System.out.println("rejected");
    }
  }
}

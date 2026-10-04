import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

  public static void main(String[] args) throws Exception {
    Path file = Files.createTempFile("seek", ".bin");
    try (RandomAccessFile raf = new RandomAccessFile(file.toFile(), "rw")) {
      raf.write("ABCDEFGH".getBytes("US-ASCII"));

      // seek moves the file pointer to an absolute byte offset counted from the beginning of
      // the file, not relative to where the pointer happens to be.
      raf.seek(3);
      System.out.println("pointerAfterSeek=" + raf.getFilePointer());
      System.out.println("readAt3=" + (char) raf.read());
      System.out.println("pointerAfterRead=" + raf.getFilePointer());

      // Absolute, not relative: seeking to 3 again returns to the same byte.
      raf.seek(3);
      System.out.println("readAt3Again=" + (char) raf.read());

      raf.seek(0);
      System.out.println("readAt0=" + (char) raf.read());

      // Writing is positional too, so a seek plus a write replaces bytes in place.
      raf.seek(1);
      raf.write('x');
      raf.seek(0);
      byte[] all = new byte[8];
      raf.readFully(all);
      System.out.println("content=" + new String(all, "US-ASCII"));

      // Seeking past the end is allowed and does not extend the file until something is
      // written there; a read at that position reports end of file.
      raf.seek(100);
      System.out.println("lengthAfterSeekPastEnd=" + raf.length());
      System.out.println("readPastEnd=" + raf.read());
    }
    Files.delete(file);
  }
}

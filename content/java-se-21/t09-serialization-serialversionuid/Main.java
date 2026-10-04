import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InvalidClassException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.ObjectStreamClass;
import java.io.Serializable;

public class Main {

  /** Declares its own version identifier, with a recognisable value. */
  static class Versioned implements Serializable {
    private static final long serialVersionUID = 0x0102030405060708L;

    final String value = "kept";
  }

  /** Declares none, so the runtime computes one from the class structure. */
  static class Unversioned implements Serializable {
    final String value = "computed";
  }

  public static void main(String[] args) throws Exception {
    long declared = ObjectStreamClass.lookup(Versioned.class).getSerialVersionUID();
    System.out.println("declared=" + Long.toHexString(declared));
    System.out.println("computedIsNonZero=" + (ObjectStreamClass.lookup(Unversioned.class).getSerialVersionUID() != 0));

    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    try (ObjectOutputStream out = new ObjectOutputStream(buffer)) {
      out.writeObject(new Versioned());
    }
    byte[] stream = buffer.toByteArray();

    // A round trip with the identifier intact succeeds.
    try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(stream))) {
      System.out.println("roundTrip=" + ((Versioned) in.readObject()).value);
    }

    // The identifier is written into the stream, so it can be found there and altered. Changing
    // it is what a class whose version moved on would look like to a reader holding old bytes.
    int at = indexOfVersion(stream, declared);
    System.out.println("identifierFoundInStream=" + (at >= 0));
    stream[at + 7] ^= 0x01;

    // Deserializing now fails, and it fails on the version check rather than on the data, which
    // is what the identifier participates in.
    try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(stream))) {
      in.readObject();
      System.out.println("mismatch=accepted");
    } catch (InvalidClassException e) {
      System.out.println("mismatch=" + e.getClass().getSimpleName());
      System.out.println("mentionsIncompatible=" + e.getMessage().contains("incompatible"));
    }
  }

  /** Where the eight big-endian bytes of the identifier sit in the stream. */
  private static int indexOfVersion(byte[] stream, long version) {
    byte[] wanted = new byte[8];
    for (int i = 0; i < 8; i++) {
      wanted[i] = (byte) (version >>> (56 - 8 * i));
    }
    outer:
    for (int start = 0; start + 8 <= stream.length; start++) {
      for (int i = 0; i < 8; i++) {
        if (stream[start + i] != wanted[i]) {
          continue outer;
        }
      }
      return start;
    }
    return -1;
  }
}

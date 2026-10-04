import java.text.MessageFormat;
import java.util.Locale;

public class Main {

  public static void main(String[] args) {
    // An explicit locale throughout, so none of this depends on the machine's default.
    // Without quotes, {0} is an argument placeholder and is substituted.
    System.out.println("placeholder=" + new MessageFormat("value is {0}", Locale.ROOT).format(new Object[] {"x"}));

    // A pair of single quotes around it makes the braces literal text: the argument is not
    // substituted, and the quotes themselves do not appear in the output.
    System.out.println("quoted=" + new MessageFormat("value is '{0}'", Locale.ROOT).format(new Object[] {"x"}));

    // Which is why a real apostrophe has to be doubled, and a lone one quotes what follows.
    System.out.println("doubled=" + new MessageFormat("it''s {0}", Locale.ROOT).format(new Object[] {"x"}));
    System.out.println("loneQuote=" + new MessageFormat("it's {0}", Locale.ROOT).format(new Object[] {"x"}));
  }
}

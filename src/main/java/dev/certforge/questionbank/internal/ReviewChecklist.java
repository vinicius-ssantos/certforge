package dev.certforge.questionbank.internal;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * The content-policy checks a reviewer can attest to. The codes are stable and part of the API; the
 * wording shown to people belongs to the client. Recording an item says the reviewer checked it
 * themselves. Nothing requires every item to be ticked: that would be an editorial policy decision,
 * not a technical one.
 */
final class ReviewChecklist {

  static final Set<String> ITEMS =
      Set.of(
          "TECHNICAL_ACCURACY",
          "CODE_VERIFIED",
          "NO_AMBIGUITY",
          "REASONS_ACCURATE",
          "OFFICIAL_REFERENCES");

  private ReviewChecklist() {}

  /** The ticked items without duplicates, in the order given; unknown codes are rejected. */
  static List<String> validate(List<String> ticked) {
    if (ticked == null || ticked.isEmpty()) {
      return List.of();
    }
    Set<String> unique = new LinkedHashSet<>(ticked);
    for (String item : unique) {
      if (!ITEMS.contains(item)) {
        throw QuestionBankException.invalid("invalid_checklist", "Unknown checklist item " + item);
      }
    }
    return List.copyOf(unique);
  }

  /** Storage form: the codes joined by commas. They never contain a comma. */
  static String store(List<String> items) {
    return String.join(",", items);
  }

  static List<String> load(String stored) {
    return stored == null || stored.isBlank() ? List.of() : Arrays.asList(stored.split(","));
  }
}

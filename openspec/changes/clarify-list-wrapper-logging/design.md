## Review and correction

- Keep `iv150-composition-over-inheritance` as an educational scenario about the fragile base-class problem.
- Make option A precise: a delegate wrapper must account for all supported insertion paths, including positional operations and mutable `listIterator()`/`subList()` views.
- Do not suggest that composition alone magically intercepts edits: every exposed path must be logged, wrapped or explicitly forbidden.
- Cite the official Java SE 21 `List` and `ListIterator` contracts, and keep the sole correct answer A.
- Keep `review.json` unchanged until a separate, deliberate technical approval with current V2 digest. The editorial pack stays `DRAFT`.

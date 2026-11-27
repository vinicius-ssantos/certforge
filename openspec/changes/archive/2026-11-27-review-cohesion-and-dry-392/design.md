## Technical grounds for two independent V2 reviews

`iv150-cohesion-and-coupling`: the unrelated validation, shipping carrier and mail responsibilities represent low cohesion, while direct external API dependencies are tight coupling. The D option uniquely recognizes both; A/B/C confuse independent method correctness or visibility with structural design. Primary first-person source: Martin Fowler, *Reducing Coupling*, IEEE Software (2001), https://martinfowler.com/ieeeSoftware/coupling.pdf.

`iv152-dry-definition-core`: avoiding duplicate knowledge/business decisions, rather than syntax similarity or repeated invocation, is the core DRY concern; C is the only correct option. The other choices describe accidental similarity, loop mechanics or method reuse. Primary first-person source: Martin Fowler, *Avoiding Repetition*, IEEE Software (2001), https://martinfowler.com/ieeeSoftware/repetition.pdf. This also explains why similar-looking code that represents independent business decisions must not automatically be unified.

Record the independent V2 digests only with the canonical `content/record-ai-review.mjs`. No question or pack metadata changes.

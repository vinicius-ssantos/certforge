# Java SE 21 publication status

Date: 2026-10-07

This file separates three claims that must not be conflated: mechanical verification, human technical review, and publication in a running CertForge deployment.

## Current state

- **150/150 questions carry Java verification sources and an `expected.txt` result checked by CI.**
- **20/150 questions carry a current human technical review in `content/java-se-21/review.json`.**
- **130/150 are AI-pre-reviewed and mechanically verified but still require a human technical verdict before publication.**
- The currently reviewed set is balanced at **2 reviewed questions per top-level topic**.
- The v0.3 mock blueprint needs 5 questions per topic, so at least **3 additional human-approved questions per topic (30 total)** are required before a 50-question mock can be assembled entirely from reviewed content.

Mechanical evidence does not convert an AI-assisted draft into reviewed content. It proves the checked program behavior, not every wording choice, distractor, explanation, reference-to-claim relationship, or specification-level generalization.

## Publishable from the repository record now

The following 20 questions have a current recorded human review and are the maximum set that `deploy/publish-pack.mjs` is allowed to approve/publish without a new human verdict:

### T01

- `t01-integer-boxing-guarantee`
- `t01-localdate-plus-months`

### T02

- `t02-pattern-switch-guard`
- `t02-switch-dominance`

### T03

- `t03-overload-null`
- `t03-record-facts`

### T04

- `t04-finally-return`
- `t04-try-with-resources-order`

### T05

- `t05-immutable-and-fixed-size-lists`
- `t05-list-remove-overload`

### T06

- `t06-stream-facts`
- `t06-stream-laziness`

### T07

- `t07-exports-and-opens`
- `t07-requires-transitive`

### T08

- `t08-executor-close`
- `t08-virtual-thread-daemon`

### T09

- `t09-read-all-lines`
- `t09-serialization-facts`

### T10

- `t10-locale-to-string`
- `t10-resource-bundle-fallback`

## Publication command

Against a running release environment with an existing reviewer account:

```sh
just publish-content reviewer@example.com 'REVIEWER_PASSWORD'
```

The publisher walks the editorial lifecycle only for questions whose recorded digest still matches the current content. Unreviewed or changed questions are held back by design.

## What remains for the other 130

They are already at the highest machine-supported state available in CertForge: original authorial content, Java 21 scoped, authoritative references, AI technical pre-review, and executable verification. The only missing publication gate is the human technical review required by the content policy.

Do not add entries to `review.json` merely to increase the published count. A question should gain a human verdict only after the reviewer actually reads and judges it.

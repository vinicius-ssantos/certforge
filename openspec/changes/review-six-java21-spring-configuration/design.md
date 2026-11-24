## Individual source validation and answer evidence

| Question | Correct | Official evidence and wrong-answer reasoning |
| --- | --- | --- |
| `iv286-arraylist-vs-linkedlist-access-pattern` | B | Oracle Java SE 21 `ArrayList` API explicitly documents constant-time indexed `get`; `LinkedList` and `List` API document sequential access, so repeated index lookup is less efficient. The alternatives wrongly treat resizing as dominant, deny ArrayList append, or conflate shared interface with shared complexity. |
| `iv288-self-invocation-bypasses-transactional-proxy` | B | Spring Framework **Understanding AOP Proxies** explicitly documents self-invocation via `this` bypasses proxy advice. The prompt expressly rules out AspectJ weaving and identifies a non-transactional caller. The `@Transactional` on `saveOrder` does not create a transaction through that internal call; an independently existing ambient transaction is a separate matter. Alternatives incorrectly assume automatic interception, startup validation, or implicit weaving. |
| `iv288-profile-specific-bean-missing-from-active-profile` | B | Official Spring Boot **Profiles**: when no explicit active profile exists, the fallback profile is `default`, **not** `prod`. `@Profile("prod")` therefore keeps the sole FileStorage bean unregistered and mandatory injection unsatisfied. The three other options invent implicit `prod` activation, wildcard profile activation, or automatic default registration. |
| `iv288-component-scan-bean-not-found` | B | Spring Framework `@ComponentScan` Javadoc and Spring Boot **Structuring Your Code** explicitly make default scan recursive under the main application class package. `com.example.billing` is a sibling, not a child of `com.example.orders`; `@Service` alone doesn't bring it into that scan. The alternatives wrongly limit scanning to exactly one package, demand a `@Bean`, or claim a nonexistent package configuration property. |
| `iv288-property-source-precedence-env-vs-yaml` | C | Official Spring Boot **Externalized Configuration** orders packaged application config below OS environment, and command-line `--server.port` above both in the default property-source precedence, yielding **7070** rather than 8080/9090. Conflicting declarations are resolved, not rejected. |
| `iv288-transactional-propagation-required-vs-requires-new` | B | Spring Framework **Transaction Propagation** documents that `REQUIRES_NEW` executes an independent physical transaction, so committed audit work survives an outer `REQUIRED` transaction's subsequent rollback. The distractors mistake it for `REQUIRED`, link it to exception catching, or confuse isolation with propagation. |

### Source integrity and governance

All six exact question objects and all four option-specific explanations were read. Their first-party references were checked in current official Oracle/Spring documentation; no secondary blog or mass review mechanism was used. They each have one correct option in the question source with the respective keys **B/B/B/B/C/B**. No source correction is needed for this batch.

The exact ordered tuple implemented in `content/manifest-pack.mjs::reviewDigestV2` was hashed via SHA-256. Independent verification matched standard `sha256("abc")` and a previously recorded `iv150-class-vs-object` digest before computing these six current V2 values:

| Question | V2 source digest |
| --- | --- |
| `iv286-arraylist-vs-linkedlist-access-pattern` | `sha256:ce7805be36230deb7b68b1ffc254295ee52c69600bc3aa156fbc06d270963ef5` |
| `iv288-self-invocation-bypasses-transactional-proxy` | `sha256:77382ff64e364072660c30176e5d1f0f19e03a9fe8a597f9b80e6a9e9e765c34` |
| `iv288-profile-specific-bean-missing-from-active-profile` | `sha256:8892932a6b9ca65615c40c09a4fb48a50297264380dbfe42967046be30d08505` |
| `iv288-component-scan-bean-not-found` | `sha256:18e13d3b9ea1f63926c060b3fb0730d66d63283649c63a0a2386461595e9829a` |
| `iv288-property-source-precedence-env-vs-yaml` | `sha256:b0d60c9a2239fbae6cf119d38c0c7fd7d1c662eca06adfe575df1b473404f220` |
| `iv288-transactional-propagation-required-vs-requires-new` | `sha256:78677db7e3ede6cac01e43f5ddfcbbf64473e0badc5685a9733a6d391cd432e1` |

The other `iv288-restcontroller-vs-controller-responsebody` question was **deliberately excluded**: its distractor B explanation overstates `@JsonProperty` as *only* customizing property names. It requires more precise wording before a separate source-bound review. This does not affect answer A. No `review.json` entry is added for it.

All 40 pre-existing review records must remain unchanged. The pack stays DRAFT; `ai-reviewer` is the honest actual review identity, not an invented user/human approval. Issue #392 stays open while 162 remain without verdict, UX issue #428 stays separately open. No deploy/publication.

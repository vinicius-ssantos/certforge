## ADDED Requirements

### Requirement: Mutable hash-map key scenarios specify the failure-producing hash change
A Java interview question about mutated HashMap keys SHALL explicitly describe
a mutation that changes the lookup's hash-derived bucket, or otherwise avoid
claiming all mutations necessarily break retrieval. It SHALL cite first-party
Java Map/HashMap/hashCode documentation and preserve its unique correct key.

#### Scenario: Retrieve an entry after key mutation
- **WHEN** a key already stored in a HashMap changes its computed hash to select a different bucket without a resize
- **THEN** lookup with the same mutated key may fail while the entry remains stored
- **AND** the question correctly retains answer C without implying every key mutation must fail.

### Requirement: Broken double-checked locking examples identify ordinary non-final state
A Java memory-model interview question about reading a partly visible Helper
through unsynchronized double-checked locking SHALL identify the ordinary
non-final field being initialized. It SHALL distinguish publication ordering
from the special final-field guarantees in JLS §17.5.

#### Scenario: Observe stale state through plain helper reference
- **WHEN** Helper has a non-final field assigned in construction and the helper reference is not volatile
- **THEN** a concurrent reader of the unsynchronized outer check may observe a non-null reference but a stale default field value
- **AND** the answer remains C and no editorial verdict is automatically granted.

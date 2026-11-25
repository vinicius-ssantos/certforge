## ADDED Requirements

### Requirement: Mockito spy interview explanations distinguish copied state and delegation
A Java testing question referring to Mockito's `spy(Object)` SHALL NOT claim
that calls on the spy delegate to the original supplied object. It SHALL
distinguish real-method behavior performed on the spy's copied state from
forwarding behavior, and keep the classic testing vocabulary clear across
stubs, mocks, fakes, and spies.

#### Scenario: Correct the test-double classification question
- **WHEN** `iv155-mock-stub-fake-spy` is reviewed for Mockito-specific accuracy
- **THEN** the answer D still identifies a stub's canned responses, a mock's interaction verification, a fake's working implementation, and a spy's real-method behavior
- **AND** its rationale states Mockito spies copy passed instance state rather than forwarding unstubbed calls to that original
- **AND** it cites pinned Mockito Javadoc and the original Martin Fowler test-double explanation
- **AND** no new editorial verdict is granted until a separate review of the merged corrected source.

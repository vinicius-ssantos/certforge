## Model semantics and evidence

IBM Developer, *The UML 2 class diagram*, distinguishes aggregation with independently existing part from composition with lifecycle-dependent ownership and treats these as relationships at the UML model level. Oracle's Java `Creating Objects` tutorial explains construction but not UML composition semantics. Java `new`, `private` and `final` cannot by themselves establish the semantic contract; Java garbage collection also does not automatically enforce domain-level part deletion.

The repaired question specifies that Engine is Car's exclusively owned lifecycle-dependent part and Driver is independently owned, transferred, and able to outlive a Car reference. Correct answer **B** remains unchanged, with precise ordinary association vs optional shared aggregation qualification.

Sources: https://developer.ibm.com/articles/the-class-diagram/ and https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html

Source repair must not be conflated with V2 editorial approval; only a separate review of exact merged `question.json` may record a source-bound verdict.

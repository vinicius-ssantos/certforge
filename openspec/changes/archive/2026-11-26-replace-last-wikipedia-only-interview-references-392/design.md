## Reference provenance and technical verification

University of Toronto CSC148 course notes (Diane Horton / David Liu) contrast linked-list head insertion O(1) with array-based list front insertion O(n); their code and runtime analysis apply to the question's head-known singly-linked list and contiguous dynamic array.

Martin Fowler's *Evans Classification* explains a domain service as a standalone operation within the domain. The original publisher's book *Domain Driven Design Quickly* summarizes the Evans domain-service principle for operations spanning multiple entities (such as a funds transfer). This does not mean every cross-aggregate use case should be a domain service; the question explicitly includes business rules spanning the two account aggregates.

Links: https://www.teach.cs.toronto.edu/~csc148h/notes/linked-lists/linked_list_efficiency.html ; https://martinfowler.com/bliki/EvansClassification.html ; https://www.infoq.com/minibooks/domain-driven-design-quickly/

Source correction and AI reviewer signoff remain disjoint. No new V2 verdict may be inserted until exact merged source verified.

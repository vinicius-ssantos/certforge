## Source-backed rationale

### Two distinct meanings of spy

1. **Classic test-spy taxonomy**: Martin Fowler's 2007 *Mocks Aren't Stubs* follows Gerard Meszaros and describes spies as **stubs that additionally record information about calls**. No universal default execution of real methods is implied. Source: https://martinfowler.com/articles/mocksArentStubs.html
2. **Mockito-specific spy**: official Mockito **5.24.0** Javadoc for `Mockito.spy(Object)` says it copies the supplied instance's state instead of delegating calls back to that instance. Unstubbed real methods run on the spy, and interactions can be verified there. Source: https://javadoc.io/static/org.mockito/mockito-core/5.24.0/org.mockito/org/mockito/Mockito.html

The previous question combined the classic terminology in its generic prompt with Mockito's particular semantics in answer D. Parenthetical `as with Mockito.spy` did not resolve the generalization. Correcting **the prompt, key D, D explanation and rationale** makes the learning target explicit without changing key D. Wrong options A/B/C remain false; explanations B/C now clarify Mockito-specific terminology and classic differences.

### Integrity split

This PR is only a technical repair. The original `iv155-mock-stub-fake-spy` question blob before this repair was `e3a1a409936580999df0bea58f6f73b3071e6494`. A new V2 digest must be generated from the *exact new merged question* in a **separate independent review PR**; do not grant an `AI_APPROVED` record here. Leave pack DRAFT and human acceptance claims absent.

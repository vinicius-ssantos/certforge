# PR #416 — Code evidence in a finalized mock

**Status:** implementation and browser checks passed; **owner's visual acceptance and #413 scope decision remain open**. This evidence does not constitute editorial approval of any Java question.

## Screenshot

[Open the terminal mock evidence card at 390 px](10e-mock-verified-evidence-mobile.png)

The capture is from a **throwaway, locally isolated Docker E2E stack** using synthetic `E2E mock fixture` content (not Oracle test content). A complete 50-question mock was submitted with questions unanswered. Its terminal result allowed opening one question review, where the recorded `Main.java` and `fixtureVerifiedOutput=A` were displayed under **“What the build ran, and what it printed”**. A previous browser E2E check asserted that the same verified output was absent from the HTML while the mock was active.

The image is a **cropped question review card** rather than a screenshot of the entire result page. The source line extends beyond the narrow code area; the source `pre` has `tabIndex=0` and its own horizontal scrolling, as in practice feedback. The recorded output is visible without scrolling.

## Verification

- `CAPTURE=1 MOCK_CAPTURE=1 npm run demo:screens`: **1 passed**, with the only optional panel screenshot taken *after terminal submission*.
- The `zz-mock-exam.spec.ts` E2E journey checks the active answer-key boundary and the terminal `Main.java`/output reveal for both desktop and mobile.
- `web/src/mock/mock-exam.test.tsx`: tests verification present/absent and unique ARIA IDs when multiple terminal reviews are open.
- `web/src/ui/VerificationEvidence.tsx`: reuses a recorded fixed build artifact, not a new Java execution endpoint or compiler.
- Synthetic content was published only inside the disposable stack with E2E-only editorial role shortcuts, never to production.

## Acceptance requested

Review whether the feedback hierarchy is useful and readable on narrow screens; confirm that the code source, recorded output and explanation are easy to distinguish, and that keyboard access to horizontally scrollable code is understandable. Issue #413 is still responsible for approving the broader v0.4.0 pilot. This PR must not be merged merely because CI passes.

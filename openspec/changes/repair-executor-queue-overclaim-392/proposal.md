## Why

During the question-by-question issue #392 review, `iv286-unbounded-queue-executor-oom` asserted that an executor with an unbounded queue **never** rejects work and **will** run out of heap. Oracle's Java SE 21 ThreadPoolExecutor documentation allows rejection after shutdown, and unbounded queue growth is a risk, not guaranteed OOM timing. An unqualified answer would mislead learners.

## What changes

Correct only this question's scenario, answer A, explanation, and distractor rationales to distinguish saturation of the running pool from shutdown rejection. Preserve the correct key A, topic and difficulty, and official Oracle reference. Do not grant a verdict or change pack status.

## Impact

Editorial source only; pack DRAFT and issue #392 open. After the source merges, perform a separately gated exact-source V2 review.

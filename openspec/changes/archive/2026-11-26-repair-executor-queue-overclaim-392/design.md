## Evidence and editorial boundary

Oracle Java SE 21 `ThreadPoolExecutor` documents that an unbounded queue holds tasks after `corePoolSize` threads are busy, that `maximumPoolSize` has no effect in this mode, and that a sustained arrival surplus admits the **possibility** of unbounded queue growth. Its rejection rules additionally cover the executor's shutdown state; consequently 'never rejects' and deterministic OOM wording were unsound.

This correction limits the scenario to an executor that remains running and states that persistent queue growth **can** exhaust memory. The answer remains A. No changes to `review.json`, since source repair must precede independent AI review and V2 digest.

Sources: https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html and https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/RejectedExecutionHandler.html

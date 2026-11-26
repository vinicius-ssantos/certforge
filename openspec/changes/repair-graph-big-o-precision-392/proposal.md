## Why

The #392 evidence repair #498 supplied primary sources for six algorithm questions without changing instructional text. Deeper review identified two technical overstatements that must be repaired before V2 approvals: graph adjacency lists were described simply as edge-proportional instead of O(V + E), and the Big-O explanation implicitly promised eventual performance dominance from upper bounds alone.

## What changes

- `iv154-graph-representation-tradeoff`: answer B remains correct, but explicitly state adjacency-list space O(V + E) vs matrix O(V²), including per-vertex overhead and actual edges.
- `iv154-big-o-meaning`: answer C remains correct, but clarify Big-O as an asymptotic upper bound, not a tight running-time classification, fixed-input benchmark or inevitable winner without additional assumptions.

Only question text and answer explanations change. Keep the primary academic references introduced by #498 and leave review.json, pack.json, and the DRAFT publication state unchanged. Any V2 approvals will be separate, individual and bound to the exact merged source.

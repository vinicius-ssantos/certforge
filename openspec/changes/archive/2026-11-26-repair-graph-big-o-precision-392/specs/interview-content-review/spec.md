## ADDED Requirements

### Requirement: Algorithm complexity wording SHALL distinguish bounds and storage costs precisely

Questions about adjacency-list versus matrix representations SHALL state general O(V + E) versus O(V²) storage bounds. Questions about Big-O SHALL distinguish asymptotic upper bounds from tight bounds and finite-input wall-clock timings.

#### Scenario: Sparse social graph and concrete n = 1,000,000 comparison

- **GIVEN** a sparse graph with vertices and edges
- **THEN** adjacency-list storage is described as O(V + E), not simply O(E) in general
- **AND** an adjacency matrix is described as O(V²).
- **GIVEN** two algorithms with Big-O complexity bounds
- **THEN** no fixed-size or eventual running-time dominance is guaranteed by the two upper bounds alone.

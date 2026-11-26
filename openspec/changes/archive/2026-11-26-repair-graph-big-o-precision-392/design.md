## Source correctness

Cornell CS 2110 graph lecture explicitly states that an adjacency-list representation requires O(|V| + |E|) space, versus O(|V|²) for an adjacency matrix. For the given sparse social graph with hundreds of edges per vertex, adjacency lists are memory-efficient, but not literally independent of |V|.

Sedgewick and Wayne's *Algorithms, 4th Edition* reference cheatsheet defines Big O as an **asymptotic upper bound**, ignoring constants. An upper bound may not be tight; the existence of bounds O(n log n) and O(n²) does not alone imply that one algorithm eventually always wins. Option C and its explanation now avoid this misleading implication.

Preserve existing gabaritos B and C and all other questions. Evidence: https://www.cs.cornell.edu/courses/cs2110/2026fa/lectures/lec21/ and https://algs4.cs.princeton.edu/cheatsheet/ . No editorial verdict is registered in this source repair.

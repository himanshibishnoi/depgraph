from graph import Graph

def test_basic_topological_sort():
    g = Graph()
    g.add_node("A")
    g.add_node("B")
    g.add_node("C")
    g.add_edge("A", "B")
    g.add_edge("B", "C")
    result = g.topological_sort_kahn()
    assert result == ["A", "B", "C"], f"Expected ['A','B','C'], got {result}"
    print("✓ test_basic_topological_sort passed")

def test_cycle_detection():
    g = Graph()
    g.add_node("A")
    g.add_node("B")
    g.add_node("C")
    g.add_edge("A", "B")
    g.add_edge("B", "C")
    g.add_edge("C", "A")
    has_cycle, cycle_nodes = g.has_cycle()
    assert has_cycle == True
    assert len(cycle_nodes) > 0
    print(f"✓ test_cycle_detection passed — cycle: {' → '.join(cycle_nodes)}")

def test_no_cycle():
    g = Graph()
    g.add_node("A")
    g.add_node("B")
    g.add_node("C")
    g.add_edge("A", "B")
    g.add_edge("A", "C")
    has_cycle, cycle_nodes = g.has_cycle()
    assert has_cycle == False
    assert cycle_nodes == []
    print("✓ test_no_cycle passed")

def test_duplicate_node():
    g = Graph()
    g.add_node("A")
    try:
        g.add_node("A")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
    print("✓ test_duplicate_node passed")

def test_duplicate_edge():
    g = Graph()
    g.add_node("A")
    g.add_node("B")
    g.add_edge("A", "B")
    try:
        g.add_edge("A", "B")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
    print("✓ test_duplicate_edge passed")

def test_self_loop():
    g = Graph()
    g.add_node("A")
    try:
        g.add_edge("A", "A")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
    print("✓ test_self_loop passed")

def test_missing_node_in_edge():
    g = Graph()
    g.add_node("A")
    try:
        g.add_edge("A", "Ghost")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
    print("✓ test_missing_node_in_edge passed")

def test_dfs_topological_sort():
    g = Graph()
    g.add_node("A")
    g.add_node("B")
    g.add_node("C")
    g.add_edge("A", "B")
    g.add_edge("B", "C")
    result = g.topological_sort_dfs()
    assert result.index("A") < result.index("B")
    assert result.index("B") < result.index("C")
    print("✓ test_dfs_topological_sort passed")

def test_empty_graph():
    g = Graph()
    result = g.topological_sort_kahn()
    assert result == []
    has_cycle, cycle_nodes = g.has_cycle()
    assert has_cycle == False
    print("✓ test_empty_graph passed")

def test_disconnected_graph():
    g = Graph()
    g.add_node("A")
    g.add_node("B")
    g.add_node("C")
    g.add_node("D")
    g.add_edge("A", "B")
    g.add_edge("C", "D")
    result = g.topological_sort_kahn()
    assert len(result) == 4
    assert result.index("A") < result.index("B")
    assert result.index("C") < result.index("D")
    print("✓ test_disconnected_graph passed")

if __name__ == "__main__":
    print("Running tests...\n")
    test_basic_topological_sort()
    test_cycle_detection()
    test_no_cycle()
    test_duplicate_node()
    test_duplicate_edge()
    test_self_loop()
    test_missing_node_in_edge()
    test_dfs_topological_sort()
    test_empty_graph()
    test_disconnected_graph()
    print("\n✓ All tests passed!")

class Graph:
    def __init__(self):
        self.graph = {}

    def add_node(self, node):
        if node in self.graph:
            raise ValueError(f"Node '{node}' already exists.")
        self.graph[node] = []

    def add_edge(self, from_node, to_node):
        if from_node not in self.graph:
            raise ValueError(f"Source node '{from_node}' does not exist.")
        if to_node not in self.graph:
            raise ValueError(f"Destination node '{to_node}' does not exist.")
        if from_node == to_node:
            raise ValueError(f"Self-loops are not allowed: '{from_node}' -> '{to_node}'.")
        if to_node in self.graph[from_node]:
            raise ValueError(f"Edge '{from_node}' -> '{to_node}' already exists.")
        self.graph[from_node].append(to_node)

    def print_graph(self):
        for node, neighbors in self.graph.items():
            print(f"{node} -> {neighbors}")

    def get_in_degrees(self):
        in_degrees = {node: 0 for node in self.graph}
        for node in self.graph:
            for neighbor in self.graph[node]:
                in_degrees[neighbor] += 1
        return in_degrees

    def topological_sort_kahn(self):
        in_degrees = self.get_in_degrees()
        queue = [node for node in in_degrees if in_degrees[node] == 0]
        result = []
        while queue:
            node = queue.pop(0)
            result.append(node)
            for neighbor in self.graph[node]:
                in_degrees[neighbor] -= 1
                if in_degrees[neighbor] == 0:
                    queue.append(neighbor)
        return result

    def has_cycle(self):
        visited = set()
        in_stack = set()

        def dfs(node):
            visited.add(node)
            in_stack.add(node)
            for neighbor in self.graph[node]:
                if neighbor in in_stack:
                    return True
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
            in_stack.remove(node)
            return False

        for node in self.graph:
            if node not in visited:
                if dfs(node):
                    return True
        return False

    def topological_sort_dfs(self):
        visited = set()
        result = []

        def dfs(node):
            visited.add(node)
            for neighbor in self.graph[node]:
                if neighbor not in visited:
                    dfs(neighbor)
            result.append(node)

        for node in self.graph:
            if node not in visited:
                dfs(node)

        return result[::-1]


if __name__ == "__main__":
    my_graph = Graph()
    my_graph.add_node("Source Code")
    my_graph.add_node("Object Code")
    my_graph.add_node("Linking")
    my_graph.add_node("Compiling")
    my_graph.add_node("Testing")
    my_graph.add_node("Documentation")
    my_graph.add_edge("Source Code", "Object Code")
    my_graph.add_edge("Object Code", "Linking")
    my_graph.add_edge("Linking", "Compiling")
    my_graph.add_edge("Compiling", "Testing")
    my_graph.add_edge("Source Code", "Documentation")

    my_graph.print_graph()
    print(my_graph.topological_sort_kahn())
    print(my_graph.has_cycle())

    cyclic_graph = Graph()
    cyclic_graph.add_node("A")
    cyclic_graph.add_node("B")
    cyclic_graph.add_node("C")
    cyclic_graph.add_edge("A", "B")
    cyclic_graph.add_edge("B", "C")
    cyclic_graph.add_edge("C", "A")
    print(cyclic_graph.has_cycle())

    print(my_graph.topological_sort_dfs())

    print("\n--- Testing input validation ---")

    try:
        my_graph.add_node("Source Code")
    except ValueError as e:
        print(f"Caught: {e}")

    try:
        my_graph.add_edge("Source Code", "Ghost Node")
    except ValueError as e:
        print(f"Caught: {e}")

    try:
        my_graph.add_edge("Source Code", "Source Code")
    except ValueError as e:
        print(f"Caught: {e}")

    try:
        my_graph.add_edge("Source Code", "Object Code")
    except ValueError as e:
        print(f"Caught: {e}")
# graph.py
# Core data structure and algorithms for depgraph
# Written with simplicity in mind — every line is explainable

class Graph:
    def __init__(self):
        # We store the graph as a dictionary
        # Key = node name (string)
        # Value = list of nodes that this node points TO
        # Example: {"A": ["B", "C"]} means A must come before B and C
        self.graph = {}

    def add_node(self, node):
        # Check if node already exists — we don't want duplicates
        if node in self.graph:
            raise ValueError(f"Node '{node}' already exists.")
        # Add the node with an empty list — no connections yet
        self.graph[node] = []

    def add_edge(self, from_node, to_node):
        # from_node must exist before we can connect it to anything
        if from_node not in self.graph:
            raise ValueError(f"Node '{from_node}' does not exist.")
        # to_node must also exist
        if to_node not in self.graph:
            raise ValueError(f"Node '{to_node}' does not exist.")
        # A node cannot depend on itself
        if from_node == to_node:
            raise ValueError(f"A node cannot depend on itself: '{from_node}'.")
        # Don't add the same connection twice
        if to_node in self.graph[from_node]:
            raise ValueError(f"Connection '{from_node}' -> '{to_node}' already exists.")
        # All checks passed — add the connection
        self.graph[from_node].append(to_node)

    def print_graph(self):
        # Print each node and what it points to — useful for debugging
        for node in self.graph:
            print(f"{node} -> {self.graph[node]}")

    def get_in_degrees(self):
        # In-degree = how many nodes point INTO this node
        # A node with in-degree 0 has nothing blocking it — it can go first

        # Start everyone at 0
        in_degrees = {}
        for node in self.graph:
            in_degrees[node] = 0

        # For every connection A -> B, increment B's in-degree by 1
        for node in self.graph:
            for neighbor in self.graph[node]:
                in_degrees[neighbor] = in_degrees[neighbor] + 1

        return in_degrees

    def topological_sort_kahn(self):
        # Kahn's Algorithm — BFS based topological sort
        # Big-O: O(V + E) where V = nodes, E = connections
        #
        # The idea:
        # 1. Find all nodes with nothing blocking them (in-degree = 0)
        # 2. Pick one, add it to the result
        # 3. Remove it from the graph (decrease neighbors' in-degrees)
        # 4. If any neighbor now has in-degree 0, it's ready — add to queue
        # 5. Repeat until queue is empty

        in_degrees = self.get_in_degrees()

        # Build the starting queue — nodes with nothing blocking them
        queue = []
        for node in in_degrees:
            if in_degrees[node] == 0:
                queue.append(node)

        # This will hold our final valid order
        result = []

        # Keep going until there are no more ready nodes
        while len(queue) > 0:
            # Take the first ready node
            node = queue.pop(0)

            # Add it to our result — it's officially scheduled
            result.append(node)

            # For each node that depends on this one:
            # now that we're "done" with current node, they have one less blocker
            for neighbor in self.graph[node]:
                in_degrees[neighbor] = in_degrees[neighbor] - 1

                # If this neighbor has no more blockers, it's ready
                if in_degrees[neighbor] == 0:
                    queue.append(neighbor)

        return result

    def has_cycle(self):
        # Cycle detection using DFS
        # Big-O: O(V + E)
        #
        # The idea:
        # We explore the graph by following connections one by one
        # We keep track of two things:
        #   visited = nodes we are completely done with
        #   current_path = nodes we are currently in the middle of exploring
        #
        # If we reach a node that is already in current_path,
        # it means we've gone in a circle — that's a cycle!

        visited = []        # nodes fully explored
        current_path = []   # nodes on our current exploration path
        cycle_found = []    # will store the cycle nodes if found

        def explore(node):
            # Mark this node as currently being explored
            visited.append(node)
            current_path.append(node)

            # Look at every node this one points to
            for neighbor in self.graph[node]:

                # If neighbor is already on our current path — cycle found!
                if neighbor in current_path:
                    # Find where the cycle starts in our path
                    cycle_start = current_path.index(neighbor)
                    # Store the cycle nodes
                    cycle_found.extend(current_path[cycle_start:])
                    return True

                # If we haven't visited this neighbor yet, explore it
                if neighbor not in visited:
                    if explore(neighbor):
                        return True

            # Done exploring this node — remove it from current path
            # (we're backtracking)
            current_path.remove(node)
            return False

        # Try starting from every node
        # (graph might have disconnected parts)
        for node in self.graph:
            if node not in visited:
                if explore(node):
                    return True, cycle_found

        # No cycle found anywhere
        return False, []

    def topological_sort_dfs(self):
        # DFS based topological sort
        # Big-O: O(V + E)
        #
        # The idea:
        # Go as deep as possible before recording a node
        # A node only gets added to result AFTER all nodes it points to are done
        # This naturally gives us reverse topological order
        # So we flip the result at the end

        visited = []    # nodes we've already processed
        result = []     # builds up in reverse order

        def explore(node):
            # Mark as visited so we don't process it twice
            visited.append(node)

            # First, explore everything this node points to
            for neighbor in self.graph[node]:
                if neighbor not in visited:
                    explore(neighbor)

            # Only AFTER exploring all neighbors, record this node
            # This means "leaf" nodes get recorded first
            result.append(node)

        # Start from every unvisited node
        for node in self.graph:
            if node not in visited:
                explore(node)

        # Reverse because nodes were added deepest-first
        result.reverse()
        return result


if __name__ == "__main__":
    # Quick manual test — only runs when you run graph.py directly
    g = Graph()
    g.add_node("A")
    g.add_node("B")
    g.add_node("C")
    g.add_edge("A", "B")
    g.add_edge("B", "C")
    g.print_graph()
    print(g.topological_sort_kahn())
    print(g.has_cycle())
    print(g.topological_sort_dfs())

class Graph:
    def __init__(self):
        self.graph = {}

    def add_node(self, node):
        self.graph[node] = []

    def add_edge(self, from_node, to_node):
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

order = my_graph.topological_sort_kahn()
print(order)
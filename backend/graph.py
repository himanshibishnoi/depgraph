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

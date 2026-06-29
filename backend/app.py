from flask import Flask, request, jsonify
from flask_cors import CORS
from graph import Graph
app = Flask(__name__)
CORS(app)

@app.route("/resolve", methods=["POST"])
def resolve():
    data = request.get_json()

    if data is None:
        return jsonify({
            "status": "error",
            "message": "Request body must be valid JSON"
        }), 400

    if "nodes" not in data or "edges" not in data:
        return jsonify({
            "status": "error",
            "message": "Missing required fields: nodes and edges"
        }), 400

    nodes = data["nodes"]
    edges = data["edges"]

    graph = Graph()
    try:
        for node in nodes:
            graph.add_node(node)
        for edge in edges:
            if len(edge) != 2:
                raise ValueError("Each edge must contain exactly two nodes")
            source, destination = edge
            graph.add_edge(source, destination)
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    has_cycle, cycle_nodes = graph.has_cycle()
    if has_cycle:
        message = "Cycle detected — no valid order exists."
        if cycle_nodes:
            message += f" Nodes involved: {' → '.join(cycle_nodes)}"
        return jsonify({
            "status": "error",
            "message": message
        }), 400

    order = graph.topological_sort_kahn()
    return jsonify({
        "status": "success",
        "order": order
    }), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)